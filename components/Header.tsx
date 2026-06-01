"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  // 현재 페이지가 메인 홈인지 확인
  const isHome = pathname === "/";
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 메인 홈이 아니면 스크롤 효과 끄고 항상 활성화
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    // 메인 홈일 때만 스크롤 감지
    setIsScrolled(window.scrollY > 50);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? isScrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-black/5"
            : "bg-transparent"
          : "bg-white border-b border-black/10"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          {/* 스크롤 상태에 따라 로고 색상(하얀색 vs 검은색) 자동 변경 */}
          <Image
            src={isHome && !isScrolled ? "/images/turnkeyhaus-logo-white.png" : "/images/turnkeyhaus-logo-dark.png"}
            alt="Turnkeyhaus Logo"
            width={140}
            height={24}
            className="w-auto h-5 md:h-6 object-contain transition-opacity"
            priority
          />
        </Link>
        <nav className="flex items-center gap-5 md:gap-8">
          <Link
            href="/store"
            className={`text-[13px] md:text-[14px] font-bold tracking-wide transition-colors ${
              isHome && !isScrolled ? "text-white/90 hover:text-white" : "text-[#0B0F0E]/70 hover:text-[#0B0F0E]"
            }`}
          >
            STORE
          </Link>
          <Link
            href="/blog"
            className={`text-[13px] md:text-[14px] font-bold tracking-wide transition-colors hidden sm:block ${
              isHome && !isScrolled ? "text-white/90 hover:text-white" : "text-[#0B0F0E]/70 hover:text-[#0B0F0E]"
            }`}
          >
            INSIGHT
          </Link>
          <Link
            href="/#contact"
            className={`flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-bold transition-all ${
              isHome && !isScrolled
                ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
                : "bg-[#21c1a2] text-[#07211d] hover:scale-[1.02] shadow-sm"
            }`}
          >
            문의하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
