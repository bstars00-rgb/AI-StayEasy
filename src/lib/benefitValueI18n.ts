import type { Lang } from '../i18n'

export interface BenefitValueStrings {
  /** "{pct}", "{min}", "{free}", "{amount}" are replaced by the number. */
  save: string
  upTo: string
  freeNights: string
  amountChip: string
  amountChipNight: string
  calcTitle: string
  calcIntro: string
  rate: string
  nights: string
  currency: string
  result: string
  resultUpTo: string
  amountResult: string
  about: string
  basis: string
  nightsBasis: string
  nightsNeed: string
  amountBasis: string
  note: string
}

export const benefitValueStrings: Record<Lang, BenefitValueStrings> = {
  en: {
    save: '{pct}% off',
    upTo: 'Up to {pct}% off',
    freeNights: '{free} free night when you stay {min}+',
    amountChip: 'Worth {amount}',
    amountChipNight: 'Worth {amount} a night',
    calcTitle: 'How much benefit could you get?',
    calcIntro: 'Enter the nightly rate you see on the official site.',
    rate: 'Nightly rate',
    nights: 'Nights',
    currency: 'Currency',
    result: 'You could get',
    resultUpTo: 'You could get up to',
    amountResult: 'Value of this benefit',
    about: 'about',
    basis: 'at {pct}% off',
    nightsBasis: 'with {free} free night',
    nightsNeed: 'Applies from {min} nights — enter {min} or more.',
    amountBasis: 'as stated by the hotel',
    note: 'Calculated from the hotel’s own stated offer and the numbers you enter. Conditions, codes and dates apply and can change, so confirm the final price on the official site.',
  },
  ko: {
    save: '{pct}% 할인',
    upTo: '최대 {pct}% 할인',
    freeNights: '{min}박 이상 숙박 시 {free}박 무료',
    amountChip: '{amount} 상당',
    amountChipNight: '1박당 {amount} 상당',
    calcTitle: '얼마나 혜택을 받을 수 있을까요?',
    calcIntro: '공식 사이트에서 보이는 1박 요금을 입력해 보세요.',
    rate: '1박 요금',
    nights: '숙박 일수',
    currency: '통화',
    result: '받을 수 있는 혜택',
    resultUpTo: '최대로 받을 수 있는 혜택',
    amountResult: '이 혜택의 가치',
    about: '약',
    basis: '{pct}% 할인 기준',
    nightsBasis: '{free}박 무료 적용',
    nightsNeed: '{min}박 이상일 때 적용돼요. 숙박 일수를 {min} 이상으로 입력해 보세요.',
    amountBasis: '호텔이 밝힌 금액 기준',
    note: '호텔이 공식 사이트에 밝힌 혜택과 입력하신 숫자로 계산한 값입니다. 조건, 코드, 기간에 따라 달라질 수 있으니 최종 금액은 공식 사이트에서 확인하세요.',
  },
  vi: {
    save: 'Giảm {pct}%',
    upTo: 'Giảm tới {pct}%',
    freeNights: 'Ở từ {min} đêm, tặng {free} đêm',
    amountChip: 'Trị giá {amount}',
    amountChipNight: 'Trị giá {amount} mỗi đêm',
    calcTitle: 'Bạn có thể nhận được bao nhiêu ưu đãi?',
    calcIntro: 'Nhập giá một đêm bạn thấy trên trang chính thức.',
    rate: 'Giá mỗi đêm',
    nights: 'Số đêm',
    currency: 'Tiền tệ',
    result: 'Bạn có thể nhận',
    resultUpTo: 'Bạn có thể nhận tối đa',
    amountResult: 'Giá trị của ưu đãi này',
    about: 'khoảng',
    basis: 'ở mức giảm {pct}%',
    nightsBasis: 'khi được tặng {free} đêm',
    nightsNeed: 'Áp dụng từ {min} đêm — hãy nhập từ {min} đêm trở lên.',
    amountBasis: 'theo số tiền khách sạn công bố',
    note: 'Được tính từ ưu đãi khách sạn tự công bố và các số bạn nhập. Điều kiện, mã và thời gian áp dụng có thể thay đổi, hãy xác nhận giá cuối cùng trên trang chính thức.',
  },
  zh: {
    save: '立减{pct}%',
    upTo: '最高减{pct}%',
    freeNights: '住满{min}晚，免费{free}晚',
    amountChip: '价值{amount}',
    amountChipNight: '每晚价值{amount}',
    calcTitle: '能获得多少优惠？',
    calcIntro: '请输入您在官网看到的每晚房价。',
    rate: '每晚房价',
    nights: '入住晚数',
    currency: '币种',
    result: '可获得',
    resultUpTo: '最多可获得',
    amountResult: '此优惠的价值',
    about: '约',
    basis: '按{pct}%优惠计算',
    nightsBasis: '含{free}晚免费',
    nightsNeed: '住满{min}晚起适用，请将晚数填为{min}或以上。',
    amountBasis: '按酒店公布的金额',
    note: '根据酒店自己公布的优惠和您输入的数字计算。条件、优惠码和日期可能影响结果且会变动，最终价格请以官网为准。',
  },
  ja: {
    save: '{pct}%オフ',
    upTo: '最大{pct}%オフ',
    freeNights: '{min}泊以上のご宿泊で{free}泊無料',
    amountChip: '{amount}相当',
    amountChipNight: '1泊あたり{amount}相当',
    calcTitle: 'どれくらい特典を受けられる?',
    calcIntro: '公式サイトに表示される1泊の料金を入力してください。',
    rate: '1泊の料金',
    nights: '泊数',
    currency: '通貨',
    result: '受けられる特典',
    resultUpTo: '最大で受けられる特典',
    amountResult: 'この特典の価値',
    about: '約',
    basis: '{pct}%オフの場合',
    nightsBasis: '{free}泊無料を適用',
    nightsNeed: '{min}泊以上で適用されます。泊数を{min}以上にしてください。',
    amountBasis: 'ホテルが示した金額',
    note: 'ホテルが公式サイトで示している特典と、入力した数字から計算した値です。条件・コード・期間により変わる場合があるため、最終的な料金は公式サイトでご確認ください。',
  },
}

/** Fill "{pct}" in a template. */
export const withPct = (tpl: string, pct: number) => tpl.replace('{pct}', String(pct))

/** Fill any {name} placeholders. */
export const withVars = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
