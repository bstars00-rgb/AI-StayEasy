# StayEasy Vietnam — 전체 명세서 (Codex 구현/인수인계용)

> 이 문서 하나로 프로젝트 전체를 이어받아 개발할 수 있도록 작성된 명세서입니다.
> **UI / UX / CI(비주얼 아이덴티티)는 구현자(Codex) 재량**입니다. 전면 재설계해도 됩니다.
> 단, §3의 **불변 조건**과 §6의 **데이터 무결성 원칙**은 어떤 경우에도 유지해야 합니다.

---

## 1. 제품 정의

**StayEasy Vietnam**은 **직접예약 플랫폼(DBP, Direct Booking Platform)**입니다.

- 여행자가 호텔을 비교·선택하면 **호텔의 공식 웹사이트로 연결**해 주는 서비스입니다.
- **OTA가 아닙니다. 메타서치도 아닙니다.** 예약을 처리하지 않고, 결제를 받지 않고,
  예약 수수료를 받지 않습니다. 이 포지셔닝은 브랜드의 핵심이며 모든 카피에 반영됩니다.
- 가치 제안: "OTA 수수료가 끼지 않는 직접예약 — 많은 호텔이 최저가와 특전을
  직접예약 고객에게만 줍니다."
- 시장: 베트남 (1차), 아시아 확장 로드맵 (태국·일본·한국 등 16개국 — 표시용 로드맵).
- 타깃 사용자: 한국어 사용자 중심의 다국어 여행자. **5개 언어 전면 지원: en / ko / vi / zh / ja.**

### 현재 규모 (2026-10 기준, 전부 실데이터)
- **110개 호텔 / 10개 라이브 도시**: 다낭 20, 호치민·냐짱·푸꾸옥·호이안·하노이·후에·달랏·사파·하롱베이 각 10.
- Coming soon 7개 도시: 닌빈·무이네·껀터·붕따우·뀌년·꼰다오·푸옌 (검색 시 "아직 미제공" 정직 응답).
- 모든 호텔 정보는 **호텔 공식 사이트에서 검증된 사실만** 수록 (§6 참조).

---

## 2. 저장소 · 배포 (변경 금지)

| 항목 | 값 |
|---|---|
| GitHub 저장소 | `bstars00-rgb/AI-StayEasy` (기존 저장소 그대로 사용) |
| 배포 URL | **https://bstars00-rgb.github.io/AI-StayEasy** |
| 배포 방식 | GitHub Pages + GitHub Actions (`.github/workflows/deploy.yml`, main 푸시 시 자동 배포) |
| Base path | `/AI-StayEasy/` — 모든 에셋·라우팅이 이 서브패스 기준 |
| 빌드 | `GITHUB_PAGES=true npm run build` |

빌드 파이프라인(`package.json` scripts)은 번들 후 **후처리 4종**을 실행합니다. 스택을
바꾸더라도 이 산출물은 동등하게 생성해야 합니다:
1. `gen-sitemap.mjs` — sitemap.xml (현재 158 URL) + robots.txt + ads.txt
2. `gen-og.mjs` — OG 이미지 (1200×630)
3. `gen-icons.mjs` — PWA 아이콘 (192/512/apple-touch 180)
4. `gen-static-routes.mjs` — **157개 라우트를 정적 HTML로 프리렌더** (GitHub Pages SPA의
   404 폴백 대신 전 라우트 200 응답 → SEO 인덱싱 가능)

CI 구성 자체(워크플로 구조, 캐시 전략 등)는 재량이되, "main 푸시 → 자동 배포 → 위 URL"은 유지.

---

## 3. 불변 조건 (Codex 재량이 아닌 것)

1. **URL 구조 유지** — 이미 색인된 라우트들입니다 (§7 라우트 표). 바꾸면 리다이렉트 필수.
2. **5개 언어 전면 지원** — UI 문자열과 호텔 콘텐츠 모두. 영어 폴백으로 때우는 것 금지 (§8).
3. **데이터 무결성 원칙** (§6) — 이 프로젝트의 핵심 자산. 협상 불가.
4. **BM 마스터 스위치** — 수익 기능은 전부 `VITE_ENABLE_BM`(기본 OFF) 뒤에 게이트 (§9).
5. **검증 가능한 테스트 불변식** (§10) — 동등한 테스트로 유지.

재량인 것: 프레임워크/스택 교체, 디자인 시스템·컬러·타이포·로고(CI), 레이아웃·인터랙션(UX),
컴포넌트 구조, 상태 관리, CSS 방법론, CI 파이프라인 세부.

---

## 4. 현재 기술 스택 (참고 — 교체 가능)

- React 18.3 + Vite 5 + TypeScript strict + Tailwind 3.4 + React Router 6
- 테스트: vitest (현재 110개, `npm test`) / 타입체크: `npm run lint` (tsc --noEmit)
- 지도: MapLibre GL + MapTiler (키는 env; 지도 라벨이 앱 언어를 따라감)
- 백엔드 없음. 전부 정적 + 클라이언트 사이드. (커뮤니티/파트너 기능은 localStorage 기반 mock이며
  실백엔드 전환은 `docs/BACKEND_PLAN.md` 참조 — 보류 중인 의사결정)

### 환경 변수
| 변수 | 용도 |
|---|---|
| `VITE_MAPTILER_KEY` | 지도 타일 (GitHub Actions secret에도 등록돼 있음) |
| `VITE_ENABLE_BM` | 수익 기능 마스터 스위치. `'true'`일 때만 ON. **기본 OFF 유지** |
| `VITE_GA_ID` | GA4 측정 ID |
| `VITE_ADSENSE_CLIENT` | AdSense (BM ON일 때만 슬롯 렌더) |
| `VITE_CONTACT_EMAIL` | 문의 이메일 (기본 hello@stayeasy.asia) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth (미발급 — 발급 시 실로그인 배선) |
| `VITE_API_URL` | 장래 실백엔드 전환용 (현재 미사용) |

---

## 5. 데이터 모델 (src/types/index.ts 요약)

```ts
Hotel {
  id: string            // 'dn01', 'hcm01', 'hl10' 식 — 로케일 파일의 키
  slug: string          // URL용 — COORDS/EDITORIAL_SCORES/HEADLINE_BENEFIT의 키
  name, country, city, area, hotelType
  shortDescription, positioningLine, mainReason
  bestFor[], notIdealFor[], thingsToCheck[], tags[], facilities[]
  officialBenefits[]    // 공식 사이트 검증 라인들 (혜택 + 예약 안내 혼재 — §6.4)
  roomGuide { couples, families, longStay, checkBeforeBooking }
  locationGuide { nearby, airportDistance, gettingAround, nearbyFood }
  cancellationChecklist[]
  conditions: HotelConditions   // 파생은 deriveConditions()가 검증 가능한 것만
  freeCancellationVerified?     // 명시 플래그만 — 정규식 파생 금지
  contact?: ContactChannels     // email/phone/whatsapp/zalo/kakao/line/messenger
  imageUrl              // Unsplash 스톡 (110개 전부 유니크), 실사진 확보 전까지 "예시 이미지" 고지
  officialWebsiteUrl    // 핵심 CTA 목적지
  voucher?              // BM 전용
  priceTier             // 'budget'|'mid'|'premium' — 검색용, 가격으로 표시 금지
}
```

핵심 데이터 (전부 `src/data/hotels.ts`):
- **`EDITORIAL_SCORES`**: slug → 점수. StayEasy 자체 편집 평가(의견임을 명시). 도시별 1위가
  Distinction "Choice", 2위가 "Recommended" 배지. **해시/자동 생성 금지, 명시적 판단만.**
- **`HEADLINE_BENEFIT`**: slug → `{ line, kind }`. 카드에 혜택 박스를 보여줄 **호텔 고유 검증
  혜택 25곳만** 등재 (discount 11 / perk 9 / guarantee 5). **체인 멤버 요금(memberRate)은
  헤드라인 불가** — 체인 속성이지 호텔별 검증이 아니기 때문. 없는 호텔은 박스 자체를 숨김.
- **`splitBenefitIndices(slug)`**: 상세페이지에서 officialBenefits를 "실특전(✓ 타일)" vs
  "직접 예약 방법(중립 리스트)"으로 분리. 영어 원문 기준 분류, 인덱스로 번역본에 적용.
- **`src/lib/geo.ts`**: `COORDS`(slug → 실좌표), `AREA`(키가 `` `${City}|${Area}` `` 템플릿
  리터럴 타입 — 도시 없는 키는 **컴파일 에러**), `CITY`, `hotelLatLng()` 폴백 체인 + 지터.
- **`src/lib/searchEngine.ts`**: 온디바이스 AI 검색. `Signal` 유니온 + `WEIGHT`(full Record —
  새 시그널 미배선 시 컴파일 에러) + 5개 언어 `SYNONYMS`(디아크리틱 무시 norm) +
  `CITY_SIGNALS`(도시 하드필터) + `COMING_SOON`(미오픈 도시 정직 응답).

---

## 6. 데이터 무결성 원칙 (절대 불변 — 이 프로젝트의 존재 이유)

> 이 원칙들은 7라운드의 독립 심사를 거치며 코드와 테스트로 강제된 것입니다.
> **"검증 안 됐으면 보여주지 않는다"가 기본값입니다.**

1. **공식 사이트에서 검증된 사실만 게시.** 검증 불가 → 생략/null. OTA(아고다·부킹닷컴·
   트립어드바이저 등)는 출처로 사용 금지.
2. **성급(★)은 공식 페이지가 명시할 때만.** 마케팅 문구("5성급 서비스")·리뷰 위젯 점수·
   로열티 프로그램 로고를 성급으로 오인하지 말 것. 객실 수도 공식 게시가 없으면 미표기.
3. **유선 전화번호를 WhatsApp/Zalo로 변환 금지** — 유선은 메신저에 등록돼 있지 않음.
   메신저 채널은 공식 사이트가 그 채널을 직접 링크할 때만 수록 (체인 레벨 ≠ 호텔 레벨).
4. **동어반복을 혜택으로 포장 금지.** "공식 사이트에서 예약하세요"는 혜택이 아님.
   카드 혜택 박스는 HEADLINE_BENEFIT 25곳만, 상세페이지는 특전/예약안내 분리 렌더.
5. **미검증 속성은 false/숨김 고정**: petFriendly, accessible, 24h 프런트, nonSmoking.
   freeCancellation은 명시 플래그(`freeCancellationVerified`)만.
6. **사진은 실사진 확보 전까지 스톡 + "예시 이미지" 고지** (5개 언어, 카드 칩 + 갤러리 고지).
   사진 중복 금지 (110개 전부 유니크 — 테스트 강제).
7. **지도 핀**: 공식 좌표(COORDS) 우선, 없으면 지역 중심 + ±350m 지터, "대략적 위치" 고지.
8. **연락은 StayEasy가 중개하지 않음** — ContactHotelDialog는 채널 런처일 뿐이며
   "StayEasy는 예약을 처리하거나 대화를 중개하지 않아요" 고지 필수.
9. 호텔 추가/수정 시 연구 함정 목록(`docs/REVIEW_SCORES.md` + 커밋 히스토리)에 기록된
   패턴 주의: 폐업했는데 검색 캐시가 살아있는 호텔, 존재하지 않는 호텔(개발 발표만 있던),
   스쿼팅된 도메인, 푸터 주소가 본사 주소인 경우, 두 호텔을 병합한 검색 답변 등.

---

## 7. 페이지/기능 명세 (라우트 전체)

| 라우트 | 기능 | 비고 |
|---|---|---|
| `/` | 홈 — 히어로, AI 검색 진입, 추천 도시/호텔, 여행 스타일 | |
| `/search` | **AI 검색** — 자유 텍스트(5개 언어) → 시그널 추출 → 랭킹 + 이유 표시. 도시 하드필터, coming-soon 정직 응답 | 온디바이스, 키 불필요 |
| `/destinations/vietnam` | 베트남 도시 목록(17) + 아시아 확장 로드맵 지도(16개국) | destText 5개 언어 |
| `/destinations/:citySlug` | 도시별 호텔 목록 — 필터(조건/스타일), 지도 뷰, 명소 소개 | |
| `/hotels/:slug` | **호텔 상세** — 갤러리, 포지셔닝, 추천/비추천, 체크리스트, 혜택(특전✓/예약안내 분리), 객실 가이드, 위치 가이드(지도), 취소 체크리스트, 직접예약 이점 콜아웃, 공식 사이트 CTA, 호텔 연락 다이얼로그, 유사 호텔 | `/hotel/:slug`는 리다이렉트 |
| `/wishlist` | 위시리스트 + **비교 테이블** (시설 ✓/—, 혜택은 헤드라인 또는 —) | localStorage |
| `/guides`, `/guides/:slug` | 여행 가이드 아티클 (JSON-LD 포함) | |
| `/booking-guide` (`/guides/direct-booking`) | 직접예약 방법 가이드 | |
| `/partner`, `/partners` | 호텔 파트너 영업 페이지 | |
| `/admin/register` | 파트너 등록 폼 (승인 대기 플로우) | mock |
| `/partner/login`, `/partner/edit`, `/partner/reset`, `/dashboard` | 파트너 포털 — 리스팅 편집, 모의 애널리틱스(GA4 형태), 벤치마크, 완성도 | mock, `docs/PARTNER_PORTAL.md` |
| `/admin`, `/admin/hotels/:slug/edit` | 내부 어드민 (KPI, 마케팅 에디터) | mock |
| `/account`, `/signin` | 게스트 계정 (BM 게이트 — 멤버 바우처 잠금해제용) | BM OFF 시 비노출 |
| `/about`, `/contact`, `/privacy`, `/terms` | 정적 페이지 | contact/privacy/terms는 현재 영어 전용(번역 보류) |
| `/vietnam`, `/da-nang` | 레거시 리다이렉트 | 유지 |

공통: Navbar(언어 전환 🌐, 5개 언어), Footer(수익구조 공개 — "예약 수수료 없음" 설명),
빵부스러기(번역됨), JSON-LD(호텔 상세·가이드), OG 메타, PWA 아이콘.

---

## 8. i18n 아키텍처 (유지 필수 — 함정 포함)

콘텐츠는 **세 곳**에 삽니다. 하나라도 빠뜨리면 영어 폴백이 조용히 노출됩니다:
1. `src/i18n/locales/{en,ko,vi,zh,ja}.ts` — UI 문자열 + `enums`(city/area/country/hotelType/
   facility 라벨) + `destText`(도시 카드 문구)
2. `src/i18n/hotelContent/{ko,vi,zh,ja}.ts` — 호텔 콘텐츠 번역, **호텔 id 키**, 영어 원본은
   hotels.ts. **배열은 인덱스 병렬**(officialBenefits 등 — 길이 불일치 시 엉뚱한 라인 노출).
3. 각 lib의 문자열 테이블 (searchI18n, mapI18n, contactI18n, voucherI18n 등)

**테스트 축 원칙 (이 프로젝트가 두 번 당하고 확립한 규칙):**
- 로케일끼리 구조 비교는 "5개 언어가 똑같이 빠진" 누락을 못 잡는다.
- 커버리지 테스트는 반드시 **자라나는 쪽(카탈로그: hotels / destinations / countries)과 비교**한다.
- 영어 폴백(`?? english`)을 두려면 커버리지 테스트를 반드시 함께 둔다 (폴백은 누락을 감춘다).

---

## 9. 수익 모델 (BM) — 이 사이트로 돈을 버는 방법

**원칙: 여행자에게 과금하지 않고, 예약 수수료를 받지 않는다.** 수익은 호텔(B2B)과 광고에서.
모든 수익 기능은 `BM_ENABLED`(src/lib/bm.ts) 뒤에 있고 **기본 OFF** — 파트너/트래픽이
생기기 전에는 켜지 않습니다.

| 수익원 | 구현 상태 | 발동 조건 |
|---|---|---|
| ① 파트너 리스팅 (호텔이 직접예약 유도를 위해 등록·관리) | 포털 mock 완성 | 실파트너 계약 |
| ② 직접예약 바우처 (멤버 게이트 — 게스트 로그인 후 코드 노출, 호텔 사이트에서 사용) | 구현 완료, BM OFF | BM ON |
| ③ 스폰서 배치 (검색/목록 상단, "Sponsored" 명시) | 구현 완료, BM OFF | BM ON |
| ④ 디스플레이 광고 (AdSense — ads.txt 배포됨, 슬롯 구현됨) | BM OFF | 트래픽 + 승인 (`docs/ADSENSE_LAUNCH_PLAN.md`) |
| ⑤ 파트너 애널리틱스/인사이트 구독 (상위 플랜) | mock (GA4/Search Console 형태) | 실백엔드 |

**북극성 지표: 호텔 수가 아니라 "검증된 직접예약 혜택 보유 호텔 수" (현재 25/110).**
이 25곳이 파트너 영업 리스트입니다 — 자기 사이트에 이미 직접예약 혜택을 게시하는 호텔들.
테스트가 kind별 구성(11/9/5)을 고정하고 있어 문구 조작으로 지표를 부풀릴 수 없습니다.

---

## 10. 품질 요구사항 — 유지해야 할 테스트 불변식

스택을 바꿔도 아래 불변식은 동등한 테스트로 유지합니다 (현재 `src/__tests__/smoke.test.ts` 110개):

1. 카탈로그: 110개 호텔, id/slug/imageUrl 전부 유니크, 도시별 수량 고정.
2. 미검증 속성 4종은 전 호텔 false (회귀 가드).
3. **i18n 커버리지는 카탈로그 축**: 전 호텔 × 4로케일 콘텐츠 존재 + 배열 길이 = 영어 길이,
   전 destination × 5로케일 destText + 도시 라벨, 전 국가 × 5로케일 라벨.
4. **지도 핀은 area 축**: 전 호텔의 `city|area` 키에 AREA 중심 존재, COORDS 없는 호텔 핀은
   area 중심 600m 이내. (도시 박스 검사는 폴백 버그를 구조적으로 못 잡음 — 금지 사유가
   커밋 85a421f에 기록돼 있음.)
5. HEADLINE_BENEFIT: 전 항목이 실호텔+유효 인덱스+비보일러플레이트, kind 구성
   `{discount:11, perk:9, guarantee:5}` 고정, memberRate kind 금지.
6. 혜택 분할 파티션: 전 라인이 특전/안내 중 정확히 한 곳, 연락처 라인은 특전 불가.
7. 검색: 전 라이브 도시 하드필터 동작(CITY_SIGNALS × 카탈로그 순회), 라이브 도시는
   COMING_SOON에 없음, golf/'saigon' 및 '싼'/'비싼' 오탐 회귀 금지.
8. 모의 애널리틱스에 음수 CTR/포지션/분포 없음 (부호 시프트 회귀 가드).
9. WhatsApp/Zalo 번호 ≠ 유선 전화번호 (fabricated channel 가드).

**작업 수칙** (리뷰 라운드에서 확립):
- 버그를 하나 고치면 **같은 패턴을 grep으로 전체 스윕**한다 (인스턴스만 고치고 클래스를
  남기는 게 반복된 실패였음).
- 새 테스트는 **버그를 일부러 되살려 실제로 실패하는지** 확인한 뒤 커밋한다.
- 커밋 메시지/문서의 수치는 데이터에서 재계산한다 (손으로 쓴 수치가 두 번 틀렸음).

---

## 11. 백로그 (외부 의존 — 코드로 해결 불가)

1. **실파트너 1호** — 실사진 + 협상된 혜택. §9의 25곳이 영업 리스트.
2. **계정 이관** — GitHub/GA4/Search Console 소유권 이전 (최우선 대기).
3. Google OAuth Web Client ID 발급 → 게스트 실로그인 배선.
4. 커뮤니티/파트너 실백엔드 결정 — 자체 서버+PostgreSQL vs Supabase (`docs/BACKEND_PLAN.md`).
5. Contact·Privacy·Terms·파트너 등록 폼 번역 (법적 문서는 단일 언어 유지 여부 오너 판단 필요).

---

## 12. 인수 기준 (Acceptance Criteria)

1. `npm run lint`(또는 동등 타입체크) 0 에러, 테스트 전부 통과, `GITHUB_PAGES=true npm run build` 성공.
2. https://bstars00-rgb.github.io/AI-StayEasy 에서 §7의 모든 라우트가 200으로 열림.
3. 5개 언어 전환 시 §7의 번역 대상 페이지에 영어 폴백 노출 없음.
4. §6 무결성 원칙 위반 0건 — 특히: 미검증 성급/객실수 표기 없음, 동어반복 혜택 박스 없음,
   유선번호 기반 메신저 링크 없음.
5. BM OFF 상태에서 바우처/광고/스폰서/게스트 로그인 UI가 일절 노출되지 않음.
6. Lighthouse 성능·접근성·SEO에서 기존 수준 이상 (프리렌더 라우트 유지).

---

## 부록 — 참고 문서 (저장소 내)

- `docs/REVIEW_SCORES.md` — 8라운드 독립 심사 기록 (왜 이런 규칙들이 생겼는지의 역사)
- `docs/APP_CONCEPT.md`, `docs/PARTNER_PORTAL.md`, `docs/BACKEND_PLAN.md`,
  `docs/ADSENSE_LAUNCH_PLAN.md`, `docs/SEARCH_CONSOLE_PLAN.md`
- `AGENTS.md` (저장소 루트) — 에이전트용 핵심 규칙 요약
