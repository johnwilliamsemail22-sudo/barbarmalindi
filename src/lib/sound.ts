let ctx: AudioContext | null = null;
export function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, type: OscillatorType, vol: number) {
  const a = audio();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(freq * 0.4, a.currentTime + dur);
  g.gain.setValueAtTime(vol, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + dur);
}

export const tick = () => blip(1800, 0.04, "square", 0.05);
export const thud = () => blip(140, 0.18, "sine", 0.25);
export const clack = () => blip(900 + Math.random() * 300, 0.03, "square", 0.04);
export const hum = () => blip(60, 1.6, "sawtooth", 0.03);
