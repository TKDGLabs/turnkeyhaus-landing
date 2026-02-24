"use client";

import Spline from "@splinetool/react-spline/next";

export default function SplineHero() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none hidden md:block" aria-hidden="true">
      <Spline scene="https://prod.spline.design/zb9htpW08g2kO3Lk/scene.splinecode" />
    </div>
  );
}
