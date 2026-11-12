import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IMAGE_FRAG, VERT } from "./shaders";
import { velocity } from "../motion/smooth";
import { prefersReducedMotion } from "../motion/tokens";

export type GLImageHandle = {
  setMix: (v: number) => void;
  setSrcB: (src: string) => void;
  commit: () => void;
};

type Props = {
  src: string;
  srcB?: string;
  alt: string;
  className?: string;
  ripple?: number;
  velocityWarp?: boolean;
  eager?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
};

type Texture = { tex: WebGLTexture; w: number; h: number };
const activeContexts = new Set<HTMLDivElement>();
const MAX_CONTEXTS = 3;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "shader");
  return shader;
}

function loadTexture(gl: WebGLRenderingContext, src: string): Promise<Texture> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const tex = gl.createTexture();
      if (!tex) return reject(new Error("texture"));
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      resolve({ tex, w: image.naturalWidth, h: image.naturalHeight });
    };
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

export const GLImage = forwardRef<GLImageHandle, Props>(function GLImage(
  { src, srcB, alt, className = "", ripple = 1, velocityWarp = true, eager, fetchPriority, width = 1672, height = 941 },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<GLImageHandle>({ setMix() {}, setSrcB() {}, commit() {} });
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    setMix: (value) => api.current.setMix(value),
    setSrcB: (value) => api.current.setSrcB(value),
    commit: () => api.current.commit(),
  }));

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    if (!box || !cv || prefersReducedMotion()) return;

    let disposed = false;
    let running = false;
    let raf = 0;
    let visible = false;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let textureA: Texture | null = null;
    let textureB: Texture | null = null;
    const state = { mix: 0, drawnMix: -1, hover: 0, hoverTarget: 0, x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, time: 0 };

    const draw = () => {
      if (!gl || !program || !textureA) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const canvasWidth = Math.max(2, Math.round(box.clientWidth * dpr));
      const canvasHeight = Math.max(2, Math.round(box.clientHeight * dpr));
      if (cv.width !== canvasWidth || cv.height !== canvasHeight) {
        cv.width = canvasWidth;
        cv.height = canvasHeight;
        gl.viewport(0, 0, canvasWidth, canvasHeight);
      }
      const drawnTextureB = textureB || textureA;
      const uniform = (name: string) => gl!.getUniformLocation(program!, name);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureA.tex);
      gl.uniform1i(uniform("uA"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, drawnTextureB.tex);
      gl.uniform1i(uniform("uB"), 1);
      gl.uniform2f(uniform("uRes"), canvasWidth, canvasHeight);
      gl.uniform2f(uniform("uImgA"), textureA.w, textureA.h);
      gl.uniform2f(uniform("uImgB"), drawnTextureB.w, drawnTextureB.h);
      gl.uniform2f(uniform("uMouse"), state.x, state.y);
      gl.uniform1f(uniform("uHover"), state.hover);
      gl.uniform1f(uniform("uTime"), state.time);
      gl.uniform1f(uniform("uVel"), velocityWarp ? velocity.v : 0);
      gl.uniform1f(uniform("uMix"), textureB ? state.mix : 0);
      gl.uniform1f(uniform("uRipple"), ripple);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      state.drawnMix = state.mix;
    };

    const frame = () => {
      raf = 0;
      if (disposed || !visible) { running = false; return; }
      state.time += 0.016;
      state.hover += (state.hoverTarget - state.hover) * 0.08;
      state.x += (state.targetX - state.x) * 0.18;
      state.y += (state.targetY - state.y) * 0.18;
      draw();
      if (Math.abs(state.hover - state.hoverTarget) > 0.002 || state.hover > 0.002 || Math.abs(velocity.v) > 0.002 || state.drawnMix !== state.mix) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const kick = () => {
      if (!running && visible && !disposed) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const disposeContext = () => {
      if (!gl) return;
      cancelAnimationFrame(raf);
      if (textureA) gl.deleteTexture(textureA.tex);
      if (textureB) gl.deleteTexture(textureB.tex);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      activeContexts.delete(box);
      gl = null;
      program = null;
      buffer = null;
      textureA = null;
      textureB = null;
      setReady(false);
    };

    const setupContext = () => {
      if (disposed || gl || activeContexts.size >= MAX_CONTEXTS) return;
      const context = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
      if (!context) return;
      gl = context;
      activeContexts.add(box);
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, IMAGE_FRAG));
      gl.linkProgram(program);
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, "a");
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
      loadTexture(gl, src).then((loaded) => {
        if (disposed || !gl) return;
        textureA = loaded;
        setReady(true);
        draw();
        if (srcB) loadTexture(gl, srcB).then((next) => { if (!disposed) textureB = next; }).catch(() => {});
      }).catch(disposeContext);
    };

    const onEnter = () => { state.hoverTarget = 1; kick(); };
    const onLeave = () => { state.hoverTarget = 0; kick(); };
    const onMove = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      state.targetX = (event.clientX - rect.left) / rect.width;
      state.targetY = (event.clientY - rect.top) / rect.height;
      kick();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) setupContext();
      else disposeContext();
    }, { rootMargin: "20% 0px" });
    observer.observe(box);

    if (window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches && ripple > 0) {
      box.addEventListener("pointerenter", onEnter);
      box.addEventListener("pointerleave", onLeave);
      box.addEventListener("pointermove", onMove);
    }
    const onScroll = () => kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    const resize = new ResizeObserver(draw);
    resize.observe(box);

    api.current = {
      setMix: (value) => { state.mix = Math.max(0, Math.min(1, value)); kick(); },
      setSrcB: (nextSrc) => { if (gl) loadTexture(gl, nextSrc).then((next) => { if (textureB && gl) gl.deleteTexture(textureB.tex); textureB = next; kick(); }).catch(() => {}); },
      commit: () => { if (textureB && textureA && gl) { gl.deleteTexture(textureA.tex); textureA = textureB; textureB = null; state.mix = 0; kick(); } },
    };

    return () => {
      disposed = true;
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      box.removeEventListener("pointerenter", onEnter);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointermove", onMove);
      disposeContext();
    };
  }, [src, srcB, ripple, velocityWarp]);

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" {...(fetchPriority ? { fetchPriority } : {})} className="absolute inset-0 h-full w-full object-cover" style={{ opacity: ready ? 0 : 1 }} />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ opacity: ready ? 1 : 0 }} />
    </div>
  );
});
