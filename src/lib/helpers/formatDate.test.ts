import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it('formats date as "Mon DD" by default', () => {
    // fixed UTC date; output uses locale 'en' but timezone can affect day.
    // Use noon UTC to avoid TZ shifting date in most zones.
    const s = new Date(Date.UTC(2026, 1, 23, 12, 0, 0)).toISOString();
    const out = formatDate(s);
    expect(out).toMatch(/^[A-Za-z]{3} \d{2}$/);
  });

  it("includes year when years=true", () => {
    const s = new Date(Date.UTC(2026, 1, 23, 12, 0, 0)).toISOString();
    const out = formatDate(s, true);
    expect(out).toMatch(/\b2026\b/);
  });
});
