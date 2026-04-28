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

## Supabase 회원가입/로그인 연동
이 프로젝트는 `/auth`에서 회원가입/로그인을 처리하고, `/store`는 로그인 사용자만 접근 가능합니다.

1. `.env.example`을 복사해 `.env.local` 생성
2. 아래 값을 입력
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (또는 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
3. Supabase SQL Editor에서 아래 파일 실행
   - `scripts/supabase/auth-profile-setup.sql`
4. Authentication > URL Configuration에서 Site URL/Redirect URL을 운영 도메인으로 설정

### 구현된 내용
- 회원가입 시 `first_name`, `last_name`, `company_name`, `phone_number`, `role`, `business_registration_number`를 `user_metadata`로 저장
- `auth.users` 생성 트리거로 `public.profiles` 자동 생성
- `public.profiles` RLS 정책 적용(본인 row만 조회/수정)
- `middleware.ts`에서 `/store` 접근 보호 및 비로그인 시 `/auth?next=/store` 리다이렉트

## PortOne 결제 연동
이 프로젝트는 `/store`에서 결제를 시작하고 `/store/result`에서 결과를 검증합니다.

1. `.env.example`을 복사해 `.env.local` 생성
2. 아래 값을 입력
   - `NEXT_PUBLIC_PORTONE_STORE_ID`
   - `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
   - `PORTONE_API_SECRET` (서버 전용)
   - `PORTONE_WEBHOOK_SECRET` (실연동)
   - `PORTONE_WEBHOOK_SECRET_TEST` (테스트 연동)
3. 개발 서버 실행 후 `/store`에서 테스트 결제 진행

### 갤럭시아 채널 사용 시 반영 사항
- 결제 요청에 `customer.customerId`를 자동 생성하여 전달합니다.
- 결제 요청에 `bypass.galaxia.ITEM_CODE`를 상품별 코드로 전달합니다.
- 결제 페이지에서 `상호명/이름/전화번호/주소/직함/사업자번호`를 입력하면 `storeDetails`/`customData`로 함께 전달됩니다.
- 결제 페이지 주소 입력은 카카오 우편번호 팝업(`postcode.v2.js`)이 기본 연동되어 있어 `우편번호 찾기` 버튼으로 자동 입력할 수 있습니다.

### 웹훅 연동
- 웹훅 수신 URL: `/api/portone/webhook`
- 포트원 콘솔 > 결제연동 > 연동정보 > 결제알림(Webhook) 관리에서 테스트/실연동 각각 URL과 시크릿을 발급하세요.
- 이 엔드포인트는 시그니처 검증 후 처리하며, `paymentId`가 있는 이벤트는 포트원 결제 조회를 한 번 더 수행합니다.

### 보안 주의
- `PORTONE_API_SECRET`은 절대 클라이언트 코드에 넣지 않습니다.
- `PORTONE_WEBHOOK_SECRET`도 서버에서만 사용해야 하며 외부에 노출되면 즉시 교체해야 합니다.
- 과거에 스토어/채널 키를 코드에 직접 넣었다면 콘솔에서 키를 재발급(회전)하는 것을 권장합니다.
- 서버(`app/api/confirm/route.ts`)에서 결제 상태/금액을 반드시 검증한 뒤 성공 처리합니다.
