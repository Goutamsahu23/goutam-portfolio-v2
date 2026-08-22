// Ashima simplex noise, used to build a curl field for the particle drift.
const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 snoiseVec3(vec3 p) {
  return vec3(
    snoise(p),
    snoise(vec3(p.y - 19.1, p.z + 33.4, p.x + 47.2)),
    snoise(vec3(p.z + 74.2, p.x - 124.5, p.y + 99.4))
  );
}

// Divergence-free field: particles circulate instead of piling into sinks.
vec3 curlNoise(vec3 p) {
  const float e = 0.12;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 px0 = snoiseVec3(p - dx);
  vec3 px1 = snoiseVec3(p + dx);
  vec3 py0 = snoiseVec3(p - dy);
  vec3 py1 = snoiseVec3(p + dy);
  vec3 pz0 = snoiseVec3(p - dz);
  vec3 pz1 = snoiseVec3(p + dz);

  float x = py1.z - py0.z - pz1.y + pz0.y;
  float y = pz1.x - pz0.x - px1.z + px0.z;
  float z = px1.y - px0.y - py1.x + py0.x;

  return vec3(x, y, z) / (2.0 * e);
}
`

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uResolve;
uniform float uDisperse;
uniform vec2 uPointer;
uniform float uPointerRadius;
uniform float uPointerStrength;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 aScatter;
attribute vec3 aTarget;
attribute float aSeed;

varying float vResolve;

${SIMPLEX_3D}

void main() {
  float t = uTime * 0.06;

  // Slow circulation through the noise field, offset per particle so the cloud
  // never reads as a single moving mass.
  vec3 drift = curlNoise(aScatter * 0.28 + vec3(aSeed * 0.4, aSeed * 0.2, t)) * 0.42;
  vec3 cloud = aScatter + drift;
  cloud.z += sin(uTime * 0.35 + aSeed * 6.2831) * 0.18;

  // The pointer is a local attractor: the field resolves under attention.
  float pointerFalloff = smoothstep(uPointerRadius, 0.0, distance(cloud.xy, uPointer));
  float resolve = clamp(uResolve + pointerFalloff * uPointerStrength, 0.0, 1.0);

  vec3 pos = mix(cloud, aTarget, resolve);

  // Scroll pushes the field apart along its own scatter direction.
  pos += normalize(aScatter + vec3(0.0001)) * uDisperse * 3.2;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Only a slight swell on resolve: larger points blur the silhouette into a
  // blob instead of letterforms.
  gl_PointSize = uSize * uPixelRatio * (0.7 + resolve * 0.4) * (10.0 / -mvPosition.z);

  vResolve = resolve;
}
`

export const fragmentShader = /* glsl */ `
precision mediump float;

uniform vec3 uBone;
uniform vec3 uSignal;
uniform float uOpacity;

varying float vResolve;

void main() {
  // Soft round sprite, no texture upload needed.
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.06, d);
  if (alpha < 0.01) discard;

  // Accent colour only where the field has resolved, and only ever half way:
  // additive blending stacks overlapping points, so a full mix reads as a solid
  // lime mass rather than an accent.
  vec3 color = mix(uBone, uSignal, smoothstep(0.55, 1.0, vResolve) * 0.35);
  gl_FragColor = vec4(color, alpha * uOpacity * (0.22 + vResolve * 0.48));
}
`
