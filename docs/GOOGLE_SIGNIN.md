# Google로 가입·로그인 켜기

가입 페이지(`/signup`)와 로그인 페이지(`/signin`)에는 "Google로 계속하기" 버튼이 있습니다. 구글 클라이언트 ID가 없으면 이 버튼은 "준비 중" 안내만 보여 주고, 이메일로 가입하는 길은 항상 열려 있습니다.

## 켜는 방법

1. Google Cloud Console에서 프로젝트를 고르고 "API 및 서비스 → 사용자 인증 정보 → OAuth 클라이언트 ID 만들기"로 **웹 애플리케이션** 클라이언트를 만듭니다.
2. "승인된 JavaScript 원본"에 아래 주소를 넣습니다.
   - `https://bstars00-rgb.github.io`
   - 로컬 확인용 `http://localhost:5174`, `http://localhost:5175`
3. 만들어진 클라이언트 ID(`...apps.googleusercontent.com`)를 GitHub 저장소의 Variable로 등록합니다. (Settings → Secrets and variables → Actions → Variables → `VITE_GOOGLE_CLIENT_ID`). 클라이언트 ID는 공개되어도 되는 값입니다.
4. main에 한 번 푸시하거나 Actions에서 배포를 다시 실행하면 버튼이 켜집니다.

로컬에서는 `.env`에 `VITE_GOOGLE_CLIENT_ID=<클라이언트 ID>`를 넣고 개발 서버를 다시 시작하세요.

## 지금 구조의 한계

- 계정은 **서버 없이 방문자 브라우저(localStorage)에만** 저장됩니다. 다른 기기나 브라우저에서는 같은 계정이 보이지 않습니다.
- 구글이 돌려준 자격 증명(JWT)을 브라우저에서 읽어 이름과 이메일만 꺼냅니다. 서명 검증은 하지 않으므로, 실제 회원 데이터를 다루기 전에 서버에서 검증해야 합니다.
- 구독도 "신청 접수"만 저장합니다. 결제와 청구는 아직 없습니다.

실서비스로 가려면 서버(계정, 구독, 결제 연동)와 이용약관·개인정보 처리방침의 실제 내용 점검이 먼저 필요합니다.
