"use client";

import { useEffect, useRef } from "react";
import { VERIFIER_SVG } from "./verifier.svg";
import { mountVerifier } from "./verifier.runtime";
import "./anatomy.css";

export default function Verifier() {
  const stage = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!stage.current || !readout.current) return;
    return mountVerifier(stage.current, readout.current);
  }, []);
  return (
    <div className="iso" data-theme="light">
      <div
        ref={stage}
        className="iso-stage"
        tabIndex={0}
        role="slider"
        aria-label="Verifier bench: left and right arrows move the card, Space tests it, T swaps a verified card for an unverified one"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={0}
        dangerouslySetInnerHTML={{ __html: VERIFIER_SVG }}
      />
      <p ref={readout} className="mono mt-2" data-readout aria-live="polite">
        card 1 · loading · till 0 credits
      </p>
    </div>
  );
}
