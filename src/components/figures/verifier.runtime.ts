// Ported from app-leadslemonade/docs/figures/verifier-light.html (module script).
type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Projection = { origin: Vec2; scale: number; azimuth?: number; elevation?: number };

const AZIMUTH = 45;
const ELEVATION = 30;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);

function cameraOf({ scale, azimuth = AZIMUTH, elevation = ELEVATION }: Projection) {
  const a = azimuth * RADIANS;
  const e = elevation * RADIANS;
  return { sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: scale * UNIT };
}
function iso([x, y, z]: Vec3, projection: Projection): Vec2 {
  const { origin } = projection;
  const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
  return [origin[0] + (x * sinA - y * cosA) * k, origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k];
}
const tenth = (value: number) => {
  const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return text === "-0" ? "0" : text;
};
function pathOf(points: Vec2[], closed = false) {
  if (!points.length) return "";
  return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}
function onTop(points: Vec2[], z: number, projection: Projection, closed = false) {
  return pathOf(points.map(([x, y]) => iso([x, y, z], projection)), closed);
}
const lineOnTop = (from: Vec2, to: Vec2, z: number, projection: Projection) => onTop([from, to], z, projection);
function axisVector(projection: Projection, [dx, dy, dz]: Vec3): Vec2 {
  const origin = iso([0, 0, 0], projection);
  const moved = iso([dx, dy, dz], projection);
  return [moved[0] - origin[0], moved[1] - origin[1]];
}
const fine = (value: number) => Math.round(value * 100) / 100;
function translateAlong(projection: Projection, by: Vec3) {
  const [x, y] = axisVector(projection, by);
  return `translate(${fine(x)} ${fine(y)})`;
}

export function mountVerifier(stage: HTMLElement, readout: HTMLElement): () => void {
  const P: Projection = { origin: [325.82944366174655, 198.67926378569965], scale: 1.7708224145083258, azimuth: 42, elevation: 30 };
  const LOAD_X = -70, TEST_X = 0, TIP_REST = 28, CARD_TOP = 9.2, TAB_H = 5, TRAVEL = 18.8;
  const DIAL: Vec2 = [0, -34], DIAL_R = 12, DIAL_TOP = 80;
  const COIN_H = 1.4, TUBE_Z = 36, GATE_OPEN = 12, FLOOR = 2;
  const svg = stage.querySelector("svg") as SVGSVGElement | null;
  if (!svg) return () => {};
  const q = (name: string) => svg.querySelector(`[data-part="${name}"]`) as SVGElement | null;
  const carriage = q("carriage")!, plunger = q("plunger")!, needle = q("needle")!, tab = q("tab")!, gate = q("gate")!, coin = q("coin")!, coins = q("coins")!;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const needleAt = (turn: number) => {
    const a = turn * Math.PI * 2;
    const [x, y] = DIAL;
    return lineOnTop(
      [x - Math.sin(a) * 3, y + Math.cos(a) * 3],
      [x + Math.sin(a) * (DIAL_R - 3.4), y - Math.cos(a) * (DIAL_R - 3.4)],
      DIAL_TOP + 0.2,
      P
    );
  };
  // model
  let card = 1, verified = true, till = 0;
  let x = LOAD_X, xTarget = LOAD_X;
  const tip: { at: number; rate: number } = { at: TIP_REST, rate: 0 };
  let tipTarget = TIP_REST;
  let gateAt = 0, gateTarget = 0;
  let drop: { z: number; v: number } | null = null; // while a credit is falling
  let phase = "load", hold = 0, result = "";
  let frame = 0, last = 0, touring = true, visible = false;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const contact = () => CARD_TOP + (verified ? TAB_H : 0);
  const spring = (s: { at: number; rate: number }, want: number, dt: number, stiff: number, drag: number, calm: boolean) => {
    if (calm) { s.at = want; s.rate = 0; return true; }
    for (let i = 0; i < 4; i++) { s.rate += ((want - s.at) * stiff - s.rate * drag) * dt / 4; s.at += s.rate * dt / 4; }
    if (Math.abs(want - s.at) < 0.005 && Math.abs(s.rate) < 0.005) { s.at = want; s.rate = 0; return true; }
    return false;
  };
  const say = (text: string) => { if (readout.textContent !== text) readout.textContent = text; };
  const describe = () => stage.setAttribute("aria-valuetext", "card " + card + (result ? " " + result : " under test") + ", till holds " + till + (till === 1 ? " credit" : " credits"));
  function draw() {
    carriage.setAttribute("transform", translateAlong(P, [x, 0, 0]));
    plunger.setAttribute("transform", translateAlong(P, [0, 0, tip.at]));
    needle.setAttribute("d", needleAt(clamp((TIP_REST - tip.at) / TRAVEL, 0, 1)));
    gate.setAttribute("transform", translateAlong(P, [0, gateAt, 0]));
    if (drop) { coin.style.display = ""; coin.setAttribute("transform", translateAlong(P, [0, 0, drop.z])); } else coin.style.display = "none";
    const credits = (n: number) => n + (n === 1 ? " credit" : " credits");
    say("card " + card + " · " + (result || (phase === "press" ? "testing" : phase === "approach" ? "to the probe" : "loading")) + " · till " + credits(till));
  }
  function addCoin() {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.innerHTML = coin.innerHTML;
    g.setAttribute("transform", translateAlong(P, [0, 0, FLOOR + (till - 1) * COIN_H]));
    coins.appendChild(g);
  }
  function step(dt: number, calm: boolean) {
    const tau = 0.26;
    x = calm ? xTarget : x + (xTarget - x) * (1 - Math.exp(-dt / tau));
    if (Math.abs(xTarget - x) < 0.25) x = xTarget;
    const tipDone = spring(tip, tipTarget, dt, 380, 24, calm);
    gateAt = calm ? gateTarget : gateAt + (gateTarget - gateAt) * (1 - Math.exp(-dt / 0.12));
    if (Math.abs(gateTarget - gateAt) < 0.02) gateAt = gateTarget;
    if (drop) {
      drop.v += 900 * dt; drop.z -= drop.v * dt;
      const rest = FLOOR + till * COIN_H;
      if (drop.z <= rest || calm) { drop = null; till += 1; addCoin(); describe(); }
    }
    if (!touring) return x === xTarget && tipDone && gateAt === gateTarget && !drop;
    hold -= dt;
    if (phase === "load" && x === xTarget && hold <= 0 && !result) { phase = "approach"; xTarget = TEST_X; }
    else if (phase === "approach" && x === xTarget) { phase = "press"; tipTarget = contact(); }
    else if (phase === "press" && tipDone) {
      phase = "read"; hold = 1.1;
      result = verified ? "verified" : "unverified";
      if (verified) { gateTarget = GATE_OPEN; drop = { z: TUBE_Z + 3, v: 0 }; }
      describe();
    }
    else if (phase === "read" && hold <= 0 && !drop) { phase = "lift"; tipTarget = TIP_REST; gateTarget = 0; }
    else if (phase === "lift" && tipDone) { phase = "load"; xTarget = LOAD_X; hold = 0.7; }
    if (phase === "load" && result && Math.abs(x - LOAD_X) < 12) { card += 1; verified = !verified; tab.style.display = verified ? "" : "none"; result = ""; hold = 0.7; describe(); }
    return true;
  }
  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const busy = step(dt, still.matches);
    draw();
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  }
  const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
  const pause = () => {
    touring = false; clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { touring = !still.matches; run(); }, 3600);
    run();
  };
  const observer = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
  observer.observe(stage);
  if (still.matches) touring = false;
  const onMove = (event: PointerEvent) => {
    if (phase === "press" || phase === "read" || drop) return;
    const box = svg.getBoundingClientRect();
    const share = clamp(((event.clientX - box.left) / box.width - 0.2) / 0.3, 0, 1);
    pause(); phase = "load"; tipTarget = TIP_REST; gateTarget = 0; xTarget = LOAD_X + share * (TEST_X - LOAD_X);
  };
  function press() {
    if (xTarget !== TEST_X || phase === "press" || phase === "read" || drop) return;
    pause(); phase = "approach"; touring = true; hold = 0;
  }
  const onKey = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") { event.preventDefault(); xTarget = TEST_X; press(); return; }
    if (event.key === "ArrowRight" || event.key === "End") { event.preventDefault(); pause(); xTarget = TEST_X; }
    if (event.key === "ArrowLeft" || event.key === "Home") { event.preventDefault(); pause(); xTarget = LOAD_X; }
    if (event.key === "t" || event.key === "T") { event.preventDefault(); if (phase === "load" || phase === "approach") { verified = !verified; tab.style.display = verified ? "" : "none"; } }
  };
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("click", press);
  stage.addEventListener("keydown", onKey);
  describe();
  draw();
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    observer.disconnect();
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("click", press);
    stage.removeEventListener("keydown", onKey);
  };
}
