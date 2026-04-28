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

## Insights Writing (언제든 글 추가)
인사이트 글은 `content/insights.ts`의 `insights` 배열에 추가하면 `/insights`와 상세 페이지에 자동 반영됩니다.
글 데이터 타입은 `Insight` / `InsightBlock`이며, 한 글당 `slug`, `title`, `description`, `publishedAt`, `keywords`, `body`를 채우면 됩니다.
본문은 `body`에서 `p`, `h2`, `ul` 블록으로 구성할 수 있습니다.
문장 중 `**강조**` 표기는 상세 페이지에서 굵게 렌더됩니다.

## Google Form Embed URL
Google Form에서 `보내기` 버튼을 누른 뒤 `< >`(임베드) 탭으로 이동합니다.
표시된 `iframe src`의 URL(`https://docs.google.com/forms/d/e/.../viewform?embedded=true`)을 복사합니다.
복사한 URL을 `content.ts`의 `content.contact.googleFormEmbedUrl`에 넣습니다. (`forms.gle` 공유 링크는 iframe에 사용하지 않음)

## PortOne 결제 연동
이 프로젝트는 `/store`에서 결제를 시작하고 `/store/result`에서 결과를 검증합니다.

1. `.env.example`을 복사해 `.env.local` 생성
2. 아래 값을 입력
   - `NEXT_PUBLIC_PORTONE_STORE_ID`
   - `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
   - `PORTONE_API_SECRET` (서버 전용)
3. 개발 서버 실행 후 `/store`에서 테스트 결제 진행

### 보안 주의
- `PORTONE_API_SECRET`은 절대 클라이언트 코드에 넣지 않습니다.
- 과거에 스토어/채널 키를 코드에 직접 넣었다면 콘솔에서 키를 재발급(회전)하는 것을 권장합니다.
- 서버(`app/api/confirm/route.ts`)에서 결제 상태/금액을 반드시 검증한 뒤 성공 처리합니다.
