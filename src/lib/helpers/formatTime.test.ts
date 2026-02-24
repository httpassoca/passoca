import { describe, expect, it } from "vitest";
import { msToTime } from "./formatTime";

describe("msToTime", () => {
  it("formats milliseconds into mm:ss", () => {
    expect(msToTime(0)).toBe("00:00");
    expect(msToTime(1000)).toBe("00:01");
    expect(msToTime(61_000)).toBe("01:01");
    expect(msToTime(10 * 60_000 + 5_000)).toBe("10:05");
  });

  it("ignores ms remainder", () => {
    expect(msToTime(1_999)).toBe("00:01");
  });
});
