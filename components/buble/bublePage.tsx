"use client";

import { useEffect, useRef } from "react";

const SPACING = 17;
const MOBILE_SPACING = 20;

const BASE_RADIUS = 1.25;
const SKIP_CHANCE = 0.12;

const IDLE_COLOR: [number, number, number] = [205, 205, 205];
const HOT_COLOR: [number, number, number] = [7, 74, 50];

/* Liquid reaction */
const RIPPLE_RADIUS = 65;
const RIPPLE_WIDTH = 32;
const RIPPLE_STRENGTH = 1.8;

/* Bubble settings */
const MAX_BUBBLES = 80;
const BUBBLE_SPAWN_DISTANCE = 7;

interface Dot {
  x: number;
  y: number;
  size: number;
  flair: number;

  // Animated displacement
  offsetX: number;
  offsetY: number;

  // Current visual intensity
  lit: number;
}

interface Bubble {
  x: number;
  y: number;

  radius: number;

  vx: number;
  vy: number;

  life: number;
  maxLife: number;

  growth: number;

  wobble: number;
  wobbleSpeed: number;

  opacity: number;
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/*
 * Creates a soft ring around the cursor.
 * Unlike the previous version, this is used mainly
 * to PUSH the dots rather than simply enlarge them.
 */
function rippleProfile(distance: number): number {
  return Math.exp(
    -((distance - RIPPLE_RADIUS) ** 2) / (2 * RIPPLE_WIDTH * RIPPLE_WIDTH),
  );
}

export default function BubblePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseRef = useRef({
    x: -9999,
    y: -9999,

    previousX: -9999,
    previousY: -9999,

    velocityX: 0,
    velocityY: 0,
  });

  const dotsRef = useRef<Dot[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);

  const animationRef = useRef<number | null>(null);

  const lastBubbleSpawnRef = useRef(0);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      return;
    }

    const context = canvasElement.getContext("2d");

    if (!context) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;

function buildGrid() {
  const dots: Dot[] = [];

  const isMobile = window.innerWidth < 640;
  const spacing = isMobile ? MOBILE_SPACING : SPACING;

  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (Math.random() < SKIP_CHANCE) {
        continue;
      }

      dots.push({
        x: col * spacing,
        y: row * spacing,

        size: BASE_RADIUS + Math.random() * 0.2,

        flair: 0.7 + Math.random() * 0.8,

        offsetX: 0,
        offsetY: 0,

        lit: 0,
      });
    }
  }

  dotsRef.current = dots;
}

    function resize() {
      const dpr = window.devicePixelRatio || 1;

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildGrid();
    }

    /*
     * Spawn a small collection of bubbles around
     * the cursor's current position.
     */
    function spawnBubbles() {
      const mouse = mouseRef.current;

      const speed = Math.sqrt(
        mouse.velocityX * mouse.velocityX + mouse.velocityY * mouse.velocityY,
      );

      /*
       * Don't create bubbles when the cursor is
       * completely still.
       */
      if (speed < 0.2) {
        return;
      }

      const now = performance.now();

      /*
       * Prevent hundreds of bubbles from being
       * created every frame.
       */
      if (now - lastBubbleSpawnRef.current < 55) {
        return;
      }

      lastBubbleSpawnRef.current = now;

      if (bubblesRef.current.length >= MAX_BUBBLES) {
        return;
      }

      /*
       * Faster mouse movement = slightly more bubbles.
       */
      const count = speed > 8 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;

        const distance = Math.random() * BUBBLE_SPAWN_DISTANCE;

        bubblesRef.current.push({
          x: mouse.x + Math.cos(angle) * distance,

          y: mouse.y + Math.sin(angle) * distance,

          radius: 1.2 + Math.random() * 2.8,

          vx: mouse.velocityX * 0.08 + (Math.random() - 0.5) * 0.35,

          /*
           * Bubbles naturally rise.
           */
          vy: -0.25 - Math.random() * 0.45,

          life: 0,

          maxLife: 900 + Math.random() * 1100,

          growth: 0.01 + Math.random() * 0.018,

          wobble: Math.random() * Math.PI * 2,

          wobbleSpeed: 0.015 + Math.random() * 0.025,

          opacity: 0.35 + Math.random() * 0.35,
        });
      }
    }

    /*
     * Update and render bubbles.
     */
    function drawBubbles() {
      const now = performance.now();

      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const bubble = bubblesRef.current[i];

        bubble.life += 16;

        bubble.x += bubble.vx + Math.sin(bubble.wobble) * 0.12;

        bubble.y += bubble.vy;

        bubble.wobble += bubble.wobbleSpeed;

        bubble.radius += bubble.growth;

        /*
         * Fade in, then fade out.
         */
        const progress = bubble.life / bubble.maxLife;

        let opacity = bubble.opacity;

        if (progress < 0.12) {
          opacity *= progress / 0.12;
        }

        if (progress > 0.7) {
          opacity *= 1 - (progress - 0.7) / 0.3;
        }

        if (bubble.life >= bubble.maxLife) {
          bubblesRef.current.splice(i, 1);
          continue;
        }

        /*
         * Bubble outer ring.
         */
        ctx.beginPath();

        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

        ctx.strokeStyle = `rgba(7, 74, 50, ${opacity})`;

        ctx.lineWidth = 0.8;

        ctx.stroke();

        /*
         * Tiny highlight inside the bubble.
         */
        ctx.beginPath();

        ctx.arc(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          Math.max(0.4, bubble.radius * 0.18),
          0,
          Math.PI * 2,
        );

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;

        ctx.fill();
      }
    }

    /*
     * Draw the dot field.
     */
    function drawDots() {
      const mouse = mouseRef.current;

      for (const dot of dotsRef.current) {
        const dx = dot.x - mouse.x;

        const dy = dot.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        /*
         * Direction from cursor to dot.
         */
        let directionX = 0;
        let directionY = 0;

        if (distance > 0.001) {
          directionX = dx / distance;

          directionY = dy / distance;
        }

        /*
         * Soft circular ripple.
         */
        const ripple = rippleProfile(distance);

        /*
         * Small central "dip".
         */
        const centerDip = Math.exp(-(distance * distance) / (2 * 18 * 18));

        /*
         * Push the dots away from the cursor.
         */
        const push = ripple * RIPPLE_STRENGTH;

        const targetOffsetX =
          directionX * push - mouse.velocityX * centerDip * 0.35;

        const targetOffsetY =
          directionY * push - mouse.velocityY * centerDip * 0.35;

        /*
         * Smooth physical movement.
         */
        dot.offsetX += (targetOffsetX - dot.offsetX) * 0.18;

        dot.offsetY += (targetOffsetY - dot.offsetY) * 0.18;

        /*
         * Slowly return to rest.
         */
        dot.offsetX *= 0.96;
        dot.offsetY *= 0.96;

        /*
         * Intensity is strongest in the ripple.
         */
        const targetLit = ripple * dot.flair;

        dot.lit += (targetLit - dot.lit) * 0.12;

        /*
         * Dots become slightly larger
         * as the ripple passes.
         */
        const radius = dot.size * (1 + dot.lit * 1.2);

        const intensity = Math.max(0, Math.min(1, dot.lit));

        const r = Math.round(mix(IDLE_COLOR[0], HOT_COLOR[0], intensity));

        const g = Math.round(mix(IDLE_COLOR[1], HOT_COLOR[1], intensity));

        const b = Math.round(mix(IDLE_COLOR[2], HOT_COLOR[2], intensity));

        /*
         * Add a tiny organic wobble.
         */
        const wobble =
          Math.sin(performance.now() * 0.002 + dot.x * 0.05) * ripple * 0.5;

        const drawX = dot.x + dot.offsetX + wobble;

        const drawY = dot.y + dot.offsetY;

        if (radius <= 0.05) {
          continue;
        }

        ctx.beginPath();

        ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        ctx.fill();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      spawnBubbles();

      drawDots();

      drawBubbles();

      /*
       * Slowly reduce mouse velocity.
       * This gives the movement a fluid feeling.
       */
      mouseRef.current.velocityX *= 0.88;
      mouseRef.current.velocityY *= 0.88;

      animationRef.current = requestAnimationFrame(draw);
    }

    function handleMouseMove(event: MouseEvent) {
      const bounds = canvas.getBoundingClientRect();

      const x = event.clientX - bounds.left;

      const y = event.clientY - bounds.top;

      const mouse = mouseRef.current;

      if (mouse.x > -9000 && mouse.y > -9000) {
        mouse.velocityX = x - mouse.x;

        mouse.velocityY = y - mouse.y;
      }

      mouse.previousX = mouse.x;

      mouse.previousY = mouse.y;

      mouse.x = x;
      mouse.y = y;
    }

    function handleMouseLeave() {
      mouseRef.current = {
        x: -9999,
        y: -9999,

        previousX: -9999,
        previousY: -9999,

        velocityX: 0,
        velocityY: 0,
      };
    }

    resize();

    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", handleMouseMove);

    canvas.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);

      canvas.removeEventListener("mousemove", handleMouseMove);

      canvas.removeEventListener("mouseleave", handleMouseLeave);

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </main>
  );
}
