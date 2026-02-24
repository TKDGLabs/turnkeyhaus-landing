"use client";

import Image from "next/image";
import { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      aria-hidden="true"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/showreel-cover.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[112%] w-[128%] -translate-x-1/2 -translate-y-1/2">
            <Spline
              scene="https://prod.spline.design/zb9htpW08g2kO3Lk/scene.splinecode"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
