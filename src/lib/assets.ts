import night from "@/assets/barbar-night.webp.asset.json";

// The asset endpoint is served by Lovable, not by third-party hosts such as Vercel.
// Keep the pointer unchanged and resolve it against its verified public host.
export const venueImageUrl = new URL(night.url, "https://barbarmalindi.lovable.app").href;