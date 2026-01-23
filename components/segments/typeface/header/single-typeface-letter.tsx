"use client";

import { useRef, useEffect } from "react";
import { Typeface } from "@/types/typefaces";

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

    const init = () => {
      if (!container) return;

      const containerRect =
        container.getBoundingClientRect();
      const w = containerRect.width;
      const h = containerRect.height;

      if (w === 0 || h === 0) {
        return;
      }

      const img = new Image();
      img.src = typeface.icon;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (!container) return;

        const currentRect =
          container.getBoundingClientRect();
        const currentW = currentRect.width;
        const currentH = currentRect.height;

        if (currentW === 0 || currentH === 0) {
          return;
        }

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
              data.data[y * 4 * data.width + x * 4 + 3] >
              128
            ) {
              particles.push(new Particle(x, y));
            }
          }
        }
      };

      img.onerror = () => {
        console.error(
          "Failed to load image:",
          typeface.icon
        );
      };
    };

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(mouse);
        p.draw(ctx);
      });
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

    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 100);

    return () => {
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
      className="relative w-full h-full"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: "transparent" }}
      />
    </div>
  );
}
