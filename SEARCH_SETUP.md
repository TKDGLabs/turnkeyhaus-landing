# Turnkeyhaus 검색 등록 체크리스트

코드에 검색 수집 구조는 반영되어 있습니다. 실제 배포 후 아래 등록 절차까지 완료해야 네이버·Google이 새 구조를 빠르게 확인할 수 있습니다.

## 1. 소유권 확인

- Google Search Console에서 `https://www.turnkey.haus` 속성을 등록합니다.
- 네이버 서치어드바이저에서 같은 도메인을 등록합니다.
- 발급받은 HTML 태그의 `content` 값을 배포 환경 변수에 입력합니다.
  - `GOOGLE_SITE_VERIFICATION`
  - `NAVER_SITE_VERIFICATION`

## 2. 제출할 주소

- 일반 사이트맵: `https://www.turnkey.haus/sitemap.xml`
- 영상 사이트맵: `https://www.turnkey.haus/video-sitemap.xml`
- 인사이트 RSS: `https://www.turnkey.haus/rss.xml`
- robots: `https://www.turnkey.haus/robots.txt`

Google Search Console에는 일반·영상 사이트맵을 제출합니다. 네이버 서치어드바이저에는 사이트맵과 RSS를 모두 제출합니다.

## 3. 배포 후 검사할 대표 URL

- `/`
- `/youtube-channel-management`
- `/company`
- `/medical-youtube`
- `/lawfirm-youtube`
- `/cases/the-apseon-dental-youtube`
- `/insights/old-video-still-converts-new-patients`

Google URL 검사와 네이버 URL 검사에서 색인 가능 여부, 대표 URL, 렌더링된 본문을 확인합니다.

## 4. 외부 채널의 회사 정보 통일

홈페이지와 아래 채널의 법인명·브랜드명·주소·전화·이메일 표기를 동일하게 유지합니다.

- 네이버 플레이스 또는 스마트플레이스
- Google Business Profile
- 카카오톡 채널
- YouTube 채널 소개
- TKDG Labs 홈페이지와 회사 SNS

권장 표기:

- 법인명: 티케이디지랩스 주식회사
- 브랜드: 턴키하우스 by TKDG
- 주소: 인천광역시 서구 파랑로 451, 10층 1010호
- 전화: 0507-1463-3664
- 이메일: contact@tkdglabs.com

## 5. 월간 점검

- 브랜드명·서비스명 검색 노출 문서 수
- 회사·팀 페이지 색인 여부
- 인사이트 신규 글의 RSS 수집 여부
- 사례 페이지의 영상 색인 여부
- 검색 유입 질문과 상담 문의 문구
- 404, 중복 제목, 중복 설명, 제외된 페이지

검색 상위 노출은 코드만으로 보장할 수 없습니다. 실제 운영 경험이 담긴 사례와 인사이트를 꾸준히 갱신하고, 외부 채널에서도 동일한 회사 정보를 유지해야 합니다.
