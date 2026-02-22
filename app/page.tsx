import Image from "next/image";
import Link from "next/link";
import { content } from "@/content";

function getEmbeddedFormUrl(formUrl: string) {
  const hasQuery = formUrl.includes("?");
  const hasEmbedParam = formUrl.includes("embedded=true");

  if (hasEmbedParam) {
    return formUrl;
  }

  return `${formUrl}${hasQuery ? "&" : "?"}embedded=true`;
}

export default function Home() {
  const embeddedFormUrl = getEmbeddedFormUrl(content.contact.formUrl);
  const heroLogo = content.site.assets.logoOnDark;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(4,20,17,0.92)] backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between gap-4">
          <Link href="#hero" className="brand-mark" aria-label="Turnkeyhaus 상단으로 이동">
            {content.site.name}
          </Link>
          <nav aria-label="섹션 바로가기" className="flex max-w-[65%] items-center gap-1 overflow-x-auto py-1 md:max-w-none md:gap-2">
            {content.navigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section id="hero" className="container-shell pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="panel hero-panel">
            <div className="logo-shell" aria-hidden="true">
              <Image
                src={heroLogo}
                alt=""
                width={3158}
                height={1384}
                priority
                className="logo-main"
              />
            </div>
            <p className="eyebrow">{content.hero.label}</p>
            <h1 className="hero-title">{content.hero.headline}</h1>
            <p className="hero-subtitle">{content.hero.subheadline}</p>
            <p className="hero-description">{content.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {content.hero.ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={cta.variant === "primary" ? "btn-primary" : "btn-secondary"}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="problem" className="section-shell">
          <div className="section-heading">
            <span className="section-label">01</span>
            <h2>{content.problem.title} | 세무사 유튜브·변호사 유튜브의 공통 문제</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.problem.items.map((item) => (
              <article key={item} className="panel card-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
          <p className="key-line">{content.problem.emphasis}</p>
        </section>

        <section id="process" className="section-shell">
          <div className="section-heading">
            <span className="section-label">02</span>
            <h2>{content.process.title} | 전문직 유튜브 운영 프로세스</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.process.steps.map((step) => (
              <article key={step.step} className="panel">
                <p className="step-index">{step.step}</p>
                <h3 className="card-title">{step.title}</h3>
                <p className="card-text">{step.description}</p>
              </article>
            ))}
          </div>
          <p className="key-line">{content.process.emphasis}</p>
        </section>

        <section id="about" className="section-shell">
          <div className="section-heading">
            <span className="section-label">03</span>
            <h2>{content.about.title}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.about.relation.map((item) => (
              <article key={item.org} className="panel">
                <p className="step-index">{item.org}</p>
                <h3 className="card-title">{item.role}</h3>
                <p className="card-text">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="fit" className="section-shell">
          <div className="section-heading">
            <span className="section-label">04</span>
            <h2>{content.fit.title} | 유튜브 브랜딩이 필요한 대상</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.fit.items.map((item) => (
              <article key={item} className="panel card-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="section-shell">
          <div className="section-heading">
            <span className="section-label">05</span>
            <h2>{content.pricing.title} | 유튜브 컨설팅 운영 구조</h2>
          </div>
          <article className="panel">
            <h3 className="card-title">{content.pricing.subtitle}</h3>
            <ul className="space-y-3">
              {content.pricing.items.map((item) => (
                <li key={item} className="list-line">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section id="contact" className="section-shell">
          <div className="section-heading">
            <span className="section-label">06</span>
            <h2>{content.contact.title} | 유튜브 제작사가 아닌 구조 진단</h2>
          </div>
          <article className="panel space-y-5">
            <p className="hero-subtitle">{content.contact.subtitle}</p>
            <div className="form-shell">
              <iframe
                src={embeddedFormUrl}
                title="상담 및 진단 신청 폼"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-[600px] w-full"
              />
            </div>
            <a
              href={content.contact.formUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex"
            >
              {content.contact.buttonLabel}
            </a>
          </article>
        </section>
      </main>

      <footer className="container-shell border-t border-white/10 py-10">
        <p className="footer-company">{content.footer.company}</p>
        <div className="footer-grid">
          <p>대표자: {content.footer.ceo}</p>
          <p>사업자등록번호: {content.footer.businessNumber}</p>
          <p>법인등록번호: {content.footer.corporateNumber}</p>
          <p>주소: {content.footer.address}</p>
          <p>
            Email: <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
          </p>
          <p>
            Tel: <a href={`tel:${content.footer.tel.replaceAll("-", "")}`}>{content.footer.tel}</a>
          </p>
        </div>
      </footer>
    </>
  );
}
