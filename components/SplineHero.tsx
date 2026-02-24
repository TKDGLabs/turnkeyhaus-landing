"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />
});

export default function SplineHero() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      {/* Keep Spline centered in a fixed frame so it doesn't feel left-biased on wide screens */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1240px] -translate-x-1/2 px-10 lg:px-16">
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute inset-0 scale-[1.28] origin-center">
            <Spline
              scene="https://prod.spline.design/zb9htpW08g2kO3Lk/scene.splinecode"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
