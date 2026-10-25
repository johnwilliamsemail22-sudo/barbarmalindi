import { describe, expect, it } from "vitest";

import { venueImageUrl } from "@/lib/assets";

describe("Portable venue photo", () => {
  it("keeps the venue photo on its asset host when the site runs on Vercel", () => {
    const resolved = new URL(venueImageUrl, "https://restaurant-example.vercel.app");

    expect(resolved.origin).toBe("https://barbarmalindi.lovable.app");
    expect(resolved.pathname).toBe("/__l5e/assets-v1/24fa01fc-209d-4b89-81a3-6754ff47bb35/barbar-night.webp");
  });
});