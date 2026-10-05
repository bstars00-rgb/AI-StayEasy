# AGENTS.md — StayEasy Vietnam

**전체 명세서: [docs/CODEX_SPEC.md](docs/CODEX_SPEC.md)** — 작업 전 반드시 읽을 것.

## 이 프로젝트가 무엇인가
직접예약 플랫폼(DBP). 여행자를 호텔 **공식 사이트**로 연결한다.
OTA가 아니다 — 예약·결제·수수료를 처리하지 않는다.

## 절대 규칙 (UI/UX/CI는 재량, 아래는 아님)

1. **검증 안 된 사실은 게시하지 않는다.** 호텔의 성급·객실수·시설·혜택은 그 호텔의
   공식 사이트가 말할 때만 쓴다. OTA는 출처가 아니다. 검증 불가 → 생략.
2. **유선 전화번호를 WhatsApp/Zalo로 바꿔 적지 않는다.** 메신저 채널은 공식 사이트가
   그 채널을 직접 링크할 때만.
3. **"공식 사이트에서 예약하세요"는 혜택이 아니다.** 혜택 UI는 `HEADLINE_BENEFIT`
   (호텔 고유 검증 혜택 25곳)만. 체인 멤버 요금만으로는 카드 헤드라인 불가.
4. **5개 언어(en/ko/vi/zh/ja) 전면 지원.** 콘텐츠는 세 곳에 산다: locales(UI+enums+destText),
   hotelContent(호텔 id 키, 배열 인덱스 병렬), 각 lib의 I18n 테이블. 커버리지 테스트는
   로케일끼리가 아니라 **카탈로그(hotels/destinations/countries)와 비교**한다.
5. **수익 기능은 전부 `VITE_ENABLE_BM` 뒤에. 기본 OFF.**
6. **배포 불변**: GitHub Pages `https://bstars00-rgb.github.io/AI-StayEasy`, base path
   `/AI-StayEasy/`, main 푸시 → Actions 자동 배포, 빌드 후처리(sitemap/OG/아이콘/
   157 라우트 프리렌더) 유지.
7. **기존 URL 구조 유지** (바꾸면 리다이렉트).

## 작업 수칙
- 버그를 고치면 같은 패턴을 저장소 전체에서 grep으로 스윕한다.
- 새 테스트는 버그를 되살려 실제로 실패하는지 확인한 뒤 커밋한다.
- 게이트: `npm run lint` · `npm test` · `GITHUB_PAGES=true npm run build` 전부 통과.
- 문서에 쓰는 수치는 손으로 옮기지 말고 데이터에서 재계산한다.

## 지도 데이터
`src/lib/geo.ts`의 `AREA` 키는 `` `${City}|${Area}` `` 타입이다 — 도시 없는 조회는
컴파일 에러가 나도록 의도된 것이니 우회하지 말 것. 핀 테스트는 도시 박스가 아니라
**area 중심 600m** 축으로 검사한다 (이유는 커밋 85a421f).
