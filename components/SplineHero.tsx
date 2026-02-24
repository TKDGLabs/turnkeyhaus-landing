"use client";

import Spline from "@splinetool/react-spline";

export default function SplineHero() {
  return (
    <div className="absolute inset-0 -z-10 hidden md:block pointer-events-none">
      <Spline scene="https://prod.spline.design/zb9htpW08g2kO3Lk/scene.splinecode" />
    </div>
  );
}
