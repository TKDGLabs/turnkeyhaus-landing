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
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2 px-12 lg:px-24">
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute inset-0 translate-x-[10%] scale-[1.08]">
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
