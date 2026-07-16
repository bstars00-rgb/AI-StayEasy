# StayEasy Vietnam 이관 문서 (Handover)

> 작성일: 2026-07-07 · OPS 계정 → CEO Office 계정 이관용
> 대상 폴더: `C:\Users\LENOVO\Desktop\AI-StayEasy` (활성본 — 데스크톱의 `StayEasy` 폴더는 구버전임, §16 참조)

---

## 1. 한 줄 요약

베트남 호텔 **직접예약(공식사이트 예약) 콘텐츠 플랫폼** "StayEasy Vietnam"의 활성 프론트엔드 — React+Vite SPA, GitHub Pages 배포 중(https://bstars00-rgb.github.io/AI-StayEasy/), 모든 수익모델(BM)은 `VITE_ENABLE_BM` 스위치 뒤에 숨김(기본 OFF, 콘텐츠 우선 전략).

## 2. 프로젝트 목적

- **포지션**: OTA가 아님. 예약·결제를 처리하지 않고 수수료도 받지 않는 **호텔 콘텐츠·비교 플랫폼**. 모든 호텔 상세 페이지가 호텔 **공식 웹사이트 예약** CTA로 유도.
- **수익모델(현재 전부 숨김)**: 무료 리스팅 → 유료 공식예약 가이드 페이지, 프리미엄 콘텐츠 제작, Featured 노출, 공식예약 클릭 광고(CPC), 시즌 캠페인 광고, AdSense, 회원 전용 바우처. 유료 노출은 "Sponsored" 라벨로 투명하게 표기.
- **전략**: 콘텐츠·오디언스 먼저 확보, BM은 나중에 스위치 ON. 그래서 바우처·광고·Sponsored 배지·소비자 로그인 등 수익 요소 전부가 `src/lib/bm.ts`의 `BM_ENABLED`(=`VITE_ENABLE_BM === 'true'`) 뒤에 게이트되어 있음(코드는 그대로 보존, 화면에서만 숨김).
- **시장**: 다낭 → 호치민·냐짱·푸꾸옥 확장. 5개 언어(EN/KO/VI/ZH/JA) 완전 지원. 현재 데이터는 4개 도시 24개 샘플 호텔(mock).

## 3. 현재 진행 상태 (최근 커밋 5개)

git 작업트리 클린(`git status --short` 결과 없음). 브랜치 main, 원격 `origin = https://github.com/bstars00-rgb/AI-StayEasy.git`.

| 커밋 | 날짜 | 내용 |
|------|------|------|
| `7e8acdb` | 2026-07-07 | 히어로 하단 텍스트 영역 어둡게 처리(가독성 확보) |
| `4c638a6` | 2026-07-07 | 히어로 배경을 차분한 어두운 바다 사진으로 교체 |
| `8617265` | 2026-07-07 | 밝은 사진 위 히어로 텍스트 가독성 수정 |
| `d08e8aa` | 2026-07-07 | AI 검색 아래 "on-device 추천" 문구 제거 |
| `f245cb8` | 2026-07-07 | 히어로 오버레이를 밝게 해 배경 사진 노출 |

(그 외 최근: 호텔 커뮤니티 회원 게이트 `c279da5`, 실사진 교체 `9a516d2`, 호텔별 커뮤니티 스레드(localStorage 목업) `2af59b6`)

## 4. 주요 기능

- **AI 호텔 검색** (`src/lib/searchEngine.ts`) — 5개 언어 자연어 입력을 on-device로 파싱·스코어링·랭킹. 백엔드/API 키 불필요. 추후 LLM 프록시로 교체 가능한 인터페이스.
- **호텔 상세** — StayEasy 요약, 공식예약 혜택, 객실 가이드, 위치 가이드, 시설 아이콘 그리드, 취소정책 체크리스트, "공식 웹사이트에서 예약" CTA.
- **미슐랭식 희소 등급**(`src/lib/distinction.ts`) + 성급별 표기 + 시설 유형(`propertyType.ts`).
- **지도** — Leaflet + OpenStreetMap (`HotelMap.tsx`, `AsiaMap.tsx`). 좌표는 **근사 좌표**(실좌표 미반영).
- **호텔 커뮤니티** (`HotelCommunity.tsx`, `src/lib/community.ts`) — localStorage 목업, 회원 로그인 게이트.
- **위시리스트** — localStorage 저장, 네비바 카운트 배지.
- **5개 언어 i18n** — UI(`src/i18n/locales/*`) + 호텔 콘텐츠(`src/i18n/hotelContent/*`), 페이지별 SEO/OG 메타 현지화.
- **파트너/운영 영역** — 파트너 포털·로그인·호텔 편집·인사이트(포털은 무료 툴 포지션), 목업 대시보드(`/dashboard`), 백오피스(`/admin`).
- **SEO/PWA** — 빌드 후처리로 sitemap/robots, OG 이미지 래스터, PWA 아이콘, 전 라우트 정적 HTML 프리렌더(soft-404 방지). `manifest.webmanifest` + `sw.js`로 설치형 PWA.
- **GA4 계측** — SPA page_view + 인텐트 이벤트(hotel_view, voucher_unlock, voucher_download, official_site_click, contact_click). `src/lib/analytics.ts`.
- **BM 게이트** — 바우처(`VoucherCard`), 광고(`AdSlot`), Sponsored 배지, 소비자 로그인 전부 `bm.ts` 스위치 뒤.

## 5. 기술 스택

| 구분 | 스택 |
|------|------|
| 프론트엔드 | React 18 + TypeScript(strict) + Vite 5 + Tailwind CSS 3 + React Router 6 |
| 지도 | Leaflet 1.9 + OpenStreetMap 타일 |
| 테스트 | Vitest 2 + Testing Library + jsdom (smoke/render 테스트) |
| 빌드 후처리 | Node 스크립트 4종(`scripts/gen-*.mjs`), @resvg/resvg-js(SVG→PNG) |
| 백엔드(스캐폴드) | Fastify 4 + Prisma 5 + SQLite(로컬)/PostgreSQL(운영 전환용), tsx 실행 |
| 배포 | GitHub Pages(GitHub Actions) · vercel.json(Vercel 대안) · render.yaml(서버용 Render 설정) |

## 6. 폴더 구조 (2단계)

```
AI-StayEasy/
├─ .claude/launch.json        # Claude Code 프리뷰 서버 설정
├─ .env                       # 로컬 환경변수(gitignore, VITE_GA_ID만 설정됨)
├─ .env.example               # 환경변수 템플릿(주석 포함)
├─ .github/workflows/
│  └─ deploy.yml              # GitHub Pages 자동 배포(main push 시)
├─ README.md                  # 영문 프로젝트 소개(일부 내용은 초기 기준으로 구버전)
├─ dist/                      # 빌드 산출물(커밋 대상 아님)
├─ docs/
│  ├─ ADSENSE_LAUNCH_PLAN.md  # 실서비스 전환·AdSense 승인 기획
│  ├─ APP_CONCEPT.md          # 모바일 앱 구상(React Native+Expo)
│  ├─ BACKEND_PLAN.md         # 백엔드 아키텍처·API 계약 기획
│  ├─ PARTNER_PORTAL.md       # 파트너 포털(호텔 엑스트라넷) 로드맵
│  └─ SEARCH_CONSOLE_PLAN.md  # Search Console→파트너 포털 연동 기획
├─ index.html                 # 진입 HTML(Search Console 인증 메타 포함)
├─ public/                    # favicon, icon.svg, manifest, og-image, sw.js
├─ scripts/
│  ├─ gen-sitemap.mjs         # dist/sitemap.xml + robots.txt 생성
│  ├─ gen-og.mjs              # OG 이미지 SVG→PNG
│  ├─ gen-icons.mjs           # PWA 아이콘 PNG 생성
│  ├─ gen-static-routes.mjs   # 전 라우트 정적 HTML 프리렌더(soft-404 방지)
│  └─ seed.mjs                # DB 시드 설계 스케치(템플릿, 실행용 아님)
├─ server/                    # Fastify+Prisma 백엔드(스캐폴드, 미배포)
│  ├─ src/ (index.ts, db.ts)  # API 서버 본체
│  ├─ prisma/ (schema.prisma, seed.ts, dev.db)  # SQLite 스키마·시드·로컬DB
│  ├─ Dockerfile / package.json / README.md
├─ src/
│  ├─ main.tsx / App.tsx      # 엔트리 + 라우팅(레거시 리다이렉트 포함)
│  ├─ api/contract.ts         # 프론트↔백엔드 API 계약(단일 소스)
│  ├─ components/             # 재사용 UI 33종 + admin/
│  ├─ data/                   # mock 카탈로그 + repo 추상화(mock/api 자동 선택)
│  ├─ i18n/                   # locales/(UI 5개 언어) + hotelContent/(호텔 텍스트)
│  ├─ lib/                    # 도메인 로직 40여 모듈(bm, analytics, searchEngine…)
│  ├─ pages/                  # 페이지 24종
│  └─ __tests__/              # smoke.test.ts, render.test.tsx
├─ vite.config.ts             # GITHUB_PAGES=true 시 base '/AI-StayEasy/' + 404.html 복사
├─ vercel.json / render.yaml  # 대안 배포 설정
└─ tailwind.config.js / tsconfig*.json / postcss.config.js
```

## 7. 주요 파일 설명

| 경로 | 역할 |
|------|------|
| `src/lib/bm.ts` | **BM 마스터 스위치.** `VITE_ENABLE_BM=true`일 때만 바우처·광고·Sponsored·소비자 로그인 노출. 기본 OFF |
| `src/lib/analytics.ts` | GA4 이벤트 배선(SPA page_view + 인텐트 이벤트) |
| `src/lib/searchEngine.ts` | on-device AI 자연어 호텔 검색(5개 언어) |
| `src/lib/distinction.ts` | 미슐랭식 희소 등급 로직 |
| `src/lib/community.ts` | 호텔 커뮤니티(localStorage 목업) |
| `src/lib/googleAuth.ts` / `guestAuth.ts` | Google 로그인(클라이언트ID 미설정 시 데모 신원 폴백) |
| `src/data/repo.ts` | 데이터 저장소 추상화 — `VITE_API_URL` 설정 시 `apiRepo`(실API), 아니면 `mockRepo`(번들 mock) |
| `src/api/contract.ts` | 프론트/백엔드 공용 API 계약 정의 |
| `src/App.tsx` | 라우트 정의 + 레거시 경로 리다이렉트 + Pages basename 처리 |
| `index.html` | Google Search Console 인증 메타 태그 포함(`google-site-verification`) |
| `vite.config.ts` | `GITHUB_PAGES=true` → base `/AI-StayEasy/`, `index.html`→`404.html` SPA 폴백 |
| `.github/workflows/deploy.yml` | main push 시 빌드(GITHUB_PAGES=true, VITE_GA_ID 주입) 후 Pages 배포 |
| `scripts/gen-static-routes.mjs` | 전 공개 라우트를 실제 HTML로 프리렌더(Google soft-404 방지, SEO 핵심) |
| `server/src/index.ts` | Fastify API 서버(`/api/v1`, `/health`) |
| `server/prisma/schema.prisma` | City/Hotel 스키마(SQLite, 한 줄 변경으로 PostgreSQL 전환 가능) |
| `docs/BACKEND_PLAN.md` 외 4종 | 백엔드·AdSense·앱·파트너포털·Search Console 기획 문서(한국어 다수) |

## 8. 환경변수/설정값 (값 기재 금지)

`.env.example`에 전 항목 주석 포함. 모든 변수는 **미설정 시 해당 기능이 no-op**이 되도록 설계됨.

| 변수명 | 용도 | 필수여부 |
|--------|------|----------|
| `VITE_ENABLE_BM` | 수익모델 마스터 스위치(바우처·광고·Sponsored·소비자 로그인). `true`일 때만 노출 | 선택(기본 OFF 유지가 현 전략) |
| `VITE_GA_ID` | GA4 측정 ID(G-…). 현재 `.env`에 설정돼 있고, 배포 워크플로에도 주입됨 | 운영 필수(계측용) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 웹 클라이언트 ID. 설정 시 데모 로그인 대신 실제 Google 로그인 | 선택(미설정) |
| `VITE_ADSENSE_CLIENT` | AdSense 퍼블리셔 ID(ca-pub-…). 설정 시 광고 슬롯 렌더 | 선택(미설정) |
| `VITE_API_URL` | Fastify 백엔드 베이스 URL. 설정 시 mock 대신 실API 사용 | 선택(백엔드 가동 시) |
| `VITE_CONTACT_EMAIL` | 푸터/법적 고지 공개 연락 이메일 | 선택 |
| `DATABASE_URL` | (server/ 전용) Prisma DB 연결 문자열 | 백엔드 가동 시 필수 |
| `SITE_URL` | (빌드 시) sitemap 생성용 사이트 URL — 커스텀 도메인 도입 시 설정 | 선택 |
| `GITHUB_PAGES` | (빌드 시) `true`면 base가 `/AI-StayEasy/`로 전환 | Pages 빌드 시 필수 |

현재 로컬 `.env`에는 `VITE_GA_ID` 1개만 설정되어 있음(값은 이 문서에 기재하지 않음).

## 9. 외부 서비스 연동

| 서비스 | 용도 | 계정 종속성 |
|--------|------|-------------|
| **GitHub (bstars00-rgb/AI-StayEasy)** | 소스 저장소 + Actions 배포 | **개인 계정 `bstars00-rgb` 소유** — 이관 시 저장소 소유권/조직 이전 필요 |
| **GitHub Pages** | 프로덕션 호스팅 (https://bstars00-rgb.github.io/AI-StayEasy/) | 저장소에 종속. 저장소 이전 시 **URL 자체가 바뀜**(Search Console·GA4 재설정 연쇄) |
| **Google Analytics 4** | 트래픽·인텐트 이벤트 계측(실측정 ID 연동 완료, 워크플로에 공개값으로 하드코딩) | GA4 속성을 만든 Google 계정 — 속성 사용자/소유권 이전 필요 |
| **Google Search Console** | 검색 노출 관리(인증 메타 태그가 `index.html`에 커밋됨) | 인증한 Google 계정 — 새 계정을 소유자로 추가 필요 |
| **Google OAuth (예정)** | 회원 로그인(`VITE_GOOGLE_CLIENT_ID` 미설정 — 현재 데모 신원 폴백) | Google Cloud 프로젝트 신규 생성 필요 |
| **Google AdSense (예정)** | 광고 수익(BM ON 이후) — `docs/ADSENSE_LAUNCH_PLAN.md` 기획만 존재 | 미개설 |
| **OpenStreetMap** | 지도 타일(Leaflet) | 계정 불필요(무료 타일) |
| **Vercel / Render (대안)** | `vercel.json`(프론트), `render.yaml`(서버) 설정 파일만 존재 — 실제 배포는 GitHub Pages | 미사용 |

## 10. 연동 여부 요약

| 항목 | 상태 |
|------|------|
| DB | **미연동** (프론트는 번들 mock. server/에 SQLite `dev.db` 로컬 전용 존재, 미배포) |
| Supabase | **미사용** (흔적 없음) |
| GitHub | **연동** (origin=bstars00-rgb/AI-StayEasy, Actions로 Pages 자동 배포) |
| 외부 API | GA4(클라이언트 계측) 연동 / Google OAuth·AdSense·자체 백엔드 API는 **스위치만 준비, 미연동** |

## 11. 실행 방법

전제: Node.js 18+ (배포 워크플로는 Node 20), npm.

```powershell
# 1) 설치
cd C:\Users\LENOVO\Desktop\AI-StayEasy
npm install

# 2) 개발 서버 (기본 http://localhost:5173)
npm run dev

# 3) 타입 체크
npm run lint

# 4) 프로덕션 빌드 (tsc + vite + sitemap/OG/아이콘/정적 라우트 생성) 및 로컬 확인
npm run build
npm run preview

# 5) 테스트 (Vitest)
npm test

# 6) GitHub Pages와 동일한 빌드 (base=/AI-StayEasy/)
$env:GITHUB_PAGES = 'true'; npm run build
# (Git Bash라면: GITHUB_PAGES=true npm run build)
```

배포는 별도 명령 불필요 — **main에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포**.

백엔드(선택, 로컬 실험용):

```powershell
cd C:\Users\LENOVO\Desktop\AI-StayEasy\server
npm install
npm run db:setup     # prisma generate + db push + seed (prisma/dev.db 생성)
npm run dev          # http://localhost:8787/api/v1 , GET /health

# 프론트를 실API에 연결하려면 리포 루트에서:
# .env.local 에 VITE_API_URL=http://localhost:8787 추가 후 npm run dev
```

## 12. 미완료 작업

- **지도 실좌표** — 현재 근사 좌표. 호텔별 실좌표 입력 필요.
- **커뮤니티 실백엔드** — localStorage 목업. 서버 저장소·모더레이션 필요.
- **실제 Google OAuth** — `VITE_GOOGLE_CLIENT_ID` 미설정, 데모 신원으로 폴백 중.
- **Search Console→파트너 포털 백엔드** — `docs/SEARCH_CONSOLE_PLAN.md` 기획만 존재(서버 측 Search Console API 필요).
- **백엔드 실배포** — server/는 스캐폴드+로컬 SQLite. PostgreSQL 전환·호스팅(render.yaml 준비만 됨) 미실행.
- **실호텔 데이터** — 24개 샘플 호텔 전부 가상("(Sample)" 표기). 실호텔 계약·콘텐츠 필요.
- **AdSense 승인** — 기획 문서만 존재. BM ON 전제.
- **GA4 서버측 리포팅** — 포털 인사이트는 완료됐으나 GA4 Data API(server/) 연동은 선택 과제로 남음.
- **README.md 갱신** — 초기(다낭 12개 호텔, i18n을 로드맵으로 표기) 기준이라 현 상태와 불일치.

## 13. CEO Office에서 이어서 할 다음 작업 (우선순위 순)

1. **계정/소유권 이관 완료** — GitHub 저장소, GA4 속성, Search Console 소유자 추가 (§16 리스크 참조). 다른 무엇보다 먼저.
2. **콘텐츠·오디언스 전략 지속** — BM 스위치는 계속 OFF 유지, 가이드 콘텐츠·SEO 강화(정적 프리렌더 파이프라인은 이미 구축됨).
3. **지도 실좌표 입력 + 실호텔 데이터 확보** — 콘텐츠 신뢰도의 기반.
4. **Google OAuth 실연동** — Cloud 프로젝트 생성 후 `VITE_GOOGLE_CLIENT_ID` 설정(BM ON 시 바우처 게이트에 필요).
5. **커뮤니티 실백엔드** — server/ 스캐폴드 활용(Fastify+Prisma, 계약은 `src/api/contract.ts`에 이미 정의).
6. **백엔드 배포 + `VITE_API_URL` 전환** — repo 레이어가 자동으로 mock→API 전환되도록 설계돼 있음.
7. **BM 스위치 ON 판단 시점에** AdSense 승인 절차(`docs/ADSENSE_LAUNCH_PLAN.md`) 진행.
8. **README.md 현행화** 및 구버전 StayEasy 폴더 정리.

## 14. 임시/중복/테스트 파일 (표시만 — 삭제 금지)

| 경로 | 성격 |
|------|------|
| `dist/` | 빌드 산출물(재생성 가능) |
| `tsconfig.tsbuildinfo`, `tsconfig.node.tsbuildinfo` | tsc 증분 빌드 캐시 |
| `vite.config.js`, `vite.config.d.ts` | `vite.config.ts`의 과거 컴파일 잔재(소스는 .ts) |
| `server/prisma/dev.db` | 로컬 SQLite(시드로 재생성 가능) |
| `scripts/seed.mjs` | 실행용이 아닌 설계 스케치(@ts-nocheck 템플릿) |
| `node_modules/`, `server/node_modules/` | 의존성(재설치 가능) |
| `vercel.json`, `render.yaml` | 현재 미사용 배포 설정(대안 경로로 보존) |
| `C:\Users\LENOVO\Desktop\StayEasy` (별도 폴더) | **구버전 사본(6/15 마지막 커밋)** — 혼동 주의, 이 폴더(AI-StayEasy)가 활성본 |

## 15. 이관 준비 체크리스트

- [x] git 작업트리 클린 확인(`git status --short` 결과 없음, 로컬=원격 동기 상태로 커밋 완료)
- [x] 원격 저장소 확인(origin = github.com/bstars00-rgb/AI-StayEasy)
- [x] 배포 파이프라인 확인(.github/workflows/deploy.yml — main push 시 자동 배포, GA4 ID 주입 포함)
- [x] 환경변수 문서화(.env.example 전 항목 주석 존재, 로컬 .env는 VITE_GA_ID만 설정)
- [x] Search Console 인증 메타 태그가 index.html에 커밋되어 있음을 확인
- [x] BM 게이트 동작 방식 확인(src/lib/bm.ts — 기본 OFF)
- [x] 기획 문서 5종 존재 확인(docs/)
- [ ] 새 PC에서 `npm install` → `npm run dev` → `npm run build` → `npm test` 정상 동작 재검증
- [ ] GitHub 저장소 소유권/권한 이전(bstars00-rgb → CEO Office 계정 또는 조직)
- [ ] GA4 속성에 CEO Office 계정 관리자 추가
- [ ] Search Console에 CEO Office 계정 소유자 추가
- [ ] 배포 사이트(https://bstars00-rgb.github.io/AI-StayEasy/) 최신 커밋 반영 여부 육안 확인
- [ ] 구버전 StayEasy 폴더 보존/폐기 방침 결정

## 16. 리스크 및 주의사항

1. **GitHub 저장소가 개인 계정(bstars00-rgb) 소유** — 이관의 최대 리스크. 저장소를 이전하면 **GitHub Pages URL이 바뀌고**, 그러면 `vite.config.ts`의 base 경로, Search Console 속성, GA4 스트림 URL, 공유·색인된 모든 링크를 함께 갱신해야 함. 커스텀 도메인 도입을 이관과 동시에 검토할 것.
2. **GA4 속성 소유권** — 측정 ID는 워크플로에 공개값으로 커밋돼 있으나(클라이언트 값이라 안전), **속성 자체는 생성 계정에 귀속**. 계정 접근을 잃으면 축적된 데이터·설정을 잃음. 이관 전 CEO Office 계정을 관리자로 추가 필수.
3. **Search Console 인증** — `index.html`의 meta 태그 방식이므로 사이트는 계속 인증되지만, **콘솔 접근 권한은 인증 계정에 귀속**. 소유자 추가 필요.
4. **localStorage 데모 데이터** — 커뮤니티 글, 위시리스트, 파트너 계정, 게스트 로그인 신원이 전부 **브라우저 localStorage**에만 존재. 실사용자 데이터처럼 보이지만 서버에 없음. 시연 시 오해 주의.
5. **구버전 폴더 혼동** — 데스크톱의 `StayEasy` 폴더는 6/15 이후 멈춘 구버전. **이 폴더(AI-StayEasy)가 유일한 활성본**. 구버전에서 작업하는 사고 방지를 위해 명확히 라벨링/보관 권장.
6. **모든 호텔 데이터가 가상** — "(Sample)" 표기가 있으나 실서비스 전환 전 법적 고지·데이터 교체 필요.
7. **BM 스위치 실수 방지** — `VITE_ENABLE_BM=true`를 배포 환경에 설정하면 바우처·광고·Sponsored가 즉시 공개됨. 전략상 OFF 유지가 기본.
8. **server/는 미배포 스캐폴드** — dev.db는 로컬 전용. 운영 전환 시 PostgreSQL 전환(schema.prisma 주석 참조)과 시크릿 관리 필요.
