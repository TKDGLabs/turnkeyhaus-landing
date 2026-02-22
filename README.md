# turnkeyhaus-landing

Next.js(App Router) 기반 단일 랜딩 페이지입니다.

## Image Setup
랜딩 이미지 파일은 아래 경로와 파일명으로 배치해야 합니다.

- `/public/images/studio-1.jpg` (회의실 촬영 셋업)
- `/public/images/studio-2.jpg` (화이트 배경 스튜디오)
- `/public/images/pro-law.jpg` (법/저울/악수 이미지)
- `/public/images/pro-med.jpg` (의사/청진기 이미지)
- `/public/images/pro-tax.jpg` (세무/저금통 이미지)
- `/public/images/concept-brand.jpg` (BRAND 다이어그램 이미지)
- `/public/images/concept-different.jpg` (빨간 사람 차별화 이미지)

## No-code Style Operation
텍스트/CTA/섹션 데이터/이미지 경로/링크는 `content.ts`에서만 수정하면 됩니다.
레이아웃은 `app/page.tsx`가 담당하며, 이미지 표시는 `next/image`를 사용합니다.
