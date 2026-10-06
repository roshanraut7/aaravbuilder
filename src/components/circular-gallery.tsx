"use client";

/* React Bits CircularGallery, adapted for this Next.js project. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import "./circular-gallery.css";

type GalleryItem = { image: string; text: string };

type CircularGalleryProps = {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
};

const vertex = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.04);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform sampler2D tMap;
  uniform float uBorderRadius;
  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
  }

  void main() {
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec4 color = texture2D(tMap, uv);
    float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
    float edge = 0.002;
    float alpha = 1.0 - smoothstep(-edge, edge, d);
    gl_FragColor = vec4(color.rgb, color.a * alpha);
  }
`;

function makeLabel(gl: any, text: string, color: string, font: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  context.font = font;
  const width = Math.ceil(context.measureText(text).width + 56);
  canvas.width = width * dpr;
  canvas.height = 74 * dpr;
  context.scale(dpr, dpr);
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.fillText(text, 28, 36);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, aspect: width / 74 };
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#231c14",
  borderRadius = 0.045,
  font = "700 30px Arial",
  scrollSpeed = 2,
  scrollEase = 0.055,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;

    let renderer: any;
    try {
      renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    } catch {
      container.dataset.webgl = "unavailable";
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    const camera = new Camera(gl);
    camera.position.z = 20;
    const scene = new Transform();
    const geometry = new Plane(gl, { heightSegments: 18, widthSegments: 36 });
    const media: any[] = [];
    const scroll = { current: 0, target: 0, last: 0, ease: scrollEase };
    let width = 0;
    let height = 0;
    const viewport = { width: 0, height: 0 };
    let cardWidth = 0;
    let totalWidth = 0;
    let raf = 0;
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const buildMedia = (item: GalleryItem, index: number) => {
      const texture = new Texture(gl, { generateMipmaps: false });
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.src = item.image;
      image.onload = () => {
        texture.image = image;
        program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
      };

      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uTime: { value: 0 },
          uSpeed: { value: 0 },
          uImageSizes: { value: [1, 1] },
          uPlaneSizes: { value: [1, 1] },
          uBorderRadius: { value: borderRadius },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      const labelData = makeLabel(gl, item.text.toUpperCase(), textColor, font);
      const labelProgram = new Program(gl, {
        vertex: `
          precision highp float;
          attribute vec3 position;
          attribute vec2 uv;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec2 vUv;
          void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
        `,
        fragment: `
          precision highp float;
          uniform sampler2D tMap;
          varying vec2 vUv;
          void main(){gl_FragColor=texture2D(tMap,vUv);}
        `,
        transparent: true,
        uniforms: { tMap: { value: labelData.texture } },
      });
      const label = new Mesh(gl, { geometry: new Plane(gl), program: labelProgram });
      label.setParent(scene);
      media.push({ mesh, label, program, index, labelAspect: labelData.aspect });
    };

    [...items, ...items, ...items].forEach(buildMedia);

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      const fov = (camera.fov * Math.PI) / 180;
      viewport.height = 2 * Math.tan(fov / 2) * camera.position.z;
      viewport.width = viewport.height * camera.aspect;
      cardWidth = Math.min(viewport.width * (width < 700 ? 0.72 : 0.31), 7.4);
      const cardHeight = cardWidth * 1.22;
      totalWidth = cardWidth * 1.18 * media.length;

      media.forEach((item) => {
        item.mesh.scale.set(cardWidth, cardHeight, 1);
        item.program.uniforms.uPlaneSizes.value = [cardWidth, cardHeight];
        const labelWidth = Math.min(cardWidth * 0.92, cardHeight * item.labelAspect * 0.23);
        item.label.scale.set(labelWidth, labelWidth / item.labelAspect, 1);
      });
    };

    const updatePositions = () => {
      const spacing = cardWidth * 1.18;
      media.forEach((item) => {
        const base = (item.index - items.length) * spacing;
        let x = base - scroll.current;
        x = ((x + totalWidth * 1.5) % totalWidth) - totalWidth * 0.5;
        const curve = bend === 0 ? 0 : Math.abs(bend) * 0.055;
        const y = bend === 0 ? 0 : -Math.pow(x / viewport.width, 2) * viewport.height * curve * Math.sign(bend);
        const rotation = bend === 0 ? 0 : -(x / viewport.width) * curve * 1.6 * Math.sign(bend);
        item.mesh.position.set(x, y + 0.55, 0);
        item.mesh.rotation.z = rotation;
        item.label.position.set(x, y - item.mesh.scale.y * 0.54, 0.02);
        item.label.rotation.z = rotation;
      });
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      scroll.target += (event.deltaY || event.deltaX) * 0.008 * scrollSpeed;
    };
    const onPointerDown = (event: PointerEvent) => {
      down = true;
      startX = event.clientX;
      startScroll = scroll.target;
      container.setPointerCapture(event.pointerId);
      container.classList.add("is-dragging");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (down) scroll.target = startScroll + (startX - event.clientX) * 0.012 * scrollSpeed;
    };
    const onPointerUp = () => {
      down = false;
      container.classList.remove("is-dragging");
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        scroll.target += (event.key === "ArrowRight" ? 1 : -1) * cardWidth * 0.7;
      }
    };

    const render = (time: number) => {
      scroll.current += (scroll.target - scroll.current) * scroll.ease;
      const speed = Math.min(Math.abs(scroll.current - scroll.last), 1);
      media.forEach((item) => {
        item.program.uniforms.uTime.value = time * 0.001;
        item.program.uniforms.uSpeed.value = speed;
      });
      scroll.last = scroll.current;
      updatePositions();
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("keydown", onKeyDown);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("keydown", onKeyDown);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [bend, borderRadius, font, items, scrollEase, scrollSpeed, textColor]);

  return (
    <div
      ref={containerRef}
      className="circular-gallery"
      role="region"
      aria-label="Interactive inspiration gallery. Drag, scroll, or use the left and right arrow keys to explore."
      tabIndex={0}
    />
  );
}
