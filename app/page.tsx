"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import Lenis from "lenis";
import { content } from "../content";
import { insights } from "../content/insights";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 42 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const process = [
  ["01", "상태 진단", "최근 지표와 검색 유입, 상담 동선에서 먼저 막힌 지점을 찾습니다."],
  ["02", "목표 편성", "채널의 목표와 고객 질문을 월간 주제와 업로드 우선순위로 묶습니다."],
  ["03", "기획/구성", "전문가의 말투는 살리고, 핵심 답변과 화면 구성을 촬영 전에 설계합니다."],
  ["04", "촬영 및 편집", "출연자는 설명에 집중하고, 제작팀은 현장 운영부터 후반 편집까지 맡습니다."],
  ["05", "콘텐츠 발행", "제목·썸네일·설명란·재생목록까지 발견되는 구조로 세팅합니다."],
  ["06", "성과 체크", "클릭·이탈·상담 반응을 함께 기록해 어떤 형식이 작동했는지 확인합니다."],
  ["07", "결정 및 변경", "결과를 바탕으로 다음 달 주제와 제목, 썸네일의 우선순위를 조정합니다."],
] as const;

const marqueeLabels = ["CHANNEL STRATEGY", "CONTENT PLANNING", "PRE-PRODUCTION", "PRODUCTION", "POST-PRODUCTION", "PUBLISHING", "PERFORMANCE REVIEW"] as const;

const videoWallItems = [
  { id: "ajOQC_X-5bE", channel: "주치아 앞선tube", title: "치과에서 가장 많이 묻는 질문을 먼저 설명합니다", format: "LONG" },
  { id: "uvyvdcKhPfQ", channel: "주치아 앞선tube", title: "임플란트와 치아교정 중 무엇이 먼저일까?", format: "Q&A" },
  { id: "Z28SynBFHkY", channel: "주치아 앞선tube", title: "보철물을 오래 쓰는 방법", format: "SHORTS" },
  { id: "etfjuKwPKaA", channel: "주치아 앞선tube", title: "치과 엑스레이를 보는 방법", format: "SHORTS" },
  { id: "ce7TuHzZSPU", channel: "주치아 앞선tube", title: "빠진 보철물을 다시 살릴 수 있을까?", format: "LONG" },
  { id: "to3V-CihU1k", channel: "주치아 앞선tube", title: "구강세정기는 무엇을 골라야 할까?", format: "SHORTS" },
  { id: "mozP07dCcuk", channel: "법 잘하는 변호사들 로맨즈", title: "사건 분야별 질문을 상담 전 콘텐츠로 바꿉니다", format: "LONG" },
  { id: "uDAmkVy6Fa8", channel: "법 잘하는 변호사들 로맨즈", title: "통장협박 피해를 막는 방법", format: "ISSUE" },
  { id: "KLpXK7KxHks", channel: "법 잘하는 변호사들 로맨즈", title: "사회 이슈를 법률 기준으로 설명합니다", format: "ISSUE" },
  { id: "oRm6S4iGNng", channel: "법 잘하는 변호사들 로맨즈", title: "이혼소송에서 인정되는 증거", format: "Q&A" },
  { id: "YT84DBAbsro", channel: "법 잘하는 변호사들 로맨즈", title: "업무방해죄 처벌과 대응 전략", format: "Q&A" },
  { id: "zKdsnm68ekE", channel: "법 잘하는 변호사들 로맨즈", title: "AI 시대에도 변호사가 필요한 이유", format: "ISSUE" },
  { id: "Fii93LBGjSY", channel: "유안티비", title: "검색 질문과 내원 전 설명을 연결합니다", format: "LONG" },
  { id: "pmGbUvESwt8", channel: "유안티비", title: "비만 치료에서 놓치면 안 되는 기준", format: "SHORTS" },
  { id: "fBYHRVd6JLs", channel: "유안티비", title: "중년 다이어트 질문을 쉽게 풀어냅니다", format: "LONG" },
  { id: "_2n62t4Oizc", channel: "유안티비", title: "노화의 파도를 예방하는 방법", format: "Q&A" },
  { id: "DLpcIyM_PWs", channel: "유안티비", title: "위고비와 마운자로의 차이", format: "Q&A" },
  { id: "9PvkvmHQqUc", channel: "유안티비", title: "주사피부염 환자가 피해야 할 음식", format: "SHORTS" },
  { id: "CHCmberPV4o", channel: "홍승표의 뼈탐구생활", title: "정형외과 전문 지식을 쉽게 시작하는 첫 화", format: "NEW SERIES" },
  { id: "UwJ3IwkDqlU", channel: "김준식의 장례수업", title: "낯선 장례 절차를 한 가지 질문으로 설명합니다", format: "VERTICAL" },
] as const;

const videoArchiveGroups = [
  {
    key: "dental",
    area: "DENTAL",
    name: "주치아 앞선tube",
    description: "치과 진료의 판단 기준을 환자가 이해하는 언어로 풀어낸 채널",
    items: videoWallItems.filter((item) => item.channel === "주치아 앞선tube"),
  },
  {
    key: "law",
    area: "LAW",
    name: "법 잘하는 변호사들 로맨즈",
    description: "복잡한 사건과 대응 기준을 상담 전에 이해할 수 있도록 정리한 채널",
    items: videoWallItems.filter((item) => item.channel === "법 잘하는 변호사들 로맨즈"),
  },
  {
    key: "medical",
    area: "MEDICAL",
    name: "유안티비",
    description: "질환과 치료에 대한 궁금증을 생활 속 질문부터 풀어낸 채널",
    items: videoWallItems.filter((item) => item.channel === "유안티비"),
  },
  {
    key: "bone-life",
    area: "ORTHOPEDICS",
    name: "홍승표의 뼈탐구생활",
    description: "정형외과 전문 지식을 첫 방문자의 질문에서 시작하는 채널",
    items: videoWallItems.filter((item) => item.channel === "홍승표의 뼈탐구생활"),
  },
  {
    key: "funeral-class",
    area: "FUNERAL CULTURE",
    name: "김준식의 장례수업",
    description: "낯선 장례 절차를 실제 상황별 질문으로 설명하는 채널",
    items: videoWallItems.filter((item) => item.channel === "김준식의 장례수업"),
  },
] as const;

const formatNumber = (value: number) => new Intl.NumberFormat("ko-KR").format(value);

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      variants={reveal}
    >
      {children}
    </motion.div>
  );
}

function SectionMeta({ index, label, dark = false }: { index: string; label: string; dark?: boolean }) {
  return (
    <div className={`tk-section-meta ${dark ? "tk-section-meta--dark" : ""}`}>
      <span>{index}</span>
      <span>{label}</span>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Page() {
  const featured = content.portfolio.items;
  const coreCases = featured.filter((item) => item.caseType !== "format");
  const formatCases = featured.filter((item) => item.caseType === "format");
  const totalSubscribers = coreCases.reduce((sum, item) => sum + item.subscriberCurrent, 0);
  const latestInsights = insights.slice(0, 3);
  const heroRef = useRef<HTMLElement | null>(null);
  const [playHeroVideo, setPlayHeroVideo] = useState(false);
  const [showContactDock, setShowContactDock] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selectedArchive, setSelectedArchive] = useState(0);
  const activeArchive = videoArchiveGroups[selectedArchive];
  const { scrollYProgress: pageProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smoothPageProgress = useSpring(pageProgress, { stiffness: 120, damping: 28, mass: 0.35 });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.1]);
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, -90]);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.72, 1], [1, 0.92, 0]);

  useEffect(() => {
    const wideScreen = window.matchMedia("(min-width: 761px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    setPlayHeroVideo(wideScreen.matches && !reducedMotion.matches && !connection?.saveData);
  }, []);

  useEffect(() => {
    const wideScreen = window.matchMedia("(min-width: 761px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wideScreen.matches || reducedMotion.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.86,
      syncTouch: false,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowContactDock(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (selectedPerson === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPerson(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPerson]);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.slice(0, 7).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main id="main-content" className="tk-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <motion.div className="tk-page-progress" style={{ scaleX: smoothPageProgress }} aria-hidden="true" />

      <section ref={heroRef} id="top" className="tk-hero" aria-labelledby="hero-title">
        <div className="tk-hero__stage">
          <motion.div className="tk-hero__media" style={{ scale: heroScale }}>
            {!playHeroVideo ? (
              <Image
                src="/images/turnkeyhaus-hq-building.jpg"
                alt="턴키하우스 사옥 전경"
                fill
                priority
                sizes="100vw"
                className="tk-hero__poster"
              />
            ) : null}
            {playHeroVideo ? (
              <video
                className="tk-hero__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/turnkeyhaus-hq-building.jpg"
              >
                <source src="/videos/turnkeyhaus-office-hero-cut.mp4" type="video/mp4" />
              </video>
            ) : null}
          </motion.div>
          <div className="tk-hero__veil" />

          <motion.div className="tk-hero__inner" style={{ y: heroCopyY, opacity: heroCopyOpacity }}>
            <h1 id="hero-title" className="tk-hero__title">
              <span className="tk-hero__line"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.12, ease }}>콘텐츠를 만들고</motion.span></span>
              <span className="tk-hero__line tk-hero__title-accent"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.22, ease }}>채널까지 <span className="tk-nowrap">움직입니다.</span></motion.span></span>
              <motion.span className="tk-hero__byline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.42, ease }}>by TKDG</motion.span>
            </h1>

            <div className="tk-hero__bottom">
              <p>전문직·고관여 브랜드의 유튜브를 기획부터 촬영과 발행<br className="tk-desktop-break" /> 다음 달 운영 판단까지 한 팀이 맡습니다.</p>
              <div className="tk-hero__actions">
                <a className="tk-hero__primary" href="#contact">채널 운영 상담 <Arrow /></a>
                <a className="tk-text-link tk-text-link--light" href="#work">대표 운영 사례 <Arrow /></a>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <div className="tk-marquee" aria-hidden="true">
        <div className="tk-marquee__track">
          {[0, 1].map((group) => (
            <div className="tk-marquee__group" key={group}>
              {[0, 1, 2, 3].flatMap((cycle) => marqueeLabels.map((label) => <span key={`${cycle}-${label}`}>{label}<i /></span>))}
            </div>
          ))}
        </div>
      </div>

      <section className="tk-intro">
        <div className="tk-shell">
          <SectionMeta index="01" label="WHAT WE DO" />
          <Reveal className="tk-intro__grid">
            <h2>전문성을 사람들이 이해하고<br />선택할 수 있는 콘텐츠로 만듭니다.</h2>
            <div className="tk-intro__copy">
              <p>
                영상 한 편을 예쁘게 만드는 일과 채널을 꾸준히 움직이는 일은 다릅니다.
                턴키하우스는 주제, 출연자, 촬영, 편집, 배포, 데이터가 같은 방향으로 움직이게 합니다.
              </p>
              <p>
                원장님과 변호사님, 대표님은 자신의 일에 집중하고,
                매달 반복되는 운영 실무는 저희가 맡습니다.
              </p>
            </div>
          </Reveal>

          <Reveal className="tk-stats" aria-label="대표 운영 성과">
            <div><strong>5개사 이상</strong><span>현재 파트너</span></div>
            <div><strong>{formatNumber(totalSubscribers)}</strong><span>사례 채널 누적 구독자</span></div>
            <div><strong>2,020만+</strong><span>누적 영상 조회</span></div>
            <div><strong>2016—현재</strong><span>유튜브 운영 경력</span></div>
          </Reveal>
        </div>
      </section>

      <section id="work" className="tk-work">
        <div className="tk-shell">
          <SectionMeta index="02" label="SELECTED WORK" dark />
          <Reveal className="tk-work__heading">
            <h2>결과만 보여주지 않습니다.<br />무엇을 맡았는지 함께 보여드립니다.</h2>
            <p>대표 운영 사례 {coreCases.length}건 / 신규 포맷 {formatCases.length}건</p>
          </Reveal>

          <div className="tk-projects">
            {coreCases.map((item, index) => {
              const media = item.youtubeId
                ? `https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg`
                : item.imageSrc;
              return (
                <Reveal key={item.title} className={`tk-project tk-project--${index + 1}`}>
                  <Link href={`/cases/${item.caseSlug}`} className="tk-project__link" aria-label={`${item.clientName} 사례 자세히 보기`} data-cursor="VIEW">
                    <motion.figure
                      className="tk-project__media"
                      initial={{ clipPath: "inset(9% 0 9% 0)" }}
                      whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
                      viewport={{ once: true, amount: 0.18 }}
                      transition={{ duration: 1.05, ease }}
                    >
                      <Image
                        src={media}
                        alt={`${item.clientName} 유튜브 운영 사례`}
                        fill
                        sizes={index === 0 || index === 3 ? "100vw" : "(max-width: 800px) 100vw, 50vw"}
                        className="tk-project__image"
                      />
                      <span className="tk-project__number">0{index + 1}</span>
                      <span className="tk-project__view">VIEW CASE <Arrow /></span>
                    </motion.figure>
                    <div className="tk-project__caption">
                      <div>
                        <p>{item.clientName}</p>
                        <h3>{item.title}</h3>
                      </div>
                      <div className="tk-project__result">
                        <span>{item.oneLiner}</span>
                        <strong>{item.result}</strong>
                      </div>
                    </div>
                    <dl className="tk-project__evidence" aria-label={`${item.clientName} 운영 전후 요약`}>
                      <div><dt>BEFORE</dt><dd>{item.before}</dd></div>
                      <div><dt>ACTION</dt><dd>{item.action}</dd></div>
                      <div><dt>AFTER</dt><dd>{item.after}</dd></div>
                    </dl>
                  </Link>
                </Reveal>
              );
            })}
          </div>

        </div>

        <div className="tk-publishing-index" aria-labelledby="publishing-index-title">
          <div className="tk-shell">
            <Reveal className="tk-publishing-index__heading">
              <div><p>PUBLISHING ARCHIVE</p><span>CURATED CHANNEL WORK</span></div>
              <h3 id="publishing-index-title">채널마다 목적에 맞는<br />영상 흐름을 설계합니다.</h3>
              <p>영상 수만 늘리지 않습니다. 채널별 발행 의도와 실제 포맷을 함께 보여드립니다.</p>
            </Reveal>

            <div className="tk-publishing-index__layout">
              <div className="tk-publishing-index__channels" role="tablist" aria-label="운영 채널 선택">
                {videoArchiveGroups.map((group, index) => (
                  <button
                    type="button"
                    role="tab"
                    id={`publishing-tab-${group.key}`}
                    aria-selected={selectedArchive === index}
                    aria-controls="publishing-index-panel"
                    className={selectedArchive === index ? "is-active" : ""}
                    onClick={() => setSelectedArchive(index)}
                    key={group.key}
                  >
                    <span>0{index + 1}</span>
                    <div><em>{group.area}</em><strong>{group.name}</strong></div>
                    <i aria-hidden="true">↗</i>
                  </button>
                ))}
              </div>

              <div className="tk-publishing-index__panel" id="publishing-index-panel" role="tabpanel" aria-labelledby={`publishing-tab-${activeArchive.key}`}>
                <div className="tk-publishing-index__panel-head">
                  <div><em>{activeArchive.area}</em><h4>{activeArchive.name}</h4></div>
                  <p>{activeArchive.description}</p>
                </div>

                <a className="tk-publishing-feature" href={`https://youtu.be/${activeArchive.items[0].id}`} target="_blank" rel="noreferrer">
                  <figure>
                    <Image src={`https://i.ytimg.com/vi/${activeArchive.items[0].id}/maxresdefault.jpg`} alt={`${activeArchive.items[0].title} 유튜브 영상 썸네일`} fill sizes="(max-width: 760px) 100vw, 56vw" loading="eager" unoptimized />
                    <span>대표 영상 재생 <Arrow /></span>
                  </figure>
                  <div><em>{activeArchive.items[0].format}</em><strong>{activeArchive.items[0].title}</strong></div>
                </a>

                <div className="tk-publishing-filmstrip" aria-label={`${activeArchive.name} 발행 영상`}>
                  {activeArchive.items.slice(1).map((item) => (
                    <a href={`https://youtu.be/${item.id}`} target="_blank" rel="noreferrer" key={item.id} aria-label={`${item.title} 유튜브에서 보기`}>
                      <figure><Image src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt={`${item.title} 유튜브 영상 썸네일`} width={320} height={180} sizes="(max-width: 760px) 62vw, 16vw" loading="eager" unoptimized /></figure>
                      <em>{item.format}</em>
                      <strong>{item.title}</strong>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="system" className="tk-system">
        <div className="tk-shell">
          <SectionMeta index="03" label="ONE OPERATING SYSTEM" />
          <div className="tk-system__top">
            <Reveal>
              <h2>기획부터 발행까지<br />하나의 팀이 끝까지 맡습니다.</h2>
            </Reveal>
            <Reveal className="tk-system__lead">
              <p>담당자가 바뀔 때마다 맥락을 다시 설명하지 않도록, 처음 진단한 사람이 발행과 리뷰까지 함께 봅니다.</p>
            </Reveal>
          </div>

          <div className="tk-process">
            {process.map(([number, title, body]) => (
              <Reveal className="tk-process__row" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="tk-team" aria-labelledby="team-title">
        <div className="tk-shell">
          <SectionMeta index="04" label="THE OPERATING TEAM" />
          <Reveal className="tk-team__heading">
            <h2 id="team-title">처음 만난 팀이<br />운영까지 함께합니다.</h2>
            <p>전략·채널 운영·촬영 책임자를 고정합니다.<br className="tk-desktop-break" />매달 같은 설명을 반복하지 않아도 됩니다.</p>
          </Reveal>
          <div className="tk-team__list">
            {content.leadership.people.map((person, index) => (
              <Reveal key={person.name}>
                <button type="button" className="tk-team-member" onClick={() => setSelectedPerson(index)} aria-label={`${person.name} 경력과 학력 보기`}>
                  <span>0{index + 1}</span>
                  <figure>
                    <Image src={person.image.src} alt={person.image.alt} fill sizes="(max-width: 760px) 42vw, 250px" />
                  </figure>
                  <div className="tk-team-member__identity">
                    <p>{person.role}</p>
                    <h3>{person.name}</h3>
                    <small>경력·학력 보기 ↗</small>
                  </div>
                  <div className="tk-team-member__detail">
                    <p>{person.body}</p>
                    <ul>{person.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selectedPerson !== null ? (
        <div className="tk-profile-modal" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedPerson(null);
        }}>
          <section className="tk-profile-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
            <button type="button" className="tk-profile-modal__close" onClick={() => setSelectedPerson(null)} aria-label="프로필 닫기" autoFocus>CLOSE <span aria-hidden="true">×</span></button>
            <div className="tk-profile-modal__intro">
              <figure>
                <img
                  src={content.leadership.people[selectedPerson].image.src}
                  alt={content.leadership.people[selectedPerson].image.alt}
                  width="1080"
                  height="1350"
                  loading="eager"
                />
              </figure>
              <div className="tk-profile-modal__copy">
                <div className="tk-profile-modal__role"><i>0{selectedPerson + 1}</i><p>{content.leadership.people[selectedPerson].role}</p></div>
                <h2 id="profile-modal-title">{content.leadership.people[selectedPerson].name}</h2>
                <span>{content.leadership.people[selectedPerson].englishName}</span>
                <strong>{content.leadership.people[selectedPerson].body}</strong>
                <ul className="tk-profile-modal__responsibilities">
                  {content.leadership.people[selectedPerson].responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div className="tk-profile-modal__specs">
              {content.leadership.people[selectedPerson].specs.map((spec) => (
                <div key={spec.category}>
                  <p>{spec.category}</p>
                  <ul>{spec.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      <section id="risk" className="tk-risk" aria-labelledby="risk-title">
        <div className="tk-shell">
          <SectionMeta index="05" label="RISK MANAGEMENT" dark />
          <Reveal className="tk-risk__heading">
            <h2 id="risk-title">전문 분야는 잘 찍는 것만큼<br />잘못 말하지 않는 일이 중요합니다.</h2>
            <p>{content.riskManagement.lead}</p>
          </Reveal>
          <div className="tk-risk__list">
            {content.riskManagement.items.map((item, index) => (
              <Reveal className="tk-risk__row" key={item}>
                <span>0{index + 1}</span><p>{item}</p>
              </Reveal>
            ))}
          </div>
          <p className="tk-risk__note">{content.riskManagement.note}</p>
        </div>
      </section>

      <section id="services" className="tk-services">
        <div className="tk-shell">
          <SectionMeta index="06" label="SERVICES" />
          <Reveal className="tk-services__heading">
            <h2>외부 채널 운영부터<br />사내 제작팀 구축까지 함께합니다.</h2>
          </Reveal>

          <div className="tk-service-list">
            {content.servicePillars.cards.map((service, index) => (
              <Reveal key={service.title}>
                <Link href={service.href} className="tk-service-row">
                  <span className="tk-service-row__index">0{index + 1}</span>
                  <div>
                    <p>{service.title}</p>
                    <h3>{service.headline}</h3>
                  </div>
                  <p className="tk-service-row__body">{service.body}</p>
                  <span className="tk-service-row__arrow"><Arrow /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link href="/youtube-channel-management" className="tk-services__all">유튜브 채널 운영 범위 자세히 보기 <Arrow /></Link>
        </div>
      </section>

      <section className="tk-studio" aria-labelledby="studio-title">
        <div className="tk-studio__image">
          <Image src="/images/studio-1.jpg" alt="턴키하우스 촬영 현장" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="tk-studio__overlay" />
        <div className="tk-studio__content tk-shell">
          <SectionMeta index="07" label="PRODUCTION" dark />
          <Reveal>
            <p className="tk-studio__kicker">PLAN BEFORE CAMERA</p>
            <h2 id="studio-title">카메라를 켜기 전에<br />말할 이유부터 정리합니다.</h2>
            <p>촬영 전 질문지와 구성, 현장 동선, 검수 기준을 먼저 맞춥니다.<br />좋은 장비는 기본입니다. 전문가가 편하게 말할 수 있는 준비가 결과를 바꿉니다.</p>
          </Reveal>
          <div className="tk-studio__facts">
            <span>멀티캠 촬영</span><span>인물 조명</span><span>현장 디렉팅</span><span>후반 편집</span><span>썸네일·발행</span>
          </div>
        </div>
      </section>

      <section id="showreel" className="tk-showreel" aria-labelledby="showreel-title">
        <div className="tk-shell">
          <SectionMeta index="08" label="TURNKEYHAUS INTRO FILM" />
          <Reveal className="tk-showreel__heading">
            <h2 id="showreel-title">턴키하우스가 어떤 팀인지<br />영상으로 소개합니다.</h2>
            <div>
              <p>기획부터 촬영과 채널 운영까지<br />턴키하우스가 일하는 방식을 영상에 담았습니다.</p>
              <span>TURNKEYHAUS INTRO FILM · CLICK TO PLAY</span>
            </div>
          </Reveal>
          <Reveal className="tk-showreel__frame">
            <video controls playsInline preload="none" poster="/images/turnkeyhaus-hq-building.jpg">
              <source src="/videos/turnkeyhaus hero new.mp4" type="video/mp4" />
              영상을 재생할 수 없는 환경입니다.
            </video>
          </Reveal>
        </div>
      </section>

      <section id="pilot" className="tk-start">
        <div className="tk-shell">
          <SectionMeta index="09" label="START SMALL" dark />
          <Reveal className="tk-start__heading">
            <h2>바로 장기계약하지 않아도 됩니다.</h2>
            <p>현재 상태와 내부 상황에 맞춰, 필요한 만큼부터 확인할 수 있습니다.</p>
          </Reveal>
          <div className="tk-start__options">
            {content.pricing.levels.slice(0, 3).map((level, index) => (
              <Reveal className="tk-start__option" key={level.title}>
                <span>0{index + 1}</span>
                <div className="tk-start__title"><p>{level.priceBand}</p><h3>{level.title}</h3></div>
                <div className="tk-start__fit"><small>누구에게 맞는지</small><p>{level.target}</p></div>
                <ul>{level.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="tk-sectors">
        <div className="tk-shell">
          <SectionMeta index="10" label="SECTORS" />
          <Reveal className="tk-sectors__grid">
            <h2>설명이 곧 신뢰가 되는<br />업종에 집중합니다.</h2>
            <p>구매 결정이 어렵고, 전문가의 판단 기준이 중요한 분야일수록 콘텐츠의 역할이 커집니다.</p>
          </Reveal>
          <div className="tk-sector-list">
            {content.professionalTargets.cards.map((sector, index) => (
              <Reveal className="tk-sector" key={sector.title}>
                <span>0{index + 1}</span>
                <h3>{sector.title}</h3>
                <p>{sector.oneLiner}</p>
                <Link href={sector.href} aria-label={`${sector.title} 운영 방식 보기`}><Arrow /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="tk-faq" aria-labelledby="faq-title">
        <div className="tk-shell">
          <SectionMeta index="11" label="QUESTIONS BEFORE START" />
          <Reveal className="tk-faq__heading">
            <h2 id="faq-title">맡기기 전에 궁금한 것부터<br />먼저 답해두겠습니다.</h2>
            <p>계약보다 운영 방식이 맞는지 확인하는 일이 먼저입니다.</p>
          </Reveal>
          <div className="tk-faq__list">
            {content.faq.items.slice(0, 7).map((item, index) => (
              <details key={item.q} className="tk-faq__item">
                <summary><span>0{index + 1}</span><strong>{item.q}</strong><i aria-hidden="true">+</i></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="resources" className="tk-resources" aria-labelledby="resources-title">
        <div className="tk-shell">
          <SectionMeta index="12" label="INSIGHTS & PROPOSAL" />
          <Reveal className="tk-resources__heading">
            <h2 id="resources-title">판단에 필요한 자료를<br />한곳에 모았습니다.</h2>
            <p>현장 운영에서 확인한 기준과 공식 제안서를 함께 공개합니다.</p>
          </Reveal>
          <div className="tk-resources__grid">
            <div className="tk-insight-list">
              {latestInsights.map((post, index) => (
                <Link href={`/insights/${post.slug}`} key={post.slug} className="tk-insight-row">
                  <span>0{index + 1}</span>
                  <div><time dateTime={post.publishedAt}>{post.publishedAt.replaceAll("-", ".")}</time><h3>{post.title}</h3></div>
                  <Arrow />
                </Link>
              ))}
              <Link href="/insights" className="tk-text-link">인사이트 전체 보기 <Arrow /></Link>
            </div>
            <a href="/proposal.html" className="tk-proposal-link">
              <span>OFFICIAL PROPOSAL · HTML</span>
              <h3>턴키하우스 공식 제안서</h3>
              <p>운영 범위와 서비스 구조를 별도 문서에서 확인하실 수 있습니다.</p>
              <strong>제안서 열기 <Arrow /></strong>
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="tk-contact">
        <div className="tk-shell">
          <SectionMeta index="13" label="LET’S TALK" dark />
          <Reveal className="tk-contact__main">
            <p>채널 운영 상담 · 1영업일 내 연락</p>
            <h2>채널 링크 하나면<br />어디서 막혀 있는지부터 보겠습니다.</h2>
            <div className="tk-contact__actions">
              <a href={content.contact.kakaoChatUrl} target="_blank" rel="noreferrer" className="tk-contact__primary">
                카카오톡으로 채널 보내기 <Arrow />
              </a>
              <a href={content.contact.googleFormShareUrl} target="_blank" rel="noreferrer" className="tk-text-link tk-text-link--light">
                상담 폼 작성하기 <Arrow />
              </a>
            </div>
          </Reveal>

          <footer className="tk-footer">
            <div className="tk-footer__brand">
              <Image src="/images/turnkeyhaus-logo-main.png" alt="턴키하우스 by TKDG" width={180} height={79} />
            </div>
            <div className="tk-footer__company">
              <strong>{content.footer.companyName}</strong>
              {content.footer.lines.map((line) => <p key={line.label}><span>{line.label}</span>{line.value}</p>)}
            </div>
            <div className="tk-footer__links">
              <Link href="/company">COMPANY <Arrow /></Link>
              <Link href="/youtube-channel-management">SERVICES <Arrow /></Link>
              <a href="/proposal.html">PROPOSAL <Arrow /></a>
              <Link href="/insights">INSIGHTS <Arrow /></Link>
              <a href="mailto:contact@tkdglabs.com">EMAIL <Arrow /></a>
              <a href={content.contact.phoneHref}>CALL <Arrow /></a>
              <a href="https://www.tkdglabs.com" target="_blank" rel="noreferrer">TKDG LABS <Arrow /></a>
            </div>
            <p className="tk-footer__copy">© {new Date().getFullYear()} TKDG Labs Co., Ltd.</p>
          </footer>
        </div>
      </section>

      <aside className={`tk-contact-dock ${showContactDock ? "is-visible" : ""}`} aria-label="빠른 상담" aria-hidden={!showContactDock}>
        <a href={content.contact.kakaoChatUrl} target="_blank" rel="noreferrer"><span>KAKAO</span><strong>카카오톡 상담</strong><Arrow /></a>
        <a href={content.contact.phoneHref}><span>CALL</span><strong>{content.contact.phoneDisplay}</strong><Arrow /></a>
      </aside>
    </main>
  );
}
