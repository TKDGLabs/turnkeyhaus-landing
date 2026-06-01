"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { content } from "../content";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21c1a2]";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 메인 홈이 아닐 때는 스크롤 감지 없이 항상 상단바 고정 노출
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    // 홈 화면일 때만 스크롤 감지 (영상이 끝나는 시점 근처에서 나타나도록 설정)
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isHome
          ? isScrolled
            ? "translate-y-0 opacity-100 bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm text-[#0B0F0E]"
            : "-translate-y-full opacity-0 pointer-events-none" // ✨ 홈화면 영상 재생 중엔 아예 흔적도 없이 숨김
          : "translate-y-0 opacity-100 bg-white border-b border-black/10 text-[#0B0F0E]" // ✨ 스토어 등 타 페이지에선 상시 고정 노출
      }`}
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-10 flex h-[60px] md:h-20 items-center justify-between">
        {/* 로고 영역 */}
        <Link href="/" className={`inline-flex items-center ${focusRing}`}>
          <Image 
            src="/logo.png" 
            alt="Turnkeyhaus" 
            width={140} 
            height={38} 
            className="h-6 md:h-8 w-auto object-contain" 
            priority 
          />
        </Link>

        {/* 100% 복구된 원래 메뉴 구성 (타 페이지 이동 시 링크 깨짐 방지 튜닝 포함) */}
        <nav className="hidden items-center gap-8 lg:flex">
          {content.nav.map((item) => {
            // 다른 페이지(스토어 등)에서 홈화면 메뉴 클릭 시 메인으로 튕겨주도록 처리
            const hrefTarget = isHome ? item.href : (item.href.startsWith("#") ? `/${item.href}` : item.href);
            return (
              <Link 
                key={item.href} 
                href={hrefTarget} 
                className={`text-[14px] font-bold text-black/60 hover:text-[#21c1a2] transition-colors ${focusRing}`}
              >
                {item.label}
              </Link>
            );
          })}
          {/* 스토어 페이지가 아닐 때만 메뉴에 스토어 링크 추가 노출 */}
          {!isHome && (
            <Link 
              href="/store" 
              className={`text-[14px] font-bold text-black/60 hover:text-[#21c1a2] transition-colors ${focusRing}`}
            >
              스토어
            </Link>
          )}
        </nav>

        {/* 100% 복구된 오른쪽 [공식 제안서] 버튼 */}
        <div className="flex items-center gap-2">
          <a 
            href="https://www.turnkey.haus/proposal.html" 
            target="_blank" 
            rel="noreferrer" 
            className={`inline-flex h-9 md:h-10 items-center rounded-full bg-[#21c1a2] px-5 md:px-6 text-[13px] md:text-[14px] font-bold text-black transition-transform hover:scale-105 ${focusRing}`}
          >
            공식 제안서
          </a>
        </div>
      </div>
    </header>
  );
}
