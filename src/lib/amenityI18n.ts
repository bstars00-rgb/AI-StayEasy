import type { Lang } from '../i18n'

/**
 * Labels for structured amenities shown in the at-a-glance icon grid that aren't
 * already covered by the filter conditions (filterI18n `cond`). Kept separate so
 * the amenity grid can reuse the filter labels for the overlap and add these.
 */
export type AmenityExtraKey = 'freeWifi' | 'gym' | 'twentyFourHourFrontDesk' | 'nonSmoking'

export const amenityExtra: Record<Lang, Record<AmenityExtraKey, string>> = {
  en: { freeWifi: 'Free Wi-Fi', gym: 'Fitness center', twentyFourHourFrontDesk: '24-hour front desk', nonSmoking: 'Non-smoking' },
  ko: { freeWifi: '무료 Wi-Fi', gym: '피트니스 센터', twentyFourHourFrontDesk: '24시간 프런트', nonSmoking: '금연' },
  vi: { freeWifi: 'Wi-Fi miễn phí', gym: 'Phòng tập gym', twentyFourHourFrontDesk: 'Lễ tân 24 giờ', nonSmoking: 'Không hút thuốc' },
  zh: { freeWifi: '免费 Wi-Fi', gym: '健身中心', twentyFourHourFrontDesk: '24小时前台', nonSmoking: '无烟' },
  ja: { freeWifi: '無料Wi-Fi', gym: 'フィットネス', twentyFourHourFrontDesk: '24時間フロント', nonSmoking: '禁煙' },
}
