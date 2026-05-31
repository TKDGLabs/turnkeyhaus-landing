-- Store product detail management fields
-- Supabase SQL Editor에서 실행하면 스토어 상품별 썸네일, 상세 이미지, 옵션, 판매자 정보, 상품 정보 고시를 DB에서 관리할 수 있습니다.

alter table public.store_products add column if not exists product_options jsonb not null default '[]'::jsonb;
alter table public.store_products add column if not exists seller_info jsonb not null default '{}'::jsonb;
alter table public.store_products add column if not exists product_notice jsonb not null default '{}'::jsonb;
alter table public.store_products add column if not exists return_policy jsonb not null default '[]'::jsonb;
alter table public.store_products add column if not exists origin_info text;

alter table public.store_orders add column if not exists selected_options jsonb not null default '{}'::jsonb;

comment on column public.store_products.hero_image_url is '상품 목록/상세 상단 썸네일. https URL 또는 product-images 버킷 내 Storage path';
comment on column public.store_products.detail_image_urls is '상세페이지 본문 이미지. text[] 형태로 product-images 버킷 path 또는 https URL 입력';
comment on column public.store_products.detail_markdown is '상품 상세 설명 본문. 빈 줄 2개로 문단 분리';
comment on column public.store_products.product_options is '상품 선택 옵션. 예: [{"name":"제공 방식","required":true,"values":["PDF 이메일 발송"]}]';
comment on column public.store_products.seller_info is '판매자 정보. sellerName, representative, businessNumber, address, email, phone';
comment on column public.store_products.product_notice is '상품 정보 고시. productType, deliveryMethod, servicePeriod, tax, issuedDocument, customerRequiredInfo';
comment on column public.store_products.return_policy is '교환/반품/환불 규정 문장 배열';
comment on column public.store_products.origin_info is '원산지 표시 또는 디지털/용역 상품 표시 예외 안내';
comment on column public.store_orders.selected_options is '주문 시 구매자가 선택한 상품 옵션 snapshot';

update public.store_products
set
  product_options = case id
    when 'tier-ebook' then '[{"name":"제공 방식","required":true,"values":["PDF 다운로드 권한"]}]'::jsonb
    when 'tier-report' then '[{"name":"상품 구성","required":true,"values":["운영 진단 리포트 PDF"]},{"name":"제공 방식","required":true,"values":["이메일 발송"]}]'::jsonb
    when 'tier-planner' then '[{"name":"상품 구성","required":true,"values":["90일 채널 전략 플래너"]},{"name":"진행 방식","required":true,"values":["온라인/이메일 컨설팅"]}]'::jsonb
    when 'tier-basic' then '[{"name":"착수 범위","required":true,"values":["상담 후 계약 범위 확정"]},{"name":"결제 목적","required":true,"values":["첫 달 착수금"]}]'::jsonb
    when 'tier-standard' then '[{"name":"착수 범위","required":true,"values":["상담 후 계약 범위 확정"]},{"name":"결제 목적","required":true,"values":["첫 달 착수금"]}]'::jsonb
    when 'tier-premium' then '[{"name":"착수 범위","required":true,"values":["상담 후 계약 범위 확정"]},{"name":"결제 목적","required":true,"values":["첫 달 착수금"]}]'::jsonb
    else product_options
  end,
  seller_info = jsonb_build_object(
    'sellerName', '티케이디지랩스 주식회사',
    'representative', '채동우',
    'businessNumber', '763-87-03415',
    'address', '인천광역시 서구 파랑로 451, 10층 1010호',
    'email', 'contact@tkdglabs.com',
    'phone', '0507-1463-3664'
  ),
  product_notice = case
    when type = 'SUBSCRIPTION' then jsonb_build_object(
      'productType', '월간 유튜브 운영대행 착수금',
      'deliveryMethod', delivery_info,
      'servicePeriod', '별도 상담 및 계약서 기준',
      'tax', 'VAT 포함',
      'issuedDocument', '결제 내역 및 필요 시 세금계산서/현금영수증 안내',
      'customerRequiredInfo', '담당자명, 연락처, 이메일, 채널 URL 또는 참고 링크'
    )
    when price = 0 then jsonb_build_object(
      'productType', '디지털 무료 자료',
      'deliveryMethod', delivery_info,
      'servicePeriod', '신청 완료 후 다운로드 권한 제공',
      'tax', '무료 상품',
      'issuedDocument', '해당 없음',
      'customerRequiredInfo', '담당자명, 연락처, 이메일'
    )
    else jsonb_build_object(
      'productType', '디지털 리포트/컨설팅 상품',
      'deliveryMethod', delivery_info,
      'servicePeriod', case when id = 'tier-planner' then '결제 익일부터 3개월' else '결제 완료 후 안내 일정 기준' end,
      'tax', 'VAT 포함',
      'issuedDocument', '결제 내역 및 필요 시 세금계산서/현금영수증 안내',
      'customerRequiredInfo', '담당자명, 연락처, 이메일, 채널 URL 또는 참고 링크'
    )
  end,
  return_policy = case
    when type = 'SUBSCRIPTION' then '["운영대행은 상담 및 계약 범위 확인 후 착수됩니다.","착수 전에는 결제 취소가 가능하나, 착수 후에는 실제 투입 인력·일정 확보·제작 진행분을 기준으로 정산됩니다.","세부 해지·환불 기준은 별도 계약서와 환불 정책을 우선 적용합니다."]'::jsonb
    when price = 0 then '["무료 자료는 신청 후 다운로드 권한이 부여됩니다.","자료의 무단 재배포, 재판매, 공개 공유는 금지됩니다."]'::jsonb
    else '["결제 후 작업 착수 전에는 취소 요청이 가능합니다.","분석·기획 작업 착수 또는 PDF/자료 전송 이후에는 무형 서비스 특성상 환불이 제한될 수 있습니다.","오입력, 중복 결제 등 결제 오류는 확인 후 취소 처리합니다."]'::jsonb
  end,
  origin_info = '디지털 콘텐츠·용역 서비스 상품으로 원산지 표시 대상이 아니며, 제작 및 서비스 제공지는 대한민국입니다.'
where id in ('tier-ebook', 'tier-report', 'tier-planner', 'tier-basic', 'tier-standard', 'tier-premium');
