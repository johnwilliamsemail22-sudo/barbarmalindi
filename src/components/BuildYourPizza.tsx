import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, Flame, Plus } from "lucide-react";
import base from "@/assets/base.png";
import basilImage from "@/assets/t-basil.png";
import mozzarellaImage from "@/assets/t-mozz-shreds.png";
import mushroomImage from "@/assets/t-mushroom.png";
import oliveImage from "@/assets/t-olive.png";
import onionImage from "@/assets/t-onion.png";
import pepperoniImage from "@/assets/t-pepperoni.png";
import peppersImage from "@/assets/t-peppers.png";
import tomatoImage from "@/assets/t-tomato.png";

type ToppingId =
  "pepperoni" | "mushroom" | "olives" | "basil" | "peppers" | "onion" | "tomato" | "mozzarella";

type PlacedTopping = {
  id: number;
  kind: ToppingId;
  x: number;
  y: number;
  rotation: number;
  width: number;
  shadowX: number;
  shadowY: number;
};

type Topping = {
  id: ToppingId;
  name: string;
  priceCents: number;
  image: string;
  width: number;
};

const TOPPINGS: Topping[] = [
  { id: "pepperoni", name: "Pepperoni", priceCents: 150, image: pepperoniImage, width: 24 },
  { id: "mushroom", name: "Mushroom", priceCents: 120, image: mushroomImage, width: 20 },
  { id: "olives", name: "Olives", priceCents: 100, image: oliveImage, width: 18 },
  { id: "basil", name: "Basil", priceCents: 80, image: basilImage, width: 20 },
  { id: "peppers", name: "Peppers", priceCents: 110, image: peppersImage, width: 22 },
  { id: "onion", name: "Red onion", priceCents: 100, image: onionImage, width: 20 },
  { id: "tomato", name: "Tomato", priceCents: 120, image: tomatoImage, width: 19 },
  { id: "mozzarella", name: "Mozzarella", priceCents: 170, image: mozzarellaImage, width: 21 },
];

const SIZES = [
  { id: "S", priceCents: 1100, diameter: "Small" },
  { id: "M", priceCents: 1250, diameter: "Medium" },
  { id: "L", priceCents: 1400, diameter: "Large" },
] as const;

type SizeId = (typeof SIZES)[number]["id"];

type PointerSession = {
  kind: ToppingId;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  dragging: boolean;
  overStage: boolean;
  timer: number;
};

const SPRING_STIFFNESS = 400;
const SPRING_DAMPING = 25;
const BASE_PRICE_CENTS = 1400;
const ORDER_PHONE = "254743898575";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function makePlacement(kind: ToppingId, x: number, y: number): PlacedTopping {
  const topping = TOPPINGS.find((item) => item.id === kind)!;
  return {
    id: Date.now() + Math.floor(Math.random() * 100000),
    kind,
    x,
    y,
    rotation: Math.round(Math.random() * 30 - 15),
    width: topping.width * (0.9 + Math.random() * 0.2),
    shadowX: Math.round(Math.random() * 2),
    shadowY: 2 + Math.round(Math.random() * 4),
  };
}

function randomSaucePoint() {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 31;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
}

function isPointOnPizza(stage: HTMLDivElement | null, clientX: number, clientY: number) {
  if (!stage) return false;
  const rect = stage.getBoundingClientRect();
  const nx = (clientX - rect.left) / rect.width;
  const ny = (clientY - rect.top) / rect.height;
  return Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2) <= 0.91;
}

function DroppedIngredient({ placement }: { placement: PlacedTopping }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const topping = TOPPINGS.find((item) => item.id === placement.kind)!;

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      image.style.transform = `translate3d(-50%, -50%, 0) rotate(${placement.rotation}deg)`;
      image.style.opacity = "1";
      return;
    }

    const started = performance.now();
    let previous = started;
    let displacement = -42;
    let velocity = 0;
    let frame = 0;

    const animate = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 1 / 30);
      previous = now;
      velocity += (-SPRING_STIFFNESS * displacement - SPRING_DAMPING * velocity) * delta;
      displacement += velocity * delta;
      const settled = Math.abs(displacement) < 0.12 && Math.abs(velocity) < 0.55;
      if (settled) displacement = 0;
      const squash = settled ? 1 : 1 - Math.min(0.14, Math.abs(displacement) / 300);
      image.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${displacement.toFixed(2)}px, 0) scale(${squash.toFixed(3)}) rotate(${placement.rotation}deg)`;
      image.style.opacity = String(Math.min(1, (now - started) / 100));
      if (!settled) frame = requestAnimationFrame(animate);
      else image.style.opacity = "1";
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [placement]);

  return (
    <img
      ref={imageRef}
      src={topping.image}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pizza-builder__dropped-ingredient"
      style={{
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: `${placement.width}%`,
        filter: `drop-shadow(${placement.shadowX}px ${placement.shadowY}px 3px rgb(0 0 0 / .36))`,
        transform: `translate3d(-50%, -50%, 0) translate3d(0, -42px, 0) scale(.86) rotate(${placement.rotation}deg)`,
        opacity: 0,
      }}
    />
  );
}

export default function BuildYourPizza() {
  const [size, setSize] = useState<SizeId>("L");
  const [placed, setPlaced] = useState<PlacedTopping[]>([]);
  const [visiblePrice, setVisiblePrice] = useState(BASE_PRICE_CENTS);
  const [firing, setFiring] = useState(false);
  const [fired, setFired] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [dragKind, setDragKind] = useState<ToppingId | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragImageRef = useRef<HTMLImageElement>(null);
  const pointerRef = useRef<PointerSession | null>(null);
  const orderTimerRef = useRef<number | null>(null);
  const displayedPriceRef = useRef(BASE_PRICE_CENTS);
  const addToppingRef = useRef<(kind: ToppingId, x?: number, y?: number) => void>(() => undefined);

  const basePrice = SIZES.find((candidate) => candidate.id === size)!.priceCents;
  const totalPrice =
    basePrice +
    placed.reduce((sum, piece) => {
      return sum + TOPPINGS.find((topping) => topping.id === piece.kind)!.priceCents;
    }, 0);

  const counts = TOPPINGS.reduce<Record<ToppingId, number>>(
    (result, topping) => {
      result[topping.id] = placed.filter((piece) => piece.kind === topping.id).length;
      return result;
    },
    {
      pepperoni: 0,
      mushroom: 0,
      olives: 0,
      basil: 0,
      peppers: 0,
      onion: 0,
      tomato: 0,
      mozzarella: 0,
    },
  );

  const addTopping = (kind: ToppingId, x?: number, y?: number) => {
    if (firing) return;
    if (fired) setFired(false);
    const point = x === undefined || y === undefined ? randomSaucePoint() : { x, y };
    setPlaced((current) => [...current, makePlacement(kind, point.x, point.y)]);
  };
  addToppingRef.current = addTopping;

  const mozzarellaCount = counts.mozzarella;
  const distinctToppings = TOPPINGS.filter((topping) => counts[topping.id] > 0).length;
  const helperText =
    distinctToppings >= 3
      ? "Looking good. Fire it"
      : mozzarellaCount >= 2
        ? "Extra cheese"
        : mozzarellaCount === 1
          ? "Drag slowly, piece by piece"
          : placed.length > 0
            ? "A little more? Drag or tap to add"
            : "Tap a topping or press and drag it onto the pizza";

  useEffect(() => {
    let frame = 0;
    const from = displayedPriceRef.current;
    const start = performance.now();
    const duration = 460;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const value = Math.round(from + (totalPrice - from) * eased);
      displayedPriceRef.current = value;
      setVisiblePrice(value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [totalPrice]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = pointerRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      current.x = event.clientX;
      current.y = event.clientY;
      if (!current.dragging) {
        const distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
        if (distance > 12) {
          window.clearTimeout(current.timer);
          pointerRef.current = null;
        }
        return;
      }

      event.preventDefault();
      if (dragImageRef.current) {
        dragImageRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }
      const over = isPointOnPizza(stageRef.current, event.clientX, event.clientY);
      if (over !== current.overStage) {
        current.overStage = over;
        setDragOver(over);
      }
    };

    const finish = (event: PointerEvent) => {
      const current = pointerRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      window.clearTimeout(current.timer);
      pointerRef.current = null;
      if (current.dragging && isPointOnPizza(stageRef.current, event.clientX, event.clientY)) {
        const rect = stageRef.current!.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        addToppingRef.current(current.kind, x, y);
        if (current.kind === "mozzarella") window.setTimeout(() => navigator.vibrate?.(10), 0);
      } else if (!current.dragging) {
        addToppingRef.current(current.kind);
      }
      setDragKind(null);
      setDragOver(false);
    };

    const cancel = (event: PointerEvent) => {
      const current = pointerRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      window.clearTimeout(current.timer);
      pointerRef.current = null;
      setDragKind(null);
      setDragOver(false);
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      if (pointerRef.current) window.clearTimeout(pointerRef.current.timer);
    };
  }, []);

  useEffect(() => {
    if (!firing) return;
    setCountdown(8);
    let remaining = 8;
    orderTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (orderTimerRef.current !== null) window.clearInterval(orderTimerRef.current);
        orderTimerRef.current = null;
        setFiring(false);
        setFired(true);
      }
    }, 1000);
    return () => {
      if (orderTimerRef.current !== null) window.clearInterval(orderTimerRef.current);
      orderTimerRef.current = null;
    };
  }, [firing]);

  useEffect(
    () => () => {
      if (orderTimerRef.current !== null) window.clearInterval(orderTimerRef.current);
    },
    [],
  );

  const startPress = (kind: ToppingId, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const current: PointerSession = {
      kind,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      dragging: false,
      overStage: false,
      timer: 0,
    };
    current.timer = window.setTimeout(() => {
      if (pointerRef.current !== current) return;
      current.dragging = true;
      setDragKind(kind);
      if (dragImageRef.current) {
        dragImageRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      if (typeof navigator !== "undefined") navigator.vibrate?.(12);
    }, 170);
    pointerRef.current = current;
  };

  const beginFire = () => {
    if (firing || fired) return;
    setFired(false);
    setFiring(true);
  };

  const toppingSummary = TOPPINGS.filter((topping) => counts[topping.id] > 0)
    .map((topping) => `${topping.name} x${counts[topping.id]}`)
    .join(", ");
  const orderText = `Hi Bar Bar! I'd like a ${size} custom pizza${toppingSummary ? ` with ${toppingSummary}` : ""}. Total: ${formatPrice(totalPrice)}.`;
  const orderUrl = `https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(orderText)}`;
  const status = firing
    ? "Wood fire, 90 seconds"
    : fired
      ? "Oven's hot. Your pizza is ready to send."
      : helperText;

  return (
    <section id="build" className="pizza-builder" data-firing={firing} data-drop-ready={dragOver}>
      <div className="pizza-builder__shell">
        <header className="pizza-builder__header">
          <a
            href="#top"
            className="pizza-builder__back"
            aria-label="Back to the menu"
            onClick={(event) => {
              if (!document.getElementById("top")) return;
              event.preventDefault();
              document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ArrowLeft size={21} strokeWidth={2.2} aria-hidden="true" />
          </a>
          <h2 className="pizza-builder__title">Build your pizza</h2>
          <div className="pizza-builder__sizes" role="group" aria-label="Choose pizza size">
            {SIZES.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                disabled={firing}
                aria-pressed={size === candidate.id}
                aria-label={`${candidate.diameter} size`}
                onClick={() => {
                  setSize(candidate.id);
                  setFired(false);
                }}
                className="pizza-builder__size"
                data-active={size === candidate.id}
              >
                {candidate.id}
              </button>
            ))}
          </div>
        </header>

        <div className="pizza-builder__stage-area">
          <div className="pizza-builder__stage-frame">
            <div className="pizza-builder__fire-ring" aria-hidden="true" />
            <div ref={stageRef} className="pizza-builder__pizza-stage" data-drop-ready={dragOver}>
              <img
                src={base}
                alt="Pizza dough spread with glossy tomato sauce"
                className="pizza-builder__base"
                draggable={false}
              />
              {placed.map((piece) => (
                <DroppedIngredient key={piece.id} placement={piece} />
              ))}
              {firing && (
                <div
                  className="pizza-builder__countdown"
                  aria-live="polite"
                  aria-label={`${countdown} seconds remaining`}
                >
                  <span className="pizza-builder__countdown-ring" />
                  <span>{countdown}</span>
                </div>
              )}
            </div>
          </div>
          <p className="pizza-builder__status" aria-live="polite">
            {firing && <span className="pizza-builder__status-dot" aria-hidden="true" />}
            {status}
          </p>
        </div>

        <div className="pizza-builder__dock">
          <div className="pizza-builder__dock-heading">
            <span className="pizza-builder__dock-title">Toppings</span>
            <span className="pizza-builder__dock-hint">Tap or hold + drag</span>
          </div>
          <div className="pizza-builder__topping-row" aria-label="Pizza toppings">
            {TOPPINGS.map((topping) => (
              <button
                key={topping.id}
                type="button"
                disabled={firing}
                aria-label={`${topping.name}, ${formatPrice(topping.priceCents)} each${counts[topping.id] ? `, added ${counts[topping.id]} times` : ""}. Tap to add or hold and drag.`}
                aria-pressed={counts[topping.id] > 0}
                className="pizza-builder__topping"
                onPointerDown={(event) => startPress(topping.id, event)}
                onContextMenu={(event) => event.preventDefault()}
                onClick={(event) => {
                  if (event.detail === 0) addTopping(topping.id);
                }}
              >
                <span className="pizza-builder__topping-orb">
                  <img src={topping.image} alt="" draggable={false} />
                  {counts[topping.id] > 0 && (
                    <span className="pizza-builder__count-badge">+{counts[topping.id]}</span>
                  )}
                  {counts[topping.id] === 0 && (
                    <span className="pizza-builder__add-mark">
                      <Plus size={12} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="pizza-builder__topping-name">{topping.name}</span>
                <span className="pizza-builder__topping-price">
                  +{formatPrice(topping.priceCents)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <footer className="pizza-builder__footer">
          {firing ? (
            <button
              type="button"
              className="pizza-builder__fire-button"
              disabled
              aria-live="polite"
            >
              <span className="pizza-builder__button-label">
                <span className="pizza-builder__spinner" />
                Firing at 480°
              </span>
              <span className="pizza-builder__button-price">{formatPrice(visiblePrice)}</span>
            </button>
          ) : fired ? (
            <a
              href={orderUrl}
              target="_blank"
              rel="noreferrer"
              className="pizza-builder__fire-button"
            >
              <span className="pizza-builder__button-label">
                <Flame size={18} strokeWidth={2.3} aria-hidden="true" />
                Send to kitchen
              </span>
              <span className="pizza-builder__button-price">{formatPrice(visiblePrice)}</span>
            </a>
          ) : (
            <button type="button" className="pizza-builder__fire-button" onClick={beginFire}>
              <span className="pizza-builder__button-label">
                <Flame size={18} strokeWidth={2.3} aria-hidden="true" />
                Fire it
              </span>
              <span className="pizza-builder__button-price">{formatPrice(visiblePrice)}</span>
            </button>
          )}
          <span className="pizza-builder__footer-note">
            Made for the wood fire. Finished your way.
          </span>
        </footer>
      </div>

      {dragKind && (
        <img
          ref={dragImageRef}
          src={TOPPINGS.find((topping) => topping.id === dragKind)!.image}
          className="pizza-builder__drag-preview"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
    </section>
  );
}
