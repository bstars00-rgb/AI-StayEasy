import type { Lang } from '../i18n'

/**
 * The StayEasy Score — our own independent, editorial hotel rating (not an
 * aggregate of user reviews). Positioned like a trusted guide: it builds
 * credibility over time and deliberately champions standout local/independent
 * hotels over big global chains.
 */
export interface ScoreStrings {
  label: string
  tagline: string
  localFocus: string
  explainerTitle: string
  explainerText: string
}

export const scoreStrings: Record<Lang, ScoreStrings> = {
  en: {
    label: 'StayEasy Score',
    tagline: 'Our independent rating',
    localFocus: 'We champion standout local hotels over big chains.',
    explainerTitle: 'What is the StayEasy Score?',
    explainerText:
      'Like a trusted guide, the StayEasy Score is our own independent rating — not an aggregate of user reviews. We assess each hotel on suitability, location, and direct-booking value, and we deliberately spotlight characterful local and independent hotels over big global chains.',
  },
  ko: {
    label: 'StayEasy 추천 점수',
    tagline: '독립 평가 점수',
    localFocus: '글로벌 체인보다 개성 있는 로컬 호텔을 응원합니다.',
    explainerTitle: 'StayEasy 추천 점수란?',
    explainerText:
      '신뢰받는 가이드처럼, StayEasy 추천 점수는 사용자 후기 집계가 아니라 저희만의 독립 평가입니다. 적합성·위치·직접예약 가치를 기준으로 호텔을 평가하며, 대형 글로벌 체인보다 개성 있는 로컬·독립 호텔을 의도적으로 조명합니다.',
  },
  vi: {
    label: 'Điểm StayEasy',
    tagline: 'Đánh giá độc lập của chúng tôi',
    localFocus: 'Chúng tôi đề cao những khách sạn địa phương nổi bật hơn các chuỗi lớn.',
    explainerTitle: 'Điểm StayEasy là gì?',
    explainerText:
      'Giống như một cẩm nang đáng tin cậy, Điểm StayEasy là đánh giá độc lập của riêng chúng tôi — không phải tổng hợp đánh giá của người dùng. Chúng tôi chấm điểm mỗi khách sạn theo mức độ phù hợp, vị trí và giá trị đặt phòng trực tiếp, và cố ý tôn vinh những khách sạn địa phương, độc lập đầy cá tính hơn là các chuỗi toàn cầu lớn.',
  },
  zh: {
    label: 'StayEasy 评分',
    tagline: '我们的独立评分',
    localFocus: '相比大型连锁，我们更推崇有特色的本地酒店。',
    explainerTitle: '什么是 StayEasy 评分？',
    explainerText:
      '如同一本值得信赖的指南，StayEasy 评分是我们自己的独立评分——并非用户评价的汇总。我们从契合度、位置与官网直订价值评估每家酒店，并有意聚焦有个性的本地与独立酒店，而非大型全球连锁。',
  },
  ja: {
    label: 'StayEasyスコア',
    tagline: '私たちの独立した評価',
    localFocus: '大手チェーンより、個性ある地元ホテルを応援します。',
    explainerTitle: 'StayEasyスコアとは？',
    explainerText:
      '信頼できるガイドのように、StayEasyスコアは利用者レビューの集計ではなく、私たち独自の独立した評価です。適合性・立地・公式直予約の価値で各ホテルを評価し、大手グローバルチェーンよりも個性ある地元・独立系ホテルを意図的に取り上げています。',
  },
}
