import type { Lang } from '../i18n'
import type { GuideCategory } from '../data/guides'

/**
 * UI chrome for the Guides surface, localized into all 5 languages. The article
 * BODIES stay in their original English — high-quality original-language content
 * is better for readers and for ad-network review than machine translation.
 */
export interface GuideStrings {
  nav: string
  indexTitle: string
  indexSubtitle: string
  minRead: string
  readGuide: string
  updated: string
  related: string
  allGuides: string
  faqTitle: string
  readyTitle: string
  readySubtitle: string
  browseBtn: string
  notFound: string
  notFoundText: string
  englishNote: string
  category: Record<GuideCategory, string>
}

export const guideStrings: Record<Lang, GuideStrings> = {
  en: {
    nav: 'Guides',
    indexTitle: 'Travel & booking guides',
    indexSubtitle: 'Original, practical advice for booking hotels directly and planning a trip to Vietnam — written for travelers, not search engines.',
    minRead: 'min read',
    readGuide: 'Read guide',
    updated: 'Updated',
    related: 'Related guides',
    allGuides: 'All guides',
    faqTitle: 'Frequently asked',
    readyTitle: 'Ready to choose a hotel?',
    readySubtitle: 'Browse Da Nang hotels curated by travel style — then book direct on the hotel’s official website.',
    browseBtn: 'Browse Da Nang hotels',
    notFound: 'Guide not found',
    notFoundText: 'We couldn’t find that guide.',
    englishNote: '',
    category: { 'Direct booking': 'Direct booking', 'City guide': 'City guide', 'Planning': 'Planning' },
  },
  ko: {
    nav: '가이드',
    indexTitle: '여행 & 예약 가이드',
    indexSubtitle: '호텔을 직접 예약하고 베트남 여행을 계획하는 데 도움이 되는 실용적인 오리지널 가이드입니다.',
    minRead: '분 읽기',
    readGuide: '가이드 읽기',
    updated: '업데이트',
    related: '관련 가이드',
    allGuides: '전체 가이드',
    faqTitle: '자주 묻는 질문',
    readyTitle: '호텔을 고를 준비가 되셨나요?',
    readySubtitle: '여행 스타일별로 큐레이션된 다낭 호텔을 둘러보고, 호텔 공식 사이트에서 직접 예약하세요.',
    browseBtn: '다낭 호텔 둘러보기',
    notFound: '가이드를 찾을 수 없습니다',
    notFoundText: '해당 가이드를 찾을 수 없어요.',
    englishNote: '이 가이드는 영어로 제공됩니다.',
    category: { 'Direct booking': '직접 예약', 'City guide': '도시 가이드', 'Planning': '여행 준비' },
  },
  vi: {
    nav: 'Cẩm nang',
    indexTitle: 'Cẩm nang du lịch & đặt phòng',
    indexSubtitle: 'Lời khuyên thực tế, nguyên bản giúp bạn đặt phòng trực tiếp và lên kế hoạch cho chuyến đi Việt Nam.',
    minRead: 'phút đọc',
    readGuide: 'Đọc cẩm nang',
    updated: 'Cập nhật',
    related: 'Cẩm nang liên quan',
    allGuides: 'Tất cả cẩm nang',
    faqTitle: 'Câu hỏi thường gặp',
    readyTitle: 'Sẵn sàng chọn khách sạn?',
    readySubtitle: 'Xem các khách sạn Đà Nẵng được tuyển chọn theo phong cách du lịch — rồi đặt trực tiếp trên website chính thức.',
    browseBtn: 'Xem khách sạn Đà Nẵng',
    notFound: 'Không tìm thấy cẩm nang',
    notFoundText: 'Chúng tôi không tìm thấy cẩm nang đó.',
    englishNote: 'Cẩm nang này được viết bằng tiếng Anh.',
    category: { 'Direct booking': 'Đặt phòng trực tiếp', 'City guide': 'Cẩm nang thành phố', 'Planning': 'Lên kế hoạch' },
  },
  zh: {
    nav: '指南',
    indexTitle: '旅行与预订指南',
    indexSubtitle: '为官网直订与规划越南之行提供的原创实用建议——为旅客而写，而非为搜索引擎。',
    minRead: '分钟阅读',
    readGuide: '阅读指南',
    updated: '更新于',
    related: '相关指南',
    allGuides: '全部指南',
    faqTitle: '常见问题',
    readyTitle: '准备好挑选酒店了吗？',
    readySubtitle: '浏览按出行风格精选的岘港酒店，然后在酒店官网直接预订。',
    browseBtn: '浏览岘港酒店',
    notFound: '未找到指南',
    notFoundText: '我们找不到该指南。',
    englishNote: '本指南以英文撰写。',
    category: { 'Direct booking': '官网直订', 'City guide': '城市指南', 'Planning': '行程规划' },
  },
  ja: {
    nav: 'ガイド',
    indexTitle: '旅行＆予約ガイド',
    indexSubtitle: 'ホテルを直接予約し、ベトナム旅行を計画するための実用的なオリジナルガイドです。',
    minRead: '分で読めます',
    readGuide: 'ガイドを読む',
    updated: '更新',
    related: '関連ガイド',
    allGuides: 'すべてのガイド',
    faqTitle: 'よくある質問',
    readyTitle: 'ホテルを選ぶ準備はできましたか？',
    readySubtitle: '旅のスタイル別に厳選したダナンのホテルを見て、公式サイトで直接予約しましょう。',
    browseBtn: 'ダナンのホテルを見る',
    notFound: 'ガイドが見つかりません',
    notFoundText: 'そのガイドが見つかりませんでした。',
    englishNote: 'このガイドは英語で提供されます。',
    category: { 'Direct booking': '直接予約', 'City guide': '都市ガイド', 'Planning': '旅の計画' },
  },
}
