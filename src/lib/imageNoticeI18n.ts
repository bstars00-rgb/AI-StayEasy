import type { Lang } from '../i18n'

/**
 * Honesty labels for hotel imagery. Until hotels supply their own verified
 * photos, listing images are illustrative stock photography — and we say so,
 * on every card and gallery, instead of letting a stock photo pass as the
 * real property.
 */
export const imageNotice: Record<Lang, { chip: string; note: string }> = {
  en: {
    chip: 'Sample photo',
    note: 'Illustrative photos — not images of this hotel. See the official website for real photos.',
  },
  ko: {
    chip: '예시 이미지',
    note: '예시 이미지입니다 — 이 호텔의 실제 사진이 아닙니다. 실제 모습은 공식 사이트에서 확인하세요.',
  },
  vi: {
    chip: 'Ảnh minh họa',
    note: 'Ảnh chỉ mang tính minh họa — không phải ảnh của khách sạn này. Xem ảnh thật trên website chính thức.',
  },
  zh: {
    chip: '示意图',
    note: '图片仅供参考——并非该酒店实拍。请在官网查看真实照片。',
  },
  ja: {
    chip: 'イメージ写真',
    note: 'イメージ写真です — このホテルの実際の写真ではありません。実際の様子は公式サイトでご確認ください。',
  },
}
