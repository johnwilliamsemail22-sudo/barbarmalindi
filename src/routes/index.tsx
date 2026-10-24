import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import night from "@/assets/barbar-night.webp.asset.json";
import pizza from "@/assets/pizza.png";
import cocktail from "@/assets/cocktail.png";
import prawns from "@/assets/prawns.png";
import base from "@/assets/base.png";
import tMozz from "@/assets/t-mozz.png";
import tProsciutto from "@/assets/t-prosciutto.png";
import tRocket from "@/assets/t-rocket.png";
import tSalami from "@/assets/t-salami.png";
import tPrawn from "@/assets/t-prawn.png";
import tMushroom from "@/assets/t-mushroom.png";
import tChilli from "@/assets/t-chilli.png";
import tOlive from "@/assets/t-olive.png";

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
    <main className="grain bg-background text-foreground">
    <section className="relative min-h-[100svh] overflow-hidden bg-night text-night-foreground">
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
        <a href="#build" className="mx-auto mb-5 mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-night-foreground/70">Build your own · Story · Book ↓</a>
      </div>
    </section>
    <BuildPlate />
    <Story />
    <Booking />
    <Footer />
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
      className="relative h-[320px] w-full touch-pan-y select-none [perspective:1100px] md:h-[400px]"
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
            className={`absolute left-1/2 top-[56%] w-[292px] md:w-[344px] ${drag.current ? "" : "transition-all duration-700 ease-[var(--ease-dough)]"}`}
            style={{
              transform: `translate(-50%,-50%) translate3d(${Math.sin(angle) * radius}px, ${(1 - Math.cos(angle)) * 160}px, ${-a * 180}px) rotateY(${off * -22}deg)`,
              opacity: a > 2.2 ? 0 : 1 - a * 0.3,
              zIndex: 20 - Math.round(a * 4),
              pointerEvents: a < 0.5 ? "auto" : "none",
            }}
          >
            <div className="relative ml-6 rounded-[28px] bg-background p-4 pl-24 text-foreground shadow-paper md:pl-36">
              <img src={d.img} alt={d.name} width={1024} height={1024} draggable={false} className={`absolute -left-8 -top-12 w-32 origin-bottom drop-shadow-[0_22px_26px_rgba(36,32,30,0.55)] md:-left-14 md:w-48 ${drag.current ? "" : "transition-transform duration-700 ease-[var(--ease-dough)]"}`} style={{ transform: `rotate(-8deg) scale(${a < 0.5 ? 1.08 : 0.92})` }} />
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg leading-tight md:text-2xl">{d.name}</h2>
              </div>
              <p className="mt-1 font-mono text-sm font-bold text-primary">KSh {d.price.toLocaleString()}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.ingredients}</p>
              <a href={wa(`Hi Bar Bar, I'd like to order: ${d.name}`)} target="_blank" rel="noreferrer" className="pill pill-primary mt-3 -ml-20 block w-[calc(100%+5rem)] text-center md:-ml-32 md:w-[calc(100%+8rem)]">Order now</a>
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

const wa = (t: string) => `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(t)}`;

const toppings = [
  { n: "Fior di latte", p: 200, img: tMozz, count: 7, size: 17 },
  { n: "Prosciutto", p: 350, img: tProsciutto, count: 5, size: 20 },
  { n: "Wild rocket", p: 120, img: tRocket, count: 9, size: 16 },
  { n: "Spicy salami", p: 300, img: tSalami, count: 8, size: 13 },
  { n: "Coast prawns", p: 450, img: tPrawn, count: 6, size: 14 },
  { n: "Mushrooms", p: 150, img: tMushroom, count: 8, size: 11 },
  { n: "Chilli honey", p: 100, img: tChilli, count: 9, size: 7 },
  { n: "Olives", p: 120, img: tOlive, count: 10, size: 7 },
] as const;
const BASE = 900;

// Deterministic scatter inside the sauce area, different per topping.
function scatter(seed: number, count: number) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + rnd() * 1.2;
    const r = Math.sqrt(0.08 + rnd() * 0.92) * 30;
    return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, rot: Math.floor(rnd() * 360), d: i * 70 + rnd() * 60 };
  });
}
const spots = toppings.map((t, i) => scatter(i + 3, t.count));

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{children}</p>;
}

function BuildPlate() {
  const [sel, setSel] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const plate = useRef<HTMLDivElement>(null);
  const total = BASE + toppings.filter((t) => sel.includes(t.n)).reduce((a, t) => a + t.p, 0);
  const toggle = (n: string) => {
    setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
    plate.current?.animate([{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }], { duration: 450, delay: 400, easing: "ease-out" });
  };
  const msg = `Bar Bar custom pizza: ${sel.join(", ") || "base only"}${note ? ` — Note: ${note}` : ""} (KSh ${total.toLocaleString()})`;
  return (
    <section id="build" className="mx-auto grid max-w-6xl gap-4 px-5 py-8 md:grid-cols-[1fr_1.1fr] md:gap-10 md:py-28">
      <div className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-md">
        <div ref={plate} className="relative h-full w-full">
          <img src={base} alt="Your empty pizza base" className="h-full w-full object-contain drop-shadow-2xl" />
          {sel.length > 0 && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {[0, 1, 2].map((i) => (
                <span key={i} className="smoke-wisp absolute left-1/2 top-[38%] h-16 w-10 rounded-full bg-foreground/10 blur-md md:h-24 md:w-14"
                  style={{ animationDelay: `${i * 1.4}s`, marginLeft: `${(i - 1) * 26}px` }} />
              ))}
            </div>
          )}
          {sel.map((n) => {
            const ti = toppings.findIndex((t) => t.n === n);
            const t = toppings[ti];
            if (!t) return null;
            return (spots[ti] ?? []).map((sp, k) => (
              <img key={`${n}-${k}`} src={t.img} alt="" aria-hidden
                className="pointer-events-none absolute"
                style={{
                  left: `${sp.x}%`, top: `${sp.y}%`, width: `${t.size}%`,
                  ["--r" as string]: `${sp.rot}deg`,
                  transform: `translate(-50%,-50%) rotate(${sp.rot}deg)`,
                  filter: "drop-shadow(0 3px 3px rgb(0 0 0 / .35))",
                  animation: `topping-drop .65s ${sp.d}ms cubic-bezier(.3,.7,.4,1) both`,
                }} />
            ));
          })}
        </div>
        {sel.length === 0 && (
          <p className="absolute inset-x-0 -bottom-2 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Empty base — tap a topping to start cooking</p>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <Eyebrow>Build your own</Eyebrow>
        <h2 className="mt-2 font-display text-3xl leading-[1.05] md:mt-3 md:text-6xl">Your pizza, <em className="text-primary">your rules.</em></h2>
        <p className="mt-2 hidden max-w-md text-muted-foreground md:mt-4 md:block">Start with our 48-hour dough and San Marzano base, then pick what goes on top. Anything else? Tell the kitchen.</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,#000_84%,transparent)] md:mt-7 md:flex-wrap md:overflow-visible md:[mask-image:none]">
          {toppings.map(({ n, p, img }) => {
            const on = sel.includes(n);
            return (
              <button key={n} type="button" onClick={() => toggle(n)} aria-pressed={on}
                className={`flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-sm transition-all active:scale-95 ${on ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15 hover:border-primary"}`}>
                <img src={img} alt="" className="h-8 w-8 rounded-full bg-background object-contain p-0.5" />
                {n} <span className="font-mono text-xs opacity-70">+{p}</span>
              </button>
            );
          })}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          placeholder="Any combination or request — extra crispy, no garlic, half & half…"
          className="mt-4 w-full resize-none rounded-2xl border border-foreground/15 bg-card p-3 text-sm outline-none focus:border-primary md:mt-5 md:p-4" />
        <div className="mt-4 flex items-center justify-between gap-4 rounded-full bg-foreground p-2 pl-6 text-background md:mt-5">
          <span className="font-mono text-sm">KSh {total.toLocaleString()}</span>
          <a href={wa(msg)} target="_blank" rel="noreferrer" className="pill pill-primary">Send to kitchen</a>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-night py-20 text-night-foreground md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow>The Bar Bar story</Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] md:text-7xl">Fire, salt air <em className="text-primary">& a red heart.</em></h2>
          <img src={night.url} alt="Bar Bar open-air dining at night" className="mt-8 aspect-[4/5] w-full rounded-[28px] object-cover" />
        </div>
        <div className="space-y-10 md:col-span-6 md:col-start-7 md:pt-24">
          <p className="font-display text-2xl leading-snug md:text-3xl">On Lamu Road, where Malindi slows down after sunset, a string of bulbs spells out two words and a heart glows over the tables.</p>
          {[
            ["01 — The oven", "Every pizza goes through a wood-fired oven at around 450°C. Ninety seconds, a blistered crust, a soft middle."],
            ["02 — The coast", "Prawns, fish and lime come from the coast — cooked simply so the sea still tastes like the sea."],
            ["03 — The open air", "No walls, no rush. Sea breeze, warm light and long tables built for friends who stay late."],
          ].map(([t, b]) => (
            <div key={t} className="border-t border-night-foreground/20 pt-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{t}</h3>
              <p className="mt-2 text-night-foreground/80">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  const [f, setF] = useState({ name: "", date: "", time: "19:30", guests: "2", type: "Table" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const msg = `Bar Bar booking — ${f.type}: ${f.name}, ${f.guests} guests, ${f.date} at ${f.time}`;
  const field = "w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  return (
    <section id="book" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid gap-10 rounded-[32px] bg-card p-6 shadow-paper md:grid-cols-2 md:p-12">
        <div>
          <Eyebrow>Reservations</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Save a seat under the heart.</h2>
          <p className="mt-4 text-muted-foreground">Tables for two, birthdays, or the whole office — party bookings of 10+ get a set menu and a reserved corner.</p>
        </div>
        <form className="grid grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); window.open(wa(msg), "_blank"); }}>
          <div className="col-span-2 flex rounded-full bg-background p-1">
            {["Table", "Party (10+)"].map((t) => (
              <button key={t} type="button" onClick={() => setF({ ...f, type: t, guests: t === "Table" ? "2" : "10" })}
                className={`flex-1 rounded-full py-2 text-sm transition-colors ${f.type === t ? "bg-foreground text-background" : ""}`}>{t}</button>
            ))}
          </div>
          <input required placeholder="Your name" value={f.name} onChange={set("name")} className={`${field} col-span-2`} />
          <input required type="date" value={f.date} onChange={set("date")} className={field} />
          <input type="time" value={f.time} onChange={set("time")} className={field} />
          <input type="number" min={1} value={f.guests} onChange={set("guests")} className={`${field} col-span-2`} aria-label="Guests" />
          <button type="submit" className="pill pill-primary col-span-2 justify-center">Request booking</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-night px-5 pb-10 pt-16 text-night-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-5xl italic neon-text">Bar Bar</p>
          <p className="mt-3 text-sm text-night-foreground/70">Restaurant & Pizzeria · Malindi</p>
        </div>
        <div className="text-sm leading-7">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Find us</h3>
          <p>Lamu Road, Malindi, Kenya</p>
          <a href={`tel:${PHONE}`} className="block hover:text-primary">{PHONE}</a>
          <a href={wa("Hi Bar Bar!")} target="_blank" rel="noreferrer" className="block hover:text-primary">Order on WhatsApp →</a>
        </div>
        <div className="text-sm leading-7">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Hours</h3>
          <p>Mon–Thu · 12:00–23:00</p>
          <p>Fri–Sun · 12:00–01:00</p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-night-foreground/15 pt-6 font-mono text-[11px] text-night-foreground/50">© {new Date().getFullYear()} Bar Bar Malindi</p>
    </footer>
  );
}
