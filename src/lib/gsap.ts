import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
export const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
