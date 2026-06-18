import type { Lang } from '../i18n'

export interface AccountStrings {
  signIn: string
  title: string
  subtitle: string
  google: string
  emailPh: string
  emailBtn: string
  demoNote: string
  welcomeTitle: string
  welcomeText: string
  voucherLabel: string
  copy: string
  copied: string
  useNote: string
  validUntil: string
  accountTitle: string
  signedInAs: string
  signOut: string
  member: string
  perkTitle: string
  perkText: string
}

export const accountStrings: Record<Lang, AccountStrings> = {
  en: {
    signIn: 'Sign in',
    title: 'Sign in to StayEasy',
    subtitle: 'Sign in and get a member voucher for your next direct booking.',
    google: 'Continue with Google',
    emailPh: 'you@gmail.com',
    emailBtn: 'Continue with email',
    demoNote: 'Demo sign-in — saved in your browser. Set a Google client ID for real sign-in.',
    welcomeTitle: 'Welcome — here’s your member voucher 🎉',
    welcomeText: 'Use it when you book directly on the hotel’s official website.',
    voucherLabel: 'Member voucher',
    copy: 'Copy code',
    copied: 'Copied!',
    useNote: 'Apply this code when booking direct — StayEasy never processes the payment.',
    validUntil: 'Valid until',
    accountTitle: 'My account',
    signedInAs: 'Signed in as',
    signOut: 'Sign out',
    member: 'Member',
    perkTitle: 'Sign in for a member voucher',
    perkText: 'StayEasy members get a discount voucher to use on direct bookings.',
  },
  ko: {
    signIn: '로그인',
    title: 'StayEasy 로그인',
    subtitle: '로그인하면 다음 직접 예약에 쓸 수 있는 회원 할인권을 드려요.',
    google: 'Google로 계속하기',
    emailPh: 'you@gmail.com',
    emailBtn: '이메일로 계속하기',
    demoNote: '데모 로그인 — 브라우저에 저장됩니다. 실제 로그인은 Google 클라이언트 ID 설정 시 활성화돼요.',
    welcomeTitle: '환영합니다 — 회원 할인권이에요 🎉',
    welcomeText: '호텔 공식 사이트에서 직접 예약할 때 사용하세요.',
    voucherLabel: '회원 할인권',
    copy: '코드 복사',
    copied: '복사됨!',
    useNote: '공식 사이트에서 직접 예약할 때 이 코드를 입력하세요 — StayEasy는 결제를 처리하지 않습니다.',
    validUntil: '유효 기간',
    accountTitle: '내 계정',
    signedInAs: '로그인 계정',
    signOut: '로그아웃',
    member: '회원',
    perkTitle: '로그인하고 회원 할인권 받기',
    perkText: 'StayEasy 회원은 직접 예약에 쓸 수 있는 할인권을 받아요.',
  },
  vi: {
    signIn: 'Đăng nhập',
    title: 'Đăng nhập StayEasy',
    subtitle: 'Đăng nhập để nhận voucher thành viên cho lần đặt phòng trực tiếp tiếp theo.',
    google: 'Tiếp tục với Google',
    emailPh: 'you@gmail.com',
    emailBtn: 'Tiếp tục bằng email',
    demoNote: 'Đăng nhập demo — lưu trong trình duyệt. Đặt Google client ID để đăng nhập thật.',
    welcomeTitle: 'Chào mừng — đây là voucher thành viên của bạn 🎉',
    welcomeText: 'Dùng khi bạn đặt phòng trực tiếp trên website chính thức của khách sạn.',
    voucherLabel: 'Voucher thành viên',
    copy: 'Sao chép mã',
    copied: 'Đã sao chép!',
    useNote: 'Nhập mã này khi đặt trực tiếp — StayEasy không xử lý thanh toán.',
    validUntil: 'Có hiệu lực đến',
    accountTitle: 'Tài khoản của tôi',
    signedInAs: 'Đăng nhập với',
    signOut: 'Đăng xuất',
    member: 'Thành viên',
    perkTitle: 'Đăng nhập để nhận voucher thành viên',
    perkText: 'Thành viên StayEasy được nhận voucher giảm giá cho đặt phòng trực tiếp.',
  },
  zh: {
    signIn: '登录',
    title: '登录 StayEasy',
    subtitle: '登录即可获得会员优惠券，用于下次官网直订。',
    google: '使用 Google 继续',
    emailPh: 'you@gmail.com',
    emailBtn: '使用邮箱继续',
    demoNote: '演示登录——保存在浏览器中。设置 Google client ID 可启用真实登录。',
    welcomeTitle: '欢迎——这是您的会员优惠券 🎉',
    welcomeText: '在酒店官网直订时使用。',
    voucherLabel: '会员优惠券',
    copy: '复制优惠码',
    copied: '已复制！',
    useNote: '官网直订时输入此优惠码——StayEasy 不处理付款。',
    validUntil: '有效期至',
    accountTitle: '我的账户',
    signedInAs: '登录账户',
    signOut: '退出登录',
    member: '会员',
    perkTitle: '登录领取会员优惠券',
    perkText: 'StayEasy 会员可获得用于官网直订的优惠券。',
  },
  ja: {
    signIn: 'ログイン',
    title: 'StayEasy にログイン',
    subtitle: 'ログインすると、次の公式直予約に使える会員クーポンがもらえます。',
    google: 'Google で続行',
    emailPh: 'you@gmail.com',
    emailBtn: 'メールで続行',
    demoNote: 'デモログイン — ブラウザに保存されます。実ログインは Google クライアント ID 設定で有効化。',
    welcomeTitle: 'ようこそ — 会員クーポンです 🎉',
    welcomeText: 'ホテル公式サイトで直接予約する際にご利用ください。',
    voucherLabel: '会員クーポン',
    copy: 'コードをコピー',
    copied: 'コピーしました！',
    useNote: '公式サイトで直接予約する際にこのコードを入力してください — StayEasy は決済を行いません。',
    validUntil: '有効期限',
    accountTitle: 'マイアカウント',
    signedInAs: 'ログイン中',
    signOut: 'ログアウト',
    member: '会員',
    perkTitle: 'ログインして会員クーポンを獲得',
    perkText: 'StayEasy 会員は公式直予約に使えるクーポンがもらえます。',
  },
}
