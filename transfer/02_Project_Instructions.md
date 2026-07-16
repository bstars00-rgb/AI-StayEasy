# 02 · Project Instructions

> 프로젝트 기본 지침 · 반복 프롬프트 · 작업/답변 기준. 새 계정에서 이 내용을 프로젝트 지침으로 입력하면 동일한 작업 방식이 이어집니다.

---

## A. 프로젝트 기본 지침 (반드시 준수)

1. **콘텐츠 우선, 수익모델(BM)은 OFF 유지** — `VITE_ENABLE_BM=true`를 배포 환경에 설정하지 말 것. 설정 즉시 바우처·광고·Sponsored·소비자 로그인이 공개됨. 코드는 보존하되 화면에서만 숨김이 현 전략. (`src/lib/bm.ts`)
2. **포지셔닝 = DBP (Direct Booking Platform)**. OTA·메타서치와 구분. 모든 호텔 상세는 **호텔 공식 웹사이트 예약**으로 유도. 화면 노출 시 "DBP"는 "Direct Booking Platform(직예약 플랫폼)"으로 풀어 쓰는 것 권장.
3. **실제 호텔 데이터 무결성 원칙 (중요)**:
   - 호텔 콘텐츠는 **공식 사이트에서 검증된 사실만** 게재.
   - 공식 사이트에 없는 **호텔별 예약 혜택(무료 조식·최저가 보장·프로모 코드 등)은 지어내지 말 것**. 그런 항목은 파트너가 파트너 포털에서 직접 확인·입력하도록 남긴다.
   - 부정확한 위치/시설/풀 개수 등도 검증된 값으로만.
4. **호텔 콘텐츠는 두 곳을 함께 수정** — 영어 base(`src/data/hotels.ts`) + 로케일 4종(`src/i18n/hotelContent/{ko,ja,vi,zh}.ts`, **호텔 id `h01`,`h02`… 로 키**). 한쪽만 고치면 번역 페이지가 옛 내용을 보여줌. (실제로 라인업 교체 시 로케일이 갱신 안 돼 **다른 호텔 내용을 보여주던 버그**가 있었음 — 전환 작업이 이를 함께 수정 중.)
5. **작업 후 검증** — 타입 체크(`npm run lint` = `tsc --noEmit`) + 가능하면 브라우저 프리뷰로 실제 렌더 확인. (이 환경에서는 스크린샷 도구가 타임아웃나서 `read_page`/`javascript_tool`/computed CSS로 검증해 왔음.)
6. **배포는 `main` push = 자동 배포**. 사용자가 "배포"라고 하면 커밋 후 `git push origin main`.
7. **기존 작업을 임의로 변경/삭제하지 말 것.** 변경 전 대상 파일을 확인하고, 설명과 다르면 먼저 알린다.
8. **값(시크릿) 문서 미기재** — GA4 ID, API Key 등 실제 값은 문서에 적지 않음(공개 클라이언트 값이라도).

## B. 반복적으로 사용하는 프롬프트 / 작업 패턴

- **실제 호텔 1곳 전환**: "공식 사이트 URL을 WebFetch로 읽어 사실만 추출 → `hotels.ts`의 해당 `hXX` + `ko/ja/vi/zh`의 `hXX`를 검증 데이터로 교체(지어낸 혜택 제거) → `npm run lint` → 브라우저로 KO 페이지 확인 → 커밋."
- **UI 수정 검증**: "`preview_start`(name: stayeasy-dev) → 소스 수정 → `read_page`/`javascript_tool`로 DOM·computed CSS 확인 → 스크린샷 대신 정량 검증."
- **배포**: "변경 파일만 `git add` → 커밋(메시지 규칙 아래) → `git push origin main`."

## C. 답변 / 작업 기준

- 커밋 메시지: 영어, 명령형 제목 + 본문에 이유. 말미에 `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- 사용자 대화 언어: **한국어**. 코드/커밋/코드 주석은 영어.
- 큰 작업은 사용자에게 범위·비용을 먼저 확인(특히 멀티에이전트 워크플로우처럼 토큰 사용량이 큰 경우).
- 불확실한 사실은 추정하지 말고 "확인 필요"로 표시.
- 파일 참조는 클릭 가능한 `경로:라인` 형식으로.

## D. 메모리 (Claude Code 로컬 메모리, 참고)

현재 Personal 계정 세션에는 아래 메모리가 기록되어 있음(경로: `~/.claude/projects/.../memory/`). **새 계정에서는 자동 이전되지 않으므로 이 지침 파일로 대체**해야 함:
- `project-stayeasy-overview`, `bm-switch-strategy`, `active-folder`, `migration-ownership`, `brand-and-category`, `hotel-content-i18n`, `first-real-hotel-olalani`.
