import type { Lang } from '../i18n'

/**
 * The StayEasy Distinction — a scarce, guide-style editorial mark (not a numeric
 * score on every hotel). Like a Michelin distinction, only a small share of
 * hotels earn one, which is exactly what makes it trustworthy. `label` names the
 * system; `choice`/`recommended` are the two tiers; the explainer states the
 * published criteria.
 */
export interface ScoreStrings {
  label: string
  tagline: string
  localFocus: string
  explainerTitle: string
  explainerText: string
  /** Top tier — at most one per city. */
  choice: string
  /** Selected tier. */
  recommended: string
  choiceTip: string
  recommendedTip: string
  /** aria/tooltip for the star rating; {n} = star count. */
  starsAria: string
}

export const scoreStrings: Record<Lang, ScoreStrings> = {
  en: {
    label: 'StayEasy Distinction',
    tagline: 'Our independent editorial mark',
    localFocus: 'We champion standout local hotels over big chains.',
    explainerTitle: 'What is the StayEasy Distinction?',
    explainerText:
      'The StayEasy Distinction is our own independent editorial mark — not an aggregate of user reviews, and not a score on every hotel. Only a small share of hotels earn one: “StayEasy Choice” goes to at most one standout per city, and “Recommended” to a select few. We judge each hotel on suitability, location, and direct-booking value, deliberately spotlighting characterful local and independent hotels. Most listed hotels carry no mark — that scarcity is what makes it worth trusting.',
    choice: 'StayEasy Choice',
    recommended: 'StayEasy Recommended',
    choiceTip: 'The single standout hotel in this city.',
    recommendedTip: 'A select hotel we recommend in this city.',
    starsAria: '{n}-star hotel',
  },
  ko: {
    label: 'StayEasy 등급',
    tagline: '우리의 독립 편집 인증',
    localFocus: '글로벌 체인보다 개성 있는 로컬 호텔을 응원합니다.',
    explainerTitle: 'StayEasy 등급이란?',
    explainerText:
      'StayEasy 등급은 사용자 후기 집계가 아니라, 모든 호텔에 점수를 주지 않는 저희만의 독립 편집 인증입니다. 극소수의 호텔만 받습니다 — “StayEasy Choice”는 도시마다 최대 한 곳, “Recommended”는 선별된 소수에게만 부여됩니다. 적합성·위치·직접예약 가치를 기준으로 평가하며, 개성 있는 로컬·독립 호텔을 의도적으로 조명합니다. 대부분의 호텔은 무등급이며 — 이 희소성이 신뢰의 근거입니다.',
    choice: 'StayEasy Choice',
    recommended: 'StayEasy Recommended',
    choiceTip: '이 도시에서 가장 돋보이는 단 한 곳.',
    recommendedTip: '이 도시에서 저희가 추천하는 선별 호텔.',
    starsAria: '{n}성급 호텔',
  },
  vi: {
    label: 'Chứng nhận StayEasy',
    tagline: 'Dấu ấn biên tập độc lập của chúng tôi',
    localFocus: 'Chúng tôi đề cao những khách sạn địa phương nổi bật hơn các chuỗi lớn.',
    explainerTitle: 'Chứng nhận StayEasy là gì?',
    explainerText:
      'Chứng nhận StayEasy là dấu ấn biên tập độc lập của riêng chúng tôi — không phải tổng hợp đánh giá của người dùng, và không phải điểm số cho mọi khách sạn. Chỉ một số ít khách sạn đạt được: “StayEasy Choice” trao cho nhiều nhất một khách sạn nổi bật mỗi thành phố, và “Recommended” cho số ít được chọn. Chúng tôi đánh giá theo mức độ phù hợp, vị trí và giá trị đặt trực tiếp, cố ý tôn vinh những khách sạn địa phương độc lập đầy cá tính. Hầu hết khách sạn không có dấu ấn — chính sự hiếm hoi đó tạo nên niềm tin.',
    choice: 'StayEasy Choice',
    recommended: 'StayEasy Recommended',
    choiceTip: 'Khách sạn nổi bật duy nhất tại thành phố này.',
    recommendedTip: 'Một khách sạn chọn lọc chúng tôi đề xuất ở thành phố này.',
    starsAria: 'Khách sạn {n} sao',
  },
  zh: {
    label: 'StayEasy 认证',
    tagline: '我们的独立编辑标识',
    localFocus: '相比大型连锁，我们更推崇有特色的本地酒店。',
    explainerTitle: '什么是 StayEasy 认证？',
    explainerText:
      'StayEasy 认证是我们自己的独立编辑标识——并非用户评价的汇总，也不是给每家酒店打分。只有少数酒店能获得：“StayEasy Choice”每座城市至多授予一家出众酒店，“Recommended”仅授予精选的少数。我们从契合度、位置与官网直订价值进行评估，并有意聚焦有个性的本地与独立酒店。大多数在列酒店没有任何标识——正是这种稀缺让它值得信赖。',
    choice: 'StayEasy Choice',
    recommended: 'StayEasy Recommended',
    choiceTip: '本城市唯一的出众之选。',
    recommendedTip: '本城市中我们推荐的精选酒店。',
    starsAria: '{n} 星级酒店',
  },
  ja: {
    label: 'StayEasy認定',
    tagline: '私たち独自の編集評価マーク',
    localFocus: '大手チェーンより、個性ある地元ホテルを応援します。',
    explainerTitle: 'StayEasy認定とは？',
    explainerText:
      'StayEasy認定は、利用者レビューの集計ではなく、すべてのホテルに点数を付けるものでもない、私たち独自の独立した編集マークです。ごく一部のホテルだけが獲得します —「StayEasy Choice」は各都市で最大1軒の傑出したホテルに、「Recommended」は厳選された少数に贈られます。適合性・立地・公式直予約の価値で評価し、個性ある地元・独立系ホテルを意図的に取り上げます。掲載ホテルの多くはマークを持ちません — その希少さこそが信頼の理由です。',
    choice: 'StayEasy Choice',
    recommended: 'StayEasy Recommended',
    choiceTip: 'この都市で唯一の傑出したホテル。',
    recommendedTip: 'この都市で私たちが薦める厳選ホテル。',
    starsAria: '{n}つ星ホテル',
  },
}
