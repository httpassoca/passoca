import { describe, expect, it } from "vitest";
import { deLocalizeUrl, localizeHref } from "../paraglide/runtime.js";
import { m } from "../paraglide/messages.js";

describe("paraglide i18n", () => {
  it("localizeHref prefixes locale when not base locale", () => {
    expect(localizeHref("/blog", { locale: "pt-BR" })).toBe("/pt-BR/blog");
  });

  it("localizeHref does not prefix base locale", () => {
    expect(localizeHref("/blog", { locale: "en" })).toBe("/blog");
  });

  it("deLocalizeUrl strips locale prefix", () => {
    const u = new URL("https://example.com/pt-BR/projects");
    expect(deLocalizeUrl(u).pathname).toBe("/projects");
  });

  it("returns translated messages based on explicit locale", () => {
    expect(m.nav_home({}, { locale: "en" })).toBe("home");
    expect(m.nav_home({}, { locale: "pt-BR" })).toBe("início");
  });
});
