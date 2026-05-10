"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { content } from "../content";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// 에러 해결 포인트: ease 값 뒤에 'as [number, number, number, number]'를 추가하여 타입을 고정했습니다.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
    } 
  }
};

export default function ModernServicesSection() {
  const { label, h2, lead, cards } = content.servicePillars;

  return (
    <section id="services" className="bg-[#f8f9fa] py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-10">
        
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col md:mb-20"
        >
          <span className="mb-4 w-fit rounded-full bg-[#21c1a2]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#1db197]">
            {label.replace(/\[|\]/g, "")}
          </span>
          <h2 className="whitespace-pre-line text-[36px] font-bold leading-[1.2] tracking-tight text-[#0B0F0E] md:text-[52px]">
            {h2}
          </h2>
          {lead && (
            <p className="mt-6 max-w-[64ch] text-lg leading-[1.8] text-black/60 md:text-xl">
              {lead}
            </p>
          )}
        </motion.div>

        {/* 벤토 그리드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card, index) => {
            let spanClass = "col-span-1";
            if (index === 0) spanClass = "md:col-span-2 lg:col-span-2";
            if (index === 2) spanClass = "md:col-span-2 lg:col-span-3 lg:flex lg:gap-12";

            return (
              <motion.article
                key={card.title}
                variants={cardVariants}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#21c1a2]/10 sm:p-10 ${spanClass}`}
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#21c1a2]/0 blur-3xl transition-colors duration-700 group-hover:bg-[#21c1a2]/5" />

                <div className={index === 2 ? "lg:w-1/2" : ""}>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-[12px] font-bold tracking-[0.16em] text-black/30">
                      SERVICE 0{index + 1}
                    </p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black/40 transition-all duration-500 group-hover:-rotate-45 group-hover:bg-[#21c1a2] group-hover:text-white">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <p className="mb-2 text-sm font-semibold text-[#1db197]">
                    {card.title}
                  </p>
                  <h3 className="text-[28px] font-bold leading-tight tracking-tight text-[#0B0F0E] md:text-[34px]">
                    {card.headline}
                  </h3>
                  <p className="mt-5 text-base leading-relaxed text-black/65">
                    {card.body}
                  </p>
                </div>

                <div className={`mt-10 flex flex-col justify-between border-t border-black/5 pt-8 ${index === 2 ? "lg:mt-0 lg:w-1/2 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0" : ""}`}>
                  <ul className="mb-8 space-y-3">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start text-[15px] font-medium text-black/70">
                        <span className="mr-3 mt-[6px] flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#21c1a2]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={card.href}
                    className="inline-flex w-fit items-center text-[15px] font-bold text-[#0B0F0E] transition-colors group-hover:text-[#21c1a2]"
                  >
                    {card.ctaLabel}
                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
