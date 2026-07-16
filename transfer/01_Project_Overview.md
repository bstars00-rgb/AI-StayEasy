# 01 · Project Overview

> 이전 패키지 (Personal/CEO Office 계정 → OPS 계정 이동용) · 작성일 2026-07-14
> 기준 폴더: `C:\Users\LENOVO\Desktop\AI-StayEasy` (활성본)
> 이 패키지는 **새 프로젝트 생성이 아니라 기존 프로젝트의 컨텍스트 이전**을 위한 것입니다. 임의 요약·변경 없이 최신 상태 + 중요한 과거 이력을 함께 담았습니다.

---

## 1. 프로젝트명

- **StayEasy Vietnam** (리포지토리/패키지명: `stayeasy-vietnam`, GitHub: `bstars00-rgb/AI-StayEasy`)
- 브랜드 표기: **StayEasy** (한글 음차 "스테이이지" — 이번 세션에서 사용자가 확정)

## 2. 목적과 최종 목표

- **포지션**: OTA가 **아님**. 예약·결제·수수료를 처리하지 않는 **호텔 콘텐츠·직접예약 안내 플랫폼**. 모든 호텔 상세 페이지가 호텔 **공식 웹사이트 예약(direct booking)** CTA로 유도.
- **공식 카테고리 명칭**: **DBP — Direct Booking Platform (직예약 플랫폼)**. 이번 세션에서 사용자가 확정. "우리는 OTA도 메타서치도 아니라 DBP" 라는 대외 포지셔닝. (메타서치=호텔스컴바인처럼 OTA 가격을 집계·비교하는 모델 — 명시적으로 **거부**됨. 이 사업은 가격 집계/비교를 하지 않음.)
- **최종 목표**: 콘텐츠·오디언스를 먼저 확보한 뒤(수익모델은 나중에 스위치 ON), 다낭 → 호치민·냐짱·푸꾸옥·하노이·호이안으로 확장하는 5개 언어(EN/KO/VI/ZH/JA) 호텔 가이드.
- **수익모델(현재 전부 숨김, 기본 OFF)**: 무료 리스팅 → 유료 공식예약 가이드, 프리미엄 콘텐츠, Featured 노출, 공식예약 클릭 광고(CPC), 시즌 캠페인, AdSense, 회원 전용 바우처. 유료 노출은 "Sponsored" 라벨로 투명 표기. 모든 수익 요소는 `src/lib/bm.ts`의 `BM_ENABLED`(=`VITE_ENABLE_BM === 'true'`) 뒤에 게이트, 기본 OFF.

## 3. 현재 상태 (요약)

- **프론트엔드**: React 18 + TS(strict) + Vite 5 + Tailwind 3 SPA. 완성도 높음, 운영 중.
- **배포**: GitHub Pages (https://bstars00-rgb.github.io/AI-StayEasy/). `main` push 시 GitHub Actions 자동 배포.
- **데이터**: 프론트 번들 mock 카탈로그(현재 **총 30개 호텔**; 다낭 10 + 타 도시 20). 백엔드(`server/`)는 스캐폴드, 미배포.
- **이번 세션 주요 산출물**: 히어로 가독성 근본 수정(배포됨), 파트너 포털 홈 링크+새 탭(배포됨), **실제 호텔 데이터 전환 착수** — Olalani(배포됨)·DLG(커밋·미배포) 2곳 완료. 상세는 `03_Progress_and_Decisions.md`.
- **미배포 변경**: 커밋 `0d7e572`(DLG 전환)이 로컬 `main`에만 있고 `origin/main`에 **아직 push 안 됨** → 배포 전. (git `main...origin/main [ahead 1]`)

## 4. 주요 담당자와 역할

| 역할 | 담당 | 비고 |
|------|------|------|
| 프로젝트 오너 / 의사결정 | 사용자 (email `CEO.office@ohmyhotel.com`) | 이번 세션에서 브랜드·카테고리·전환 범위 등 결정 |
| GitHub 저장소 소유 | 개인 계정 `bstars00-rgb` | 저장소·Pages·GA4·Search Console가 이 계정에 종속 — **이전 최대 리스크** |
| 실행(코드/문서) | Claude Code (Opus 4.8) | 세션 내 구현·조사·문서화 수행 |

**⚠️ 계정 명칭 — 확인 필요**: 최초 이관 문서(`handover.md`, 2026-07-07)는 "**OPS 계정 → CEO Office 계정** 이관"으로 기재됨. 이번 지시는 "현재 **Personal 계정** → **OPS 계정**으로 다시 이동". 즉 계정 라벨(OPS / CEO Office / Personal)이 세션마다 다르게 불림. **어느 계정이 최종 목적지(OPS)이고 현재 계정과 동일 인물/이메일인지 확인 필요.** 현재 로그인 컨텍스트 이메일은 `CEO.office@ohmyhotel.com`.
