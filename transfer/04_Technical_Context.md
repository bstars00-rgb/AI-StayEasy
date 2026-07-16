# 04 · Technical Context

> 시스템 구조 · 개발 환경 · 데이터 구조 · 연동 정보 · 실행 방법. (handover.md의 기술 내용을 최신 상태로 반영)

---

## A. 기술 스택

| 구분 | 스택 |
|------|------|
| 프론트엔드 | React 18 + TypeScript(strict) + Vite 5 + Tailwind CSS 3 + React Router 6 |
| 지도 | Leaflet 1.9 + OpenStreetMap 타일 (좌표는 근사값) |
| 테스트 | Vitest 2 + Testing Library + jsdom (smoke/render) |
| 빌드 후처리 | Node 스크립트 4종(`scripts/gen-*.mjs`), @resvg/resvg-js(SVG→PNG) |
| 백엔드(스캐폴드, 미배포) | Fastify 4 + Prisma 5 + SQLite(로컬)/PostgreSQL(운영 전환용), tsx |
| 배포 | GitHub Pages(GitHub Actions) · vercel.json(대안) · render.yaml(서버용) |

## B. 시스템 구조 / 주요 파일

| 경로 | 역할 |
|------|------|
| `src/lib/bm.ts` | **BM 마스터 스위치** — `VITE_ENABLE_BM=true`일 때만 수익요소 노출. 기본 OFF |
| `src/lib/searchEngine.ts` | on-device AI 자연어 호텔 검색(5개 언어) |
| `src/lib/analytics.ts` | GA4 이벤트 배선(SPA page_view + 인텐트 이벤트) |
| `src/lib/distinction.ts` | 미슐랭식 희소 등급 로직 |
| `src/lib/community.ts` | 호텔 커뮤니티(localStorage 목업) |
| `src/lib/partnerAuth.ts` / `partnerAccounts.ts` | 파트너 로그인/계정(**localStorage 데모, 비밀번호 평문**) |
| `src/data/hotels.ts` | 호텔 카탈로그(영어 base). 현재 **총 30개 호텔**(다낭 h01–h10 + 타 도시 20) |
| `src/data/repo.ts` | 데이터 추상화 — `VITE_API_URL` 설정 시 실API, 아니면 mock 자동 선택 |
| `src/i18n/hotelContent/{ko,ja,vi,zh}.ts` | 호텔 콘텐츠 **현지화(호텔 id로 키)**. base와 함께 갱신 필요 |
| `src/i18n/locales/{en,ko,vi,zh,ja}.ts` | UI 문자열 i18n |
| `src/api/contract.ts` | 프론트/백엔드 공용 API 계약 |
| `src/App.tsx` | 라우트 + 레거시 리다이렉트 + Pages basename |
| `index.html` | Google Search Console 인증 메타 포함 |
| `vite.config.ts` | `GITHUB_PAGES=true` → base `/AI-StayEasy/`, index.html→404.html SPA 폴백 |
| `.github/workflows/deploy.yml` | main push 시 자동 빌드(GA ID 주입) · Pages 배포 |
| `scripts/gen-static-routes.mjs` | 전 공개 라우트 정적 프리렌더(SEO 핵심) |
| `server/` | Fastify+Prisma 백엔드(스캐폴드, 미배포, 로컬 dev.db) |

### 호텔 데이터 구조 (핵심)
- 호텔 = `src/data/hotels.ts`의 객체(`id`, `slug`, `name`, `officialWebsiteUrl`, `facilities[]`, `officialBenefits[]`, `roomGuide`, `locationGuide`, `contact?`, `koreanFriendly` 등). 타입: `src/types/index.ts`의 `Hotel`.
- **번역 가능한 텍스트 필드**는 로케일 파일에서 **호텔 id(`h01`,`h02`…)로 오버라이드**. 타입: `src/i18n/hotelContent/types.ts`의 `HotelText`. 영어는 base(hotels.ts) 사용.
- 시설 아이콘: `src/lib/facilities.ts` — 소문자 라벨 매핑, 미지정은 `✓` 폴백. 알려진 키: pool, breakfast, beachfront, kids club, kids-friendly, korean-friendly, spa, gym, airport transfer, restaurant, bar, parking, free wi-fi, kitchen. (`Fitness`는 매핑 없음 → `Gym` 사용 권장.)
- **알려진 버그(수정 중)**: 과거 호텔 라인업 교체 시 로케일 파일이 갱신 안 돼, 비영어 페이지가 **다른 호텔 내용**을 보여줌. 실제 전환 작업이 각 `hXX` 로케일을 실제 호텔로 재작성하며 함께 수정 중(h01·h02 완료).

## C. 개발 환경 / 실행 방법

전제: Node.js 18+ (배포 워크플로는 Node 20), npm. Windows/PowerShell 환경(Git Bash 병행). Claude Code 프리뷰 설정: `.claude/launch.json` (name: `stayeasy-dev`, port 5173).

```powershell
cd C:\Users\LENOVO\Desktop\AI-StayEasy
npm install
npm run dev        # http://localhost:5173
npm run lint       # 타입 체크 (tsc --noEmit)
npm run build      # tsc + vite + sitemap/OG/아이콘/정적 라우트
npm run preview
npm test           # Vitest
# GitHub Pages와 동일 빌드:
$env:GITHUB_PAGES = 'true'; npm run build   # (Git Bash: GITHUB_PAGES=true npm run build)
```

배포: **main에 push → `.github/workflows/deploy.yml` 자동 배포.** 별도 명령 불필요.

백엔드(선택, 로컬 실험):
```powershell
cd server
npm install
npm run db:setup   # prisma generate + db push + seed (prisma/dev.db)
npm run dev        # http://localhost:8787/api/v1 , GET /health
# 프론트를 실API 연결: 리포 루트 .env.local 에 VITE_API_URL=http://localhost:8787
```

## D. 환경변수 (값은 문서에 미기재 — `.env.example` 주석 참조)

| 변수 | 용도 | 필수 |
|------|------|------|
| `VITE_ENABLE_BM` | 수익모델 마스터 스위치. `true`일 때만 노출 | 선택(기본 OFF 유지가 전략) |
| `VITE_GA_ID` | GA4 측정 ID. 로컬 `.env`에 설정됨 + 배포 워크플로에 주입 | 운영 필수 |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 웹 클라이언트 ID. 미설정 시 데모 신원 폴백 | 선택(미설정) |
| `VITE_ADSENSE_CLIENT` | AdSense 퍼블리셔 ID | 선택(미설정) |
| `VITE_API_URL` | Fastify 백엔드 베이스 URL. 설정 시 mock 대신 실API | 선택 |
| `VITE_CONTACT_EMAIL` | 푸터/법적 고지 공개 이메일 | 선택 |
| `DATABASE_URL` | (server/) Prisma DB 연결 | 백엔드 가동 시 필수 |
| `SITE_URL` | (빌드) sitemap용 사이트 URL | 선택 |
| `GITHUB_PAGES` | (빌드) `true`면 base `/AI-StayEasy/` | Pages 빌드 시 필수 |

현재 로컬 `.env`에는 `VITE_GA_ID` **1개만** 설정. 나머지는 미설정 시 해당 기능 no-op 설계.

## E. 연동 정보 (상세는 05_Files_and_Resources.md D절)
- **연동됨**: GitHub(origin=bstars00-rgb/AI-StayEasy, Actions 자동 배포), GA4(클라이언트 계측).
- **미연동/스위치만 준비**: Google OAuth, AdSense, 자체 백엔드 API, DB(프론트는 번들 mock).
- **미사용**: Supabase(흔적 없음), Vercel/Render(설정 파일만).
