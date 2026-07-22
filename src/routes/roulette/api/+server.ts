import { json, error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

// Storage: Upstash Redis via the Vercel Marketplace (REST API, no SDK).
// Reads either env naming the integration may inject.
const PADS_KEY = "roulette:pads";
const WHEEL_KEY = "roulette:wheel";

type Pad = { text: string; t: number };
type Option = { id: string; author: string; text: string };
type Wheel = {
  options: Option[];
  max_picks: number;
  winner_id: string | null;
  spin_turns: number | null;
  spun_at: string | null;
};

const DEFAULT_WHEEL: Wheel = {
  options: [],
  max_picks: 1,
  winner_id: null,
  spin_turns: null,
  spun_at: null,
};

type Run = (commands: (string | number)[][]) => Promise<unknown[]>;

function redis(): Run | null {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return async (commands) => {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw error(502, "storage unreachable");
    const results = (await res.json()) as { result: unknown; error?: string }[];
    if (results.some((r) => r.error)) throw error(502, "storage error");
    return results.map((r) => r.result);
  };
}

function parseDoc(padsRaw: unknown, wheelRaw: unknown) {
  const pads: Record<string, Pad> = {};
  const flat = Array.isArray(padsRaw) ? (padsRaw as string[]) : [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    try {
      pads[flat[i]] = JSON.parse(flat[i + 1]) as Pad;
    } catch {
      // skip corrupt pad
    }
  }
  let wheel = { ...DEFAULT_WHEEL };
  if (typeof wheelRaw === "string") {
    try {
      wheel = { ...DEFAULT_WHEEL, ...(JSON.parse(wheelRaw) as Wheel) };
    } catch {
      // corrupt wheel; reset
    }
  }
  return { pads, wheel };
}

/** Runs `commands` (may be empty), then reads the whole doc, in one pipeline. */
async function runAndRead(run: Run, commands: (string | number)[][] = []) {
  const results = await run([
    ...commands,
    ["HGETALL", PADS_KEY],
    ["GET", WHEEL_KEY],
  ]);
  return parseDoc(results[results.length - 2], results[results.length - 1]);
}

const clip = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max).trim() : "";

export const GET: RequestHandler = async () => {
  const run = redis();
  if (!run) return json({ configured: false });
  const doc = await runAndRead(run);
  return json(
    { configured: true, ...doc },
    { headers: { "cache-control": "no-store" } }
  );
};

export const POST: RequestHandler = async ({ request }) => {
  const run = redis();
  if (!run) throw error(503, "storage not configured");

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || typeof body.action !== "string") throw error(400, "bad request");

  if (body.action === "pad") {
    const author = clip(body.author, 24);
    if (!author) throw error(400, "author required");
    const pad: Pad = { text: clip(body.text, 8000), t: Date.now() };
    const doc = await runAndRead(run, [
      ["HSET", PADS_KEY, author, JSON.stringify(pad)],
    ]);
    return json({ configured: true, ...doc });
  }

  // Wheel actions: read-modify-write. Not atomic, but contention here is a
  // handful of friends clicking, not a job queue.
  const { pads, wheel } = await runAndRead(run);

  switch (body.action) {
    case "add_option": {
      const author = clip(body.author, 24);
      const text = clip(body.text, 120);
      if (!author || !text) throw error(400, "author and text required");
      wheel.options.push({ id: crypto.randomUUID(), author, text });
      break;
    }
    case "remove_option": {
      wheel.options = wheel.options.filter((o) => o.id !== body.id);
      if (wheel.winner_id === body.id) wheel.winner_id = null;
      break;
    }
    case "set_max": {
      const value = Number(body.value);
      if (!Number.isInteger(value) || value < 1 || value > 10) {
        throw error(400, "value must be 1-10");
      }
      wheel.max_picks = value;
      break;
    }
    case "spin": {
      const winner = wheel.options.find((o) => o.id === body.winner_id);
      if (!winner) throw error(400, "winner not in the wheel");
      wheel.winner_id = winner.id;
      wheel.spin_turns = Number(body.turns) || 4;
      wheel.spun_at = new Date().toISOString();
      break;
    }
    case "clear_spin": {
      wheel.winner_id = null;
      wheel.spin_turns = null;
      wheel.spun_at = null;
      break;
    }
    default:
      throw error(400, "unknown action");
  }

  await run([["SET", WHEEL_KEY, JSON.stringify(wheel)]]);
  return json({ configured: true, pads, wheel });
};
