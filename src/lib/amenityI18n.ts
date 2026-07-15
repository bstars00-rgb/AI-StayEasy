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

/** Integrity note under the amenity grid: we only show what we verified. */
export const amenityVerifiedNote: Record<Lang, string> = {
  en: 'Only amenities confirmed from the hotel’s official site are shown. For anything not listed (pet policy, accessibility, smoking, cancellation terms), please confirm with the hotel.',
  ko: '호텔 공식 사이트에서 확인된 편의시설만 표시합니다. 표시되지 않은 항목(반려동물·배리어프리·흡연·취소 조건 등)은 호텔에 직접 확인해 주세요.',
  vi: 'Chỉ hiển thị các tiện nghi đã xác nhận từ trang chính thức của khách sạn. Những mục không hiển thị (thú cưng, tiếp cận, hút thuốc, điều kiện hủy), vui lòng xác nhận với khách sạn.',
  zh: '仅显示经酒店官网确认的设施。未显示的项目（宠物、无障碍、吸烟、取消条款等）请直接与酒店确认。',
  ja: 'ホテル公式サイトで確認できた設備のみ表示しています。表示のない項目（ペット・バリアフリー・喫煙・キャンセル条件など）はホテルに直接ご確認ください。',
}
