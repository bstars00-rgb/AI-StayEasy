import type { Lang } from '../i18n'

/**
 * The downloadable company profile. One PDF per site language lives in
 * public/brochure; they are built by scripts/brochure.
 */
export const brochureFile = (lang: Lang) => `stayeasy-company-profile-${lang}.pdf`

/** Plain file link (not a router route), so it respects the GitHub Pages base path. */
export const brochureHref = (lang: Lang) => `${import.meta.env.BASE_URL}brochure/${brochureFile(lang)}`

export const brochureStrings: Record<Lang, { title: string; text: string; button: string; footer: string }> = {
  en: {
    title: 'Company profile',
    text: 'What StayEasy does, for travellers and for hotels, in a four-page PDF.',
    button: 'Download PDF',
    footer: 'Company profile (PDF)',
  },
  ko: {
    title: '회사소개서',
    text: 'StayEasy가 여행자와 호텔을 위해 하는 일을 4쪽 PDF에 담았습니다.',
    button: 'PDF 내려받기',
    footer: '회사소개서 (PDF)',
  },
  vi: {
    title: 'Hồ sơ giới thiệu công ty',
    text: 'StayEasy làm gì cho du khách và khách sạn, trong bản PDF bốn trang.',
    button: 'Tải PDF',
    footer: 'Giới thiệu công ty (PDF)',
  },
  zh: {
    title: '公司介绍',
    text: '四页 PDF，介绍 StayEasy 为旅客和酒店提供的服务。',
    button: '下载 PDF',
    footer: '公司介绍 (PDF)',
  },
  ja: {
    title: '会社案内',
    text: '旅行者とホテルに向けたStayEasyの取り組みを、4ページのPDFにまとめました。',
    button: 'PDFをダウンロード',
    footer: '会社案内 (PDF)',
  },
}
