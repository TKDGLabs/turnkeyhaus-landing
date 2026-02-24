"use client";

import Spline from "@splinetool/react-spline";

export default function SplineHero() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      <div className="h-full w-full">
        <Spline scene="https://prod.spline.design/zb9htpW08g2kO3Lk/scene.splinecode" />
      </div>
    </div>
  );
}
