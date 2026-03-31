"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplineHero() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [canRenderSpline, setCanRenderSpline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(min-width: 768px)");
    const syncDesktop = () => setIsDesktop(media.matches);
    syncDesktop();

    if ("addEventListener" in media) {
      media.addEventListener("change", syncDesktop);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = Reflect.get(navigator, "connection");
    const saveData =
      typeof connection === "object" &&
      connection !== null &&
      Reflect.get(connection, "saveData") === true;

    let timer: number | null = null;
    if (!reduceMotion && !saveData) {
      timer = window.setTimeout(() => setCanRenderSpline(true), 120);
    }

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      if ("removeEventListener" in media) {
        media.removeEventListener("change", syncDesktop);
      }
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      {!canRenderSpline ? (
        <Image
          src="/images/showreel-cover-optimized.jpg"
          alt="Turnkeyhaus hero fallback"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : null}

      {canRenderSpline ? (
        <iframe
          src="https://my.spline.design/statisticscolumns-gzsp5KbIvLR1IJUmAZZ0SEpP/"
          title="Turnkeyhaus hero spline background"
          className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 border-0"
          loading="eager"
        />
      ) : null}
    </div>
  );
}
