"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { ctaHref, SEARCH_HREF } from "@/lib/cta";
import AnatomySlot from "@/components/sections/AnatomySlot";

type Demo = {
  query: string;
  filters: string[];
  status: string;
  columns: string[];
  rows: string[][];
  footer: string;
  note: string;
};

type HeroProps = {
  titleLines: string[];
  sub: string;
  primary: string;
  secondary: string;
  demo: Demo;
  figure: { title: string; body: string };
};

export default function Hero({ titleLines, sub, primary, secondary, demo, figure }: HeroProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current!;
      if (reduced()) {
        gsap.set(section, { height: "auto" });
        gsap.set(".hero-stick", { position: "static", height: "auto", overflow: "visible" });
        gsap.set(".hero-panel", { width: "100%" });
        return;
      }
      gsap.from(".ln > span", { yPercent: 135, duration: 1.4, stagger: 0.1, ease: "expo.out" });
      gsap.from(".hero-sub, .hero-cta", { y: 14, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.4, clearProps: "transform" });

      const inner = section.querySelector<HTMLElement>(".hero-inner")!;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        })
        .fromTo(".hero-slot", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.2 }, 0)
        .to(".hero-head", { y: -32, opacity: 0.25, duration: 0.3 }, 0.05)
        .to(inner, { y: () => Math.min(0, innerHeight - (inner.offsetHeight + 0.12 * innerHeight + 24)), duration: 0.5 }, 0.15)
        .fromTo(".hero-panel", { width: "72%" }, { width: "100%", duration: 0.4 }, 0.2)
        .from(".hero-row", { opacity: 0, y: 10, duration: 0.1, stagger: 0.07 }, 0.4)
        .from(".hero-foot", { opacity: 0, y: 8, duration: 0.08 }, ">");
    },
    { scope: ref }
  );

  const td = "border-b border-[var(--color-rule)] px-4 py-2 text-[13px] whitespace-nowrap";

  return (
    <section ref={ref} id="hero" aria-labelledby="hero-h" className="relative h-[240vh] md:h-[300vh]">
      <div className="hero-stick sticky top-0 h-screen overflow-hidden">
        <div className="hero-inner pt-[12vh]">
          <div className="hero-head mx-auto w-full max-w-[1200px] px-[var(--pad,24px)] text-center">
            <h1 id="hero-h" className="text-[clamp(34px,6vw,64px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              {titleLines.map((l) => (
                <span key={l} className="ln">
                  <span>{l}</span>
                </span>
              ))}
            </h1>
            <p className="hero-sub mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-[var(--color-ink-2)]">{sub}</p>
            <div className="hero-cta mt-7 flex flex-wrap items-center justify-center gap-3">
              <a className="btn-primary" href={ctaHref("hero")}>{primary}</a>
              <a className="btn-secondary" href={SEARCH_HREF}>{secondary}</a>
            </div>
          </div>

          <div className="hero-slot mx-auto mt-14 grid w-full max-w-[1200px] items-center gap-8 px-[var(--pad,24px)] md:grid-cols-12">
            <div className="md:col-span-5">
              <AnatomySlot />
            </div>
            <div className="md:col-span-7">
              <h2 className="text-[20px] font-semibold">{figure.title}</h2>
              <p className="mt-3 max-w-[480px] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{figure.body}</p>
            </div>
          </div>

          <div className="mx-auto mt-14 w-full max-w-[1200px] px-[var(--pad,24px)]">
            <div
              className="hero-panel mx-auto rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] [box-shadow:var(--shadow-lift)]"
              style={{ width: "72%" }}
            >
              <p className="border-b border-[var(--color-rule)] px-4 py-3 text-[16px]">{demo.query}</p>
              <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
                {demo.filters.map((f) => (
                  <span key={f} className="mono rounded-[var(--radius-ctl,4px)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-2 py-0.5 text-[12px]">
                    {f}
                  </span>
                ))}
              </div>
              <p className="mono px-4 py-2 text-[12px] text-[var(--color-muted)]">{demo.status}</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr>
                      {demo.columns.map((c) => (
                        <th key={c} className="mono border-y border-[var(--color-rule)] px-4 py-2 text-[11px] font-medium whitespace-nowrap text-[var(--color-muted)]">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {demo.rows.map((r) => (
                      <tr key={r[0]} className="hero-row">
                        <td className={td}>{r[0]}</td>
                        <td className={td}>{r[1]}</td>
                        <td className={td}>{r[2]}</td>
                        <td className={`${td} ${r[3] === "Hidden until reveal" ? "text-[var(--color-muted)]" : "mono"}`}>{r[3]}</td>
                        <td className={td}>
                          <span className={r[4] === "Verified" ? "badge-ok" : "badge-warn"}>{r[4]}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="hero-foot mono px-4 py-3 text-[12px] text-[var(--color-muted)]">{demo.footer}</p>
            </div>
            <p className="mono mt-3 text-center text-[12px] text-[var(--color-muted)]">{demo.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
