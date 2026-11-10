"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced } from "@/lib/gsap";

export default function Smooth() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const hash = a?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.6 });
    };
    document.addEventListener("click", onClick);

    let alive = true;
    document.fonts.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
