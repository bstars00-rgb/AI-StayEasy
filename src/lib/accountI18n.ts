import type { Lang } from '../i18n'

export interface AccountStrings {
  signIn: string
  title: string
  subtitle: string
  google: string
  emailPh: string
  emailBtn: string
  demoNote: string
  accountTitle: string
  signedInAs: string
  signOut: string
  member: string
}

export const accountStrings: Record<Lang, AccountStrings> = {
  en: {
    signIn: 'Sign in',
    title: 'Sign in to StayEasy',
    subtitle: 'Sign in to manage your subscription and keep hotel member vouchers in one place.',
    google: 'Continue with Google',
    emailPh: 'you@gmail.com',
    emailBtn: 'Continue with email',
    demoNote: 'Demo sign-in — saved in this browser only. Google sign-in turns on once a Google client ID is set.',
    accountTitle: 'My page',
    signedInAs: 'Signed in as',
    signOut: 'Sign out',
    member: 'Member',
  },
  ko: {
    signIn: '로그인',
    title: 'StayEasy 로그인',
    subtitle: '로그인하면 구독을 관리하고 호텔 회원 바우처를 한곳에서 볼 수 있어요.',
    google: 'Google로 계속하기',
    emailPh: 'you@gmail.com',
    emailBtn: '이메일로 계속하기',
    demoNote: '데모 로그인 — 이 브라우저에만 저장됩니다. Google 클라이언트 ID를 설정하면 Google 로그인이 켜져요.',
    accountTitle: '마이페이지',
    signedInAs: '로그인 계정',
    signOut: '로그아웃',
    member: '회원',
  },
  vi: {
    signIn: 'Đăng nhập',
    title: 'Đăng nhập StayEasy',
    subtitle: 'Đăng nhập để quản lý gói đăng ký và xem voucher thành viên của khách sạn ở một nơi.',
    google: 'Tiếp tục với Google',
    emailPh: 'you@gmail.com',
    emailBtn: 'Tiếp tục với email',
    demoNote: 'Đăng nhập thử nghiệm — chỉ lưu trong trình duyệt này. Đăng nhập Google sẽ bật khi có Google client ID.',
    accountTitle: 'Trang của tôi',
    signedInAs: 'Đăng nhập bằng',
    signOut: 'Đăng xuất',
    member: 'Thành viên',
  },
  zh: {
    signIn: '登录',
    title: '登录 StayEasy',
    subtitle: '登录后即可管理订阅，并在一处查看酒店的会员优惠券。',
    google: '使用 Google 继续',
    emailPh: 'you@gmail.com',
    emailBtn: '使用邮箱继续',
    demoNote: '演示登录——仅保存在此浏览器中。设置 Google 客户端 ID 后将启用 Google 登录。',
    accountTitle: '我的页面',
    signedInAs: '登录账号',
    signOut: '退出登录',
    member: '会员',
  },
  ja: {
    signIn: 'ログイン',
    title: 'StayEasyにログイン',
    subtitle: 'ログインすると、購読の管理とホテルの会員バウチャーの確認を一か所でできます。',
    google: 'Googleで続ける',
    emailPh: 'you@gmail.com',
    emailBtn: 'メールで続ける',
    demoNote: 'デモログイン — このブラウザにのみ保存されます。GoogleクライアントIDを設定するとGoogleログインが有効になります。',
    accountTitle: 'マイページ',
    signedInAs: 'ログイン中のアカウント',
    signOut: 'ログアウト',
    member: '会員',
  },
}
