# Google 리뷰 요약 블록

호텔 상세 페이지의 "StayEasy 요약" 아래에 **추가**로 붙는 블록입니다. 기존 요약(공식 사이트로 확인한 내용)을 대체하지 않습니다.

## 가져오는 것

Google Places API(New) Place Details의 `reviewSummary` 필드(Gemini가 만든 리뷰 요약)만 가져옵니다.
화면에는 요약 원문, "Summarized with Gemini" 표기, Google 지도 리뷰 링크, 문제 신고 링크를 함께 보여줍니다.
요약 위에는 "투숙객의 의견이며 StayEasy가 확인한 사실이 아니다"라는 문구가 붙습니다.

## 구글 정책 때문에 지켜야 할 것

- 리뷰, 요약, 이름, 주소 같은 Places 내용은 미리 받아 두거나 캐시하거나 저장하면 안 됩니다. 저장할 수 있는 건 장소 ID뿐입니다.
- 그래서 정적 사이트(GitHub Pages)에 요약을 구워 넣지 않고, 페이지를 볼 때마다 서버가 구글에 물어 그대로 전달합니다. 서버도 저장하지 않습니다(`cache-control: no-store`).
- API 키는 서버에만 둡니다. 브라우저는 우리 호텔 slug만 보내고 장소 ID는 서버가 `src/data/placeIds.ts`에서 찾습니다.
- 약관은 바뀔 수 있으니 실서비스 전에 현재 Maps Platform 약관을 다시 확인하세요.

## 켜기 전에 확인할 것

1. **구글이 베트남 호텔에 요약을 주는지** 모릅니다. 구글 문서의 AI 요약 지원 지역·장소 유형 표에 베트남과 숙박업소가 분명하게 나오지 않습니다. 아래 스크립트로 먼저 확인하세요(호텔당 호출 2~3회, 소액 과금).

   ```powershell
   $env:GOOGLE_PLACES_API_KEY = "<키>"
   node scripts/probe-places.mjs "Olalani Resort Da Nang" "Amiana Resort Nha Trang" "Rex Hotel Saigon"
   ```

   `SUMMARY PRESENT`가 나오는 호텔이 거의 없으면 여기서 멈추는 게 맞습니다.
2. 요약이 나오면 호텔별 장소 ID를 **사람이 이름과 주소로 확인한 뒤** `src/data/placeIds.ts`에 넣습니다. 같은 체인의 이웃 호텔로 잘못 잡히면 다른 호텔의 리뷰가 붙습니다.
3. Google Cloud에서 Places API(New)를 켜고 결제를 등록한 뒤, 서버 환경변수 `GOOGLE_PLACES_API_KEY`를 설정합니다.
4. 서버를 배포하고 사이트 빌드에 `VITE_API_URL`을 지정합니다. 이 값이 없으면 블록은 아예 그려지지 않습니다.

## 동작 요약

| 상황 | 결과 |
|---|---|
| `VITE_API_URL` 없음 | 블록 없음, 외부 호출 없음 |
| 장소 ID 없음 / 구글이 요약을 안 줌 / 오류 | 블록 없음 |
| `GOOGLE_PLACES_API_KEY` 없음 | 서버가 503, 블록 없음 |
| 요약 있음 | 블록 표시 |

## 비용

방문할 때마다 Place Details를 호출합니다(Enterprise + Atmosphere 등급). 캐시할 수 없어서 방문이 늘면 비용도 그대로 늡니다. 서버는 IP당 분당 30회로 제한합니다.
