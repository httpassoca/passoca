import { describe, expect, it } from "vitest";
import { capitalize, getSlug } from "./helpers";

describe("helpers", () => {
  describe("capitalize", () => {
    it("capitalizes first letter and lowercases the rest", () => {
      expect(capitalize("hELLo")).toBe("Hello");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("getSlug", () => {
    it("extracts filename without extension (posix)", () => {
      expect(getSlug("/a/b/c/post.md")).toBe("post");
    });

    it("extracts filename without extension (windows)", () => {
      expect(getSlug("C:\\a\\b\\c\\post.md")).toBe("post");
    });

    it("returns empty string if no filename", () => {
      expect(getSlug("")).toBe("");
    });
  });
});
