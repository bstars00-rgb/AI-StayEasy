import type { Lang } from '../i18n'
import type { PropertyType } from './propertyType'

export interface PropertyTypeStrings {
  title: string
  type: Record<PropertyType, string>
}

export const propertyTypeStrings: Record<Lang, PropertyTypeStrings> = {
  en: {
    title: 'Property type',
    type: {
      Resort: 'Resort', 'Beach hotel': 'Beach hotel', 'Spa hotel': 'Spa hotel',
      'Boutique hotel': 'Boutique hotel', 'Apartment hotel': 'Apartment hotel',
      Hostel: 'Hostel', 'B&B': 'B&B', Motel: 'Motel', Inn: 'Inn', Hotel: 'Hotel', Other: 'Other',
    },
  },
  ko: {
    title: '시설 유형',
    type: {
      Resort: '리조트', 'Beach hotel': '해변 호텔', 'Spa hotel': '스파 호텔',
      'Boutique hotel': '부티크 호텔', 'Apartment hotel': '아파트 호텔',
      Hostel: '호스텔', 'B&B': 'B&B', Motel: '모텔', Inn: '여관', Hotel: '호텔', Other: '기타',
    },
  },
  vi: {
    title: 'Loại hình lưu trú',
    type: {
      Resort: 'Resort', 'Beach hotel': 'Khách sạn biển', 'Spa hotel': 'Khách sạn spa',
      'Boutique hotel': 'Khách sạn boutique', 'Apartment hotel': 'Căn hộ khách sạn',
      Hostel: 'Hostel', 'B&B': 'B&B', Motel: 'Nhà nghỉ', Inn: 'Nhà trọ', Hotel: 'Khách sạn', Other: 'Khác',
    },
  },
  zh: {
    title: '住宿类型',
    type: {
      Resort: '度假村', 'Beach hotel': '海滨酒店', 'Spa hotel': '水疗酒店',
      'Boutique hotel': '精品酒店', 'Apartment hotel': '公寓式酒店',
      Hostel: '青年旅舍', 'B&B': '民宿', Motel: '汽车旅馆', Inn: '旅馆', Hotel: '酒店', Other: '其他',
    },
  },
  ja: {
    title: '施設タイプ',
    type: {
      Resort: 'リゾート', 'Beach hotel': 'ビーチホテル', 'Spa hotel': 'スパホテル',
      'Boutique hotel': 'ブティックホテル', 'Apartment hotel': 'アパートホテル',
      Hostel: 'ホステル', 'B&B': 'B&B', Motel: 'モーテル', Inn: '旅館', Hotel: 'ホテル', Other: 'その他',
    },
  },
}
