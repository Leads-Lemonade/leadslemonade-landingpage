"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { ctaHref, SEARCH_HREF } from "@/lib/cta";

type Props = { title: string; sub: string; primary: string; secondary: string };

export default function FinalCta({ title, sub, primary, secondary }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".fc-reveal", {
        y: 16,
        opacity: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: "expo.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });

      if (matchMedia("(hover: none)").matches) return;
      const btn = ref.current!.querySelector<HTMLElement>(".fc-magnet")!;
      const pull = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.2, y: (e.clientY - r.top - r.height / 2) * 0.2, duration: 0.4, ease: "power3" });
      };
      const release = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, .4)" });
      btn.addEventListener("pointermove", pull);
      btn.addEventListener("pointerleave", release);
      return () => {
        btn.removeEventListener("pointermove", pull);
        btn.removeEventListener("pointerleave", release);
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="cta" aria-labelledby="cta-h" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-[var(--pad,24px)] text-center">
        <h2 id="cta-h" className="fc-reveal mx-auto max-w-[640px] text-[clamp(30px,4.2vw,40px)] font-semibold leading-tight">
          {title}
        </h2>
        <p className="fc-reveal mt-4 text-[15px] text-[var(--color-ink-2)]">{sub}</p>
        <div className="fc-reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          <a className="btn-primary fc-magnet inline-block" href={ctaHref("final-cta")}>{primary}</a>
          <a className="btn-secondary" href={SEARCH_HREF}>{secondary}</a>
        </div>
      </div>
    </section>
  );
}
