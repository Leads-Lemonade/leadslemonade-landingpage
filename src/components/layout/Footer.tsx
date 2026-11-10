import Link from "next/link";
import Image from "next/image";
import landing from "@/content/landing.json";

const { tagline, columns, legal } = landing.footer;

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-rule)]">
      <div className="h-[10px]" style={{ background: "var(--dots)", backgroundSize: "7px 7px" }} aria-hidden="true" />
      <div className="mx-auto max-w-[1200px] px-[var(--pad,24px)] py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-[320px]">
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo-ink-wordmark.png" alt="LeadsLemonade" width={169} height={32} className="h-[32px] w-auto" />
            </Link>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mono text-[12px] text-[var(--color-muted)]">{col.title}</p>
                <ul className="mt-3 list-none space-y-2 p-0">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {l.href.startsWith("#") ? (
                        <a href={l.href} className="text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]">{l.label}</a>
                      ) : (
                        <Link href={l.href} className="text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]">{l.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--color-rule)] pt-6">
          <p className="mono text-[11px] text-[var(--color-muted)]">{new Date().getFullYear()} {legal}</p>
        </div>
      </div>
    </footer>
  );
}
