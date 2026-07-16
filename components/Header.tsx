"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const mainNav = [
  { label: "WORK", href: "#work" },
  { label: "SYSTEM", href: "#system" },
  { label: "SERVICES", href: "/youtube-channel-management" },
  { label: "COMPANY", href: "/company" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "PROPOSAL", href: "/proposal.html" },
];

const kakaoChatUrl = "https://pf.kakao.com/_dyNPn/chat";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const resolveHref = (href: string) => {
    if (!href.startsWith("#")) return href;
    return isHome ? href : `/${href}`;
  };

  return (
    <header className={`tk-header ${isHome ? "tk-header--home" : "tk-header--inner"} ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-open" : ""}`}>
      <div className="tk-header__inner">
        <Link href="/" className="tk-wordmark" aria-label="턴키하우스 홈">
          <Image
            src={isHome || menuOpen ? "/images/turnkeyhaus-logo-main.png" : "/images/turnkeyhaus-logo-dark.png"}
            alt="턴키하우스 by TKDG"
            width={132}
            height={58}
            priority
          />
        </Link>

        <nav className="tk-header__nav" aria-label="주요 메뉴">
          {mainNav.map((item) => (
            <Link key={item.href} href={resolveHref(item.href)}>{item.label}</Link>
          ))}
        </nav>

        <a className="tk-header__cta" href={kakaoChatUrl} target="_blank" rel="noreferrer">
          카카오톡 상담 <span aria-hidden="true">↗</span>
        </a>

        <button
          type="button"
          className="tk-header__menu"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="tk-mobile-nav" aria-hidden={!menuOpen}>
        <nav aria-label="모바일 메뉴">
          {mainNav.map((item, index) => (
            <Link key={item.href} href={resolveHref(item.href)} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div>
          <a href="mailto:contact@tkdglabs.com">contact@tkdglabs.com</a>
          <a href={resolveHref("#contact")} onClick={() => setMenuOpen(false)}>채널 운영 상담 ↗</a>
        </div>
      </div>
    </header>
  );
}
