"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";

type Card = { n: string; title: string; body: string; figure: string };
type Props = { index: string; title: string; cards: Card[] };

const S = { fill: "none", stroke: "var(--color-ink)", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* [01] envelope through a stamp/check gate; lemon check; "refund" ledger line */
function FigVerified() {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="An envelope passing through a verification gate" className="h-full w-full">
      <g className="why-stroke" {...S}>
        {/* gate */}
        <path d="M150 30v110" />
        <path d="M196 30v110" />
        <path d="M144 30h58" />
        <path d="M144 140h58" />
        <path d="M150 30l-6-8h58l-6 8" />
        {/* envelope sliding in */}
        <rect x="34" y="62" width="88" height="56" rx="4" />
        <path d="M34 66l44 30 44-30" />
        <path d="M34 114l32-24" />
        <path d="M122 114l-32-24" />
        {/* motion ticks */}
        <path d="M16 78h10" />
        <path d="M12 90h14" />
        <path d="M16 102h10" />
        {/* stamp head inside gate */}
        <circle cx="173" cy="72" r="16" />
        <path d="M173 88v14" />
        <path d="M163 102h20" />
        {/* ledger line beneath */}
        <path d="M34 156h168" />
        <path d="M34 166h60" />
      </g>
      <g className="why-lemon">
        <path d="M166 70l5 6 10-11" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="206" cy="161" r="4" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1" />
      </g>
      <text x="100" y="169" style={{ font: "500 10px var(--font-mono)", fill: "var(--color-muted)" }}>refund</text>
    </svg>
  );
}

/* [02] coin stack + calendar with crossed-out expires field; top coin lemon */
function FigNoExpiry() {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="A stack of credit coins beside a calendar whose expiry field is crossed out" className="h-full w-full">
      <g className="why-stroke" {...S}>
        {/* coin stack */}
        <ellipse cx="68" cy="134" rx="40" ry="13" />
        <path d="M28 134v-18" />
        <path d="M108 134v-18" />
        <ellipse cx="68" cy="116" rx="40" ry="13" />
        <path d="M28 116v-18" />
        <path d="M108 116v-18" />
        <ellipse cx="68" cy="98" rx="40" ry="13" />
        <path d="M28 98v-18" />
        <path d="M108 98v-18" />
        {/* calendar */}
        <rect x="136" y="44" width="84" height="92" rx="6" />
        <path d="M136 68h84" />
        <path d="M156 36v16" />
        <path d="M200 36v16" />
        {/* grid rows */}
        <path d="M148 84h24" />
        <path d="M184 84h24" />
        <path d="M148 100h24" />
        <path d="M184 100h24" />
        {/* expires field */}
        <rect x="148" y="112" width="60" height="14" rx="3" />
        {/* strike through it */}
        <path d="M144 126l68-14" />
      </g>
      <g className="why-lemon">
        <ellipse cx="68" cy="80" rx="40" ry="13" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1" />
        <path d="M54 80h28" fill="none" stroke="var(--color-ink)" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* [03] locked drawer with a lead row inside and a lemon "0 credits" tag */
function FigOwned() {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="A locked drawer holding a lead row with a zero credits tag" className="h-full w-full">
      <g className="why-stroke" {...S}>
        {/* drawer body, open */}
        <path d="M36 70h168v76H36z" />
        <path d="M36 70l16-22h136l16 22" />
        {/* drawer front panel */}
        <rect x="52" y="104" width="136" height="42" rx="4" />
        <path d="M108 125h24" />
        {/* lead row card sticking out */}
        <rect x="60" y="78" width="120" height="20" rx="3" />
        <circle cx="72" cy="88" r="5" />
        <path d="M84 84h52" />
        <path d="M84 92h36" />
        {/* padlock */}
        <rect x="186" y="110" width="26" height="22" rx="4" />
        <path d="M191 110v-7a8 8 0 0 1 16 0v7" />
        <path d="M199 118v6" />
      </g>
      <g className="why-lemon">
        <rect x="142" y="60" width="58" height="16" rx="3" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1" />
        <text x="149" y="72" style={{ font: "500 10px var(--font-mono)", fill: "var(--color-ink)" }}>0 credits</text>
      </g>
    </svg>
  );
}

const figures = [FigVerified, FigNoExpiry, FigOwned];

export default function Why({ index, title, cards }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current!;
      if (reduced()) return;

      gsap.from(".why-head", { y: 16, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: section, start: "top 75%" } });

      // draw-on strokes per card
      gsap.utils.toArray<HTMLElement>(".why-card").forEach((card) => {
        const paths = card.querySelectorAll<SVGGeometryElement>(".why-stroke path, .why-stroke rect, .why-stroke circle, .why-stroke ellipse");
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: card, start: "top 75%" },
        });
        gsap.from(card.querySelector(".why-lemon"), {
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 75%" },
          delay: 0.9,
        });
      });

      const stack = section.querySelector<HTMLElement>(".why-stack")!;
      const items = gsap.utils.toArray<HTMLElement>(".why-card");
      const progress = items.map(() => 0);
      const apply = () =>
        items.forEach((c, i) => gsap.set(c, { scale: 1 - 0.04 * progress.slice(i + 1).reduce((a, b) => a + b, 0) }));
      const topOf = (i: number) => {
        let y = stack.getBoundingClientRect().top + scrollY;
        for (let k = 0; k < i; k++) y += items[k].offsetHeight + parseFloat(getComputedStyle(items[k]).marginBottom);
        return y;
      };
      items.forEach(
        (c, i) =>
          i &&
          ScrollTrigger.create({
            trigger: stack,
            start: () => topOf(i) - innerHeight,
            end: () => topOf(i) - parseFloat(getComputedStyle(c).top),
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              progress[i] = s.progress;
              apply();
            },
            onRefresh: (s) => {
              progress[i] = s.progress;
              apply();
            },
          })
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="why" aria-labelledby="why-h" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1200px] px-[var(--pad,24px)]">
        <h2 id="why-h" className="why-head mb-10 text-[clamp(26px,3.4vw,36px)] font-semibold">
          <span className="idx" aria-hidden="true">[{index}]</span> {title}
        </h2>
        <div className="why-stack">
          {cards.map((c, i) => {
            const Fig = figures[i] ?? figures[0];
            return (
              <article
                key={c.n}
                className={`why-card grid grid-cols-1 gap-8 rounded-[var(--radius-card)] border border-[var(--color-rule)] p-8 md:grid-cols-12 ${
                  i === 0 ? "bg-[var(--color-accent-tint)]" : "bg-[var(--color-card)]"
                }`}
                style={{
                  position: "sticky",
                  top: `calc(96px + ${i * 16}px)`,
                  marginBottom: i < cards.length - 1 ? `calc(24px + ${(cards.length - 1 - i) * 16}px)` : 0,
                  transformOrigin: "50% 0",
                }}
              >
                <div className="md:col-span-7">
                  <p className="mono text-[12px] text-[var(--color-muted)]" aria-hidden="true">[{c.n}]</p>
                  <h3 className="mt-3 text-[24px] font-semibold">{c.title}</h3>
                  <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{c.body}</p>
                  <p className="mono mt-8 text-[24px] font-medium">{c.figure}</p>
                </div>
                <div className="max-h-[160px] md:col-span-5 md:max-h-none">
                  <Fig />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
