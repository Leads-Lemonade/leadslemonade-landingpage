"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

type Step = { label: string; title: string; body: string };
type Demo = { query: string; filters: string[]; status: string; rows: string[][] };
type Stage = { url: string; applied: string; reveal: string; credits: string; export: string };

type Props = { index: string; title: string; steps: Step[]; demo: Demo; stage: Stage };

const icons = {
  search: <><circle cx="9" cy="9" r="5.5" /><path d="M13.2 13.2 17 17" /></>,
  list: <><path d="M7 5.5h10M7 10h10M7 14.5h10" /><path d="M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" /></>,
  download: <><path d="M10 3.5v9" /><path d="M6.5 9.5 10 13l3.5-3.5" /><path d="M4 16.5h12" /></>,
  credits: <><ellipse cx="10" cy="6" rx="6" ry="2.5" /><path d="M4 6v8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" /><path d="M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" /></>,
} as const;

function SideIcon({ name }: { name: keyof typeof icons }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Visual({ i, demo, stage }: { i: number; demo: Demo; stage: Stage }) {
  const rows4 = demo.rows.slice(0, 4);
  if (i === 0)
    return (
      <div className="rounded-[var(--radius-input,10px)] border border-[var(--color-rule)] bg-[var(--color-card)] px-4 py-3 text-[16px]">
        <span className="hiw-type">
          {demo.query.split("").map((ch, k) => (
            <span key={k} className="hiw-ch">{ch}</span>
          ))}
        </span>
        <span className="hiw-caret" aria-hidden="true" />
      </div>
    );
  if (i === 1)
    return (
      <div className="flex flex-wrap items-center gap-2">
        {demo.filters.map((f) => (
          <span key={f} className="hiw-chip mono rounded-[var(--radius-ctl,4px)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-2 py-1 text-[12px]">
            {f}
          </span>
        ))}
        <span className="hiw-chip mono rounded-[var(--radius-ctl,4px)] border border-[var(--color-rule)] bg-[var(--color-accent-tint)] px-2 py-1 text-[12px] text-[var(--color-ink)]">
          {stage.applied}
        </span>
      </div>
    );
  if (i === 2)
    return (
      <div>
        <p className="mono mb-3 text-[12px] text-[var(--color-muted)]">{demo.status}</p>
        <table className="w-full border-collapse text-left text-[13px]">
          <tbody>
            {rows4.map((r, k) => {
              const checked = k < 2;
              return (
                <tr key={r[0]} className={checked ? "bg-[var(--color-accent-tint)]" : undefined}>
                  <td className="w-8 border-b border-[var(--color-rule)] px-2 py-2">
                    <span
                      className={`inline-block h-[14px] w-[14px] rounded-[var(--radius-ctl,4px)] border ${
                        checked ? "border-[var(--color-ink)] bg-[var(--color-ink)]" : "border-[var(--color-rule)] bg-[var(--color-card)]"
                      }`}
                      aria-hidden="true"
                    >
                      {checked && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M3.5 7.5 6 10l4.5-5.5" stroke="var(--color-on-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td className="border-b border-[var(--color-rule)] px-2 py-2 whitespace-nowrap">{r[0]}</td>
                  <td className="border-b border-[var(--color-rule)] px-2 py-2 whitespace-nowrap">{r[2]}</td>
                  <td className="border-b border-[var(--color-rule)] px-2 py-2">
                    <span className={r[4] === "Verified" ? "badge-ok" : "badge-warn"}>{r[4]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  if (i === 3)
    return (
      <div>
        <div className="grid">
          <div className="hiw-rv-a col-start-1 row-start-1 flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] px-4 py-3">
            <span className="text-[14px]">{demo.rows[0][0]}</span>
            <span className="btn-primary pointer-events-none text-[13px]">{stage.reveal}</span>
          </div>
          <div className="hiw-rv-b col-start-1 row-start-1 flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] px-4 py-3 opacity-0">
            <span className="mono text-[13px]">{demo.rows[0][3]}</span>
            <span className="badge-ok">Verified</span>
          </div>
        </div>
        <p className="mono mt-3 text-[12px] text-[var(--color-muted)]">{stage.credits}</p>
      </div>
    );
  return (
    <div>
      <span className="btn-secondary pointer-events-none inline-block">{stage.export}</span>
      <pre className="mono mt-3 overflow-x-auto rounded-[var(--radius-ctl,4px)] bg-[var(--color-paper-2)] p-3 text-[12px] leading-relaxed text-[var(--color-ink-2)]">
        {["name,title,company,email", ...demo.rows.slice(0, 2).map((r) => [r[0], r[1], r[2], r[3]].join(","))].join("\n")}
      </pre>
    </div>
  );
}

function StageFrame({ demo, stage, steps }: { demo: Demo; stage: Stage; steps: Step[] }) {
  return (
    <div
      className="relative rounded-[var(--radius-card)] border border-[var(--color-rule)] p-4 md:p-8"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-rule) 60%, transparent) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-rule) 60%, transparent) 0 1px, transparent 1px 24px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] [box-shadow:var(--shadow-lift)]">
        <div className="flex h-9 items-center border-b border-[var(--color-rule)] px-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[var(--color-rule)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-rule)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-rule)]" />
          </span>
          <span className="mono mx-auto text-[11px] text-[var(--color-muted)]">{stage.url}</span>
          <span className="w-9" aria-hidden="true" />
        </div>
        <div className="flex">
          <div className="flex w-12 shrink-0 flex-col items-center gap-4 border-r border-[var(--color-rule)] py-4 text-[var(--color-muted)]">
            <SideIcon name="search" />
            <SideIcon name="list" />
            <SideIcon name="download" />
            <SideIcon name="credits" />
          </div>
          <div className="relative min-h-[300px] flex-1 p-5">
            {steps.map((s, i) => (
              <div key={s.label} className="hiw-visual absolute inset-5 flex flex-col justify-center">
                <Visual i={i} demo={demo} stage={stage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks({ index, title, steps, demo, stage }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current!;
      const mm = gsap.matchMedia();

      if (reduced()) return; // CSS motion-reduce swaps to the stacked layout

      mm.add("(min-width: 768px)", () => {
        const q = gsap.utils.selector(section);
        const visuals = q(".hiw-visual");
        const bodies = q(".hiw-body");
        const titles = q(".hiw-title");
        const nodes = q(".hiw-node");
        const railFill = q(".hiw-rail-fill")[0];
        const ink = "var(--color-ink)";
        const muted = "var(--color-muted)";
        const rule = "var(--color-rule)";
        const lemon = "var(--color-accent)";

        gsap.set(visuals.slice(1), { autoAlpha: 0, y: 14 });
        gsap.set(bodies, { clipPath: "inset(0 0 100% 0)", opacity: 0 });
        gsap.set(bodies[0], { clipPath: "inset(0 0 0% 0)", opacity: 1 });
        gsap.set(titles, { color: muted });
        gsap.set(titles[0], { color: ink });
        gsap.set(nodes, { backgroundColor: rule, borderColor: rule });
        gsap.set(nodes[0], { backgroundColor: lemon, borderColor: ink });
        gsap.set(".hiw-rv-b", { autoAlpha: 0 });
        gsap.set(".hiw-ch", { opacity: 0 });
        gsap.set(".hiw-chip", { opacity: 0, y: 8 });
        gsap.set(railFill, { scaleY: 0, transformOrigin: "top center" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + 3.2 * innerHeight,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.to(railFill, { scaleY: 1, duration: 5 }, 0);

        steps.forEach((s, i) => {
          tl.addLabel(s.label, i);
          if (i === 0) return;
          tl.to(visuals[i - 1], { autoAlpha: 0, y: -14, duration: 0.15 }, i - 0.1)
            .to(bodies[i - 1], { clipPath: "inset(0 0 100% 0)", opacity: 0, duration: 0.15 }, i - 0.1)
            .to(titles[i - 1], { color: muted, duration: 0.15 }, i - 0.1)
            .to(nodes[i - 1], { backgroundColor: ink, borderColor: ink, duration: 0.15 }, i - 0.1)
            .to(visuals[i], { autoAlpha: 1, y: 0, duration: 0.15 }, i + 0.02)
            .to(bodies[i], { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.15 }, i + 0.02)
            .to(titles[i], { color: ink, duration: 0.15 }, i + 0.02)
            .to(nodes[i], { backgroundColor: lemon, borderColor: ink, duration: 0.15 }, i + 0.02);
        });
        tl.to(".hiw-ch", { opacity: 1, duration: 0.4, stagger: 0.012 }, 0.1)
          .to(".hiw-chip", { opacity: 1, y: 0, duration: 0.1, stagger: 0.08 }, "Filter+=0.1")
          .to(".hiw-rv-a", { autoAlpha: 0, duration: 0.2 }, "Reveal+=0.4")
          .to(".hiw-rv-b", { autoAlpha: 1, duration: 0.2 }, "Reveal+=0.5")
          .set({}, {}, 5);
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from(".hiw-m > *", {
          y: 16,
          opacity: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "expo.out",
          clearProps: "transform",
          scrollTrigger: { trigger: section, start: "top 75%" },
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="how" aria-labelledby="how-h" className="bg-[var(--color-paper)]">
      <style>{`
        .hiw-caret { display:inline-block; width:1px; height:1.1em; margin-left:2px; background:var(--color-ink); vertical-align:text-bottom; animation:hiw-blink 1.1s steps(1) infinite; }
        @keyframes hiw-blink { 50% { opacity:0 } }
        @media (prefers-reduced-motion: reduce) { .hiw-caret { animation:none } }
      `}</style>
      {/* desktop pinned; reduced motion gets the stacked layout instead */}
      <div className="mx-auto hidden h-screen max-w-[1200px] flex-col justify-center px-[var(--pad,24px)] md:motion-safe:flex">
        <h2 id="how-h" className="mb-12 text-[clamp(26px,3.4vw,36px)] font-semibold">
          <span className="idx" aria-hidden="true">[{index}]</span> {title}
        </h2>
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-5 flex gap-5">
            <div className="relative w-2 shrink-0" aria-hidden="true">
              <span className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-[var(--color-rule)]" />
              <span className="hiw-rail-fill absolute top-2 bottom-2 left-1/2 w-[2px] -translate-x-1/2 bg-[var(--color-accent)]" />
            </div>
            <ol className="m-0 flex-1 list-none p-0">
              {steps.map((s, i) => (
                <li key={s.label} className="relative py-4">
                  <span className="hiw-node absolute top-[22px] -left-[30px] h-2 w-2 rounded-full border bg-[var(--color-rule)]" aria-hidden="true" />
                  <p className="hiw-title text-[18px] font-semibold">
                    <span className="mono mr-3 text-[12px] font-normal" aria-hidden="true">[0{i + 1}]</span>
                    {s.title}
                  </p>
                  <p className="hiw-body mt-2 max-w-[400px] text-[14px] leading-relaxed text-[var(--color-ink-2)]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-7">
            <StageFrame demo={demo} stage={stage} steps={steps} />
          </div>
        </div>
      </div>

      {/* mobile and reduced motion: stacked, static visuals */}
      <div className="hiw-m mx-auto max-w-[1200px] px-[var(--pad,24px)] py-16 md:motion-safe:hidden">
        <h2 className="mb-8 text-[26px] font-semibold">
          <span className="idx" aria-hidden="true">[{index}]</span> {title}
        </h2>
        {steps.map((s, i) => (
          <div key={s.label} className="border-b border-dotted border-[var(--color-rule)] py-6 last:border-b-0">
            <p className="text-[17px] font-semibold">
              <span className="mono mr-3 text-[12px] font-normal text-[var(--color-muted)]" aria-hidden="true">[0{i + 1}]</span>
              {s.title}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{s.body}</p>
            <div className="mt-4">
              <Visual i={i} demo={demo} stage={stage} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
