import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import night from "@/assets/barbar-night.webp.asset.json";
import pizza from "@/assets/pizza.png";
import cocktail from "@/assets/cocktail.png";
import prawns from "@/assets/prawns.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bar Bar Malindi — Wood-Fired Pizza & Coastal Nights" },
      { name: "description", content: "Order wood-fired pizza, coast seafood and cocktails from Bar Bar Restaurant & Pizzeria in Malindi, Kenya." },
      { property: "og:title", content: "Bar Bar Malindi — Wood-Fired Pizza & Coastal Nights" },
      { property: "og:description", content: "Wood-fired pizza, coast seafood and cocktails under the glowing red heart in Malindi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Placeholder contact — replace with the restaurant's real number.
const PHONE = "+254700000000";

// Photo is 382x510; the real marquee sign is centred at (191, 212) and ~250px wide.
const IMG_W = 382, IMG_H = 510, SIGN_X = 191, SIGN_Y = 212, SIGN_W = 250;

const dishes = [
  { name: "Prosciutto & Rocket", ingredients: "San Marzano tomato, fior di latte, prosciutto crudo, wild rocket, shaved parmesan, olive oil", price: 1450, img: pizza },
  { name: "Malindi Grilled Prawns", ingredients: "Coast tiger prawns, garlic butter, red chilli, parsley, charred lemon", price: 1850, img: prawns },
  { name: "Passion Dawa", ingredients: "Vodka, fresh passion fruit, lime, raw honey, mint, crushed ice", price: 750, img: cocktail },
  { name: "Diavola", ingredients: "Tomato, fior di latte, spicy salami, chilli honey, basil", price: 1350, img: pizza },
  { name: "Sundowner Spritz", ingredients: "Bitter orange aperitivo, prosecco, soda, orange slice", price: 850, img: cocktail },
];

function useSignPosition() {
  const [pos, setPos] = useState<{ x: number; y: number; size: number; offY: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const W = window.innerWidth, H = window.innerHeight;
      const s = Math.max(W / IMG_W, H / IMG_H);
      const offX = (W - IMG_W * s) / 2;
      // Shift the photo so the real sign sits near the top of the screen.
      const offY = Math.min(0, Math.max(H - IMG_H * s, H * 0.16 - SIGN_Y * s));
      setPos({ x: offX + SIGN_X * s, y: offY + SIGN_Y * s, size: (SIGN_W * s) / 4.2, offY });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return pos;
}

function Index() {
  const [locked, setLocked] = useState(false);
  const pos = useSignPosition();
  useEffect(() => {
    const t = setTimeout(() => setLocked(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="grain relative min-h-[100svh] overflow-hidden bg-night text-night-foreground">
      <img
        src={night.url}
        alt="Bar Bar Malindi at night with the lit marquee and glowing red heart"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${locked ? "opacity-100" : "opacity-0"}`}
        style={{ objectPosition: `50% ${pos?.offY ?? 0}px` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night/20 to-night/90" />

      {/* Logo forms centre, then locks over the real marquee */}
      {pos && (
        <h1
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display font-semibold italic neon-text transition-all duration-[1400ms] ease-[var(--ease-dough)]"
          style={
            locked
              ? { left: pos.x, top: pos.y, fontSize: pos.size, opacity: 0 }
              : { left: "50%", top: "50%", fontSize: "clamp(3.5rem, 14vw, 9rem)" }
          }
        >
          {"Bar Bar".split("").map((l, i) => (
            <span key={i} style={{ animation: `bulb-on 0.45s ${0.15 + i * 0.16}s both` }}>{l === " " ? "\u00A0" : l}</span>
          ))}
        </h1>
      )}

      <div className={`relative z-10 flex min-h-[100svh] flex-col justify-end transition-all duration-1000 ease-[var(--ease-dough)] ${locked ? "translate-y-0 opacity-100 delay-700" : "translate-y-16 opacity-0"}`}>
        <OrbitCarousel />
        <CustomOrder />
      </div>
    </main>
  );
}

function OrbitCarousel() {
  const [pos, setPos] = useState(0); // continuous index
  const drag = useRef<{ x: number; start: number } | null>(null);
  const wheelLock = useRef(0);
  const n = dishes.length;
  const [radius, setRadius] = useState(420);
  useEffect(() => {
    const r = () => setRadius(Math.min(420, window.innerWidth * 0.62));
    r(); window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  const active = ((Math.round(pos) % n) + n) % n;

  const snap = (v: number) => setPos(Math.round(v));

  return (
    <div
      className="relative h-[300px] w-full touch-pan-y select-none [perspective:1100px] md:h-[380px]"
      onPointerDown={(e) => { drag.current = { x: e.clientX, start: pos }; (e.target as Element).setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => { if (drag.current) setPos(drag.current.start - (e.clientX - drag.current.x) / 260); }}
      onPointerUp={() => { if (drag.current) snap(pos); drag.current = null; }}
      onPointerCancel={() => { snap(pos); drag.current = null; }}
      onWheel={(e) => {
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        const now = Date.now();
        if (Math.abs(d) < 8 || now - wheelLock.current < 450) return;
        wheelLock.current = now;
        setPos((p) => Math.round(p) + (d > 0 ? 1 : -1));
      }}
    >
      {dishes.map((d, k) => {
        let off = k - pos;
        off = ((off + n / 2) % n + n) % n - n / 2;
        const a = Math.abs(off);
        const angle = off * 0.55; // radians along the orbit
        return (
          <article
            key={d.name}
            className={`absolute left-1/2 top-[56%] w-[270px] md:w-[320px] ${drag.current ? "" : "transition-all duration-700 ease-[var(--ease-dough)]"}`}
            style={{
              transform: `translate(-50%,-50%) translate3d(${Math.sin(angle) * radius}px, ${(1 - Math.cos(angle)) * 160}px, ${-a * 180}px) rotateY(${off * -22}deg)`,
              opacity: a > 2.2 ? 0 : 1 - a * 0.3,
              zIndex: 20 - Math.round(a * 4),
              pointerEvents: a < 0.5 ? "auto" : "none",
            }}
          >
            <div className="relative ml-6 rounded-[28px] bg-background p-4 pl-24 text-foreground shadow-paper md:pl-32">
              <img src={d.img} alt={d.name} width={1024} height={1024} draggable={false} className="absolute -left-8 -top-10 w-28 drop-shadow-2xl md:w-44" />
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg leading-tight md:text-2xl">{d.name}</h2>
              </div>
              <p className="mt-1 font-mono text-sm font-bold text-primary">KSh {d.price.toLocaleString()}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.ingredients}</p>
              <a href={`tel:${PHONE}`} className="pill pill-primary mt-3 inline-block">Order now / Call</a>
            </div>
          </article>
        );
      })}
      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5">
        {dishes.map((_, k) => (
          <span key={k} className={`h-1 rounded-full transition-all duration-500 ${k === active ? "w-6 bg-primary" : "w-2 bg-night-foreground/40"}`} />
        ))}
      </div>
    </div>
  );
}

function CustomOrder() {
  const [text, setText] = useState("");
  return (
    <form
      className="mx-auto mb-5 mt-3 flex w-[min(640px,calc(100%-2rem))] items-center gap-2 rounded-full bg-background p-1.5 pl-5 text-foreground shadow-paper"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        window.open(`https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(`Bar Bar order: ${text}`)}`, "_blank");
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your own combo or request for the kitchen…"
        aria-label="Custom order or special request"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button type="submit" className="pill pill-primary shrink-0">Send</button>
    </form>
  );
}
