'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type CountUpProps = {
  value: number;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
};

export default function CountUp({
  value,
  durationMs = 900,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  const formatter = useMemo(() => {
    if (format) return format;
    return (n: number) =>
      n.toLocaleString(undefined, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      });
  }, [format, decimals]);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;

      setDisplay(current);

      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(to);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [started, value, durationMs]);

  return (
    <span ref={ref}>
      {prefix}
      {formatter(display)}
      {suffix}
    </span>
  );
}
