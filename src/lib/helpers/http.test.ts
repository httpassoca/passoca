import { describe, expect, it } from "vitest";
import { fetchJson, HttpError } from "./http";

describe("fetchJson", () => {
  it("returns parsed json on 200", async () => {
    const fakeFetch = async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    const res = await fetchJson<{ ok: boolean }>(
      fakeFetch as any,
      "https://x.test"
    );
    expect(res.ok).toBe(true);
  });

  it("throws HttpError on non-2xx", async () => {
    const fakeFetch = async () => new Response("nope", { status: 500 });

    await expect(
      fetchJson(fakeFetch as any, "https://x.test")
    ).rejects.toBeInstanceOf(HttpError);
  });
});
