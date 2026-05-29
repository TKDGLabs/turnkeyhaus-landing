-- Turnkeyhaus Store MVP
-- Supabase SQL Editor 또는 migration으로 실행하세요.
-- 상품은 public.store_products에서 관리하고, 주문/결제/권한은 서버 API가 service role로 기록합니다.

create extension if not exists pgcrypto;

create table if not exists public.store_products (
  id text primary key,
  type text not null default 'SINGLE',
  name text not null,
  summary text not null default '',
  price integer not null default 0,
  delivery_info text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 100,
  hero_image_url text,
  detail_image_urls text[] not null default '{}',
  detail_markdown text,
  cta_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_products add column if not exists type text not null default 'SINGLE';
alter table public.store_products add column if not exists name text not null default '';
alter table public.store_products add column if not exists summary text not null default '';
alter table public.store_products add column if not exists price integer not null default 0;
alter table public.store_products add column if not exists delivery_info text not null default '';
alter table public.store_products add column if not exists is_active boolean not null default true;
alter table public.store_products add column if not exists sort_order integer not null default 100;
alter table public.store_products add column if not exists hero_image_url text;
alter table public.store_products add column if not exists detail_image_urls text[] not null default '{}';
alter table public.store_products add column if not exists detail_markdown text;
alter table public.store_products add column if not exists cta_label text;
alter table public.store_products add column if not exists created_at timestamptz not null default now();
alter table public.store_products add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'store_products_type_check') then
    alter table public.store_products
      add constraint store_products_type_check check (type in ('SINGLE', 'SUBSCRIPTION'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'store_products_price_check') then
    alter table public.store_products
      add constraint store_products_price_check check (price >= 0);
  end if;
end $$;

create table if not exists public.store_orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  product_id text not null references public.store_products(id) on delete restrict,
  product_name text not null,
  product_snapshot jsonb not null,
  amount integer not null default 0,
  currency text not null default 'KRW',
  status text not null default 'pending',
  payment_id text unique,
  pay_method text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  channel_url text,
  company_name text,
  business_registration_number text,
  tax_invoice_requested boolean not null default false,
  consents jsonb not null default '{}',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'store_orders_amount_check') then
    alter table public.store_orders
      add constraint store_orders_amount_check check (amount >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'store_orders_status_check') then
    alter table public.store_orders
      add constraint store_orders_status_check
      check (status in ('pending', 'paid', 'awaiting_deposit', 'failed', 'cancelled', 'amount_mismatch', 'refunded', 'partially_refunded'));
  end if;
end $$;

create table if not exists public.store_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete cascade,
  order_no text not null,
  user_id uuid not null references auth.users(id) on delete restrict,
  payment_id text not null unique,
  status text not null,
  amount integer not null default 0,
  payment_method jsonb,
  raw_response jsonb not null default '{}',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.store_products(id) on delete restrict,
  order_id uuid not null references public.store_orders(id) on delete cascade,
  status text not null default 'active',
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'store_entitlements_status_check') then
    alter table public.store_entitlements
      add constraint store_entitlements_status_check check (status in ('active', 'revoked', 'expired'));
  end if;
end $$;

create unique index if not exists store_entitlements_unique_order_idx
  on public.store_entitlements(user_id, product_id, order_id);

create table if not exists public.store_payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.store_orders(id) on delete set null,
  order_no text,
  payment_id text,
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists store_products_active_sort_idx on public.store_products(is_active, sort_order);
create index if not exists store_orders_user_created_idx on public.store_orders(user_id, created_at desc);
create index if not exists store_orders_payment_id_idx on public.store_orders(payment_id);
create index if not exists store_payments_user_created_idx on public.store_payments(user_id, created_at desc);
create index if not exists store_payment_events_payment_id_idx on public.store_payment_events(payment_id);
create index if not exists store_entitlements_user_product_idx on public.store_entitlements(user_id, product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_store_products_updated_at on public.store_products;
create trigger set_store_products_updated_at
before update on public.store_products
for each row execute function public.set_updated_at();

drop trigger if exists set_store_orders_updated_at on public.store_orders;
create trigger set_store_orders_updated_at
before update on public.store_orders
for each row execute function public.set_updated_at();

drop trigger if exists set_store_payments_updated_at on public.store_payments;
create trigger set_store_payments_updated_at
before update on public.store_payments
for each row execute function public.set_updated_at();

drop trigger if exists set_store_entitlements_updated_at on public.store_entitlements;
create trigger set_store_entitlements_updated_at
before update on public.store_entitlements
for each row execute function public.set_updated_at();

alter table public.store_products enable row level security;
alter table public.store_orders enable row level security;
alter table public.store_payments enable row level security;
alter table public.store_entitlements enable row level security;
alter table public.store_payment_events enable row level security;

drop policy if exists "Public can read active store products" on public.store_products;
create policy "Public can read active store products"
on public.store_products
for select
using (is_active = true);

drop policy if exists "Users can read own store orders" on public.store_orders;
create policy "Users can read own store orders"
on public.store_orders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own store payments" on public.store_payments;
create policy "Users can read own store payments"
on public.store_payments
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own store entitlements" on public.store_entitlements;
create policy "Users can read own store entitlements"
on public.store_entitlements
for select
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');

insert into public.store_products (
  id, type, name, summary, price, delivery_info, is_active, sort_order, detail_markdown, cta_label
)
values
  (
    'tier-ebook',
    'SINGLE',
    '브랜드 유튜브 구축 전자책',
    '유튜브를 처음 시작하는 전문직/기업 필수 가이드' || chr(10) ||
    '문의가 들어오는 채널 세팅의 3가지 핵심 원칙',
    0,
    '무료 신청 즉시 다운로드 권한 제공',
    true,
    10,
    '브랜드 유튜브를 처음 시작하는 전문직·기업 담당자가 채널 방향과 기본 세팅을 빠르게 잡을 수 있도록 만든 무료 PDF 자료입니다.' || chr(10) || chr(10) ||
    '채널명, 소개 문구, 첫 콘텐츠 구조, 문의 전환 동선처럼 시작 단계에서 놓치기 쉬운 요소를 정리합니다.' || chr(10) || chr(10) ||
    '무료 자료는 신청 계정에 다운로드 권한이 부여되며, 무단 배포를 금지합니다.',
    '무료 다운로드 받기'
  ),
  (
    'tier-report',
    'SINGLE',
    '운영 진단 리포트 (1회성)',
    '현재 채널 및 경쟁 채널 3곳 정밀 분석' || chr(10) ||
    '검색 유입을 위한 주제 20개 추출 및 검증' || chr(10) ||
    '즉시 적용 가능한 썸네일/제목 교정 가이드',
    490000,
    '결제 완료 후 3영업일 이내 PDF 이메일 발송',
    true,
    20,
    '현재 채널과 경쟁 채널을 비교해 지금 막혀 있는 지점, 바로 고쳐야 할 제목·썸네일·주제 구조를 PDF 리포트로 정리합니다.' || chr(10) || chr(10) ||
    '구매 후 채널 URL과 참고 자료를 확인한 뒤 분석을 시작합니다. 분석 범위는 현재 채널, 경쟁 채널 3곳, 검색 유입형 주제 20개, 제목·썸네일 개선 방향입니다.' || chr(10) || chr(10) ||
    '완성 리포트는 PDF로 제공되며, 작업 착수 후에는 무형 서비스 특성상 환불이 제한될 수 있습니다.',
    '490,000원 결제하기'
  ),
  (
    'tier-planner',
    'SINGLE',
    '90일 채널 전략 플래너 (특가)',
    '단기 성과를 위한 3개월 채널 로드맵 기획' || chr(10) ||
    '시즌 이슈 및 검색량 기반 핵심 키워드 매칭' || chr(10) ||
    '기존 업로드 영상 구조 피드백 및 코칭',
    297000,
    '결제 완료 후 익일부터 3개월간 온라인/이메일 컨설팅',
    true,
    30,
    '앞으로 90일 동안 어떤 주제를 어떤 순서로 발행해야 하는지, 채널 목표와 고객 유입 관점에서 실행 로드맵을 설계합니다.' || chr(10) || chr(10) ||
    '플래너는 콘텐츠 주제, 업로드 순서, 검색 키워드, 기존 영상 구조 피드백을 중심으로 구성됩니다.' || chr(10) || chr(10) ||
    '결제 후 익일부터 3개월간 온라인 또는 이메일 기반 컨설팅으로 진행되며, 세부 운영 방식은 담당자가 안내합니다.',
    '297,000원 결제하기'
  ),
  (
    'tier-basic',
    'SUBSCRIPTION',
    '유튜브 운영대행 [베이직]',
    '콘텐츠 기획 및 연출 (6편)' || chr(10) ||
    '롱폼 편집 10분 이내 (2편)' || chr(10) ||
    '숏폼 신규/재편집 (12편)' || chr(10) ||
    '현장 촬영 1회차 (PD 2인/3CAM)',
    3800000,
    '상담 및 계약 범위 확인 후 첫 달 착수금 결제',
    true,
    40,
    '베이직 플랜은 월간 브랜드 유튜브 운영을 시작하기 위한 최소 운영 패키지입니다.' || chr(10) || chr(10) ||
    '콘텐츠 기획, 현장 촬영, 롱폼 편집, 숏폼 재가공까지 포함하며, 정확한 착수 범위는 상담과 계약서로 확정합니다.' || chr(10) || chr(10) ||
    '운영대행은 결제 전 상담 및 계약 범위 확인이 필요합니다.',
    '착수금 결제하기'
  ),
  (
    'tier-standard',
    'SUBSCRIPTION',
    '유튜브 운영대행 [스탠다드]',
    '콘텐츠 기획 및 연출 (7편)' || chr(10) ||
    '롱폼 편집 10분 이내 (3편)' || chr(10) ||
    '숏폼 신규/재편집 (16편)' || chr(10) ||
    '현장 촬영 1회차 (PD 2인/3CAM)',
    4400000,
    '상담 및 계약 범위 확인 후 첫 달 착수금 결제',
    true,
    50,
    '스탠다드 플랜은 월간 채널 운영의 기획·촬영·편집 볼륨을 균형 있게 가져가는 패키지입니다.' || chr(10) || chr(10) ||
    '월간 롱폼 3편과 숏폼 16편 기준으로 운영되며, 내부 담당자와 함께 주제 선정과 업로드 방향을 조율합니다.' || chr(10) || chr(10) ||
    '운영대행은 결제 전 상담 및 계약 범위 확인이 필요합니다.',
    '착수금 결제하기'
  ),
  (
    'tier-premium',
    'SUBSCRIPTION',
    '유튜브 운영대행 [프리미엄]',
    '콘텐츠 기획 및 연출 (12편)' || chr(10) ||
    '롱폼 편집 10분 이내 (4편)' || chr(10) ||
    '숏폼 신규/재편집 (28편)' || chr(10) ||
    '현장 촬영 2회차 (PD 2인/3CAM)',
    5000000,
    '상담 및 계약 범위 확인 후 첫 달 착수금 결제',
    true,
    60,
    '프리미엄 플랜은 월간 발행량과 촬영 회차가 많은 브랜드·기관을 위한 집중 운영 패키지입니다.' || chr(10) || chr(10) ||
    '기획 편수와 숏폼 전개량을 크게 늘려 채널 운영 속도를 확보합니다. 세부 범위와 일정은 상담과 계약서로 확정합니다.' || chr(10) || chr(10) ||
    '운영대행은 결제 전 상담 및 계약 범위 확인이 필요합니다.',
    '착수금 결제하기'
  )
on conflict (id) do update set
  type = excluded.type,
  name = excluded.name,
  summary = excluded.summary,
  price = excluded.price,
  delivery_info = excluded.delivery_info,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  detail_markdown = excluded.detail_markdown,
  cta_label = excluded.cta_label,
  updated_at = now();

comment on table public.store_products is 'Turnkeyhaus 스토어 상품. Supabase Table Editor에서 is_active, 이미지, 상세설명, 가격을 관리합니다.';
comment on column public.store_products.hero_image_url is 'https URL 또는 product-images 버킷 내 Storage path';
comment on column public.store_products.detail_image_urls is 'https URL 또는 product-images 버킷 내 Storage path 배열';
comment on table public.store_orders is '스토어 주문. 서버 API가 생성하며 상품 snapshot을 보존합니다.';
comment on table public.store_payments is '포트원 결제 조회 결과 및 결제 상태 저장';
comment on table public.store_entitlements is '구매 또는 무료 신청 후 다운로드/열람 권한';
comment on table public.store_payment_events is '브라우저 완료 처리 및 포트원 웹훅 원본 이벤트 로그';
