import type { Lang } from '../i18n'

export interface BenefitValueStrings {
  /** "{pct}" is replaced with the number. */
  save: string
  upTo: string
  calcTitle: string
  calcIntro: string
  rate: string
  nights: string
  currency: string
  result: string
  resultUpTo: string
  about: string
  basis: string
  note: string
}

export const benefitValueStrings: Record<Lang, BenefitValueStrings> = {
  en: {
    save: '{pct}% off',
    upTo: 'Up to {pct}% off',
    calcTitle: 'See what you’d save',
    calcIntro: 'Enter the nightly rate you see on the official site.',
    rate: 'Nightly rate',
    nights: 'Nights',
    currency: 'Currency',
    result: 'You could save',
    resultUpTo: 'You could save up to',
    about: 'about',
    basis: 'at {pct}% off',
    note: 'Calculated from the hotel’s own stated offer and the numbers you enter. Conditions, codes and dates apply and can change, so confirm the final price on the official site.',
  },
  ko: {
    save: '{pct}% 할인',
    upTo: '최대 {pct}% 할인',
    calcTitle: '내 요금으로 아끼는 금액 계산',
    calcIntro: '공식 사이트에서 보이는 1박 요금을 입력해 보세요.',
    rate: '1박 요금',
    nights: '숙박 일수',
    currency: '통화',
    result: '아낄 수 있는 금액',
    resultUpTo: '최대로 아낄 수 있는 금액',
    about: '약',
    basis: '{pct}% 할인 기준',
    note: '호텔이 공식 사이트에 밝힌 혜택과 입력하신 숫자로 계산한 값입니다. 조건, 코드, 기간에 따라 달라질 수 있으니 최종 금액은 공식 사이트에서 확인하세요.',
  },
  vi: {
    save: 'Giảm {pct}%',
    upTo: 'Giảm tới {pct}%',
    calcTitle: 'Tính số tiền bạn tiết kiệm được',
    calcIntro: 'Nhập giá một đêm bạn thấy trên trang chính thức.',
    rate: 'Giá mỗi đêm',
    nights: 'Số đêm',
    currency: 'Tiền tệ',
    result: 'Bạn có thể tiết kiệm',
    resultUpTo: 'Bạn có thể tiết kiệm tối đa',
    about: 'khoảng',
    basis: 'ở mức giảm {pct}%',
    note: 'Được tính từ ưu đãi khách sạn tự công bố và các số bạn nhập. Điều kiện, mã và thời gian áp dụng có thể thay đổi, hãy xác nhận giá cuối cùng trên trang chính thức.',
  },
  zh: {
    save: '立减{pct}%',
    upTo: '最高减{pct}%',
    calcTitle: '按您的房价计算能省多少',
    calcIntro: '请输入您在官网看到的每晚房价。',
    rate: '每晚房价',
    nights: '入住晚数',
    currency: '币种',
    result: '可节省',
    resultUpTo: '最多可节省',
    about: '约',
    basis: '按{pct}%优惠计算',
    note: '根据酒店自己公布的优惠和您输入的数字计算。条件、优惠码和日期可能影响结果且会变动，最终价格请以官网为准。',
  },
  ja: {
    save: '{pct}%オフ',
    upTo: '最大{pct}%オフ',
    calcTitle: 'あなたの料金でいくら節約できるか',
    calcIntro: '公式サイトに表示される1泊の料金を入力してください。',
    rate: '1泊の料金',
    nights: '泊数',
    currency: '通貨',
    result: '節約できる金額',
    resultUpTo: '最大で節約できる金額',
    about: '約',
    basis: '{pct}%オフの場合',
    note: 'ホテルが公式サイトで示している特典と、入力した数字から計算した値です。条件・コード・期間により変わる場合があるため、最終的な料金は公式サイトでご確認ください。',
  },
}

/** Fill "{pct}" in a template. */
export const withPct = (tpl: string, pct: number) => tpl.replace('{pct}', String(pct))
