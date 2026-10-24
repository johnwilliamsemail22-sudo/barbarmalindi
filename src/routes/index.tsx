import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import night from "@/assets/barbar-night.webp.asset.json";
import pizza from "@/assets/pizza.png";
import cocktail from "@/assets/cocktail.png";
import prawns from "@/assets/prawns.png";
import { audio, clack, hum, thud, tick } from "@/lib/sound";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bar Bar Malindi — Wood-Fired Pizza & Coastal Nights" },
      { name: "description", content: "Bar Bar Restaurant & Pizzeria in Malindi, Kenya. Wood-fired pizza, fresh coast seafood, cocktails under the glowing red heart." },
      { property: "og:title", content: "Bar Bar Malindi — Wood-Fired Pizza & Coastal Nights" },
      { property: "og:description", content: "Wood-fired pizza, coast seafood and cocktails under the glowing red heart in Malindi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="grain relative overflow-x-hidden bg-background text-foreground">
      <Hero />
      <Carousel />
      <Soundscape />
      <PlateBuilder />
      <HeartWall />
      <TicketFooter />
    </main>
  );
}

/* ---------- ACT I ---------- */
function Hero() {
  const [phase, setPhase] = useState<"dark" | "lit">("dark");
  useEffect(() => {
    const t = setTimeout(() => setPhase("lit"), 2400);
    return () => clearTimeout(t);
  }, []);
  const letters = "Bar Bar".split("");
  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-night text-night-foreground">
      <img src={night.url} alt="Bar Bar Malindi at night with the glowing red heart" className={`absolute inset-0 h-full w-full object-cover transition-all duration-[2000ms] ${phase === "lit" ? "scale-100 opacity-70" : "scale-110 opacity-0"}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/60" />
      <header className={`absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-[1400ms] ease-[var(--ease-dough)] ${phase === "lit" ? "top-6" : "top-1/2 -translate-y-1/2"}`}>
        <h1 onClick={hum} className={`font-display italic font-semibold neon-text select-none transition-all duration-[1400ms] ease-[var(--ease-dough)] ${phase === "lit" ? "text-4xl" : "text-7xl md:text-9xl"}`}>
          {letters.map((l, i) => (
            <span key={i} style={{ animation: `bulb-on 0.5s ${0.2 + i * 0.22}s both` }}>{l === " " ? "\u00A0" : l}</span>
          ))}
        </h1>
      </header>
      <div className={`absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:px-14 ${phase === "lit" ? "animate-rise" : "opacity-0"}`}>
        <p className="font-mono text-xs tracking-[0.3em] text-glow">MALINDI · KENYA COAST · SINCE THE NIGHTS GOT WARM</p>
        <h2 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] md:text-8xl">
          Wood-fire, salt air <em className="text-glow">&</em> a heart that never switches off.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#menu" className="pill pill-primary">Order now</a>
          <a href="#book" className="pill pill-oat">Book a table</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- ACT II ---------- */
const dishes = [
  { name: "Prosciutto & Rocket", note: "Wood-fired, blistered crust, aged parmesan", img: pizza },
  { name: "Passion Dawa", note: "Passion fruit, lime, mint, crushed ice", img: cocktail },
  { name: "Malindi Prawns", note: "Charcoal grilled, chilli garlic butter", img: prawns },
  { name: "Diavola", note: "Spicy salami, chilli honey, fior di latte", img: pizza },
  { name: "Sundowner Spritz", note: "Bitter orange, prosecco, coast citrus", img: cocktail },
];

function Carousel() {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const go = (d: number) => { setI((v) => (v + d + dishes.length) % dishes.length); tick(); };
  return (
    <section id="menu" className="relative px-6 py-28 md:px-14">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-primary">ACT II — THE ORBIT</p>
          <h2 className="mt-3 font-display text-5xl leading-none md:text-6xl">Tonight's<br /><em>rotation</em></h2>
          <p className="mt-4 max-w-xs text-muted-foreground">Swipe, or spin the wheel. Every plate clicks into place.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => go(-1)} className="pill pill-oat" aria-label="Previous dish">←</button>
            <button onClick={() => go(1)} className="pill pill-primary" aria-label="Next dish">→</button>
          </div>
        </div>
        <div
          className="relative h-[560px] [perspective:1200px]"
          onPointerDown={(e) => (startX.current = e.clientX)}
          onPointerUp={(e) => { if (startX.current !== null && Math.abs(e.clientX - startX.current) > 40) go(e.clientX < startX.current ? 1 : -1); startX.current = null; }}
          onWheel={(e) => { if (Math.abs(e.deltaX) > 30) go(e.deltaX > 0 ? 1 : -1); }}
        >
          {dishes.map((d, k) => {
            let off = k - i;
            if (off > 2) off -= dishes.length;
            if (off < -2) off += dishes.length;
            const a = Math.abs(off);
            return (
              <article
                key={k}
                className="absolute left-1/2 top-1/2 w-[300px] transition-all duration-[900ms] ease-[var(--ease-dough)]"
                style={{
                  transform: `translate(-50%,-50%) translate(${off * -230}px, ${off * 150}px) rotateY(${off * 25}deg) scale(${1 - a * 0.22})`,
                  filter: `blur(${a * 3}px)`,
                  opacity: a > 1 ? 0.35 : 1,
                  zIndex: 10 - a,
                }}
              >
                <div className="relative mt-24 rounded-[28px] bg-card px-6 pb-6 pt-36 shadow-paper">
                  <img src={d.img} alt={d.name} width={1024} height={1024} loading="lazy" className="absolute -left-10 -top-28 w-64 drop-shadow-2xl" />
                  <h3 className="font-display text-2xl">{d.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.note}</p>
                  {off === 0 && (
                    <div className="mt-5 flex gap-2">
                      <a href="#build" className="pill pill-primary">Order now</a>
                      <a href="#book" className="pill pill-oat">Book</a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Soundscape ---------- */
function Soundscape() {
  const [on, setOn] = useState(false);
  const [dots, setDots] = useState<{ x: number; y: number; id: number }[]>([]);
  const nodes = useRef<{ filter: BiquadFilterNode; osc: OscillatorNode; stop: () => void } | null>(null);

  const start = () => {
    const a = audio();
    if (!a) return;
    const buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let n = 0; n < data.length; n++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; data[n] = last * 3.5; }
    const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
    const filter = a.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 600;
    const wave = a.createGain(); wave.gain.value = 0.4;
    const lfo = a.createOscillator(); lfo.frequency.value = 0.12;
    const lfoG = a.createGain(); lfoG.gain.value = 0.3; lfo.connect(lfoG).connect(wave.gain);
    src.connect(filter).connect(wave).connect(a.destination);
    const osc = a.createOscillator(); osc.type = "triangle"; osc.frequency.value = 220;
    const og = a.createGain(); og.gain.value = 0.03; osc.connect(og).connect(a.destination);
    src.start(); lfo.start(); osc.start();
    nodes.current = { filter, osc, stop: () => { src.stop(); lfo.stop(); osc.stop(); } };
    setOn(true);
  };
  const stop = () => { nodes.current?.stop(); nodes.current = null; setOn(false); };
  useEffect(() => () => nodes.current?.stop(), []);

  return (
    <section className="relative bg-night px-6 py-28 text-night-foreground md:px-14">
      <p className="font-mono text-xs tracking-[0.3em] text-glow">THE MALINDI NIGHT SOUNDSCAPE</p>
      <h2 className="mt-3 max-w-2xl font-display text-5xl leading-none md:text-6xl">Drag through the dark. <em>Tune the tide.</em></h2>
      <div
        className="relative mt-10 h-[380px] cursor-crosshair overflow-hidden rounded-[28px] border border-night-foreground/10"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          if (nodes.current) { nodes.current.filter.frequency.value = 200 + x * 2400; nodes.current.osc.frequency.value = 110 + (1 - y) * 330; }
          const id = performance.now();
          setDots((d) => [...d.slice(-40), { x: x * 100, y: y * 100, id }]);
        }}
      >
        {dots.map((d, k) => (
          <span key={d.id} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${d.x}%`, top: `${d.y}%`, opacity: k / dots.length, boxShadow: "var(--shadow-neon)" }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={on ? stop : start} className="pill pill-primary">{on ? "Silence the night" : "Tap to listen"}</button>
        </div>
        <span className="absolute bottom-4 left-6 font-mono text-[10px] tracking-widest opacity-60">← CALM SWELL · · · OPEN SEA →</span>
      </div>
    </section>
  );
}

/* ---------- Plate builder ---------- */
const ingredients = [
  { n: "Fior di latte", p: 250, c: "bg-background" },
  { n: "Spicy salami", p: 350, c: "bg-primary" },
  { n: "Rocket", p: 150, c: "bg-chart-2" },
  { n: "Mushroom", p: 200, c: "bg-muted-foreground" },
  { n: "Prawns", p: 600, c: "bg-accent" },
  { n: "Chilli honey", p: 150, c: "bg-chart-4" },
];
const BASE = 900;

function PlateBuilder() {
  const [items, setItems] = useState<{ n: string; x: number; y: number; c: string; id: number }[]>([]);
  const add = (name: string, x = 30 + Math.random() * 40, y = 30 + Math.random() * 40) => {
    const ing = ingredients.find((g) => g.n === name)!;
    setItems((s) => [...s, { n: name, x, y, c: ing.c, id: Math.random() }]);
    thud();
  };
  const total = BASE + items.reduce((s, it) => s + ingredients.find((g) => g.n === it.n)!.p, 0);
  return (
    <section id="build" className="px-6 py-28 md:px-14">
      <p className="font-mono text-xs tracking-[0.3em] text-primary">BUILD-YOUR-OWN WOOD-FIRED PLATE</p>
      <h2 className="mt-3 font-display text-5xl leading-none md:text-6xl">Drop it on the <em>dough</em>.</h2>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr_1fr]">
        <div className="flex flex-wrap content-start gap-3">
          {ingredients.map((g) => (
            <button key={g.n} draggable onDragStart={(e) => e.dataTransfer.setData("text", g.n)} onClick={() => add(g.n)} className="pill pill-oat flex items-center gap-2 shadow-paper">
              <span className={`h-3 w-3 rounded-full ${g.c} ring-1 ring-foreground/20`} />{g.n}
            </button>
          ))}
        </div>
        <div
          className="relative mx-auto aspect-square w-full max-w-[440px] rounded-full bg-card p-6 shadow-paper"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); add(e.dataTransfer.getData("text"), ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100); }}
        >
          <div className="h-full w-full rounded-full bg-accent/40 p-5 ring-8 ring-chart-5/50">
            <div className="h-full w-full rounded-full bg-primary/70" />
          </div>
          {items.map((it) => (
            <span key={it.id} className={`absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full ${it.c} shadow-paper ring-1 ring-foreground/20 animate-rise`} style={{ left: `${it.x}%`, top: `${it.y}%`, animationDuration: ".5s" }} />
          ))}
        </div>
        <aside className="rounded-[28px] bg-card p-6 font-mono text-sm shadow-paper">
          <p className="text-xs tracking-[0.3em] text-primary">ORDER PASS</p>
          <ul className="mt-4 space-y-1">
            <li className="flex justify-between"><span>Margherita base</span><span>{BASE}</span></li>
            {items.map((it) => (<li key={it.id} className="flex justify-between text-muted-foreground"><span>+ {it.n}</span><span>{ingredients.find((g) => g.n === it.n)!.p}</span></li>))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-dashed border-foreground/30 pt-4 text-lg font-bold"><span>KES</span><span>{total.toLocaleString()}</span></div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setItems([])} className="pill pill-oat">Clear</button>
            <a href="#book" className="pill pill-primary">Order</a>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ---------- Heart wall ---------- */
const memories = ["Anniversary, table 7", "First pizza in Kenya", "Sundowners after the dhow trip", "Birthday under the heart", "We said yes here", "Every Friday since 2019"];
function HeartWall() {
  const N = 17;
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = (c - N / 2 + 0.5) / (N / 2.4), y = -(r - N / 2 + 0.5) / (N / 2.4) + 0.2;
    if ((x * x + y * y - 1) ** 3 - x * x * y ** 3 <= 0) cells.push({ x: c, y: r });
  }
  const [lit, setLit] = useState<Set<number>>(new Set());
  const [mem, setMem] = useState<string | null>(null);
  return (
    <section className="bg-night px-6 py-28 text-night-foreground md:px-14">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-glow">THE HEARTBEAT WALL</p>
          <h2 className="mt-3 font-display text-5xl leading-none md:text-6xl">Run your hand over <em className="text-glow">the heart</em>.</h2>
          <p className="mt-4 max-w-sm opacity-70">Every bulb holds a night someone remembers.</p>
          <div className={`mt-10 w-64 rotate-[-4deg] bg-night-foreground p-3 pb-10 text-night shadow-paper transition-all duration-700 ${mem ? "opacity-100" : "opacity-0"}`}>
            <div className="aspect-square bg-primary/80" style={{ backgroundImage: `url(${night.url})`, backgroundSize: "cover", backgroundBlendMode: "multiply" }} />
            <p className="mt-3 font-display italic">{mem}</p>
          </div>
        </div>
        <div className="mx-auto grid gap-1.5" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
          {Array.from({ length: N * N }).map((_, k) => {
            const on = cells.some((c) => c.y * N + c.x === k);
            if (!on) return <span key={k} className="h-4 w-4 md:h-5 md:w-5" />;
            const l = lit.has(k);
            return (
              <span
                key={k}
                onPointerEnter={() => { setLit((s) => new Set(s).add(k)); setMem(memories[k % memories.length] ?? null); }}
                className={`h-4 w-4 rounded-full transition-all duration-500 md:h-5 md:w-5 ${l ? "bg-glow" : "bg-primary/25"}`}
                style={l ? { boxShadow: "var(--shadow-neon)" } : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Split flap ---------- */
function Flap({ text }: { text: string }) {
  return (
    <div className="flex gap-1">
      {text.padEnd(10).slice(0, 10).split("").map((ch, k) => (
        <span key={`${k}-${ch}`} className="animate-flap flex h-11 w-8 items-center justify-center rounded-md bg-night font-mono text-xl font-bold text-glow shadow-paper md:h-14 md:w-10 md:text-2xl" style={{ animationDelay: `${k * 40}ms` }}>
          {ch}
        </span>
      ))}
    </div>
  );
}
function TicketFooter() {
  const [date, setDate] = useState("FRI");
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [issued, setIssued] = useState(false);
  const pick = <T,>(fn: (v: T) => void, v: T) => { fn(v); setIssued(false); for (let n = 0; n < 8; n++) setTimeout(clack, n * 35); };
  const Opt = ({ v, cur, on }: { v: string; cur: string; on: () => void }) => (
    <button onClick={on} className={`pill ${v === cur ? "pill-primary" : "pill-oat"}`}>{v}</button>
  );
  return (
    <footer id="book" className="px-6 py-28 md:px-14">
      <p className="font-mono text-xs tracking-[0.3em] text-primary">MIDNIGHT EXPRESS · RESERVATIONS</p>
      <h2 className="mt-3 font-display text-5xl leading-none md:text-6xl">Your table, <em>now arriving</em>.</h2>
      <div className="mt-10 rounded-[28px] bg-foreground p-6 shadow-paper md:p-10">
        <div className="space-y-3">
          <Flap text={`DAY  ${date}`} />
          <Flap text={`TIME ${time}`} />
          <Flap text={`PAX  ${guests}`} />
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="flex flex-wrap gap-2">{["THU", "FRI", "SAT", "SUN"].map((d) => <Opt key={d} v={d} cur={date} on={() => pick(setDate, d)} />)}</div>
        <div className="flex flex-wrap gap-2">{["19:00", "20:00", "21:30"].map((t) => <Opt key={t} v={t} cur={time} on={() => pick(setTime, t)} />)}</div>
        <div className="flex flex-wrap gap-2">{[2, 4, 6].map((g) => <Opt key={g} v={String(g)} cur={String(guests)} on={() => pick(setGuests, g)} />)}</div>
      </div>
      <button onClick={() => { setIssued(true); thud(); }} className="pill pill-primary mt-8">Print my ticket</button>
      {issued && (
        <div className="animate-rise mt-8 max-w-md rounded-[28px] border-2 border-dashed border-primary bg-card p-6 shadow-paper">
          <p className="font-display text-3xl italic neon-text">Bar Bar</p>
          <p className="mt-2 font-mono text-sm">{date} · {time} · {guests} GUESTS · MALINDI</p>
          <p className="mt-1 text-xs text-muted-foreground">Show this pass at the door under the heart.</p>
        </div>
      )}
      <p className="mt-20 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">BAR BAR RESTAURANT & PIZZERIA · MALINDI, KENYA</p>
    </footer>
  );
}
