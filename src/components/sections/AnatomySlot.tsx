import type { ReactNode } from "react";

// ponytail: swap placeholder for <Figure/> from anatomy-figures
export default function AnatomySlot({ children }: { children?: ReactNode }) {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-card)] [aspect-ratio:4/3] md:[aspect-ratio:16/10]">
      {children ?? (
        <>
          <div className="absolute inset-0" style={{ background: "var(--hatch)" }} aria-hidden="true" />
          <p className="mono absolute inset-0 grid place-items-center text-[12px] text-[var(--color-muted)]">Figure loads here</p>
        </>
      )}
      <span className="mono absolute top-3 left-4 text-[11px] text-[var(--color-muted)]" aria-hidden="true">[01]</span>
      <span className="mono absolute top-3 right-4 text-[11px] text-[var(--color-muted)]">Verified reveal</span>
      <span className="mono absolute bottom-3 left-4 text-[11px] text-[var(--color-muted)]">hint</span>
      <span className="mono absolute right-4 bottom-3 text-[11px] text-[var(--color-muted)]">live readout</span>
    </div>
  );
}
