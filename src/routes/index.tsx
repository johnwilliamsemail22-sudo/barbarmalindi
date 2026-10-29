import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, Phone, Search, X } from "lucide-react";

import { venueImageUrl } from "@/lib/assets";
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
      { property: "og:image", content: venueImageUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: venueImageUrl },
    ],
  }),
  component: Index,
});

// Real contact details supplied by the owner.
const PHONE = "+254743898575";
const PHONE_DISPLAY = "+254 743 898 575";

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/109759043924328", Icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/barbarofficialpage/", Icon: Instagram },
];



// Photo is 382x510; the real marquee sign is centred at (191, 212) and ~250px wide.
const IMG_W = 382, IMG_H = 510, SIGN_X = 191, SIGN_Y = 212, SIGN_W = 250;

const dishes = [
  // Current menu items
  { name: "Prosciutto & Rocket", ingredients: "San Marzano tomato, fior di latte, prosciutto crudo, wild rocket, shaved parmesan, olive oil", price: 1450, img: pizza, keywords: "pizza luxury italian ham arugula" },
  { name: "Malindi Grilled Prawns", ingredients: "Coast tiger prawns, garlic butter, red chilli, parsley, charred lemon", price: 1850, img: prawns, keywords: "seafood luxury prawns shrimp coast" },
  { name: "Passion Dawa", ingredients: "Vodka, fresh passion fruit, lime, raw honey, mint, crushed ice", price: 750, img: cocktail, keywords: "cocktail drink passion fruit dawa" },
  { name: "Diavola", ingredients: "Tomato, fior di latte, spicy salami, chilli honey, basil", price: 1350, img: pizza, keywords: "pizza pepperoni spicy salami" },
  { name: "Sundowner Spritz", ingredients: "Bitter orange aperitivo, prosecco, soda, orange slice", price: 850, img: cocktail, keywords: "cocktail spritz drink orange luxury" },

  // Sample searchable dishes for menu discovery. These are placeholders, not confirmed menu items.
  { name: "Truffle Mushroom Pizza", ingredients: "Wild mushrooms, mozzarella, truffle oil, thyme, parmesan", price: 1650, img: pizza, keywords: "pizza mushroom vegetarian luxury truffle" },
  { name: "Four Cheese Pizza", ingredients: "Mozzarella, gorgonzola, parmesan, ricotta, basil", price: 1550, img: pizza, keywords: "pizza cheese cheesy vegetarian" },
  { name: "BBQ Chicken Pizza", ingredients: "Roast chicken, smoked barbecue sauce, mozzarella, red onion", price: 1450, img: pizza, keywords: "pizza chicken barbecue bbq" },
  { name: "Margherita Pizza", ingredients: "Tomato, fior di latte mozzarella, basil, extra virgin olive oil", price: 1150, img: pizza, keywords: "pizza vegetarian classic cheese" },
  { name: "Seafood Linguine", ingredients: "Prawns, calamari, garlic, cherry tomato, parsley, lemon", price: 1950, img: prawns, keywords: "pasta seafood luxury prawns shrimp" },
  { name: "Creamy Truffle Pasta", ingredients: "Fresh pasta, cream, parmesan, truffle oil, cracked black pepper", price: 1750, img: base, keywords: "pasta luxury truffle creamy italian" },
  { name: "Grilled Lobster", ingredients: "Grilled lobster, garlic butter, herbs, charred lemon", price: 3200, img: prawns, keywords: "seafood luxury lobster shellfish" },
  { name: "Wagyu Beef Burger", ingredients: "Premium beef, aged cheddar, caramelised onions, house sauce, brioche", price: 2250, img: base, keywords: "burger beef luxury wagyu meat" },
  { name: "Chocolate Fondant", ingredients: "Warm dark chocolate cake, molten centre, vanilla cream", price: 850, img: base, keywords: "dessert chocolate cake sweet luxury" },
  { name: "Vanilla Panna Cotta", ingredients: "Vanilla bean cream, berry compote, seasonal fruit", price: 750, img: base, keywords: "dessert vanilla sweet creamy" },
  { name: "Tiramisu", ingredients: "Espresso-soaked sponge, mascarpone cream, cocoa", price: 900, img: base, keywords: "dessert coffee espresso italian sweet" },
  { name: "Espresso", ingredients: "A short, rich shot of freshly brewed coffee", price: 300, img: "https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA2L3Jhd3BpeGVsb2ZmaWNlXzMzX3Bob3RvX29mX2FfbW9kZXJuX2N1cF9vZl9ob3RfYW1lcmljYW5vX3dpdGhfYm9fM2NlZTg2ZjItNWNkNi00MTJjLThhMTEtMjgwM2E3OWRmNDJhLnBuZw.png", keywords: "coffee caffeine espresso hot drink" },
  { name: "Cappuccino", ingredients: "Espresso, steamed milk, silky foam, cocoa dust", price: 400, img: "https://images.rawpixel.com/image_png_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA3L3Jhd3BpeGVsX29mZmljZV8zM19waG90b19vZl9hX2N1cF9vZl9jYXBwdWNjaW5vX2Zyb250X3NpZGVfdmlld183ZDMxZDYwOC03N2VkLTQwOTEtODcxMS03OTNhM2I3NzBjYTcucG5n.png", keywords: "coffee cappuccino latte milk hot drink" },
  { name: "Iced Caramel Latte", ingredients: "Double espresso, chilled milk, caramel, ice", price: 500, img: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA2L3Jhd3BpeGVsb2ZmaWNlXzNlX3Bob3RvX3Rha2VfYXdheV9pY2VkX29tYnJlX21pbGtfbGF0dGVfaXNvbGF0X2E1ZTMxMGUxLWU0OGEtNGNhNi1iNzA3LTg3OTc5Mjg5YmQyOC5wbmc.png", keywords: "coffee iced latte caramel cold drink" },
  { name: "Luxury Hot Chocolate", ingredients: "Dark chocolate, steamed milk, whipped cream", price: 450, img: base, keywords: "coffee hot chocolate cocoa warm drink" },
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
  const [menuQuery, setMenuQuery] = useState("");
  const pos = useSignPosition();
  useEffect(() => {
    const t = setTimeout(() => setLocked(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="grain bg-background text-foreground">
    <section className="relative min-h-[100svh] overflow-hidden bg-night text-night-foreground">
      <img
        src={venueImageUrl}
        alt="Bar Bar Malindi at night with the lit marquee and glowing red heart"
        fetchPriority="high" decoding="async" onLoad={() => setLocked(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ${locked ? "opacity-100" : "opacity-0"}`}
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
        <OrbitCarousel query={menuQuery} />
        <div className="mx-auto mb-5 mt-4 w-full max-w-xl px-5">
          <label htmlFor="barbar-menu-search" className="sr-only">Search the menu</label>
          <div className="flex items-center gap-3 rounded-full border border-night-foreground/25 bg-night/55 px-4 py-3 text-night-foreground shadow-lg backdrop-blur-md transition-colors focus-within:border-primary">
            <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <input id="barbar-menu-search" type="search" value={menuQuery} onChange={(event) => setMenuQuery(event.target.value)} placeholder="Search dishes, ingredients…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-night-foreground/65" autoComplete="off" />
            {menuQuery && <button type="button" onClick={() => setMenuQuery("")} aria-label="Clear search" className="rounded-full p-1 text-night-foreground/70 transition-colors hover:text-primary"><X className="h-4 w-4" aria-hidden="true" /></button>}
          </div>
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-night-foreground/60">Find a dish by name or ingredient</p>
        </div>
      </div>
    </section>
    <BuildPlate />
    <Story />
    <Booking />
    <Footer />
    </main>
  );
}

function OrbitCarousel({ query }: { query: string }) {
  const [pos, setPos] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const wheelLock = useRef(0);
  const filteredDishes = dishes.filter((dish) => `${dish.name} ${dish.ingredients} ${"keywords" in dish ? dish.keywords : ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const n = filteredDishes.length;
  const [radius, setRadius] = useState(420);

  useEffect(() => {
    const resize = () => setRadius(Math.min(560, window.innerWidth * 0.85));
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => { setPos(0); }, [query]);
  const active = n ? ((Math.round(pos) % n) + n) % n : 0;
  const snap = (value: number) => setPos(Math.round(value));

  return (
    <div
      className="relative h-[660px] w-full touch-pan-y select-none [perspective:1100px] md:h-[700px]"
      onPointerDown={(event) => { drag.current = { x: event.clientX, start: pos }; }}
      onPointerMove={(event) => { if (drag.current) setPos(drag.current.start - (event.clientX - drag.current.x) / 260); }}
      onPointerUp={() => { if (drag.current) snap(pos); drag.current = null; }}
      onPointerCancel={() => { if (drag.current) snap(pos); drag.current = null; }}
      onWheel={(event) => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        const now = Date.now();
        if (Math.abs(delta) < 8 || now - wheelLock.current < 450 || !n) return;
        wheelLock.current = now;
        setPos((current) => Math.round(current) + (delta > 0 ? 1 : -1));
      }}
    >
      {filteredDishes.map((dish, index) => {
        let offset = index - pos;
        offset = n ? ((offset + n / 2) % n + n) % n - n / 2 : 0;
        const distance = Math.abs(offset);
        const angle = offset * 0.55;
        return (
          <article key={dish.name}
            className="absolute left-1/2 top-[52%] w-[min(88vw,360px)] md:w-[344px] transition-all duration-700 ease-[var(--ease-dough)]"
            style={{
              transform: `translate(-50%,-50%) translate3d(${Math.sin(angle) * radius}px, ${(1 - Math.cos(angle)) * 160}px, ${-distance * 180}px) rotateY(${offset * -22}deg)`,
              opacity: distance > 2.2 ? 0 : 1 - distance * 0.3,
              zIndex: 20 - Math.round(distance * 4),
              pointerEvents: distance < 0.5 ? "auto" : "none",
            }}>
            <div className="relative ml-6 rounded-[28px] bg-background p-5 pl-28 pt-32 text-foreground shadow-paper md:pl-36 md:pt-40">
              <img src={dish.img} alt={dish.name} width={1024} height={1024} draggable={false}
                loading={distance < 1 ? "eager" : "lazy"} fetchPriority={distance < 0.5 ? "high" : "auto"} decoding="async"
                className="absolute -left-6 -top-16 w-44 origin-bottom drop-shadow-[0_26px_30px_rgba(36,32,30,0.6)] md:-left-14 md:-top-12 md:w-48"
                style={{ transform: `rotate(-8deg) scale(${distance < 0.5 ? 1.14 : 0.92})` }} />
              <h2 className="font-display text-2xl leading-tight">{dish.name}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground md:text-xs">{dish.ingredients}</p>
              <div className="mt-4 -ml-20 flex w-[calc(100%+5rem)] items-center justify-between gap-3 md:-ml-32 md:w-[calc(100%+8rem)]">
                <p className="font-mono text-xl font-bold text-primary md:text-2xl">KSh {dish.price.toLocaleString()}</p>
                <a href={wa(`Hi Bar Bar! I'd like to order ${dish.name} — KSh ${dish.price.toLocaleString()}.`)} target="_blank" rel="noreferrer" aria-label={`Order ${dish.name} on WhatsApp`} className="pill pill-primary flex shrink-0 items-center gap-2 transition-transform hover:scale-[1.03] active:scale-95">Order now <Phone className="h-4 w-4" strokeWidth={2.2} aria-hidden /></a>
              </div>
              <a href="#book" className="mt-2 -ml-20 flex w-[calc(100%+5rem)] items-center justify-center gap-2 rounded-full border border-foreground/20 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary md:-ml-32 md:w-[calc(100%+8rem)] md:text-[11px]">Reserve a table <span aria-hidden>→</span></a>
            </div>
          </article>
        );
      })}
      {n === 0 && <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 text-center font-mono text-xs uppercase tracking-[0.2em] text-night-foreground/70">No dishes found. Try another search.</div>}
      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5">
        {filteredDishes.map((_, index) => <span key={index} className={`h-1 rounded-full transition-all duration-500 ${index === active ? "w-6 bg-primary" : "w-2 bg-night-foreground/40"}`} />)}
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
    <section id="build" className="mx-auto grid max-w-6xl gap-3 px-5 py-6 md:grid-cols-[1fr_1.1fr] md:gap-10 md:py-28">
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
      <div className="flex min-w-0 flex-col justify-center">
        <Eyebrow>Build your own</Eyebrow>
        <h2 className="mt-2 font-display text-3xl leading-[1.05] md:mt-3 md:text-6xl">Your pizza, <em className="text-primary">your rules.</em></h2>
        <p className="mt-2 hidden max-w-md text-muted-foreground md:mt-4 md:block">Start with our 48-hour dough and San Marzano base, then pick what goes on top. Anything else? Tell the kitchen.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 md:mt-7 md:flex md:flex-wrap">
          {toppings.map(({ n, p, img }) => {
            const on = sel.includes(n);
            return (
              <button key={n} type="button" onClick={() => toggle(n)} aria-pressed={on}
                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs transition-all active:scale-95 md:text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15 hover:border-primary"}`}>
                <img src={img} alt="" className="h-6 w-6 shrink-0 rounded-full bg-background object-contain p-0.5 md:h-7 md:w-7" />
                <span className="flex-1 text-left">{n}</span> <span className="font-mono text-[10px] opacity-70 md:text-xs">+{p}</span>
              </button>
            );
          })}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          placeholder="Any combination or request — extra crispy, no garlic, half & half…"
          className="mt-3 w-full resize-none rounded-2xl border border-foreground/15 bg-card p-3 text-sm outline-none focus:border-primary md:mt-5 md:p-4" />
        <div className="mt-3 flex items-center justify-between gap-4 rounded-full bg-foreground p-2 pl-6 text-background md:mt-5">
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
          <img src={venueImageUrl} alt="Bar Bar open-air dining at night" className="mt-8 aspect-[4/5] w-full rounded-[28px] object-cover" />
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
          <div className="mt-6 flex gap-3">
            {socials.map(({ name, href, Icon }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={`Bar Bar on ${name}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-night-foreground/25 text-night-foreground/80 transition-colors hover:border-primary hover:text-primary">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="text-sm leading-7">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Find us</h3>
          <p>Opposite Malindi Casino, Sabaki Centre, Lamu Road, Malindi, Kenya</p>
          <a href={`tel:${PHONE}`} className="block hover:text-primary">{PHONE_DISPLAY}</a>
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
