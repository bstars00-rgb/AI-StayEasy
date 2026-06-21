import type { Lang } from '../i18n'

/**
 * Strings for the hotel-partner area (login, password reset, portal, listing
 * editor) and its insight panels — in all five StayEasy languages. The partner
 * pages share the public language selection (localStorage), so a hotel manager
 * can run the whole portal in their own language.
 *
 * Templates with `{name}` / `{n}` are filled in by the component.
 */
export interface PartnerStrings {
  // shared
  signOut: string
  backToSite: string
  backToPortal: string
  backToSignIn: string
  cancel: string
  remove: string
  email: string
  password: string
  hotelName: string
  city: string

  login: {
    signIn: string
    createAccount: string
    forgotPw: string
    emailLoginId: string
    pwMinPh: string
    newAcctNote: string
    whyPartner: string
    demoNote: string
    errPending: string
    errRejected: string
    errInvalid: string
    errPwShort: string
    errEmailExists: string
    okCreated: string
  }

  reset: {
    title: string
    subtitle: string
    newPw: string
    confirmPw: string
    updatePw: string
    demoNote: string
    errPwShort: string
    errMismatch: string
    errNoAccount: string
    okUpdated: string
  }

  portal: {
    kicker: string
    plan: string
    status: string
    clicks30d: string
    marketing: string
    marketingSub: string
    funnelTitle: string
    views: string
    viewsHint: string
    unlocks: string
    unlocksHint: string
    officialClicks: string
    officialClicksHint: string
    wantTitle: string
    bestFor: string
    leadWith: string
    demoFunnelNote: string
    yourListing: string
    yourListingSub: string
    editListing: string
    viewPublic: string
    officialBenefits: string
    noBenefits: string
    demoPortalNote: string
  }

  trend: {
    title: string
    daysAgo: string
    today: string
  }

  search: {
    title: string
    badgeLive: string
    badgeDemo: string
    sub: string // "... last {n} days"
    impressions: string
    impressionsSub: string
    clicks: string
    clicksSub: string
    ctr: string
    ctrSub: string
    avgPos: string
    avgPosSub: string
    topTerms: string
    colQuery: string
    colImpr: string
    colClicks: string
    colCtr: string
    colPos: string
    demoNote: string
  }

  edit: {
    title: string
    subtitle: string // "{name} — ..."
    positioning: string
    positioningHint: string
    shortDesc: string
    mainReason: string
    facilities: string
    officialBenefits: string
    officialUrl: string
    mainPhoto: string
    koreanFriendly: string
    photosTitle: string
    photosSub: string
    addPhotoUrl: string
    uploadPhotos: string
    voucherTitle: string
    voucherSub: string
    voucherCode: string
    validUntil: string
    discountLabel: string
    terms: string
    howRedeem: string
    redeemOnline: string
    redeemOnsite: string
    fieldName: string
    contactTitle: string
    contactSub: string
    yourLang: string
    yourLangHint: string
    phone: string
    phoneHint: string
    whatsapp: string
    zalo: string
    kakao: string
    kakaoHint: string
    line: string
    lineHint: string
    messenger: string
    messengerHint: string
    numberHint: string
    saveChanges: string
  }
}

export const partnerStrings: Record<Lang, PartnerStrings> = {
  en: {
    signOut: 'Sign out',
    backToSite: '← Back to site',
    backToPortal: '← Back to portal',
    backToSignIn: '← Back to sign in',
    cancel: 'Cancel',
    remove: 'Remove',
    email: 'Email',
    password: 'Password',
    hotelName: 'Hotel name',
    city: 'City',
    login: {
      signIn: 'Sign in',
      createAccount: 'Create account',
      forgotPw: 'Forgot password?',
      emailLoginId: 'Email (your login ID)',
      pwMinPh: 'At least 6 characters',
      newAcctNote: 'New accounts are reviewed and approved by our team before sign-in.',
      whyPartner: 'Why partner with us?',
      demoNote: '🧪 Demo — accounts and approval are stored in your browser.',
      errPending: 'Your account is awaiting admin approval.',
      errRejected: 'This account was not approved. Please contact us.',
      errInvalid: 'Invalid email or password.',
      errPwShort: 'Password must be at least 6 characters.',
      errEmailExists: 'An account with this email already exists.',
      okCreated: 'Account created — it’s pending admin approval. We’ll email you once it’s approved.',
    },
    reset: {
      title: 'Reset password',
      subtitle: 'Enter your account email and choose a new password.',
      newPw: 'New password',
      confirmPw: 'Confirm new password',
      updatePw: 'Update password',
      demoNote: '🧪 Demo — a real build emails a secure reset link instead.',
      errPwShort: 'Password must be at least 6 characters.',
      errMismatch: 'Passwords don’t match.',
      errNoAccount: 'No account found for that email.',
      okUpdated: 'Password updated — redirecting to sign in…',
    },
    portal: {
      kicker: 'Partner portal',
      plan: 'Plan',
      status: 'Status',
      clicks30d: 'Clicks (30d)',
      marketing: 'Marketing insights',
      marketingSub: 'What travelers do on your page, and what to put front and center.',
      funnelTitle: 'Booking-intent funnel · 30 days',
      views: 'Views',
      viewsHint: 'Travelers who opened your page',
      unlocks: 'Voucher unlocks',
      unlocksHint: 'Signed in for your direct-booking voucher',
      officialClicks: 'Official-site clicks',
      officialClicksHint: 'Headed to your booking site',
      wantTitle: 'What travelers want from you',
      bestFor: 'Best for:',
      leadWith: 'Lead your marketing with',
      demoFunnelNote: '🧪 Funnel figures are demo estimates. Connect GA4 and these fill with live hotel_view, voucher_unlock and official_site_click events — including top search terms and demand by traveler type.',
      yourListing: 'Your listing',
      yourListingSub: 'Keep your description, official benefits, photo, and voucher up to date — changes appear on your public page right away.',
      editListing: 'Edit your listing',
      viewPublic: 'View public page ↗',
      officialBenefits: 'Official booking benefits',
      noBenefits: 'No benefits yet — add them in your listing.',
      demoPortalNote: '🧪 Demo portal — edits are saved in your browser. A real build syncs to the partner backend for the whole team.',
    },
    trend: {
      title: 'Official-site clicks · last 14 days',
      daysAgo: '14 days ago',
      today: 'Today',
    },
    search: {
      title: 'How travelers find you on Google',
      badgeLive: 'Search Console',
      badgeDemo: 'Demo',
      sub: 'The Google searches that surface your StayEasy page — last {n} days.',
      impressions: 'Impressions',
      impressionsSub: 'times shown on Google',
      clicks: 'Clicks',
      clicksSub: 'visits from search',
      ctr: 'CTR',
      ctrSub: 'clicks ÷ impressions',
      avgPos: 'Avg. position',
      avgPosSub: '1 = top of results',
      topTerms: 'Top search terms',
      colQuery: 'Query',
      colImpr: 'Impr.',
      colClicks: 'Clicks',
      colCtr: 'CTR',
      colPos: 'Pos.',
      demoNote: '🧪 Demo figures. Live Google Search Console data appears here once the StayEasy backend is connected with a service account — your page is already verified and Google is collecting data now.',
    },
    edit: {
      title: 'Edit your listing',
      subtitle: '{name} — changes appear on your public page immediately. List items go one per line.',
      positioning: 'Positioning line',
      positioningHint: 'one-line pitch',
      shortDesc: 'Short description',
      mainReason: 'Main reason to choose',
      facilities: 'Facilities',
      officialBenefits: 'Official booking benefits',
      officialUrl: 'Official website URL',
      mainPhoto: 'Main photo URL',
      koreanFriendly: '🇰🇷 Korean-friendly',
      photosTitle: 'Room & property photos',
      photosSub: 'Add photo URLs, or upload images. The first photos appear in your gallery.',
      addPhotoUrl: '+ Add photo URL',
      uploadPhotos: '⬆ Upload photos',
      voucherTitle: 'Direct-booking voucher',
      voucherSub: 'Optional — leave the code blank to remove it.',
      voucherCode: 'Voucher code',
      validUntil: 'Valid until',
      discountLabel: 'Discount label',
      terms: 'Terms',
      howRedeem: 'How guests redeem',
      redeemOnline: 'Online — enter the code in your booking form’s discount field',
      redeemOnsite: 'On-site — guest shows it at the front desk on arrival',
      fieldName: 'Code field name (as it appears in your booking widget)',
      contactTitle: 'Direct contact channels',
      contactSub: 'Guests reach you directly on these — StayEasy doesn’t host the chat. Fill only the ones you use; chat apps are easiest across languages.',
      yourLang: 'Your language',
      yourLangHint: 'guest requests are translated into this',
      phone: 'Phone',
      phoneHint: '+country code',
      whatsapp: 'WhatsApp',
      zalo: 'Zalo',
      kakao: 'KakaoTalk',
      kakaoHint: 'open-chat URL',
      line: 'LINE',
      lineHint: 'id',
      messenger: 'Messenger',
      messengerHint: 'm.me username',
      numberHint: 'number',
      saveChanges: 'Save changes',
    },
  },

  ko: {
    signOut: '로그아웃',
    backToSite: '← 사이트로',
    backToPortal: '← 포털로',
    backToSignIn: '← 로그인으로',
    cancel: '취소',
    remove: '삭제',
    email: '이메일',
    password: '비밀번호',
    hotelName: '호텔명',
    city: '도시',
    login: {
      signIn: '로그인',
      createAccount: '계정 만들기',
      forgotPw: '비밀번호를 잊으셨나요?',
      emailLoginId: '이메일 (로그인 ID)',
      pwMinPh: '6자 이상',
      newAcctNote: '신규 계정은 팀 검토·승인 후 로그인할 수 있습니다.',
      whyPartner: '파트너십 안내 →',
      demoNote: '🧪 데모 — 계정과 승인 정보는 브라우저에 저장됩니다.',
      errPending: '계정이 관리자 승인 대기 중입니다.',
      errRejected: '승인되지 않은 계정입니다. 문의해 주세요.',
      errInvalid: '이메일 또는 비밀번호가 올바르지 않습니다.',
      errPwShort: '비밀번호는 6자 이상이어야 합니다.',
      errEmailExists: '이미 가입된 이메일입니다.',
      okCreated: '계정이 생성되었습니다 — 관리자 승인 대기 중입니다. 승인되면 이메일로 알려드립니다.',
    },
    reset: {
      title: '비밀번호 재설정',
      subtitle: '계정 이메일을 입력하고 새 비밀번호를 설정하세요.',
      newPw: '새 비밀번호',
      confirmPw: '새 비밀번호 확인',
      updatePw: '비밀번호 변경',
      demoNote: '🧪 데모 — 실제 서비스에서는 보안 재설정 링크를 이메일로 보냅니다.',
      errPwShort: '비밀번호는 6자 이상이어야 합니다.',
      errMismatch: '비밀번호가 일치하지 않습니다.',
      errNoAccount: '해당 이메일의 계정을 찾을 수 없습니다.',
      okUpdated: '비밀번호가 변경되었습니다 — 로그인으로 이동합니다…',
    },
    portal: {
      kicker: '파트너 포털',
      plan: '플랜',
      status: '상태',
      clicks30d: '클릭 (30일)',
      marketing: '마케팅 인사이트',
      marketingSub: '여행자가 내 페이지에서 무엇을 하는지, 무엇을 앞세워야 하는지.',
      funnelTitle: '예약 의도 퍼널 · 30일',
      views: '조회',
      viewsHint: '내 페이지를 연 여행자',
      unlocks: '바우처 잠금 해제',
      unlocksHint: '직접 예약 바우처를 받으려 로그인',
      officialClicks: '공식 사이트 클릭',
      officialClicksHint: '예약 사이트로 이동',
      wantTitle: '여행자가 원하는 것',
      bestFor: '추천 대상:',
      leadWith: '이걸 앞세워 마케팅하세요',
      demoFunnelNote: '🧪 퍼널 수치는 데모 추정치입니다. GA4를 연결하면 실제 hotel_view·voucher_unlock·official_site_click 이벤트로 채워지며, 검색어 상위·여행자 유형별 수요까지 볼 수 있습니다.',
      yourListing: '내 리스팅',
      yourListingSub: '설명·공식 혜택·사진·바우처를 최신으로 유지하세요. 변경 사항은 공개 페이지에 즉시 반영됩니다.',
      editListing: '리스팅 편집',
      viewPublic: '공개 페이지 보기 ↗',
      officialBenefits: '공식 예약 혜택',
      noBenefits: '아직 혜택이 없습니다 — 리스팅에서 추가하세요.',
      demoPortalNote: '🧪 데모 포털 — 편집 내용은 브라우저에 저장됩니다. 실제 서비스에서는 팀 전체가 공유하는 백엔드와 동기화됩니다.',
    },
    trend: {
      title: '공식 사이트 클릭 · 최근 14일',
      daysAgo: '14일 전',
      today: '오늘',
    },
    search: {
      title: '여행자가 구글에서 나를 찾는 방법',
      badgeLive: 'Search Console',
      badgeDemo: '데모',
      sub: '내 StayEasy 페이지가 노출된 구글 검색 — 최근 {n}일.',
      impressions: '노출수',
      impressionsSub: '구글에 표시된 횟수',
      clicks: '클릭수',
      clicksSub: '검색을 통한 방문',
      ctr: 'CTR',
      ctrSub: '클릭 ÷ 노출',
      avgPos: '평균 순위',
      avgPosSub: '1 = 최상단',
      topTerms: '상위 검색어',
      colQuery: '검색어',
      colImpr: '노출',
      colClicks: '클릭',
      colCtr: 'CTR',
      colPos: '순위',
      demoNote: '🧪 데모 수치입니다. StayEasy 백엔드가 서비스 계정으로 연결되면 실제 구글 Search Console 데이터가 표시됩니다 — 페이지는 이미 인증됐고 구글이 지금 데이터를 수집 중입니다.',
    },
    edit: {
      title: '리스팅 편집',
      subtitle: '{name} — 변경 사항은 공개 페이지에 즉시 반영됩니다. 목록 항목은 한 줄에 하나씩 입력하세요.',
      positioning: '포지셔닝 한 줄',
      positioningHint: '한 줄 소개',
      shortDesc: '짧은 설명',
      mainReason: '선택해야 하는 핵심 이유',
      facilities: '시설',
      officialBenefits: '공식 예약 혜택',
      officialUrl: '공식 웹사이트 URL',
      mainPhoto: '대표 사진 URL',
      koreanFriendly: '🇰🇷 한국어 지원',
      photosTitle: '객실 & 시설 사진',
      photosSub: '사진 URL을 추가하거나 이미지를 업로드하세요. 앞쪽 사진이 갤러리에 표시됩니다.',
      addPhotoUrl: '+ 사진 URL 추가',
      uploadPhotos: '⬆ 사진 업로드',
      voucherTitle: '직접 예약 바우처',
      voucherSub: '선택 사항 — 코드를 비우면 제거됩니다.',
      voucherCode: '바우처 코드',
      validUntil: '유효 기간',
      discountLabel: '할인 문구',
      terms: '이용 조건',
      howRedeem: '사용 방법',
      redeemOnline: '온라인 — 예약 폼의 할인 코드 칸에 입력',
      redeemOnsite: '현장 — 체크인 시 프런트에 제시',
      fieldName: '코드 입력 칸 이름 (예약 위젯에 표시되는 그대로)',
      contactTitle: '직접 연락 채널',
      contactSub: '여행자가 이 채널로 직접 연락합니다 — StayEasy는 대화를 호스팅하지 않습니다. 사용하는 것만 입력하세요. 채팅 앱이 언어 장벽에 가장 편합니다.',
      yourLang: '호텔 사용 언어',
      yourLangHint: '여행자 요청이 이 언어로 번역됩니다',
      phone: '전화',
      phoneHint: '+국가번호',
      whatsapp: 'WhatsApp',
      zalo: 'Zalo',
      kakao: '카카오톡',
      kakaoHint: '오픈채팅 URL',
      line: 'LINE',
      lineHint: 'id',
      messenger: 'Messenger',
      messengerHint: 'm.me 사용자명',
      numberHint: '번호',
      saveChanges: '변경 저장',
    },
  },

  vi: {
    signOut: 'Đăng xuất',
    backToSite: '← Về trang chính',
    backToPortal: '← Về cổng đối tác',
    backToSignIn: '← Về đăng nhập',
    cancel: 'Hủy',
    remove: 'Xóa',
    email: 'Email',
    password: 'Mật khẩu',
    hotelName: 'Tên khách sạn',
    city: 'Thành phố',
    login: {
      signIn: 'Đăng nhập',
      createAccount: 'Tạo tài khoản',
      forgotPw: 'Quên mật khẩu?',
      emailLoginId: 'Email (ID đăng nhập)',
      pwMinPh: 'Tối thiểu 6 ký tự',
      newAcctNote: 'Tài khoản mới được đội ngũ duyệt trước khi đăng nhập.',
      whyPartner: 'Vì sao hợp tác với chúng tôi? →',
      demoNote: '🧪 Demo — tài khoản và phê duyệt lưu trong trình duyệt của bạn.',
      errPending: 'Tài khoản của bạn đang chờ quản trị viên phê duyệt.',
      errRejected: 'Tài khoản này không được duyệt. Vui lòng liên hệ chúng tôi.',
      errInvalid: 'Email hoặc mật khẩu không đúng.',
      errPwShort: 'Mật khẩu phải có ít nhất 6 ký tự.',
      errEmailExists: 'Email này đã được đăng ký.',
      okCreated: 'Đã tạo tài khoản — đang chờ phê duyệt. Chúng tôi sẽ email khi được duyệt.',
    },
    reset: {
      title: 'Đặt lại mật khẩu',
      subtitle: 'Nhập email tài khoản và chọn mật khẩu mới.',
      newPw: 'Mật khẩu mới',
      confirmPw: 'Xác nhận mật khẩu mới',
      updatePw: 'Cập nhật mật khẩu',
      demoNote: '🧪 Demo — bản chính thức gửi liên kết đặt lại an toàn qua email.',
      errPwShort: 'Mật khẩu phải có ít nhất 6 ký tự.',
      errMismatch: 'Mật khẩu không khớp.',
      errNoAccount: 'Không tìm thấy tài khoản với email đó.',
      okUpdated: 'Đã cập nhật mật khẩu — đang chuyển đến đăng nhập…',
    },
    portal: {
      kicker: 'Cổng đối tác',
      plan: 'Gói',
      status: 'Trạng thái',
      clicks30d: 'Lượt nhấp (30 ngày)',
      marketing: 'Thông tin marketing',
      marketingSub: 'Du khách làm gì trên trang của bạn, và nên làm nổi bật điều gì.',
      funnelTitle: 'Phễu ý định đặt phòng · 30 ngày',
      views: 'Lượt xem',
      viewsHint: 'Du khách đã mở trang của bạn',
      unlocks: 'Mở khóa voucher',
      unlocksHint: 'Đăng nhập để nhận voucher đặt trực tiếp',
      officialClicks: 'Nhấp vào website chính thức',
      officialClicksHint: 'Đi đến trang đặt phòng của bạn',
      wantTitle: 'Điều du khách mong muốn ở bạn',
      bestFor: 'Phù hợp với:',
      leadWith: 'Hãy làm nổi bật',
      demoFunnelNote: '🧪 Số liệu phễu là ước tính demo. Kết nối GA4 để điền dữ liệu thực từ sự kiện hotel_view, voucher_unlock và official_site_click — gồm cả từ khóa tìm kiếm hàng đầu và nhu cầu theo nhóm du khách.',
      yourListing: 'Trang của bạn',
      yourListingSub: 'Cập nhật mô tả, ưu đãi chính thức, ảnh và voucher — thay đổi xuất hiện ngay trên trang công khai.',
      editListing: 'Chỉnh sửa trang',
      viewPublic: 'Xem trang công khai ↗',
      officialBenefits: 'Ưu đãi đặt phòng chính thức',
      noBenefits: 'Chưa có ưu đãi — thêm trong trang của bạn.',
      demoPortalNote: '🧪 Cổng demo — thay đổi lưu trong trình duyệt. Bản chính thức đồng bộ với backend cho cả nhóm.',
    },
    trend: {
      title: 'Nhấp website chính thức · 14 ngày qua',
      daysAgo: '14 ngày trước',
      today: 'Hôm nay',
    },
    search: {
      title: 'Du khách tìm thấy bạn trên Google như thế nào',
      badgeLive: 'Search Console',
      badgeDemo: 'Demo',
      sub: 'Các tìm kiếm Google hiển thị trang StayEasy của bạn — {n} ngày qua.',
      impressions: 'Lượt hiển thị',
      impressionsSub: 'số lần xuất hiện trên Google',
      clicks: 'Lượt nhấp',
      clicksSub: 'lượt truy cập từ tìm kiếm',
      ctr: 'CTR',
      ctrSub: 'nhấp ÷ hiển thị',
      avgPos: 'Vị trí TB',
      avgPosSub: '1 = trên cùng',
      topTerms: 'Từ khóa hàng đầu',
      colQuery: 'Từ khóa',
      colImpr: 'Hiển thị',
      colClicks: 'Nhấp',
      colCtr: 'CTR',
      colPos: 'Vị trí',
      demoNote: '🧪 Số liệu demo. Dữ liệu Google Search Console thực sẽ hiển thị khi backend StayEasy được kết nối bằng tài khoản dịch vụ — trang của bạn đã được xác minh và Google đang thu thập dữ liệu.',
    },
    edit: {
      title: 'Chỉnh sửa trang',
      subtitle: '{name} — thay đổi xuất hiện ngay trên trang công khai. Mỗi mục một dòng.',
      positioning: 'Dòng định vị',
      positioningHint: 'giới thiệu một dòng',
      shortDesc: 'Mô tả ngắn',
      mainReason: 'Lý do chính để chọn',
      facilities: 'Tiện nghi',
      officialBenefits: 'Ưu đãi đặt phòng chính thức',
      officialUrl: 'URL website chính thức',
      mainPhoto: 'URL ảnh chính',
      koreanFriendly: '🇰🇷 Thân thiện với khách Hàn',
      photosTitle: 'Ảnh phòng & khách sạn',
      photosSub: 'Thêm URL ảnh hoặc tải ảnh lên. Các ảnh đầu tiên xuất hiện trong thư viện.',
      addPhotoUrl: '+ Thêm URL ảnh',
      uploadPhotos: '⬆ Tải ảnh lên',
      voucherTitle: 'Voucher đặt trực tiếp',
      voucherSub: 'Tùy chọn — để trống mã để xóa.',
      voucherCode: 'Mã voucher',
      validUntil: 'Có hiệu lực đến',
      discountLabel: 'Nhãn giảm giá',
      terms: 'Điều kiện',
      howRedeem: 'Cách khách sử dụng',
      redeemOnline: 'Trực tuyến — nhập mã vào ô giảm giá trên biểu mẫu đặt phòng',
      redeemOnsite: 'Tại chỗ — khách xuất trình tại quầy lễ tân khi đến',
      fieldName: 'Tên ô nhập mã (đúng như trên widget đặt phòng của bạn)',
      contactTitle: 'Kênh liên hệ trực tiếp',
      contactSub: 'Du khách liên hệ trực tiếp qua đây — StayEasy không host cuộc trò chuyện. Chỉ điền những kênh bạn dùng; ứng dụng chat dễ nhất khi khác ngôn ngữ.',
      yourLang: 'Ngôn ngữ của bạn',
      yourLangHint: 'yêu cầu của khách được dịch sang ngôn ngữ này',
      phone: 'Điện thoại',
      phoneHint: '+mã quốc gia',
      whatsapp: 'WhatsApp',
      zalo: 'Zalo',
      kakao: 'KakaoTalk',
      kakaoHint: 'URL open-chat',
      line: 'LINE',
      lineHint: 'id',
      messenger: 'Messenger',
      messengerHint: 'tên m.me',
      numberHint: 'số',
      saveChanges: 'Lưu thay đổi',
    },
  },

  zh: {
    signOut: '退出',
    backToSite: '← 返回网站',
    backToPortal: '← 返回门户',
    backToSignIn: '← 返回登录',
    cancel: '取消',
    remove: '删除',
    email: '邮箱',
    password: '密码',
    hotelName: '酒店名称',
    city: '城市',
    login: {
      signIn: '登录',
      createAccount: '创建账户',
      forgotPw: '忘记密码？',
      emailLoginId: '邮箱（登录 ID）',
      pwMinPh: '至少 6 个字符',
      newAcctNote: '新账户需经我们团队审核批准后方可登录。',
      whyPartner: '为何与我们合作？→',
      demoNote: '🧪 演示 — 账户与审批保存在您的浏览器中。',
      errPending: '您的账户正在等待管理员审批。',
      errRejected: '此账户未获批准，请联系我们。',
      errInvalid: '邮箱或密码不正确。',
      errPwShort: '密码至少需 6 个字符。',
      errEmailExists: '该邮箱已注册。',
      okCreated: '账户已创建 — 正在等待管理员审批。批准后我们会发邮件通知您。',
    },
    reset: {
      title: '重置密码',
      subtitle: '输入账户邮箱并设置新密码。',
      newPw: '新密码',
      confirmPw: '确认新密码',
      updatePw: '更新密码',
      demoNote: '🧪 演示 — 正式版会改为发送安全重置链接邮件。',
      errPwShort: '密码至少需 6 个字符。',
      errMismatch: '两次密码不一致。',
      errNoAccount: '未找到该邮箱对应的账户。',
      okUpdated: '密码已更新 — 正在跳转到登录…',
    },
    portal: {
      kicker: '合作伙伴门户',
      plan: '套餐',
      status: '状态',
      clicks30d: '点击（30 天）',
      marketing: '营销洞察',
      marketingSub: '了解旅客在您页面上的行为，以及应突出展示什么。',
      funnelTitle: '预订意向漏斗 · 30 天',
      views: '浏览',
      viewsHint: '打开您页面的旅客',
      unlocks: '优惠券解锁',
      unlocksHint: '为获取直订优惠券而登录',
      officialClicks: '官网点击',
      officialClicksHint: '前往您的预订网站',
      wantTitle: '旅客对您的期待',
      bestFor: '适合：',
      leadWith: '请重点营销',
      demoFunnelNote: '🧪 漏斗数据为演示估算。连接 GA4 后，将由真实的 hotel_view、voucher_unlock 与 official_site_click 事件填充 — 包括热门搜索词与按旅客类型的需求。',
      yourListing: '您的展示页',
      yourListingSub: '及时更新描述、官方权益、照片和优惠券 — 更改会立即显示在公开页面。',
      editListing: '编辑展示页',
      viewPublic: '查看公开页面 ↗',
      officialBenefits: '官方预订权益',
      noBenefits: '暂无权益 — 请在展示页中添加。',
      demoPortalNote: '🧪 演示门户 — 编辑保存在浏览器中。正式版会与团队共享的后端同步。',
    },
    trend: {
      title: '官网点击 · 近 14 天',
      daysAgo: '14 天前',
      today: '今天',
    },
    search: {
      title: '旅客如何在 Google 上找到您',
      badgeLive: 'Search Console',
      badgeDemo: '演示',
      sub: '展示您 StayEasy 页面的 Google 搜索 — 近 {n} 天。',
      impressions: '展示次数',
      impressionsSub: '在 Google 上出现的次数',
      clicks: '点击次数',
      clicksSub: '来自搜索的访问',
      ctr: '点击率',
      ctrSub: '点击 ÷ 展示',
      avgPos: '平均排名',
      avgPosSub: '1 = 最顶部',
      topTerms: '热门搜索词',
      colQuery: '搜索词',
      colImpr: '展示',
      colClicks: '点击',
      colCtr: '点击率',
      colPos: '排名',
      demoNote: '🧪 演示数据。当 StayEasy 后端以服务账户连接后，将显示真实的 Google Search Console 数据 — 您的页面已验证，Google 正在收集数据。',
    },
    edit: {
      title: '编辑展示页',
      subtitle: '{name} — 更改会立即显示在公开页面。列表项每行一个。',
      positioning: '定位语',
      positioningHint: '一句话卖点',
      shortDesc: '简短描述',
      mainReason: '选择的主要理由',
      facilities: '设施',
      officialBenefits: '官方预订权益',
      officialUrl: '官方网站 URL',
      mainPhoto: '主图 URL',
      koreanFriendly: '🇰🇷 韩语友好',
      photosTitle: '客房与酒店照片',
      photosSub: '添加照片 URL 或上传图片。前几张照片会显示在图库中。',
      addPhotoUrl: '+ 添加照片 URL',
      uploadPhotos: '⬆ 上传照片',
      voucherTitle: '直订优惠券',
      voucherSub: '可选 — 留空优惠码即可移除。',
      voucherCode: '优惠码',
      validUntil: '有效期至',
      discountLabel: '折扣说明',
      terms: '使用条件',
      howRedeem: '旅客如何使用',
      redeemOnline: '在线 — 在预订表单的优惠码栏输入',
      redeemOnsite: '现场 — 旅客抵达时在前台出示',
      fieldName: '优惠码栏名称（与您预订组件上显示的一致）',
      contactTitle: '直接联系渠道',
      contactSub: '旅客通过这些渠道直接联系您 — StayEasy 不托管对话。只填您使用的；聊天应用最便于跨语言。',
      yourLang: '您的语言',
      yourLangHint: '旅客请求将翻译成此语言',
      phone: '电话',
      phoneHint: '+国家代码',
      whatsapp: 'WhatsApp',
      zalo: 'Zalo',
      kakao: 'KakaoTalk',
      kakaoHint: '开放聊天 URL',
      line: 'LINE',
      lineHint: 'id',
      messenger: 'Messenger',
      messengerHint: 'm.me 用户名',
      numberHint: '号码',
      saveChanges: '保存更改',
    },
  },

  ja: {
    signOut: 'ログアウト',
    backToSite: '← サイトへ',
    backToPortal: '← ポータルへ',
    backToSignIn: '← ログインへ',
    cancel: 'キャンセル',
    remove: '削除',
    email: 'メール',
    password: 'パスワード',
    hotelName: 'ホテル名',
    city: '都市',
    login: {
      signIn: 'ログイン',
      createAccount: 'アカウント作成',
      forgotPw: 'パスワードをお忘れですか？',
      emailLoginId: 'メール（ログインID）',
      pwMinPh: '6文字以上',
      newAcctNote: '新規アカウントはチームの審査・承認後にログインできます。',
      whyPartner: 'パートナーのご案内 →',
      demoNote: '🧪 デモ — アカウントと承認はブラウザに保存されます。',
      errPending: 'アカウントは管理者の承認待ちです。',
      errRejected: 'このアカウントは承認されませんでした。お問い合わせください。',
      errInvalid: 'メールまたはパスワードが正しくありません。',
      errPwShort: 'パスワードは6文字以上で入力してください。',
      errEmailExists: 'このメールは既に登録されています。',
      okCreated: 'アカウントを作成しました — 管理者の承認待ちです。承認されたらメールでお知らせします。',
    },
    reset: {
      title: 'パスワード再設定',
      subtitle: 'アカウントのメールを入力し、新しいパスワードを設定してください。',
      newPw: '新しいパスワード',
      confirmPw: '新しいパスワード（確認）',
      updatePw: 'パスワードを更新',
      demoNote: '🧪 デモ — 本番では安全な再設定リンクをメールで送信します。',
      errPwShort: 'パスワードは6文字以上で入力してください。',
      errMismatch: 'パスワードが一致しません。',
      errNoAccount: 'そのメールのアカウントが見つかりません。',
      okUpdated: 'パスワードを更新しました — ログインへ移動します…',
    },
    portal: {
      kicker: 'パートナーポータル',
      plan: 'プラン',
      status: 'ステータス',
      clicks30d: 'クリック（30日）',
      marketing: 'マーケティングインサイト',
      marketingSub: '旅行者がページで何をするか、何を前面に出すべきか。',
      funnelTitle: '予約意図ファネル · 30日',
      views: '閲覧',
      viewsHint: 'ページを開いた旅行者',
      unlocks: 'クーポン解錠',
      unlocksHint: '直接予約クーポンのためにログイン',
      officialClicks: '公式サイトクリック',
      officialClicksHint: '予約サイトへ移動',
      wantTitle: '旅行者が求めるもの',
      bestFor: 'おすすめ:',
      leadWith: 'これを前面に出しましょう',
      demoFunnelNote: '🧪 ファネルの数値はデモ推定です。GA4 を接続すると、実際の hotel_view・voucher_unlock・official_site_click イベントで満たされ、上位検索語や旅行者タイプ別の需要も確認できます。',
      yourListing: 'あなたの掲載',
      yourListingSub: '説明・公式特典・写真・クーポンを最新に保ちましょう — 変更は公開ページに即時反映されます。',
      editListing: '掲載を編集',
      viewPublic: '公開ページを見る ↗',
      officialBenefits: '公式予約特典',
      noBenefits: 'まだ特典がありません — 掲載で追加してください。',
      demoPortalNote: '🧪 デモポータル — 編集はブラウザに保存されます。本番ではチーム共有のバックエンドと同期します。',
    },
    trend: {
      title: '公式サイトクリック · 直近14日',
      daysAgo: '14日前',
      today: '今日',
    },
    search: {
      title: '旅行者が Google であなたを見つける方法',
      badgeLive: 'Search Console',
      badgeDemo: 'デモ',
      sub: 'あなたの StayEasy ページが表示された Google 検索 — 直近{n}日。',
      impressions: '表示回数',
      impressionsSub: 'Google に表示された回数',
      clicks: 'クリック数',
      clicksSub: '検索からの訪問',
      ctr: 'CTR',
      ctrSub: 'クリック ÷ 表示',
      avgPos: '平均掲載順位',
      avgPosSub: '1 = 最上位',
      topTerms: '上位検索語',
      colQuery: '検索語',
      colImpr: '表示',
      colClicks: 'クリック',
      colCtr: 'CTR',
      colPos: '順位',
      demoNote: '🧪 デモ数値です。StayEasy バックエンドがサービスアカウントで接続されると、実際の Google Search Console データが表示されます — ページは既に確認済みで、Google がデータを収集中です。',
    },
    edit: {
      title: '掲載を編集',
      subtitle: '{name} — 変更は公開ページに即時反映されます。リスト項目は1行に1つ。',
      positioning: 'ポジショニング一文',
      positioningHint: '一言アピール',
      shortDesc: '短い説明',
      mainReason: '選ぶ主な理由',
      facilities: '設備',
      officialBenefits: '公式予約特典',
      officialUrl: '公式サイト URL',
      mainPhoto: 'メイン写真 URL',
      koreanFriendly: '🇰🇷 韓国語対応',
      photosTitle: '客室・館内写真',
      photosSub: '写真 URL を追加するか画像をアップロード。最初の写真がギャラリーに表示されます。',
      addPhotoUrl: '+ 写真 URL を追加',
      uploadPhotos: '⬆ 写真をアップロード',
      voucherTitle: '直接予約クーポン',
      voucherSub: '任意 — コードを空にすると削除されます。',
      voucherCode: 'クーポンコード',
      validUntil: '有効期限',
      discountLabel: '割引ラベル',
      terms: '利用条件',
      howRedeem: '利用方法',
      redeemOnline: 'オンライン — 予約フォームの割引コード欄に入力',
      redeemOnsite: '現地 — チェックイン時にフロントで提示',
      fieldName: 'コード入力欄の名称（予約ウィジェットの表示どおり）',
      contactTitle: '直接連絡チャネル',
      contactSub: '旅行者はこちらで直接連絡します — StayEasy はチャットをホストしません。使うものだけ入力してください。チャットアプリが言語を越えて最も簡単です。',
      yourLang: 'ホテルの言語',
      yourLangHint: '旅行者のリクエストはこの言語に翻訳されます',
      phone: '電話',
      phoneHint: '+国番号',
      whatsapp: 'WhatsApp',
      zalo: 'Zalo',
      kakao: 'KakaoTalk',
      kakaoHint: 'オープンチャット URL',
      line: 'LINE',
      lineHint: 'id',
      messenger: 'Messenger',
      messengerHint: 'm.me ユーザー名',
      numberHint: '番号',
      saveChanges: '変更を保存',
    },
  },
}
