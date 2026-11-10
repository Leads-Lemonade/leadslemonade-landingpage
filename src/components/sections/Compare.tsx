"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

type Props = { index: string; title: string; intro: string; columns: string[]; rows: string[][]; source: string };

export default function Compare({ index, title, intro, columns, rows, source }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".cmp-reveal", {
        y: 16,
        opacity: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: "expo.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  const td = "border-b border-[var(--color-rule)] px-4 py-3 text-[14px] whitespace-nowrap";

  return (
    <section ref={ref} id="compare" aria-labelledby="compare-h" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1200px] px-[var(--pad,24px)]">
        <h2 id="compare-h" className="cmp-reveal text-[clamp(26px,3.4vw,36px)] font-semibold">
          <span className="idx" aria-hidden="true">[{index}]</span> {title}
        </h2>
        <p className="cmp-reveal mt-4 max-w-[620px] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{intro}</p>

        <div className="cmp-reveal mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                {columns.map((c, i) => (
                  <th key={i} className="mono border-b border-[var(--color-rule)] px-4 py-2 text-[12px] font-medium whitespace-nowrap text-[var(--color-muted)]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className={r[0] === "LeadsLemonade" ? "bg-[var(--color-accent-tint)]" : undefined}>
                  <td className={`${td} font-semibold`}>{r[0]}</td>
                  {r.slice(1).map((v, i) => (
                    <td key={i} className={`${td} mono text-[13px]`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cmp-reveal mono mt-4 text-[12px] text-[var(--color-muted)]">{source}</p>
      </div>
    </section>
  );
}
