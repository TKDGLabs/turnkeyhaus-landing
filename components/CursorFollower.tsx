"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const visibleRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || noMotion) return;

    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      targetX.current = event.clientX;
      targetY.current = event.clientY;

      if (!visibleRef.current) {
        currentX.current = event.clientX;
        currentY.current = event.clientY;
        visibleRef.current = true;
        setVisible(true);
      }

      const element = event.target as HTMLElement | null;
      const interactive = element?.closest("a, button, [role='button'], input, textarea, select");
      const nextActive = Boolean(interactive);
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const tick = () => {
      currentX.current += (targetX.current - currentX.current) * 0.18;
      currentY.current += (targetY.current - currentY.current) * 0.18;

      const x = currentX.current;
      const y = currentY.current;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x - 20}px, ${y - 20}px, 0) scale(${activeRef.current ? 1.15 : 1})`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed left-0 top-0 z-[140] hidden h-10 w-10 rounded-full border border-[#21c1a2]/45 bg-[#21c1a2]/10 transition-opacity duration-200 md:block ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[141] hidden h-1.5 w-1.5 rounded-full bg-[#21c1a2] transition-opacity duration-150 md:block ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </>
  );
}
