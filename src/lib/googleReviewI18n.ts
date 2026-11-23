import type { Lang } from '../i18n'

export interface GoogleReviewStrings {
  title: string
  /** Says what this is and that it is opinion, not a StayEasy-verified fact. */
  sub: string
  openReviews: string
  report: string
}

export const googleReviewStrings: Record<Lang, GoogleReviewStrings> = {
  en: {
    title: 'Google review summary',
    sub: 'An AI summary of guest reviews on Google Maps. It reflects guest opinion, not facts StayEasy has verified.',
    openReviews: 'See reviews on Google Maps',
    report: 'Report a problem',
  },
  ko: {
    title: 'Google 리뷰 요약',
    sub: 'Google 지도의 투숙객 리뷰를 AI가 요약한 내용입니다. StayEasy가 확인한 사실이 아니라 투숙객의 의견입니다.',
    openReviews: 'Google 지도에서 리뷰 보기',
    report: '문제 신고',
  },
  vi: {
    title: 'Tóm tắt đánh giá trên Google',
    sub: 'Bản tóm tắt bằng AI từ đánh giá của khách trên Google Maps. Đây là ý kiến của khách, không phải thông tin StayEasy đã xác minh.',
    openReviews: 'Xem đánh giá trên Google Maps',
    report: 'Báo cáo vấn đề',
  },
  zh: {
    title: 'Google评价摘要',
    sub: '由AI根据Google地图上的住客评价生成的摘要。反映的是住客的看法，并非StayEasy核实过的事实。',
    openReviews: '在Google地图上查看评价',
    report: '报告问题',
  },
  ja: {
    title: 'Googleのクチコミ要約',
    sub: 'Googleマップの宿泊者クチコミをAIが要約したものです。StayEasyが確認した事実ではなく、宿泊者の意見です。',
    openReviews: 'Googleマップでクチコミを見る',
    report: '問題を報告',
  },
}
