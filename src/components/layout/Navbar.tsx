"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import { ctaHref } from "@/lib/cta";
import landing from "@/content/landing.json";

const navItems: { id: string; label: string }[] = landing.nav.items;
const ctaLabel: string = landing.nav.cta;

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const root = ref.current!;
      const nav = root.querySelector<HTMLElement>(".nv-list");
      const ind = root.querySelector<HTMLElement>(".nv-ind");
      if (!nav || !ind) return;
      const links = Array.from(nav.querySelectorAll("a"));
      let active = -1;

      const placeInd = (animate: boolean) => {
        if (active < 0) return void gsap.to(ind, { opacity: 0, duration: 0.3, overwrite: "auto" });
        const n = nav.getBoundingClientRect();
        const a = links[active].getBoundingClientRect();
        const to = { x: a.left - n.left, width: a.width, opacity: 1 };
        if (animate && !reduced() && gsap.getProperty(ind, "opacity") !== 0) {
          gsap.to(ind, { ...to, duration: 0.7, ease: "expo.out", overwrite: "auto" });
        } else {
          gsap.set(ind, to);
        }
      };
      const setActive = (i: number) => {
        if (i === active) return;
        links.forEach((l, k) => (k === i ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current")));
        active = i;
        placeInd(true);
      };

      ScrollTrigger.create({
        start: 60,
        end: "max",
        onToggle: (s) => root.classList.toggle("is-compact", s.isActive),
      });
      root.classList.toggle("is-compact", window.scrollY > 60);

      links.forEach((l, i) => {
        const sec = document.querySelector(l.getAttribute("href") || "");
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: "top 50%",
          end: "bottom 50%",
          refreshPriority: -1,
          onToggle: (s) => (s.isActive ? setActive(i) : active === i && setActive(-1)),
        });
      });
      const onRefresh = () => placeInd(false);
      ScrollTrigger.addEventListener("refresh", onRefresh);
      return () => {
        gsap.killTweensOf(ind);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
      };
    },
    { scope: ref }
  );

  return (
    <header ref={ref} className="group fixed inset-x-0 top-0 z-50 pointer-events-none px-[var(--pad,24px)] pt-4">
      <div className="pointer-events-auto mx-auto flex h-14 max-w-[1200px] items-center gap-6 rounded-[var(--radius-card)] border border-transparent bg-transparent px-3 py-2 transition-[background-color,border-color,box-shadow] duration-500 group-[.is-compact]:border-[var(--color-rule)] group-[.is-compact]:bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] group-[.is-compact]:[backdrop-filter:blur(14px)] group-[.is-compact]:[box-shadow:var(--shadow-lift)]">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo-ink-wordmark.png"
            alt="LeadsLemonade"
            width={211}
            height={40}
            priority
            className="h-[40px] w-auto origin-left transition-transform duration-500 group-[.is-compact]:scale-[0.9]"
          />
        </Link>

        <nav aria-label="Main" className="relative ml-auto hidden md:block">
          <span className="nv-ind absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--color-accent)] opacity-0" aria-hidden="true" />
          <ul className="nv-list m-0 flex list-none gap-1 p-0">
            {navItems.map((it) => (
              <li key={it.id}>
                <a href={`#${it.id}`} className="block rounded-[var(--radius-ctl,4px)] px-3 py-1.5 text-[14px] font-medium text-[var(--color-ink-2)] hover:text-[var(--color-ink)] aria-[current]:text-[var(--color-ink)]">
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="btn-primary hidden shrink-0 md:inline-flex"
          style={{ height: 36, padding: "0 14px", fontSize: 13 }}
          href={ctaHref("nav")}
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          className="ml-auto rounded-[var(--radius-ctl,4px)] border border-[var(--color-rule)] bg-[var(--color-card)] p-2 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round">
            {open ? (
              <>
                <path d="M3 3 13 13" />
                <path d="M13 3 3 13" />
              </>
            ) : (
              <>
                <path d="M2 4.5h12" />
                <path d="M2 8h12" />
                <path d="M2 11.5h12" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="pointer-events-auto mx-auto mt-2 max-w-[1200px] rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] p-4 [box-shadow:var(--shadow-pop)] md:hidden">
          <ul className="m-0 list-none p-0">
            {navItems.map((it) => (
              <li key={it.id} className="border-b border-dotted border-[var(--color-rule)] last:border-b-0">
                <a href={`#${it.id}`} className="block py-3 text-[15px]" onClick={() => setOpen(false)}>
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn-primary mt-3 block text-center" href={ctaHref("nav")} onClick={() => setOpen(false)}>
            {ctaLabel}
          </a>
        </div>
      )}
    </header>
  );
}
