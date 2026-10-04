"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** sRGB hex -> vec3 without colour-space conversion (shaders output sRGB directly). */
const rgb = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const DUST_VERT = /* glsl */ `
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime, uFly, uSize, uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    float z = mod(pos.z + uTime * (0.25 + aSeed * 0.5) + uFly * 6.0 + 12.0, 16.0) - 12.0;
    pos.z = z;
    pos.xy += vec2(sin(uTime * 0.3 + aSeed * 20.0), cos(uTime * 0.25 + aSeed * 30.0)) * 0.08;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float fade = smoothstep(-12.0, -8.0, z) * smoothstep(4.0, 1.5, z);
    vAlpha = fade * (0.35 + 0.65 * fract(aSeed * 7.0));
    vColor = aColor;
    gl_PointSize = min(uSize * uPixelRatio * (0.5 + aSeed) * (7.0 / -mv.z), 40.0);
  }
`;

const DUST_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha * uAlpha);
  }
`;

const sceneState = {
  zoom: 1,
  page: 0,
  dim: 1,
  px: 0,
  py: 0,
}

export default function MandalaScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the page still works, the backdrop is simply plain.
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    renderer.setClearColor(0x000000, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 0, 5);

    // ----- mandala -----
    const group = new THREE.Group();
    scene.add(group);
    const planeGeo = new THREE.PlaneGeometry(2, 2);

    // ----- drifting embers -----
    const count = small ? 650 : 1500;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = ["#f59a3c", "#f6d58a", "#c4508f", "#8f5fd0", "#3a6fb5"].map(rgb);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.pow(Math.random(), 0.7) * 5.5;
      positions.set([Math.cos(angle) * radius, Math.sin(angle) * radius, -12 + Math.random() * 16], i * 3);
      seeds[i] = Math.random();
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors.set([c.x, c.y, c.z], i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    dustGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    const dustMaterial = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uFly: { value: 0 },
        uSize: { value: 5 },
        uPixelRatio: { value: 1 },
        uAlpha: { value: 1 }
      },
    });
    const dust = new THREE.Points(dustGeo, dustMaterial);
    dust.frustumCulled = false;
    scene.add(dust);

    let baseScale = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      dustMaterial.uniforms.uPixelRatio.value = dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // ----- loop -----
    let last = performance.now();
    let elapsed = 0;
    let raf = 0;
    let reveal = reduceMotion ? 1 : 0;
    let camX = 0;
    let camY = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      const t = reduceMotion ? 0 : elapsed;

      if (reveal < 1) reveal = Math.min(1, reveal + dt / 2.6);

      group.scale.setScalar(baseScale * sceneState.zoom);

      dustMaterial.uniforms.uTime.value = t;
      dustMaterial.uniforms.uFly.value = sceneState.page * 3 + Math.log(sceneState.zoom) * 0.6;
      dustMaterial.uniforms.uAlpha.value = 0.55 + 0.45 * sceneState.dim;

      // gentle pointer parallax
      camX += (sceneState.px * 0.35 - camX) * Math.min(1, dt * 2.5);
      camY += (-sceneState.py * 0.22 - camY) * Math.min(1, dt * 2.5);
      camera.position.set(camX, camY, 5 - sceneState.page * 0.8);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    frame();

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        frame();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      planeGeo.dispose();
      dustGeo.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 h-full w-full" />;
}
