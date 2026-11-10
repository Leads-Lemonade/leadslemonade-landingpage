"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

type Item = { title: string; body: string };
type LinkItem = { label: string; href: string };
type Props = { index: string; title: string; items: Item[]; links: LinkItem[] };

export default function Trust({ index, title, items, links }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".tr-reveal", {
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
    <section ref={ref} id="trust" aria-labelledby="trust-h" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1200px] px-[var(--pad,24px)]">
        <h2 id="trust-h" className="tr-reveal text-[clamp(26px,3.4vw,36px)] font-semibold">
          <span className="idx" aria-hidden="true">[{index}]</span> {title}
        </h2>

        <div className="mt-10 grid grid-cols-1 border-t border-[var(--color-rule)] sm:grid-cols-2">
          {items.map((it, i) => (
            <div
              key={it.title}
              className={`tr-reveal border-b border-[var(--color-rule)] py-6 sm:pr-8 ${i % 2 === 1 ? "sm:border-l sm:pl-8" : ""}`}
            >
              <h3 className="text-[15px] font-semibold">{it.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{it.body}</p>
            </div>
          ))}
        </div>

        <div className="tr-reveal mt-6 flex gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] text-[var(--color-ink-2)] underline underline-offset-[0.16em]">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
