"use client";

import { useEffect, useRef } from "react";
import type { Typeface } from "@/types/typefaces";

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number = 0;
  vy: number = 0;
  size: number = 1.6;
  baseSize: number = 1.6;
  maxSize: number = 4.5;
  angle: number = Math.random() * Math.PI * 2;
  spin: number = (Math.random() - 0.5) * 0.05;
  distance: number = Math.random() * 45 + 10;
  color: string = "rgba(0, 0, 0, 0.7)";

  constructor(x: number, y: number) {
    this.originX = x;
    this.originY = y;
    this.x = x + Math.cos(this.angle) * this.distance;
    this.y = y + Math.sin(this.angle) * this.distance;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update(mouse: { x: number; y: number; radius: number }) {
    const dxMouse = mouse.x - this.x;
    const dyMouse = mouse.y - this.y;
    const distMouse = Math.sqrt(
      dxMouse * dxMouse + dyMouse * dyMouse
    );

    this.angle += this.spin;

    if (distMouse < mouse.radius) {
      const force =
        (mouse.radius - distMouse) / mouse.radius;
      const targetX = this.originX;
      const targetY = this.originY;

      this.vx += (targetX - this.x) * 0.15;
      this.vy += (targetY - this.y) * 0.15;

      const targetSize =
        this.baseSize + this.maxSize * force;
      this.size += (targetSize - this.size) * 0.2;
    } else {
      const idleX =
        this.originX + Math.cos(this.angle) * this.distance;
      const idleY =
        this.originY + Math.sin(this.angle) * this.distance;

      this.vx += (idleX - this.x) * 0.02;
      this.vy += (idleY - this.y) * 0.02;

      this.size += (this.baseSize - this.size) * 0.05;
    }

    this.vx *= 0.9;
    this.vy *= 0.9;

    this.x += this.vx;
    this.y += this.vy;
  }
}

const scaleFactor = 0.9;

/**
 * Load an image as a blob URL to avoid cross-origin canvas tainting.
 * Falls back to direct src assignment if fetch fails.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image: ${src}`));

    // Try fetching as blob first (avoids CORS tainted canvas)
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        // Store for cleanup
        (
          img as HTMLImageElement & { _blobUrl?: string }
        )._blobUrl = url;
        img.src = url;
      })
      .catch(() => {
        // Fallback: load directly
        img.crossOrigin = "anonymous";
        img.src = src;
      });
  });
}

export default function SingleTypefaceLetter({
  typeface,
}: {
  typeface: Typeface;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true,
    });
    if (!ctx) return;

    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 200 };
    let animationFrameId: number;
    let cancelled = false;

    const init = async () => {
      if (!container || cancelled) return;

      const containerRect =
        container.getBoundingClientRect();
      const w = containerRect.width;
      const h = containerRect.height;

      if (w === 0 || h === 0) return;
      if (!typeface.icon) return;

      let img: HTMLImageElement;
      try {
        img = await loadImage(typeface.icon);
      } catch (err) {
        console.error(err);
        return;
      }

      if (cancelled || !container) return;

      // Clean up blob URL
      const blobUrl = (
        img as HTMLImageElement & { _blobUrl?: string }
      )._blobUrl;
      if (blobUrl) URL.revokeObjectURL(blobUrl);

      const currentRect = container.getBoundingClientRect();
      const currentW = currentRect.width;
      const currentH = currentRect.height;

      if (currentW === 0 || currentH === 0) return;

      canvas.width = currentW;
      canvas.height = currentH;

      const scale =
        Math.min(
          currentW / img.width,
          currentH / img.height
        ) * scaleFactor;
      const xPos = (currentW - img.width * scale) / 2;
      const yPos = (currentH - img.height * scale) / 2;

      ctx.drawImage(
        img,
        xPos,
        yPos,
        img.width * scale,
        img.height * scale
      );

      const data = ctx.getImageData(
        0,
        0,
        currentW,
        currentH
      );
      ctx.clearRect(0, 0, currentW, currentH);

      particles = [];
      for (let y = 0; y < data.height; y += 4) {
        for (let x = 0; x < data.width; x += 4) {
          if (
            data.data[y * 4 * data.width + x * 4 + 3] > 128
          ) {
            particles.push(new Particle(x, y));
          }
        }
      }
    };

    function animate() {
      if (!ctx || !canvas || cancelled) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update(mouse);
        p.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const resizeObserver = new ResizeObserver(() => {
      init();
    });

    resizeObserver.observe(container);
    container.addEventListener(
      "mousemove",
      handleMouseMove
    );

    // Start: init must finish before animate starts
    const timeoutId = setTimeout(async () => {
      await init();
      if (!cancelled) animate();
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      container.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [typeface.icon]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute top-0 left-0 h-full w-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
}
