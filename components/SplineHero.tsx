"use client";

import Spline from "@splinetool/react-spline";

export default function SplineHero() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      {/* centered frame + side gutters to avoid left-heavy composition */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2 px-12 lg:px-24">
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute inset-0 translate-x-[10%] scale-[1.08]">
            <Spline scene="https://prod.spline.design/zb9htpW08g2kO3Lk/scene.splinecode" />
          </div>
        </div>
      </div>
    </div>
  );
}
