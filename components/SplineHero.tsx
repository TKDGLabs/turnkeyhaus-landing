"use client";

export default function SplineHero() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      {/* centered frame with gutters to avoid oversized/cropped look */}
      <div className="absolute inset-0 flex items-center justify-center px-8 py-8 lg:px-14 lg:py-10">
        <div className="relative h-full w-full max-h-[700px] max-w-[1180px] overflow-hidden">
          <iframe
            src="https://my.spline.design/statisticscolumns-gzsp5KbIvLR1IJUmAZZ0SEpP/"
            title="Turnkeyhaus hero spline background"
            className="h-full w-full origin-center scale-[0.94] border-0"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
