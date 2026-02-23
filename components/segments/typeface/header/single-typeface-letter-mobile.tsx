"use client";

import { useEffect, useRef } from "react";
import type { Typeface } from "@/types/typefaces";

/**
 * Mobile particle: responds to beta (vertical tilt).
 * spreadFactor 0 = regrouped at origin (sharp image)
 * spreadFactor 1 = spread outward
 */
class ParticleMobile {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number = 0;
  vy: number = 0;
  size: number = 1.6;
  baseSize: number = 1.6;
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

  update(spreadFactor: number) {
    this.angle += this.spin;

    // spreadFactor 0 = at origin (sharp), 1 = full spread
    const targetDistance = this.distance * spreadFactor;
    const idleX =
      this.originX + Math.cos(this.angle) * targetDistance;
    const idleY =
      this.originY + Math.sin(this.angle) * targetDistance;

    this.vx += (idleX - this.x) * 0.08;
    this.vy += (idleY - this.y) * 0.08;

    // Size: smaller when regrouped, larger when spread
    const targetSize =
      this.baseSize + this.baseSize * 1.5 * spreadFactor;
    this.size += (targetSize - this.size) * 0.05;

    this.vx *= 0.88;
    this.vy *= 0.88;

    this.x += this.vx;
    this.y += this.vy;
  }
}

const scaleFactor = 0.9;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image: ${src}`));
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        (
          img as HTMLImageElement & { _blobUrl?: string }
        )._blobUrl = url;
        img.src = url;
      })
      .catch(() => {
        img.crossOrigin = "anonymous";
        img.src = src;
      });
  });
}

/**
 * Beta to spreadFactor: tilt up (beta negative, top away) -> sharp, tilt down (beta positive, top toward user) -> spread
 * beta -90 = sharp, beta 90 = max spread
 */
function betaToSpreadFactor(beta: number): number {
  const clamped = Math.max(-90, Math.min(90, beta ?? 0));
  return (clamped + 90) / 180;
}

export default function SingleTypefaceLetterMobile({
  typeface,
  beta,
}: {
  typeface: Typeface;
  beta: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const betaRef = useRef(beta);

  useEffect(() => {
    betaRef.current = beta;
  }, [beta]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true,
    });
    if (!ctx) return;

    let particles: ParticleMobile[] = [];
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
            particles.push(new ParticleMobile(x, y));
          }
        }
      }
    };

    function animate() {
      if (!ctx || !canvas || cancelled) return;
      const spreadFactor = betaToSpreadFactor(
        betaRef.current
      );
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update(spreadFactor);
        p.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(() => {
      init();
    });

    resizeObserver.observe(container);

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
