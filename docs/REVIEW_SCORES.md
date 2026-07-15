# StayEasy — 기획·QA 평가 라운드 기록

> CRM 프로젝트의 planner/tester 라운드 관행을 StayEasy에 적용한 기록.
> 각 라운드: 독립 심사 에이전트 2개(기획/QA)가 코드·배포·문서를 근거로 10점 만점 채점.

| Round | 일자 | 기획(Planner) | QA(Tester) | 비고 |
|---|---|---|---|---|
| 1 | 2026-07-15 | **5/10** | **7/10** | 첫 정식 평가. 기획: 신뢰 설계가 파생(해시) 데이터로 자기모순 — deriveConditions/Distinction 근거/성급/스톡사진. QA: 3대 게이트(tsc·85테스트·빌드) 전부 통과, Critical 0건, 지도 리렌더 재생성·삭제권한 이름비교·setHTML 미이스케이프가 감점. |

## Round 1 → 패치 적용 현황 (2026-07-15, 커밋 a3cb867 · 62dda5b)

- [x] 기획 1: deriveConditions 해체 — 미검증 속성 표기 중단(+검증 고지 5개 언어), 성급은 검증 표기 시에만(25/40), 편집 점수 명시화(EDITORIAL_SCORES) → Distinction이 실제 편집 픽으로
- [x] 기획 2: breadcrumb·목록 SEO 메타 도시 파라미터화, "다낭 12개" stale 카피 20개 검증본으로(5개 언어), 커뮤니티 읽기 공개/쓰기 게이트 역전
- [ ] 기획 3: 실사진·실혜택 확보 플로우 — 파트너 확인 필요(외부 의존, 미착수)
- [x] QA 1: 지도 인스턴스 1회 생성, 마커만 교체(팬/줌 보존), 호텔셋 변경 시에만 refit
- [x] QA 2: hotelContent 4로케일×40호텔 패리티 + 고아 항목 회귀 테스트 (테스트 87개)
- [x] QA 3: 삭제 권한 email 기준 + 팝업 HTML 이스케이프 + MapTiler 실패 시 OSM 폴백 + 손상 localStorage 방어

## Round 1 패치 우선순위 (원 처방)

기획 측:
1. deriveConditions() 해체 — 검증 필드만 명시 입력, 미확인은 "호텔에 확인" 표기. Distinction 근거 점수를 실제 편집 판단 값으로.
2. 커뮤니티 게이트 역전(읽기 공개/쓰기 게이트) + 다낭 하드코딩 제거(breadcrumb·목록 SEO 메타 도시 파라미터화).
3. 실사진·실혜택 확보 플로우(파트너 확인 기반).

QA 측:
1. 지도 안정화 — hotels/attractions props를 useMemo로 고정 또는 마커만 갱신.
2. hotelContent 4로케일 × 40호텔 패리티 회귀 테스트 추가.
3. 커뮤니티 삭제 권한을 author email 기준으로 + 지도 팝업 HTML 이스케이프.
