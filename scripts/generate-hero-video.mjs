import { chromium } from "playwright";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inputs = [
  "public/images/construction.jpg",
  "public/images/web.jpg",
  "public/images/residence.jpg",
];

const dataUrls = await Promise.all(
  inputs.map(async (input) => {
    const bytes = await readFile(path.join(root, input));
    return `data:image/jpeg;base64,${bytes.toString("base64")}`;
  }),
);

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const downloadPromise = page.waitForEvent("download");
const recording = await page.evaluate(async ({ sources }) => {
  const width = 1280;
  const height = 720;
  const duration = 12;
  const fps = 30;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D context is unavailable");

  const images = await Promise.all(
    sources.map(
      (source) =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = source;
        }),
    ),
  );

  const drawCover = (image, progress, direction) => {
    const zoom = 1.04 + progress * 0.075;
    const scale = Math.max(width / image.width, height / image.height) * zoom;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const travelX = Math.max(0, drawWidth - width) * 0.26;
    const travelY = Math.max(0, drawHeight - height) * 0.18;
    const x = (width - drawWidth) / 2 + (progress - 0.5) * travelX * direction;
    const y = (height - drawHeight) / 2 - (progress - 0.5) * travelY;
    context.drawImage(image, x, y, drawWidth, drawHeight);
  };

  const smoothstep = (value) => value * value * (3 - 2 * value);
  const stream = canvas.captureStream(fps);
  const mimeTypes = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  const mimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) throw new Error("No WebM MediaRecorder codec is available");
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 4_500_000,
  });
  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const complete = new Promise((resolve) => {
    recorder.onstop = resolve;
  });
  recorder.start(500);

  const start = performance.now();
  await new Promise((resolve) => {
    const render = (now) => {
      const elapsed = Math.min((now - start) / 1000, duration);
      const segment = 4;
      const current = Math.min(images.length - 1, Math.floor(elapsed / segment));
      const local = (elapsed - current * segment) / segment;
      const next = (current + 1) % images.length;

      context.globalAlpha = 1;
      drawCover(images[current], local, current % 2 === 0 ? 1 : -1);

      const fadeStart = 0.7;
      if (local > fadeStart || elapsed === duration) {
        const fade = smoothstep(
          Math.min(1, Math.max(0, (local - fadeStart) / (1 - fadeStart))),
        );
        context.globalAlpha = fade;
        drawCover(images[next], Math.max(0, local - fadeStart), next % 2 ? -1 : 1);
      }

      context.globalAlpha = 1;
      const warmth = context.createLinearGradient(0, 0, width, height);
      warmth.addColorStop(0, "rgba(55, 33, 18, 0.08)");
      warmth.addColorStop(0.58, "rgba(190, 78, 38, 0.035)");
      warmth.addColorStop(1, "rgba(10, 24, 31, 0.11)");
      context.fillStyle = warmth;
      context.fillRect(0, 0, width, height);

      if (elapsed >= duration) {
        resolve();
        return;
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  });

  recorder.stop();
  await complete;
  stream.getTracks().forEach((track) => track.stop());
  const blob = new Blob(chunks, { type: mimeType });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "aarav-dual-solutions-hero.webm";
  anchor.click();
  return { mimeType, size: blob.size };
}, { sources: dataUrls });

const download = await downloadPromise;
await mkdir(path.join(root, "public", "video"), { recursive: true });
const output = path.join(root, "public", "video", "aarav-dual-solutions-hero.webm");
await download.saveAs(output);
await browser.close();
console.log(`Created ${path.relative(root, output)} (${recording.size} bytes, ${recording.mimeType})`);
