import type { Lang } from '../i18n'

export type ConditionKey =
  | 'freeCancellation'
  | 'breakfastIncluded'
  | 'pool'
  | 'beachfront'
  | 'familyFriendly'
  | 'freeAirportShuttle'
  | 'freeParking'
  | 'petFriendly'
  | 'spa'
  | 'accessible'

export const CONDITION_OPTS: ConditionKey[] = [
  'freeCancellation', 'breakfastIncluded', 'pool', 'beachfront', 'familyFriendly',
  'freeAirportShuttle', 'freeParking', 'petFriendly', 'spa', 'accessible',
]

export interface FilterStrings {
  groupStars: string
  groupGuest: string
  groupConditions: string
  guest9: string
  guest85: string
  /** Shown when no hotel matches every filter and we fall back to close matches. */
  relaxedNote: string
  cond: Record<ConditionKey, string>
}

export const filterStrings: Record<Lang, FilterStrings> = {
  en: {
    groupStars: 'Star rating',
    groupGuest: 'Guest rating',
    groupConditions: 'Travel conditions',
    guest9: 'Excellent 9+',
    guest85: 'Very good 8.5+',
    relaxedNote: 'No hotel matches every filter — showing the closest matches.',
    cond: {
      freeCancellation: 'Free cancellation',
      breakfastIncluded: 'Breakfast included',
      pool: 'Pool',
      beachfront: 'Beachfront',
      familyFriendly: 'Family-friendly',
      freeAirportShuttle: 'Airport shuttle',
      freeParking: 'Free parking',
      petFriendly: 'Pet-friendly',
      spa: 'Spa',
      accessible: 'Accessible',
    },
  },
  ko: {
    groupStars: '성급',
    groupGuest: '평점',
    groupConditions: '여행 조건',
    guest9: '최고 9+',
    guest85: '매우 좋음 8.5+',
    relaxedNote: '모든 조건에 맞는 호텔이 없어 가장 가까운 호텔을 보여드려요.',
    cond: {
      freeCancellation: '무료 취소',
      breakfastIncluded: '조식 포함',
      pool: '수영장',
      beachfront: '해변 인접',
      familyFriendly: '가족 친화',
      freeAirportShuttle: '공항 셔틀',
      freeParking: '무료 주차',
      petFriendly: '반려동물 동반',
      spa: '스파',
      accessible: '배리어프리',
    },
  },
  vi: {
    groupStars: 'Hạng sao',
    groupGuest: 'Điểm đánh giá',
    groupConditions: 'Điều kiện du lịch',
    guest9: 'Xuất sắc 9+',
    guest85: 'Rất tốt 8.5+',
    relaxedNote: 'Không có khách sạn nào khớp mọi bộ lọc — hiển thị kết quả gần nhất.',
    cond: {
      freeCancellation: 'Hủy miễn phí',
      breakfastIncluded: 'Bao gồm bữa sáng',
      pool: 'Hồ bơi',
      beachfront: 'Sát biển',
      familyFriendly: 'Phù hợp gia đình',
      freeAirportShuttle: 'Xe đưa đón sân bay',
      freeParking: 'Đỗ xe miễn phí',
      petFriendly: 'Cho phép thú cưng',
      spa: 'Spa',
      accessible: 'Tiếp cận dễ dàng',
    },
  },
  zh: {
    groupStars: '星级',
    groupGuest: '住客评分',
    groupConditions: '出行条件',
    guest9: '超棒 9+',
    guest85: '很好 8.5+',
    relaxedNote: '没有完全符合所有筛选条件的酒店——为您显示最接近的结果。',
    cond: {
      freeCancellation: '免费取消',
      breakfastIncluded: '含早餐',
      pool: '泳池',
      beachfront: '临海',
      familyFriendly: '适合家庭',
      freeAirportShuttle: '机场接送',
      freeParking: '免费停车',
      petFriendly: '可携宠物',
      spa: '水疗',
      accessible: '无障碍',
    },
  },
  ja: {
    groupStars: '星評価',
    groupGuest: '宿泊者評価',
    groupConditions: '旅行条件',
    guest9: '最高 9+',
    guest85: 'とても良い 8.5+',
    relaxedNote: 'すべての条件に一致するホテルがないため、最も近いホテルを表示しています。',
    cond: {
      freeCancellation: '無料キャンセル',
      breakfastIncluded: '朝食付き',
      pool: 'プール',
      beachfront: 'ビーチ近く',
      familyFriendly: 'ファミリー向け',
      freeAirportShuttle: '空港送迎',
      freeParking: '無料駐車場',
      petFriendly: 'ペット可',
      spa: 'スパ',
      accessible: 'バリアフリー',
    },
  },
}
