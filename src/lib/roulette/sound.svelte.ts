import { SPIN_EASING } from "./spin.svelte";

const MUTED_KEY = "passoca:roulette:muted";

/**
 * Returns the y (progress) of a CSS `cubic-bezier(x1, y1, x2, y2)` curve at a
 * given x (time), so JS can follow a CSS transition frame by frame.
 */
export function cubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
): (x: number) => number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Newton first, bisection as the safety net.
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return sampleY(t);
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= err / slope;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (sampleX(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

const spinEase = cubicBezier(...SPIN_EASING);

/**
 * Synthesised roulette sounds (no audio assets): a ratchet "tick" every time
 * a wedge boundary passes the needle, and a short fanfare on the reveal.
 *
 * Everything is generated with the Web Audio API, lazily, after a user
 * gesture — browsers keep a context suspended until then, so remote viewers
 * who never touched the page simply get a silent spin.
 */
export class RouletteSound {
  muted = $state(false);

  #ctx: AudioContext | null = null;
  #raf = 0;
  #lastTickAt = 0;

  constructor() {
    if (typeof localStorage !== "undefined") {
      try {
        this.muted = localStorage.getItem(MUTED_KEY) === "1";
      } catch {
        /* private mode etc. — default to unmuted */
      }
    }
  }

  toggleMuted(): void {
    this.muted = !this.muted;
    try {
      localStorage.setItem(MUTED_KEY, this.muted ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  /** Call from any user gesture: creates/resumes the context (autoplay policy). */
  unlock(): void {
    if (this.muted) return;
    const ctx = this.#context();
    if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => {});
  }

  #context(): AudioContext | null {
    if (this.#ctx) return this.#ctx;
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      this.#ctx = new Ctor();
    } catch {
      return null;
    }
    return this.#ctx;
  }

  #ready(): AudioContext | null {
    if (this.muted) return null;
    const ctx = this.#context();
    if (!ctx || ctx.state !== "running") return null;
    return ctx;
  }

  /**
   * One ratchet click. `strength` (0–1) scales volume + brightness so fast
   * passes sound sharper than the slow final clicks.
   */
  tick(strength = 1): void {
    const ctx = this.#ready();
    if (!ctx) return;
    // Rate limit: several boundary crossings in one frame become one click.
    const now = ctx.currentTime;
    if (now - this.#lastTickAt < 0.018) return;
    this.#lastTickAt = now;

    const s = Math.max(0.25, Math.min(1, strength));
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09 + 0.07 * s, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03 + 0.03 * (1 - s));

    // Bright body (the pin snapping past a peg)…
    const click = ctx.createOscillator();
    click.type = "triangle";
    click.frequency.setValueAtTime(1500 + 600 * s + Math.random() * 120, now);
    click.frequency.exponentialRampToValueAtTime(700, now + 0.03);
    click.connect(gain);
    click.start(now);
    click.stop(now + 0.07);

    // …over a low knock so it isn't just a tinny beep.
    const knock = ctx.createOscillator();
    knock.type = "sine";
    knock.frequency.setValueAtTime(180, now);
    knock.frequency.exponentialRampToValueAtTime(90, now + 0.05);
    const knockGain = ctx.createGain();
    knockGain.gain.setValueAtTime(0.12 * s, now);
    knockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    knock.connect(knockGain).connect(ctx.destination);
    knock.start(now);
    knock.stop(now + 0.07);
  }

  /** Winner reveal: a rising four-note arpeggio with a soft shimmer. */
  fanfare(): void {
    const ctx = this.#ready();
    if (!ctx) return;
    const t0 = ctx.currentTime + 0.02;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const at = t0 + i * 0.13;
      const last = i === notes.length - 1;
      const len = last ? 1.1 : 0.32;
      for (const [type, mix] of [
        ["sine", 0.16],
        ["triangle", 0.06],
      ] as const) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, at);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(mix, at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + len);
        osc.connect(gain).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + len + 0.05);
      }
    });
  }

  /**
   * Follows the CSS spin transition (same easing) and clicks every time the
   * rotation crosses a wedge boundary — boundaries sit at multiples of the
   * segment angle, since the winner's midline lands at `360 − (i+0.5)·seg`.
   */
  followSpin(from: number, to: number, seconds: number, segments: number): void {
    this.stop();
    if (segments < 1 || seconds <= 0 || typeof requestAnimationFrame === "undefined") return;
    const seg = 360 / segments;
    const total = to - from;
    const start = performance.now();
    let last = from;
    let lastAt = start;

    const frame = (now: number) => {
      const x = (now - start) / (seconds * 1000);
      const rotation = from + total * spinEase(x);
      const crossed = Math.floor(rotation / seg) - Math.floor(last / seg);
      if (crossed !== 0) {
        // deg/ms → 0–1 "strength": ~1.2 deg/ms at launch, near 0 at rest.
        const speed = Math.abs(rotation - last) / Math.max(1, now - lastAt);
        this.tick(Math.min(1, 0.35 + speed / 1.2));
      }
      last = rotation;
      lastAt = now;
      if (x < 1) this.#raf = requestAnimationFrame(frame);
      else this.#raf = 0;
    };
    this.#raf = requestAnimationFrame(frame);
  }

  /** Ticks for a manual nudge: `from`→`to` happened just now, no easing. */
  nudge(from: number, to: number, segments: number): void {
    if (segments < 1) return;
    const seg = 360 / segments;
    if (Math.floor(from / seg) !== Math.floor(to / seg)) this.tick(0.5);
  }

  stop(): void {
    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#raf = 0;
  }

  destroy(): void {
    this.stop();
    void this.#ctx?.close().catch(() => {});
    this.#ctx = null;
  }
}
