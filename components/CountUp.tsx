"use client";
import { useEffect, useRef, useState } from "react";
const fmt = (v: number) => "+" + v.toLocaleString("fr-FR").replace(/[  ]/g, " ");

/** Compteur qui monte de 0 au chiffre exact quand il devient visible (≈ 4 s, se met en pause si l'onglet est masqué). */
export default function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0, started = false;
    const run = () => {
      if (started) return; started = true;
      let f = 0; const frames = 240;
      const step = () => { f++; const k = f / frames; setV(Math.min(value, Math.round(value * (1 - Math.pow(1 - k, 3))))); if (f < frames) raf = requestAnimationFrame(step); else setV(value); };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting) && document.visibilityState === "visible") { io.disconnect(); setTimeout(run, 250); } }, { threshold: 0.3 });
    io.observe(el);
    const vis = () => { if (document.visibilityState === "visible" && !started && el.getBoundingClientRect().top < innerHeight) { io.disconnect(); setTimeout(run, 250); } };
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", vis); };
  }, [value]);
  return <b ref={ref} className="num" aria-label={fmt(value)}>{fmt(v)}</b>;
}
