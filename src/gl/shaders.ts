// MERES WebGL shaders. Do not rewrite — tune only the uniforms/constants noted in comments.

export const VERT = `
attribute vec2 a;
varying vec2 vUv;
void main(){
  vUv = vec2(a.x * 0.5 + 0.5, 1.0 - (a.y * 0.5 + 0.5));
  gl_Position = vec4(a, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}`;

// Image shader: cover-fit, water-ripple on hover, scroll-velocity bend + RGB split,
// and a liquid dissolve between image A and image B (uMix 0 -> 1).
export const IMAGE_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;      // canvas size px
uniform vec2 uImgA;     // image A size px
uniform vec2 uImgB;     // image B size px
uniform vec2 uMouse;    // 0..1, y down
uniform float uHover;   // 0..1 eased
uniform float uTime;
uniform float uVel;     // -1..1 scroll velocity
uniform float uMix;     // 0..1 dissolve A->B
uniform float uRipple;  // ripple strength (default 1.0)
${NOISE}
vec2 cover(vec2 uv, vec2 img){
  float r = uRes.x / uRes.y;
  float ir = img.x / img.y;
  vec2 s = r > ir ? vec2(1.0, ir / r) : vec2(r / ir, 1.0);
  return (uv - 0.5) * s + 0.5;
}
void main(){
  vec2 uv = vUv;
  float asp = uRes.x / uRes.y;

  // 1) Water ripple around the pointer (expanding rings that fade with distance)
  vec2 d = (uv - uMouse) * vec2(asp, 1.0);
  float dist = length(d);
  float wave = sin(dist * 42.0 - uTime * 4.2) * exp(-dist * 6.5) * uHover * uRipple;
  uv += normalize(d + 1e-5) * wave * 0.014;

  // 2) Scroll-velocity bend (image bows while scrolling) + chromatic split
  uv.y += sin(uv.x * 3.14159) * uVel * 0.018;
  float ca = abs(uVel) * 0.005 + abs(wave) * 0.004;

  // 3) Liquid dissolve with noise-shaped edge and refraction
  float n = fbm(uv * 3.0 + vec2(uTime * 0.04, 0.0));
  float m = smoothstep(0.0, 1.0, clamp(uMix * 1.7 - 0.35 + (n - 0.5) * 0.9 + (uv.y - 0.5) * 0.25, 0.0, 1.0));
  vec2 off = vec2(n - 0.5, fbm(uv * 3.0 + 7.3) - 0.5) * 0.07 * sin(m * 3.14159);

  vec2 ua = cover(uv + off, uImgA);
  vec2 ub = cover(uv - off, uImgB);
  float r = mix(texture2D(uA, ua + vec2(ca, 0.0)).r, texture2D(uB, ub + vec2(ca, 0.0)).r, m);
  float g = mix(texture2D(uA, ua).g, texture2D(uB, ub).g, m);
  float b = mix(texture2D(uA, ua - vec2(ca, 0.0)).b, texture2D(uB, ub - vec2(ca, 0.0)).b, m);
  gl_FragColor = vec4(r, g, b, 1.0);
}`;

// Page-transition shader: organic noise-edged liquid wipe expanding from an origin.
// uOut = 0 -> cover (colour grows from uOrigin); uOut = 1 -> reveal (colour recedes toward uOrigin).
export const VEIL_FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uP;       // 0..1 progress of the current phase
uniform float uOut;     // 0 cover, 1 reveal
uniform float uTime;
uniform float uAsp;
uniform vec2 uOrigin;    // 0..1, y down
uniform vec3 uColor;
uniform vec3 uRim;
${NOISE}
void main(){
  vec2 p = vUv * vec2(uAsp, 1.0);
  vec2 o = uOrigin * vec2(uAsp, 1.0);
  float maxd = length(vec2(uAsp, 1.0));
  float d = distance(p, o) / maxd;
  float n = fbm(p * 2.2 + uTime * 0.15);
  float e = uP * 1.6 - d + (n - 0.5) * 0.45;
  float a = smoothstep(0.0, 0.05, e);
  float rim = smoothstep(0.0, 0.03, e) - smoothstep(0.03, 0.10, e);
  if (uOut > 0.5) { a = 1.0 - a; }
  vec3 col = mix(uColor, uRim, rim * 0.6);
  gl_FragColor = vec4(col * a, a);
}`;
