import type { Lang } from '../i18n'

export interface AsiaStrings {
  eyebrow: string
  title: string
  subtitle: string
  live: string
  coming: string
  regions: Record<'Southeast Asia' | 'East Asia' | 'South Asia', string>
}

export const asiaStrings: Record<Lang, AsiaStrings> = {
  en: {
    eyebrow: 'Asia roadmap',
    title: 'Vietnam first — then all of Asia',
    subtitle: 'We launched in Vietnam to enter the market. These destinations across Asia are next.',
    live: 'Live now',
    coming: 'Coming soon',
    regions: { 'Southeast Asia': 'Southeast Asia', 'East Asia': 'East Asia', 'South Asia': 'South Asia' },
  },
  ko: {
    eyebrow: '아시아 로드맵',
    title: '베트남을 시작으로, 아시아 전역으로',
    subtitle: '시장 진입을 위해 베트남에서 먼저 시작했어요. 다음은 아시아 전역의 여행지입니다.',
    live: '운영 중',
    coming: '준비 중',
    regions: { 'Southeast Asia': '동남아시아', 'East Asia': '동아시아', 'South Asia': '남아시아' },
  },
  vi: {
    eyebrow: 'Lộ trình châu Á',
    title: 'Việt Nam trước — rồi cả châu Á',
    subtitle: 'Chúng tôi ra mắt tại Việt Nam để thâm nhập thị trường. Các điểm đến khắp châu Á là bước tiếp theo.',
    live: 'Đang hoạt động',
    coming: 'Sắp ra mắt',
    regions: { 'Southeast Asia': 'Đông Nam Á', 'East Asia': 'Đông Á', 'South Asia': 'Nam Á' },
  },
  zh: {
    eyebrow: '亚洲路线图',
    title: '先越南，再覆盖整个亚洲',
    subtitle: '我们率先在越南进入市场，下一步是亚洲各地的目的地。',
    live: '已上线',
    coming: '即将上线',
    regions: { 'Southeast Asia': '东南亚', 'East Asia': '东亚', 'South Asia': '南亚' },
  },
  ja: {
    eyebrow: 'アジア展開ロードマップ',
    title: 'まずベトナム、そしてアジア全域へ',
    subtitle: '市場参入のためまずベトナムで開始しました。次はアジア各地の旅行先です。',
    live: '公開中',
    coming: '近日公開',
    regions: { 'Southeast Asia': '東南アジア', 'East Asia': '東アジア', 'South Asia': '南アジア' },
  },
}
