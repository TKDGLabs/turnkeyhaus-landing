"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type IntroGateProps = {
  logoSrc: string;
  logoAlt: string;
  title: string;
  subtitle: string;
};

const STORAGE_KEY = "turnkeyhaus_intro_seen_v1";
const SHOW_MS = 1300;
const FADE_MS = 420;

export default function IntroGate({ logoSrc, logoAlt, title, subtitle }: IntroGateProps) {
  const [phase, setPhase] = useState<"checking" | "visible" | "fading" | "hidden">("checking");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("hidden");
      return;
    }

    const seen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    if (seen) {
      setPhase("hidden");
      return;
    }

    setPhase("visible");
    const showTimer = window.setTimeout(() => setPhase("fading"), SHOW_MS);
    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("hidden");
    }, SHOW_MS + FADE_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "visible") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
        setPhase("hidden");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  const isOpen = useMemo(() => phase === "visible" || phase === "fading", [phase]);
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-white transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(STORAGE_KEY, "1");
        }
        setPhase("hidden");
      }}
    >
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <div className="mx-auto mb-8 w-fit rounded-2xl border border-black/10 bg-white px-6 py-4 shadow-[0_8px_24px_rgba(11,15,14,0.06)]">
          <Image src={logoSrc} alt={logoAlt} width={188} height={52} className="h-12 w-auto object-contain" priority />
        </div>

        <p className="text-[30px] font-semibold leading-[1.2] tracking-tight text-[#0B0F0E] md:text-[44px]">
          {title}
        </p>
        <p className="mt-3 text-base leading-[1.8] text-black/65 md:text-lg">{subtitle}</p>
      </div>
    </div>
  );
}
