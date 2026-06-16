import type { Lang } from '../i18n'

export interface VoucherStrings {
  /** Card heading. */
  title: string
  /** One-line explanation of what the voucher is. */
  subtitle: string
  /** Small label above the code box. */
  codeLabel: string
  copy: string
  copied: string
  download: string
  /** CTA that opens the official website. */
  useOnSite: string
  termsLabel: string
  validUntil: string
  /** Reassurance line — direct booking, no commission. */
  note: string
  /** Compact card badge. */
  badge: string
  /** Coupon footer printed on the downloaded SVG. */
  couponFooter: string
}

export const voucherStrings: Record<Lang, VoucherStrings> = {
  en: {
    title: 'Direct-booking voucher',
    subtitle: 'A discount the hotel offers when you book on its official website.',
    codeLabel: 'Voucher code',
    copy: 'Copy code',
    copied: 'Copied!',
    download: 'Download voucher',
    useOnSite: 'Use on official website',
    termsLabel: 'Terms',
    validUntil: 'Valid until',
    note: 'Apply this code when booking direct — StayEasy never processes the payment.',
    badge: 'Voucher',
    couponFooter: 'Present this code when booking on the official website.',
  },
  ko: {
    title: '직접 예약 할인권',
    subtitle: '호텔 공식 사이트에서 예약할 때 사용할 수 있는 할인 혜택이에요.',
    codeLabel: '바우처 코드',
    copy: '코드 복사',
    copied: '복사됨!',
    download: '바우처 다운로드',
    useOnSite: '공식 사이트에서 사용',
    termsLabel: '이용 조건',
    validUntil: '유효 기간',
    note: '공식 사이트에서 직접 예약할 때 이 코드를 입력하세요 — StayEasy는 결제를 처리하지 않습니다.',
    badge: '할인권',
    couponFooter: '공식 사이트에서 예약할 때 이 코드를 제시하세요.',
  },
  vi: {
    title: 'Voucher đặt phòng trực tiếp',
    subtitle: 'Ưu đãi giảm giá khách sạn dành cho bạn khi đặt trên website chính thức.',
    codeLabel: 'Mã voucher',
    copy: 'Sao chép mã',
    copied: 'Đã sao chép!',
    download: 'Tải voucher',
    useOnSite: 'Dùng trên website chính thức',
    termsLabel: 'Điều kiện',
    validUntil: 'Có hiệu lực đến',
    note: 'Nhập mã này khi đặt trực tiếp — StayEasy không xử lý thanh toán.',
    badge: 'Voucher',
    couponFooter: 'Xuất trình mã này khi đặt trên website chính thức.',
  },
  zh: {
    title: '官网直订优惠券',
    subtitle: '酒店为您在官网预订时提供的折扣优惠。',
    codeLabel: '优惠码',
    copy: '复制优惠码',
    copied: '已复制！',
    download: '下载优惠券',
    useOnSite: '在官网使用',
    termsLabel: '使用条件',
    validUntil: '有效期至',
    note: '官网直订时输入此优惠码——StayEasy 不处理任何付款。',
    badge: '优惠券',
    couponFooter: '在官网预订时出示此优惠码。',
  },
  ja: {
    title: '公式直予約クーポン',
    subtitle: 'ホテル公式サイトで予約する際に使える割引特典です。',
    codeLabel: 'クーポンコード',
    copy: 'コードをコピー',
    copied: 'コピーしました！',
    download: 'クーポンをダウンロード',
    useOnSite: '公式サイトで使う',
    termsLabel: '利用条件',
    validUntil: '有効期限',
    note: '公式サイトで直接予約する際にこのコードを入力してください — StayEasy は決済を行いません。',
    badge: 'クーポン',
    couponFooter: '公式サイトで予約する際にこのコードをご提示ください。',
  },
}
