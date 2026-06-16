# StayEasy Vietnam — 백엔드 기획 (Backend Plan v0.1)

> 현재 웹/앱은 **번들 mock 데이터**로 동작합니다. 본 문서는 이를 대체할 **백엔드**의 아키텍처·데이터 모델·API 계약·로드맵을 정의합니다.
> API 타입 계약(코드)은 [`src/api/contract.ts`](../src/api/contract.ts)에 함께 정의되어 웹/앱/백엔드가 공유합니다.

---

## 1. 원칙 (포지셔닝 = 제약)

1. **OTA 아님** — 예약/결제를 **처리하지 않음**. 결제·카드 데이터 미보유(PCI 범위 회피).
2. **수수료 0** — 수익은 광고/콘텐츠/노출(CPC, 스폰서, 캠페인). 트래킹은 **클릭/노출**까지만.
3. **신뢰·투명** — 스폰서 라벨, 콘텐츠 검증 상태를 데이터로 보유.
4. **mock 호환** — 현 `data/*` 구조를 그대로 승계(점진 교체). 프론트는 타입 계약만 보고 mock↔API 전환.
5. **다국어 우선** — 콘텐츠는 로케일별 저장 + en 폴백.

---

## 2. 아키텍처 개요

```
[ Web (Vite) ]   [ App (RN/Expo) ]   [ Back-office ]
        \              |                 /
         \             |                /
              [  API Gateway (REST)  ]
        ┌──────────────┼───────────────────────┐
   Content/Catalog   Partners/Campaigns     Tracking
     Service           Service              (clicks/impr)
        │                │                     │
        └──── PostgreSQL (primary) ────────────┘
                 │                       │
            Object Storage          AI Proxy (serverless)
            (images/CDN)            → Claude API (key 서버 보관)
```

- **단일 API(REST/JSON)** 로 시작(GraphQL은 추후 옵션).
- **읽기 경로**(공개 카탈로그)는 캐시/Edge 친화적, **쓰기 경로**(파트너/운영자)는 인증 필수.
- **AI**는 별도 서버리스 프록시(키 비노출).
- **이미지**는 오브젝트 스토리지 + CDN(현 picsum 대체).

---

## 3. 도메인 데이터 모델

> 현재 타입(`src/types/index.ts`)을 기준으로 정규화. 임베디드(roomGuide/locationGuide)는 JSONB로 보관 가능.

### 핵심 엔티티

| 엔티티 | 핵심 필드 | 관계 |
|---|---|---|
| **City** (Destination) | id, slug, name, available, heroColor, emoji, hotelCount(파생) | 1—N Hotel |
| **Area** | id, cityId, key(enum), nameI18n | N—1 City |
| **Hotel** | id, slug, cityId, areaId, hotelType, priceTier, isSponsored, koreanFriendly, officialWebsiteUrl, heroColor, emoji, status(draft/published) | N—1 City, N—1 Area, 1—N HotelContent, 1—N MediaAsset |
| **HotelContent** | hotelId, locale, shortDescription, positioningLine, bestFor[], notIdealFor[], mainReason, thingsToCheck[], officialBenefits[], roomGuide(JSON), locationGuide(JSON), cancellationChecklist[] | N—1 Hotel (locale별 1행) |
| **HotelFacility / HotelTag** | hotelId, key(enum) | N—1 Hotel |
| **MediaAsset** | id, hotelId, url, kind(photo/video), alt, order | N—1 Hotel |
| **Partner** | id, hotelId, plan(Starter/Growth/Campaign), status, monthlyFee, since, contactEmail | 1—1 Hotel(옵션), 1—N Campaign |
| **Campaign** | id, hotelId, slot, period(start/end), status(Live/Scheduled/Ended), budget | N—1 Hotel |
| **Inquiry** (lead) | id, hotelName, city, contact, planInterest, message, status(New/Contacted/Won/Lost), createdAt | — |
| **ClickEvent** | id, hotelId, type(official_click/impression), source(home/list/detail/search/campaign), lang, ts, sessionId(anon) | N—1 Hotel |
| **User** | id, role(operator/admin/partner), email, partnerId? | RBAC |

### 다국어 저장 전략
- **콘텐츠 텍스트**: `HotelContent(hotelId, locale)` 행으로 분리. 누락 locale은 `en` 폴백(현 `localizeHotel`과 동일 규칙).
- **enum 라벨**(city/area/facility/tag/hotelType): 코드 i18n 리소스(`locales/*`)에 유지 — DB 불필요(안정적).

---

## 4. REST API 설계

> 상세 타입은 [`src/api/contract.ts`](../src/api/contract.ts). 경로 프리픽스 `/api/v1`.

### 4.1 공개(읽기) — 인증 불필요, 캐시 가능
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/cities` | 목적지 목록(available 포함) |
| GET | `/cities/:slug` | 목적지 상세 |
| GET | `/cities/:slug/hotels` | 도시별 호텔(필터·정렬·페이지) `?area=&tag=&facility=&benefit=&lang=` |
| GET | `/hotels/:slug?lang=` | 호텔 상세(로케일 머지) |
| POST | `/recommend` | AI 추천(쿼리→랭킹+이유). 온디바이스와 동일 응답 스키마 |
| POST | `/track` | 클릭/노출 이벤트 수집(anon) |
| POST | `/inquiries` | 파트너 문의 생성(공개 폼) |

### 4.2 파트너(인증)
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/partner/me` | 내 호텔/플랜/상태 |
| GET | `/partner/metrics?range=` | 내 호텔 성과(views/clicks/CTR/소스) |
| PUT | `/partner/hotel` | 내 호텔 콘텐츠/혜택 수정(검수 큐) |

### 4.3 운영자/백오피스 (RBAC: operator/admin)
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/admin/overview` | KPI 집계 |
| GET/POST/PUT | `/admin/hotels` | 호텔 CRUD + 게시 상태 |
| GET/PUT | `/admin/partners` | 파트너/플랜 관리 |
| GET/POST/PUT | `/admin/campaigns` | 스폰서/캠페인 |
| GET/PUT | `/admin/inquiries` | 리드 상태 관리 |
| GET | `/admin/clicks?range=` | CPC/노출 리포트 |

응답 공통: `Paginated<T>`, 에러는 `ApiError { code, message }`.

---

## 5. 인증 & 권한 (RBAC)

- **일반 사용자**: 익명(서버 세션/쿠키 또는 anon id). 위시리스트 등은 **로컬 저장**으로 시작 → 추후 계정 옵션.
- **파트너**: 이메일+매직링크/OAuth. `partnerId` 스코프로 본인 호텔만 접근.
- **운영자/관리자**: 백오피스. 역할 `operator`(읽기+리드/캠페인 관리), `admin`(전체+사용자 관리).
- 토큰: 짧은 JWT(access) + refresh(httpOnly 쿠키). 모든 쓰기 경로 CSRF/auth 검사.

---

## 6. AI 프록시 (P2)

- 서버리스 함수(`/api/ai/recommend`, `/api/ai/plan`) 뒤에 **Claude API**.
- **키는 서버 환경변수**(앱/웹 미노출). 레이트리밋 + 캐싱.
- **하이브리드**: 온디바이스 추천 결과를 컨텍스트로 전달 → 자유 질의/일정 플래너만 LLM 사용(비용↓, 오프라인 폴백 유지).
- 최신 모델 기본값: `claude-opus-4-8`(고품질) 또는 비용 최적화 시 `claude-haiku-4-5`. (모델 ID는 운영 시 재확인)

---

## 7. 트래킹 & CPC 정산

- `POST /track` 으로 **official_click / impression** 수집(anon sessionId, source, lang, hotelId).
- 집계 잡(일 배치)으로 파트너/운영자 리포트 + **CPC 청구 데이터** 생성.
- 봇/중복 클릭 필터(세션·IP·UA 휴리스틱). 개인정보 최소 수집.

---

## 8. 기술 스택 권장

| 영역 | 권장 | 비고 |
|---|---|---|
| 런타임/언어 | **Node + TypeScript** | 웹/앱과 타입 공유 |
| 프레임워크 | Fastify 또는 NestJS | REST, 검증(zod) |
| DB/ORM | **PostgreSQL + Prisma** | JSONB(roomGuide 등) |
| 이미지 | S3 호환 오브젝트 스토리지 + CDN | picsum 대체 |
| AI | 서버리스(Vercel/Cloudflare Functions) | Claude API 프록시 |
| 배포 | 컨테이너(or 서버리스) + 관리형 PG | 환경: dev/stage/prod |
| 공유 | **monorepo `packages/core`** (types, i18n, searchEngine) | 웹/앱/API 공통 |

---

## 9. mock → DB 마이그레이션

1. 현 `data/hotels.ts`(24개) + `i18n/hotelContent/*`(5개 언어)를 **시드 스크립트**로 변환 → Hotel/HotelContent/Facility/Tag/Media 테이블 적재.
2. 프론트는 `contract.ts` 타입 그대로, 데이터 소스만 mock→fetch로 교체(어댑터 패턴).
3. 백오피스 `adminData`(파생)를 실제 집계 쿼리로 대체.

---

## 10. 단계별 로드맵

- **Phase 1 — 읽기 API(MVP)**: cities/hotels/recommend(온디바이스 미러)/track/inquiries + 시드. 프론트 데이터 소스 교체.
- **Phase 2 — 운영/파트너 CRUD**: 백오피스/파트너 쓰기 + RBAC + 검수 큐 + 이미지 업로드.
- **Phase 3 — AI 프록시 + 정산**: LLM 플래너, 클릭 집계/CPC 리포트, 캠페인 스케줄러.

---

## 11. 비기능 요구

- **성능/캐시**: 공개 읽기 Edge 캐시(콘텐츠 변경 시 무효화). 페이지네이션 필수.
- **보안**: 결제/카드 **미보유**(범위 회피), 최소 PII, 입력 검증(zod), rate limit, 감사 로그(운영 쓰기).
- **관측성**: 요청 로그 + 퍼널 이벤트(검색→상세→공식클릭).
- **i18n 정합성**: HotelContent locale 누락 시 en 폴백, 콘텐츠 검수 상태 플래그.

---

## 12. 오픈 이슈 (결정 필요)

- 일반 사용자 **계정 도입 시점**(위시리스트 동기화 vs 로컬 only)
- 호스팅 형태(**컨테이너 vs 풀 서버리스**)
- 이미지 파이프라인(직접 업로드 vs 파트너 제공 URL 검증)
- 콘텐츠 **번역 워크플로**(AI 초벌 → 원어민 감수 큐) 운영 주체
- 모델 선택/비용 가드(Opus vs Haiku, 캐싱 정책)

---

_본 문서는 살아있는 초안입니다. API 계약은 코드(`src/api/contract.ts`)와 항상 동기화하세요._
