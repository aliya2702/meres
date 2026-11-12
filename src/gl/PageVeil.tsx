import { useEffect, useRef } from "react";
import gsap from "gsap";
import { VEIL_FRAG, VERT } from "./shaders";
import { prefersReducedMotion } from "../motion/tokens";
import { MeresMark } from "../components/MeresMark";

type Origin = [number, number];
type VeilApi = { cover: (origin?: Origin) => Promise<void>; reveal: (origin?: Origin) => Promise<void>; hold: () => void };

let api: VeilApi = { cover: async () => {}, reveal: async () => {}, hold: () => {} };
export const veil = {
  cover: (o?: Origin) => api.cover(o),
  reveal: (o?: Origin) => api.reveal(o),
  hold: () => api.hold(),
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
}

export function PageVeil({ color = "#2C382A", rim = "#AD9680", durationIn = 0.95, durationOut = 1.05 }: { color?: string; rim?: string; durationIn?: number; durationOut?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const markEl = markRef.current;
    const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl || prefersReducedMotion()) { api = { cover: async () => {}, reveal: async () => {}, hold: () => {} }; return; }

    const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, VEIL_FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const [cr, cg, cb] = hexToRgb(color); const [rr, rg, rb] = hexToRgb(rim);
    const state = { p: 0, out: 0, origin: [0.5, 0.5] as Origin, t: 0 };

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(window.innerWidth * dpr), h = Math.round(window.innerHeight * dpr);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
      state.t += 0.016;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U("uP"), state.p); gl.uniform1f(U("uOut"), state.out); gl.uniform1f(U("uTime"), state.t);
      gl.uniform1f(U("uAsp"), w / h); gl.uniform2f(U("uOrigin"), state.origin[0], state.origin[1]);
      gl.uniform3f(U("uColor"), cr, cg, cb); gl.uniform3f(U("uRim"), rr, rg, rb);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const run = (out: 0 | 1, origin: Origin, dur: number) =>
      new Promise<void>((resolve) => {
        state.out = out; state.origin = origin; state.p = 0;
        cv.style.display = "block";
        if (out === 1 && markEl) {
          gsap.set(markEl, { opacity: 0, clipPath: "inset(0 0 0 0)" });
        }
        gsap.to(state, { p: 1, duration: dur, ease: "power2.inOut", onUpdate: draw, onComplete: () => { if (out === 1) { cv.style.display = "none"; if (markEl) gsap.set(markEl, { opacity: 0 }); } resolve(); } });
      });

    api = {
      cover: (o = [0.5, 0.5]) => run(0, o, durationIn),
      reveal: (o = [0.5, 0.5]) => run(1, o, durationOut),
      hold: () => {
        state.out = 1; state.p = 0; state.origin = [0.5, 0.5];
        cv.style.display = "block"; draw();
        if (markEl) {
          gsap.set(markEl, { opacity: 0, clipPath: "inset(50% 0 50% 0)" });
          gsap.to(markEl, { opacity: 1, clipPath: "inset(0 0 0 0)", duration: 0.4, ease: "power3.out", delay: 0.15 });
        }
      },
    };
    cv.style.display = "none";
    return () => { gsap.killTweensOf(state); gl.getExtension("WEBGL_lose_context")?.loseContext(); api = { cover: async () => {}, reveal: async () => {}, hold: () => {} }; };
  }, [color, rim, durationIn, durationOut]);

  return (
    <>
      <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 9999, pointerEvents: "none", display: "none" }} />
      <div ref={markRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center" style={{ opacity: 0 }}>
        <MeresMark className="h-16 w-20 text-linen" />
      </div>
    </>
  );
}
