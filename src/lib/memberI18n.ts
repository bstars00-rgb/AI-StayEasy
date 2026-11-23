import type { Lang } from '../i18n'

/** Copy for the sign-up page and the member's "My page". */
export interface MemberStrings {
  signup: {
    title: string
    subtitle: string
    /** "{plan}" and "{period}" are filled in. */
    fromPlan: string
    google: string
    googleNotReady: string
    or: string
    nameLabel: string
    namePh: string
    emailLabel: string
    emailPh: string
    /** "{terms}" and "{privacy}" are replaced by links. */
    consent: string
    terms: string
    privacy: string
    submit: string
    errEmail: string
    errConsent: string
    haveAccount: string
    signInLink: string
    newHere: string
    signUpLink: string
    stores: string
    demoNote: string
  }
  mypage: {
    title: string
    joined: string
    subTitle: string
    subNone: string
    subNoneCta: string
    subStatus: string
    subStatusNote: string
    subRequested: string
    subChange: string
    subCancel: string
    subCancelAsk: string
    subCancelYes: string
    subCancelNo: string
    subDone: string
    subCancelled: string
    voucherTitle: string
    voucherEmpty: string
    voucherCta: string
    wishlist: string
    manageTitle: string
    deleteBtn: string
    deleteAsk: string
    deleteYes: string
    deleteNo: string
  }
}

/** Fill {name} placeholders in a template. */
export const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)

export const memberStrings: Record<Lang, MemberStrings> = {
  en: {
    signup: {
      title: 'Create your account',
      subtitle: 'Sign up first to request a plan and manage it on My page.',
      fromPlan: 'Sign up to continue with {plan} · {period}.',
      google: 'Sign up with Google',
      googleNotReady: 'Google sign-up is still being set up. Please use email below.',
      or: 'or',
      nameLabel: 'Name',
      namePh: 'Your name',
      emailLabel: 'Email',
      emailPh: 'you@gmail.com',
      consent: 'I agree to the {terms} and {privacy} (required)',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      submit: 'Sign up and continue',
      errEmail: 'Enter a valid email.',
      errConsent: 'You need to agree to the Terms of Use and Privacy Policy to sign up.',
      haveAccount: 'Already have an account?',
      signInLink: 'Sign in',
      newHere: 'New here?',
      signUpLink: 'Create an account',
      stores: 'We only keep your name and email.',
      demoNote: 'Demo sign-up — what you enter is not sent to a server; it stays in this browser.',
    },
    mypage: {
      title: 'My page',
      joined: 'Joined',
      subTitle: 'Manage subscription',
      subNone: 'You haven’t requested a plan.',
      subNoneCta: 'See plans',
      subStatus: 'Request received',
      subStatusNote: 'We’ll explain payment after the official launch. For now we only take the request and charge nothing.',
      subRequested: 'Requested on',
      subChange: 'Change plan or period',
      subCancel: 'Cancel request',
      subCancelAsk: 'Cancel your subscription request?',
      subCancelYes: 'Cancel request',
      subCancelNo: 'Keep it',
      subDone: 'Your {plan} · {period} request was received.',
      subCancelled: 'Your subscription request was cancelled.',
      voucherTitle: 'Member-only vouchers',
      voucherEmpty: 'When a hotel offers vouchers to members they’ll be collected here. There are none available right now.',
      voucherCta: 'Browse hotels',
      wishlist: 'Wishlist',
      manageTitle: 'Account',
      deleteBtn: 'Delete account',
      deleteAsk: 'The account and subscription request saved in this browser will be erased and this can’t be undone. Continue?',
      deleteYes: 'Delete',
      deleteNo: 'Cancel',
    },
  },
  ko: {
    signup: {
      title: '회원가입',
      subtitle: '구독을 신청하고 마이페이지에서 관리하려면 먼저 가입해 주세요.',
      fromPlan: '{plan} · {period} 구독을 이어가려면 먼저 가입해 주세요.',
      google: 'Google로 가입하기',
      googleNotReady: 'Google 가입은 아직 설정 중이에요. 아래에서 이메일로 가입해 주세요.',
      or: '또는',
      nameLabel: '이름',
      namePh: '이름',
      emailLabel: '이메일',
      emailPh: 'you@gmail.com',
      consent: '{terms}과 {privacy}에 동의합니다 (필수)',
      terms: '이용약관',
      privacy: '개인정보 처리방침',
      submit: '가입하고 계속하기',
      errEmail: '올바른 이메일을 입력해 주세요.',
      errConsent: '이용약관과 개인정보 처리방침에 동의해야 가입할 수 있어요.',
      haveAccount: '이미 계정이 있나요?',
      signInLink: '로그인',
      newHere: '처음이신가요?',
      signUpLink: '회원가입',
      stores: '저장하는 정보는 이름과 이메일뿐이에요.',
      demoNote: '데모 가입 — 입력한 정보는 서버로 보내지지 않고 이 브라우저에만 저장돼요.',
    },
    mypage: {
      title: '마이페이지',
      joined: '가입일',
      subTitle: '구독 관리',
      subNone: '신청한 구독이 없어요.',
      subNoneCta: '요금제 보기',
      subStatus: '신청 접수됨',
      subStatusNote: '결제는 정식 출시 후에 안내해 드려요. 지금은 신청만 접수하고 요금은 청구하지 않습니다.',
      subRequested: '신청일',
      subChange: '단계·기간 변경',
      subCancel: '신청 취소',
      subCancelAsk: '구독 신청을 취소할까요?',
      subCancelYes: '취소하기',
      subCancelNo: '유지하기',
      subDone: '{plan} · {period} 구독 신청이 접수되었어요.',
      subCancelled: '구독 신청을 취소했어요.',
      voucherTitle: '회원 전용 바우처',
      voucherEmpty: '호텔이 회원에게 내준 바우처가 생기면 여기에 모아 보여 드려요. 지금은 이용할 수 있는 바우처가 없어요.',
      voucherCta: '호텔 둘러보기',
      wishlist: '위시리스트',
      manageTitle: '계정 관리',
      deleteBtn: '계정 삭제',
      deleteAsk: '이 브라우저에 저장된 계정과 구독 신청이 지워지고 되돌릴 수 없어요. 계속할까요?',
      deleteYes: '삭제하기',
      deleteNo: '취소',
    },
  },
  ja: {
    signup: {
      title: '会員登録',
      subtitle: '購読を申し込み、マイページで管理するには、先に登録してください。',
      fromPlan: '{plan}・{period}の購読を続けるには、先に登録してください。',
      google: 'Googleで登録',
      googleNotReady: 'Googleでの登録は準備中です。下のメールで登録してください。',
      or: 'または',
      nameLabel: 'お名前',
      namePh: 'お名前',
      emailLabel: 'メールアドレス',
      emailPh: 'you@gmail.com',
      consent: '{terms}と{privacy}に同意します(必須)',
      terms: '利用規約',
      privacy: 'プライバシーポリシー',
      submit: '登録して続ける',
      errEmail: '正しいメールアドレスを入力してください。',
      errConsent: '登録には利用規約とプライバシーポリシーへの同意が必要です。',
      haveAccount: 'すでにアカウントをお持ちですか?',
      signInLink: 'ログイン',
      newHere: '初めてですか?',
      signUpLink: '会員登録',
      stores: '保存する情報はお名前とメールアドレスだけです。',
      demoNote: 'デモ登録 — 入力した情報はサーバーに送信されず、このブラウザにのみ保存されます。',
    },
    mypage: {
      title: 'マイページ',
      joined: '登録日',
      subTitle: '購読の管理',
      subNone: '申し込んだ購読はありません。',
      subNoneCta: 'プランを見る',
      subStatus: '申し込みを受け付けました',
      subStatusNote: 'お支払いについては正式リリース後にご案内します。現在は申し込みのみを受け付け、料金は請求しません。',
      subRequested: '申込日',
      subChange: 'プランや期間を変更',
      subCancel: '申し込みを取り消す',
      subCancelAsk: '購読の申し込みを取り消しますか?',
      subCancelYes: '取り消す',
      subCancelNo: '続ける',
      subDone: '{plan}・{period}の申し込みを受け付けました。',
      subCancelled: '購読の申し込みを取り消しました。',
      voucherTitle: '会員限定バウチャー',
      voucherEmpty: 'ホテルが会員向けに用意したバウチャーができると、ここにまとめて表示します。現在ご利用いただけるものはありません。',
      voucherCta: 'ホテルを見る',
      wishlist: 'ウィッシュリスト',
      manageTitle: 'アカウント',
      deleteBtn: 'アカウントを削除',
      deleteAsk: 'このブラウザに保存されたアカウントと購読の申し込みが削除され、元に戻せません。続けますか?',
      deleteYes: '削除する',
      deleteNo: 'キャンセル',
    },
  },
  vi: {
    signup: {
      title: 'Tạo tài khoản',
      subtitle: 'Hãy đăng ký trước để đăng ký gói và quản lý tại Trang của tôi.',
      fromPlan: 'Hãy đăng ký để tiếp tục với {plan} · {period}.',
      google: 'Đăng ký bằng Google',
      googleNotReady: 'Đăng ký bằng Google vẫn đang được thiết lập. Vui lòng dùng email bên dưới.',
      or: 'hoặc',
      nameLabel: 'Tên',
      namePh: 'Tên của bạn',
      emailLabel: 'Email',
      emailPh: 'you@gmail.com',
      consent: 'Tôi đồng ý với {terms} và {privacy} (bắt buộc)',
      terms: 'Điều khoản sử dụng',
      privacy: 'Chính sách quyền riêng tư',
      submit: 'Đăng ký và tiếp tục',
      errEmail: 'Hãy nhập email hợp lệ.',
      errConsent: 'Bạn cần đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư để đăng ký.',
      haveAccount: 'Đã có tài khoản?',
      signInLink: 'Đăng nhập',
      newHere: 'Lần đầu đến đây?',
      signUpLink: 'Tạo tài khoản',
      stores: 'Chúng tôi chỉ lưu tên và email của bạn.',
      demoNote: 'Đăng ký thử nghiệm — thông tin bạn nhập không được gửi lên máy chủ mà chỉ lưu trong trình duyệt này.',
    },
    mypage: {
      title: 'Trang của tôi',
      joined: 'Ngày tham gia',
      subTitle: 'Quản lý gói đăng ký',
      subNone: 'Bạn chưa đăng ký gói nào.',
      subNoneCta: 'Xem các gói',
      subStatus: 'Đã nhận yêu cầu',
      subStatusNote: 'Chúng tôi sẽ hướng dẫn thanh toán sau khi chính thức ra mắt. Hiện chỉ nhận yêu cầu và không thu phí.',
      subRequested: 'Ngày yêu cầu',
      subChange: 'Đổi gói hoặc chu kỳ',
      subCancel: 'Hủy yêu cầu',
      subCancelAsk: 'Hủy yêu cầu đăng ký gói?',
      subCancelYes: 'Hủy yêu cầu',
      subCancelNo: 'Giữ lại',
      subDone: 'Đã nhận yêu cầu {plan} · {period} của bạn.',
      subCancelled: 'Đã hủy yêu cầu đăng ký gói.',
      voucherTitle: 'Voucher dành riêng cho thành viên',
      voucherEmpty: 'Khi khách sạn cung cấp voucher cho thành viên, chúng sẽ được tập hợp tại đây. Hiện chưa có voucher nào.',
      voucherCta: 'Xem khách sạn',
      wishlist: 'Danh sách yêu thích',
      manageTitle: 'Tài khoản',
      deleteBtn: 'Xóa tài khoản',
      deleteAsk: 'Tài khoản và yêu cầu đăng ký lưu trong trình duyệt này sẽ bị xóa và không thể khôi phục. Tiếp tục?',
      deleteYes: 'Xóa',
      deleteNo: 'Hủy',
    },
  },
  zh: {
    signup: {
      title: '创建账户',
      subtitle: '请先注册，才能申请方案并在“我的页面”中管理。',
      fromPlan: '请先注册，以继续申请 {plan} · {period}。',
      google: '使用 Google 注册',
      googleNotReady: 'Google 注册仍在设置中，请使用下方的邮箱注册。',
      or: '或',
      nameLabel: '姓名',
      namePh: '您的姓名',
      emailLabel: '邮箱',
      emailPh: 'you@gmail.com',
      consent: '我同意{terms}和{privacy}（必填）',
      terms: '使用条款',
      privacy: '隐私政策',
      submit: '注册并继续',
      errEmail: '请输入有效的邮箱。',
      errConsent: '需同意使用条款和隐私政策才能注册。',
      haveAccount: '已有账户？',
      signInLink: '登录',
      newHere: '第一次使用？',
      signUpLink: '创建账户',
      stores: '我们只保存您的姓名和邮箱。',
      demoNote: '演示注册——您填写的信息不会发送到服务器，只保存在此浏览器中。',
    },
    mypage: {
      title: '我的页面',
      joined: '注册日期',
      subTitle: '订阅管理',
      subNone: '您还没有申请任何方案。',
      subNoneCta: '查看方案',
      subStatus: '已收到申请',
      subStatusNote: '付款方式将在正式上线后说明。目前只受理申请，不收取任何费用。',
      subRequested: '申请日期',
      subChange: '更改方案或周期',
      subCancel: '取消申请',
      subCancelAsk: '要取消订阅申请吗？',
      subCancelYes: '取消申请',
      subCancelNo: '保留',
      subDone: '已收到您的 {plan} · {period} 申请。',
      subCancelled: '已取消订阅申请。',
      voucherTitle: '会员专属优惠券',
      voucherEmpty: '酒店为会员提供优惠券后，会汇集在这里。目前没有可用的优惠券。',
      voucherCta: '浏览酒店',
      wishlist: '心愿单',
      manageTitle: '账户',
      deleteBtn: '删除账户',
      deleteAsk: '保存在此浏览器中的账户和订阅申请将被删除，且无法恢复。要继续吗？',
      deleteYes: '删除',
      deleteNo: '取消',
    },
  },
}
