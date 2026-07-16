# 03 · Progress and Decisions

> 완료 업무 · 진행 중 업무(진행률) · 주요 결정사항 · 변경 이력. 이번 세션(2026-07-14) 내용 + 그 이전 이력(handover.md 기준)을 함께 유지.

---

## A. 완료된 작업

### 이전부터 완료 (handover.md 2026-07-07 기준, 요약)
- 프론트엔드 전체: AI 호텔 검색(on-device, 5개 언어), 호텔 상세, 지도(Leaflet/OSM, **근사 좌표**), 호텔 커뮤니티(localStorage 목업), 위시리스트, 5개 언어 i18n, SEO/PWA(정적 프리렌더·sitemap·OG·아이콘·sw.js), GA4 계측, BM 게이트.
- 배포 파이프라인(`.github/workflows/deploy.yml`, main push 자동 배포, GA ID 주입).
- 기획 문서 5종(`docs/`), 백엔드 스캐폴드(`server/`, Fastify+Prisma+SQLite, 미배포).

### 이번 세션(2026-07-14) 완료
1. **히어로 텍스트 가독성 근본 수정** — 커밋 `ef4d383` (배포됨).
   - 원인: 오버레이가 존재하지 않는 `brand-950` 색을 참조 → Tailwind가 오버레이를 렌더하지 않아 흰 글씨가 밝은 사진 위에 노출. 이전 커밋 여러 개가 무효로 반복됐던 근본 원인.
   - 조치: `tailwind.config.js`에 `brand.950: '#04231a'` 추가. 검증: 최악(순백 배경)에서도 텍스트 영역 대비 15.7:1(WCAG AAA 통과).
2. **파트너 포털 홈 링크 + 새 탭 진입** — 커밋 `c784e19` (배포됨).
   - 포털·편집 페이지 로고 → 홈(`/`) 링크. Navbar "호텔 로그인" 진입(데스크톱·모바일) → `target="_blank"` 새 탭.
3. **Olalani Resort & Condotel (h01) 실제 데이터 전환** — 커밋 `004ba6e` (배포됨).
   - 공식 사이트(olalani.net) 검증 데이터로 base + ko/ja/vi/zh 전면 교체. 지어낸 내용(3개 풀·유수풀·워터슬라이드·2인 무료 조식·최저가 보장) 제거. 실제 주소(111 Vo Nguyen Giap, Ngu Hanh Son)·285객실·연락처(rsvn@olalani.net / +84 236 3981 999) 반영.
4. **DLG Hotel Danang (h02) 실제 데이터 전환** — 커밋 `0d7e572` (**커밋됨, 미푸시=미배포**).
   - dlghoteldanang.com 검증. 258 Vo Nguyen Giap, My Khe, 230+ 객실, 2개 풀, 3개 다이닝, 실제 전화(+84 236 3925 888). 지어낸 promo code(MST10)·best-rate 제거.
   - **부수 성과**: 로케일 desync 버그를 함께 수정(h02의 ko/ja/vi/zh가 전혀 다른 호텔 "손짜 절벽 리조트"를 설명하던 것을 실제 DLG로 교체).

## B. 진행 중인 작업과 진행률

### 작업: "다낭 20개 호텔 전부 공식 홈페이지 있는 업체로 실제 데이터 전환" — 진행률 ≈ **10% (2/20 완료)**
- **범위 확정**: 프론트엔드(localStorage 유지), 호텔 1곳씩, 공식 사이트 검증 기반. (사용자 결정)
- **완료**: h01 Olalani(배포), h02 DLG(미배포). = 2곳.
- **데이터 확보 완료, 전환 대기**: 기존 다낭 h03~h10 (8곳) — 각 공식 사이트 WebFetch 검증 데이터 확보됨:
  - h03 M Hotel Danang (mhotel.vn) — 5★, 286 Vo Nguyen Giap, 루프톱 인피니티 풀, Lim Dim Spa(27F), 3 다이닝, +84 236 3816 868
  - h04 Grand Tourane (grandtouranehotel.com) — 5★, 252 Vo Nguyen Giap, 아웃도어 풀, Serenity 스파, 테니스/피클볼, reservations@grandtouranehotel.com / +84 236 3778 888
  - h05 HAIAN Beach Hotel & Spa (haianbeachhotelspa.com) — 4★, 278 Vo Nguyen Giap, 22F 인피니티 풀, 214실, **공식 명시 혜택 있음**("HAIAN Beach Time" 유연 체크인/아웃 + best available rate), info@haianbeachhotelspa.com / +84 236 2228 666
  - h06 Le Sands Oceanfront (lesandshotel.com) — 28 Vo Nguyen Giap, 루프톱 인피니티 풀, 106실/레지던스, Kids Club, info@lesandshotel.com / +84 236 3818 688
  - h07 Brilliant Hotel (brillianthotel.vn) — 162 Bach Dang(한강변, 시내), 루프톱 바, **공식 혜택**: 직접 예약 시 전 객실 15% 할인(프로모), info@brillianthotel.vn / 0236 3222 999
  - h08 Sanouva Danang (sanouvadanang.com) — 4★ 부티크, 시내 중심(정확 주소 미기재—확인 필요), S'Spa/S'Ngon/S'Lounge, +84 236 382 3468
  - h09 Parosand Danang (parosanddanang.com) — 216 Vo Nguyen Giap, An Hai, 인피니티 풀, Kid's Club, Sky 21 Bar, booking@parosanddanang.com / +84 236 392 8688
  - h10 Adamo Hotel (adamodanang.com) — 4★, 304 Vo Nguyen Giap, My An, Ngu Hanh Son, 루프톱 풀, 106실, ask@adamohotel.com.vn / +84 236 6269 888
- **신규 10곳 발굴**: 후보 9곳 공식 사이트 **라이브 검증 완료**, 10번째 미확정 — 사용자 승인 대기(목록은 `05_Files_and_Resources.md` E절 참조).
- **방식 결정**: 사용자가 **멀티에이전트 워크플로우**로 진행 선택(기존 8곳 + 신규 10곳 × 5개 언어를 병렬 조사·작성·검증). **아직 실행 안 함** — 신규 10곳 목록 승인 후 시작 예정.

### 기타 진행/보류 (handover 기준, 미변경)
- 지도 실좌표 입력, 커뮤니티 실백엔드, 실제 Google OAuth, 백엔드 실배포, GA4 서버측 리포팅, README 현행화 — 모두 **보류/미완**.

## C. 주요 결정사항 (이번 세션)

| 결정 | 내용 |
|------|------|
| 브랜드명 | **StayEasy** (스테이이지) |
| 카테고리 명칭 | **DBP — Direct Booking Platform (직예약 플랫폼)**. OTA·메타서치와 구분. "metasearch" 명시 거부 |
| 실제 호텔 전환 범위 | 프론트엔드/ localStorage 유지, 호텔 1곳씩, 공식 사이트 검증 기반 |
| 무결성 원칙 | 공식 사이트에 없는 호텔별 예약 혜택은 **지어내지 않음** — 파트너 포털에서 확인하도록 남김 |
| 첫 실제 호텔 | Olalani (h01) |
| 20곳 전환 방식 | 멀티에이전트 워크플로우 (사용자 선택) |
| 신규 호텔 선정 | 후보 목록을 먼저 제시 → 승인 후 진행 (사용자 선택) |

## D. 변경 이력 (커밋 로그, 최신순)

```
0d7e572  Make DLG Hotel Danang (h02) a real, verified listing + fix locale desync   [미배포]
004ba6e  Make Olalani the first real, verified hotel listing                        [배포됨]
c784e19  Add home link to partner portal and open it in a new tab                   [배포됨]
ef4d383  Fix hero overlays by defining the missing brand-950 shade                  [배포됨]
7e8acdb  Darken the hero's entire text half for reliable legibility                 (이전 세션)
4c638a6  Swap hero background for a calmer, darker seascape
8617265  Fix hero text legibility over bright photos
d08e8aa  Remove the on-device recommendation note under AI search
f245cb8  Lighten hero overlay so the background photo shows through
223b9ca  Give the home hero a full scenic photo background
b6f3f0d  Polish the hero background with depth (color orbs + dot texture)
c279da5  Gate hotel community behind member sign-in
```

**미배포 주의**: `0d7e572`(DLG)는 로컬 `main`에만 있음. 새 계정에서 저장소를 그대로 이어받으면 이 커밋도 함께 오지만, **아직 GitHub Pages에 반영 안 됨** → push 필요.
