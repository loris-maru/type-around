"use client";
import { useRef, useEffect } from "react";

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number = 0;
  vy: number = 0;
  // --- UPDATED: Initial size is now 2x larger ---
  size: number = 1.6;
  baseSize: number = 1.6; // Increased from 0.8 to 1.6
  maxSize: number = 4.5; // Slightly increased to maintain contrast when gathering

  angle: number = Math.random() * Math.PI * 2;
  spin: number = (Math.random() - 0.5) * 0.05;
  distance: number = Math.random() * 45 + 10;
  color: string = "rgba(0, 0, 0, 0.7)"; // Slightly more transparent due to larger size

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
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

    this.angle += this.spin;

    if (distMouse < mouse.radius) {
      // --- ACTIVE STATE (Snap to SVG) ---
      const force = (mouse.radius - distMouse) / mouse.radius;
      const targetX = this.originX;
      const targetY = this.originY;

      this.vx += (targetX - this.x) * 0.15;
      this.vy += (targetY - this.y) * 0.15;

      // Grow towards the maxSize
      const targetSize = this.baseSize + this.maxSize * force;
      this.size += (targetSize - this.size) * 0.2;
    } else {
      // --- IDLE STATE (Loose Revolution) ---
      const idleX = this.originX + Math.cos(this.angle) * this.distance;
      const idleY = this.originY + Math.sin(this.angle) * this.distance;

      this.vx += (idleX - this.x) * 0.02;
      this.vy += (idleY - this.y) * 0.02;

      // Return to the new larger baseSize
      this.size += (this.baseSize - this.size) * 0.05;
    }

    this.vx *= 0.9;
    this.vy *= 0.9;
    this.x += this.vx;
    this.y += this.vy;
  }
}

export default function ParticleSVG() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ADJUST THIS VALUE TO CHANGE SVG SIZE ---
  // Range: 0.1 to 1.0 (0.1 = very small, 1.0 = full screen fit)
  const scaleFactor = 0.9;
  // --------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true,
    });
    if (!ctx) return;

    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 200 }; // Slightly larger radius for the bigger particles

    const init = () => {
      const img = new Image();
      img.src = "/svg/logo.svg";

      img.onload = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        const scale = Math.min(w / img.width, h / img.height) * scaleFactor;
        const xPos = (w - img.width * scale) / 2;
        const yPos = (h - img.height * scale) / 2;

        ctx.drawImage(img, xPos, yPos, img.width * scale, img.height * scale);
        const data = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);

        particles = [];
        // Sample every 4 pixels since particles are larger now (avoids too much overlap)
        for (let y = 0; y < data.height; y += 4) {
          for (let x = 0; x < data.width; x += 4) {
            if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
              particles.push(new Particle(x, y));
            }
          }
        }
      };
    };

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(mouse);
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", init);
    };
  }, [scaleFactor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
