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
  const labelRef = useRef("");

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");

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
      }

      const cursorLabel = element?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      if (labelRef.current !== cursorLabel) {
        labelRef.current = cursorLabel;
        setLabel(cursorLabel);
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
        const size = labelRef.current ? 68 : 40;
        cursorRef.current.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(${activeRef.current ? 1.08 : 1})`;
        cursorRef.current.style.width = `${size}px`;
        cursorRef.current.style.height = `${size}px`;
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
        className={`pointer-events-none fixed left-0 top-0 z-[140] hidden h-10 w-10 items-center justify-center rounded-full border border-[#21c1a2]/55 bg-[#0b0b0a]/70 text-[9px] font-bold tracking-[0.12em] text-white backdrop-blur-md transition-[opacity,width,height] duration-200 md:flex ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {label}
      </div>
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[141] hidden h-1.5 w-1.5 rounded-full bg-[#21c1a2] transition-opacity duration-150 md:block ${
          visible && !label ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </>
  );
}
