# 05 · Files and Resources

> 관련 파일 목록 · 용도 · 외부 링크 · 새 계정에 다시 업로드/재연결해야 할 항목.

---

## A. 폴더 구조 (2단계)

```
AI-StayEasy/
├─ .claude/launch.json        # 프리뷰 서버 설정 (stayeasy-dev, 5173)
├─ .env                       # 로컬 환경변수 (gitignore, VITE_GA_ID만)
├─ .env.example               # 환경변수 템플릿(전 항목 주석)
├─ .github/workflows/deploy.yml  # GitHub Pages 자동 배포
├─ README.md                  # 영문 소개 (구버전 — 현행화 필요)
├─ handover.md                # 2026-07-07 이관 문서 (git 미추적)
├─ transfer/                  # ← 이 이전 패키지 (01~07 + 체크리스트)
├─ docs/                      # 기획 문서 5종 (아래 C절)
├─ index.html                 # Search Console 인증 메타 포함
├─ public/                    # favicon, icon.svg, manifest, og-image, sw.js
├─ scripts/                   # gen-sitemap/og/icons/static-routes .mjs + seed.mjs
├─ server/                    # Fastify+Prisma 백엔드 (스캐폴드, 미배포)
│  ├─ src/ (index.ts, db.ts)
│  ├─ prisma/ (schema.prisma, seed.ts, dev.db)
│  └─ Dockerfile / package.json / README.md
├─ src/
│  ├─ main.tsx / App.tsx
│  ├─ api/contract.ts
│  ├─ components/ (재사용 UI + admin/)
│  ├─ data/ (hotels.ts = 30개 호텔 카탈로그 + repo 추상화)
│  ├─ i18n/ locales/(UI 5개 언어) + hotelContent/(호텔 텍스트, id로 키)
│  ├─ lib/ (bm, analytics, searchEngine, partnerAuth …)
│  ├─ pages/ (페이지)
│  └─ __tests__/ (smoke.test.ts, render.test.tsx)
├─ vite.config.ts · vercel.json · render.yaml
└─ tailwind.config.js · tsconfig*.json · postcss.config.js
```

## B. 이번 세션에서 변경/생성된 파일
- `tailwind.config.js` — `brand.950` 추가 (배포됨)
- `src/pages/PartnerPortalPage.tsx`, `src/pages/PartnerEditPage.tsx`, `src/components/Navbar.tsx` — 포털 홈 링크/새 탭 (배포됨)
- `src/data/hotels.ts` + `src/i18n/hotelContent/{ko,ja,vi,zh}.ts` — h01 Olalani(배포), h02 DLG(미배포) 실제 데이터
- `transfer/01~07_*.md` — 이 이전 패키지 (신규)
- `handover.md` — 기존 이관 문서 (git 미추적, 이전 세션 산출)

## C. 문서 (docs/)
| 파일 | 용도 |
|------|------|
| `docs/ADSENSE_LAUNCH_PLAN.md` | 실서비스 전환·AdSense 승인 기획 |
| `docs/APP_CONCEPT.md` | 모바일 앱 구상(React Native+Expo) |
| `docs/BACKEND_PLAN.md` | 백엔드 아키텍처·API 계약 기획 |
| `docs/PARTNER_PORTAL.md` | 파트너 포털(엑스트라넷) 로드맵 |
| `docs/SEARCH_CONSOLE_PLAN.md` | Search Console→파트너 포털 연동 기획 |

## D. 외부 링크 / 서비스
| 서비스 | 링크 / 식별자 | 상태 · 계정 종속 |
|--------|--------------|------------------|
| 프로덕션 사이트 | https://bstars00-rgb.github.io/AI-StayEasy/ | 저장소에 종속 → 이전 시 **URL 변경** |
| GitHub 저장소 | https://github.com/bstars00-rgb/AI-StayEasy | **개인 계정 bstars00-rgb 소유** |
| GitHub Actions | https://github.com/bstars00-rgb/AI-StayEasy/actions | 배포 로그 |
| Google Analytics 4 | 측정 ID는 워크플로/`.env`에 (값 미기재) | 속성 소유권 = 생성 Google 계정 (**확인 필요**) |
| Google Search Console | `index.html` meta 태그로 인증 | 콘솔 접근권 = 인증 계정 (**확인 필요**) |
| Google OAuth | `VITE_GOOGLE_CLIENT_ID` 미설정 | 신규 Cloud 프로젝트 필요(예정) |
| Google AdSense | 미개설 | BM ON 이후(예정) |
| OpenStreetMap | Leaflet 타일 | 계정 불필요 |

## E. 진행 중 작업의 참고 자료 — 다낭 호텔 공식 사이트 목록

### 기존 다낭 10곳 (모두 실제 공식 URL 보유)
1. h01 Olalani — https://www.olalani.net/  **[전환 완료·배포]**
2. h02 DLG Hotel Danang — https://dlghoteldanang.com/  **[전환 완료·미배포]**
3. h03 M Hotel Danang — https://mhotel.vn/property/m-hotel-da-nang/  (데이터 확보)
4. h04 Grand Tourane — https://grandtouranehotel.com/  (데이터 확보)
5. h05 HAIAN Beach Hotel & Spa — https://haianbeachhotelspa.com/  (데이터 확보)
6. h06 Le Sands Oceanfront — https://lesandshotel.com/  (데이터 확보)
7. h07 Brilliant Hotel — https://brillianthotel.vn/en/  (데이터 확보)
8. h08 Sanouva Danang — https://www.sanouvadanang.com/  (데이터 확보)
9. h09 Parosand Danang — https://parosanddanang.com/  (데이터 확보)
10. h10 Adamo Hotel — https://www.adamodanang.com/en  (데이터 확보)

### 신규 후보 9곳 (공식 사이트 라이브 검증 완료 · 승인 대기)
1. Furama Resort Danang — https://furamavietnam.com/
2. Pullman Danang Beach Resort — https://www.pullman-danang.com/
3. TIA Wellness Resort — https://tiawellnessresort.com/
4. Naman Retreat — https://namanretreat.com/
5. Fusion Resort & Villas Da Nang — https://fusionresorts.com/danang/
6. À La Carte Danang Beach — https://www.alacartedanangbeach.com/
7. Muong Thanh Luxury Da Nang — https://luxurydanang.muongthanh.com/
8. Diamond Sea Hotel — https://diamondseahotel.com/
9. Wink Hotel Danang Centre — https://wink-hotels.com/hotel/wink-hotel-danang-centre/
- **10번째 미확정** (체인 리조트 중 택1 제안: Vinpearl Resort & Spa Da Nang / Sheraton Grand Danang / Hyatt Regency Danang / Danang Marriott — 공식 사이트 존재하나 페처 차단으로 실시간 확인 미완, **확인 필요**)
- 확인 실패로 제외한 후보(이 환경 DNS/인증서 이슈, 실존 여부 별개): Sala Danang, Balcona, Sel de Mer, Cicilia, Belle Maison Hadana, Grandvrio, Golden Bay 등 — **재확인 필요**.

## F. 새 계정에서 다시 업로드/이관해야 할 항목
- **소스코드 전체**: GitHub 저장소를 그대로 이어받으면 됨(별도 업로드 불필요). 단, 저장소 소유권 이전 필요 → G절.
- **로컬 `.env`**: git에 없음 → 새 환경에서 `VITE_GA_ID` 등 재설정 필요. (`.env.example` 참조)
- **이 transfer/ 패키지 + handover.md**: 새 계정 프로젝트 지침/컨텍스트로 재입력.
- **Claude 로컬 메모리**: 자동 이전 안 됨 → `02_Project_Instructions.md`로 대체.
- **localStorage 데모 데이터**(커뮤니티 글·위시리스트·파트너 계정·게스트 신원): 서버에 없음, 브라우저에만 존재 → **이전 불가/재현 불필요**(데모용).

## G. 계정·소유권 (이전의 핵심)
- GitHub 저장소·GitHub Pages·GA4 속성·Search Console가 모두 개인 계정 `bstars00-rgb` / 생성 Google 계정에 종속.
- OPS 계정 이동 시: 저장소 소유권/조직 이전 → **Pages URL 변경** → `vite.config.ts` base·Search Console·GA4 스트림 URL·색인 링크 연쇄 갱신. 커스텀 도메인 동시 검토 권장.
