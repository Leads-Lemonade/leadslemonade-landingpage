"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

type Field = { name: string; fill: number; of: number };
type Props = {
  index: string;
  title: string;
  intro: string;
  sampleLine: string;
  panelHead: string[];
  fields: Field[];
  notProvided: string;
  caveats: string[];
};

export default function DataSection({ index, title, intro, sampleLine, panelHead, fields, notProvided, caveats }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current!;
      if (reduced()) return;
      gsap.from(".data-reveal", {
        y: 16,
        opacity: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: "expo.out",
        clearProps: "transform",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
      gsap.from(".data-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="data" aria-labelledby="data-h" className="py-16 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-[var(--pad,24px)] lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="data-h" className="data-reveal text-[clamp(26px,3.4vw,36px)] font-semibold">
            <span className="idx" aria-hidden="true">[{index}]</span> {title}
          </h2>
          <p className="data-reveal mt-4 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{intro}</p>
          <p className="data-reveal mt-6 text-[14px] text-[var(--color-ink-2)]">{notProvided}</p>
          <ul className="data-reveal mt-4 list-none p-0">
            {caveats.map((c) => (
              <li key={c} className="border-b border-dotted border-[var(--color-rule)] py-3 text-[14px] text-[var(--color-ink-2)] last:border-b-0">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="data-reveal rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] px-4">
            <div className="mono flex h-10 items-center gap-4 border-b border-[var(--color-rule)] text-[12px] text-[var(--color-muted)]">
              <span className="w-[140px] shrink-0 lg:w-[220px]">{panelHead[0]}</span>
              <span className="flex-1">{panelHead[1]}</span>
              <span className="w-16 shrink-0 text-right">{panelHead[2]}</span>
            </div>
            {fields.map((f) => (
              <div key={f.name} className="flex h-11 items-center gap-4 border-b border-dotted border-[var(--color-rule)] last:border-b-0">
                <p className="w-[140px] shrink-0 truncate text-[14px] lg:w-[220px]">{f.name}</p>
                <div
                  className="h-[6px] flex-1 overflow-hidden rounded-[var(--radius-ctl,4px)] border border-[var(--color-rule)]"
                  style={{ background: "var(--hatch)" }}
                  role="progressbar"
                  aria-valuenow={f.fill}
                  aria-valuemin={0}
                  aria-valuemax={f.of}
                  aria-label={`${f.name}: ${f.fill} of ${f.of}`}
                >
                  <div className="data-fill h-full bg-[var(--color-accent)]" style={{ width: `${(f.fill / f.of) * 100}%` }} />
                </div>
                <p className="mono w-16 shrink-0 text-right text-[12px] [font-variant-numeric:tabular-nums] text-[var(--color-muted)]">
                  {f.fill} of {f.of}
                </p>
              </div>
            ))}
          </div>
          <p className="data-reveal mono mt-3 text-[12px] text-[var(--color-muted)]">{sampleLine}</p>
        </div>
      </div>
    </section>
  );
}
