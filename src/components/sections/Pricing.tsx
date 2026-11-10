"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import { ctaHref } from "@/lib/cta";

type Tier = { plan: string; name: string; price: string; unit: string; per: string; lines: string[]; cta: string; featured: boolean };
type Props = { index: string; title: string; intro: string; tiers: Tier[] };

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-[3px] shrink-0">
      <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing({ index, title, intro, tiers }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".pr-reveal", {
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

  return (
    <section ref={ref} id="pricing" aria-labelledby="pricing-h" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1200px] px-[var(--pad,24px)]">
        <h2 id="pricing-h" className="pr-reveal text-[clamp(26px,3.4vw,36px)] font-semibold">
          <span className="idx" aria-hidden="true">[{index}]</span> {title}
        </h2>
        <p className="pr-reveal mt-4 max-w-[620px] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{intro}</p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.plan}
              className={`pr-reveal flex flex-col rounded-[var(--radius-card)] bg-[var(--color-card)] p-8 ${
                t.featured ? "border border-[var(--color-ink)]" : "border border-[var(--color-rule)]"
              }`}
            >
              <h3 className="text-[15px] font-semibold">{t.name}</h3>
              <p className="mono mt-4 text-[32px] font-medium leading-none">
                {t.price} <span className="text-[12px] font-normal text-[var(--color-muted)]">{t.unit}</span>
              </p>
              <p className="mono mt-2 text-[12px] text-[var(--color-muted)]">{t.per}</p>
              <ul className="mt-6 mb-8 list-none space-y-2 p-0">
                {t.lines.map((l) => (
                  <li key={l} className="flex gap-2 text-[14px] text-[var(--color-ink-2)]">
                    <Check />
                    {l}
                  </li>
                ))}
              </ul>
              <a className={`${t.featured ? "btn-primary" : "btn-secondary"} mt-auto text-center`} href={ctaHref("pricing", { plan: t.plan })}>
                {t.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
