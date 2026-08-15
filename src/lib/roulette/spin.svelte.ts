import type { WheelState } from "./types";

/**
 * Drives the wheel's spin animation off the server's `spun_at` timestamp.
 * Rotation is cumulative so the CSS transition always spins forward.
 */
export class SpinController {
  rotation = $state(0);
  spinDuration = $state(0);
  spinning = $state(false);
  winnerId = $state<string | null>(null);
  // Fullscreen takeover: only for spins witnessed live (not for late joiners
  // who load an already-settled winner). Dismissing is local to this client.
  overlayDismissed = $state(true);

  /** `undefined` until the first server snapshot — that one never animates. */
  lastSpunAt: string | null | undefined = undefined;

  #spinSeconds: number;
  #settleTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(spinSeconds: number) {
    this.#spinSeconds = spinSeconds;
  }

  sync(next: WheelState, animate: boolean): void {
    if (next.spun_at === this.lastSpunAt) return;
    this.lastSpunAt = next.spun_at;

    if (!next.spun_at || !next.winner_id) {
      this.winnerId = null;
      return;
    }
    const index = next.options.findIndex((o) => o.id === next.winner_id);
    if (index === -1) {
      this.winnerId = null;
      return;
    }
    const segment = 360 / next.options.length;
    const align = 360 - (index + 0.5) * segment;

    if (animate) {
      this.spinning = true;
      this.winnerId = null;
      this.overlayDismissed = false;
      this.spinDuration = this.#spinSeconds;
      // Whole turns only — a fractional turn would rest the wheel offset from
      // the winner segment while the announcement names the true winner.
      const turns = Math.max(3, Math.round(next.spin_turns ?? 4));
      this.rotation = this.rotation - (this.rotation % 360) + 360 * turns + align;
      clearTimeout(this.#settleTimer);
      this.#settleTimer = setTimeout(() => {
        this.spinning = false;
        this.winnerId = next.winner_id;
      }, this.#spinSeconds * 1000 + 150);
    } else {
      this.spinDuration = 0;
      this.rotation = align;
      this.winnerId = next.winner_id;
    }
  }

  destroy(): void {
    clearTimeout(this.#settleTimer);
  }
}
