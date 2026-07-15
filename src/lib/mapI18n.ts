import type { Lang } from '../i18n'

export interface MapStrings {
  title: string
  approx: string
  mapView: string
  listView: string
  hotels: string
  attractions: string
}

export const mapStrings: Record<Lang, MapStrings> = {
  en: { title: 'Map', approx: 'Approximate location — confirm the exact address on the official site.', mapView: 'Map view', listView: 'List view', hotels: 'Hotels', attractions: 'Attractions' },
  ko: { title: '지도', approx: '대략적 위치입니다 — 정확한 주소는 공식 사이트에서 확인하세요.', mapView: '지도로 보기', listView: '목록으로 보기', hotels: '호텔', attractions: '추천 관광지' },
  vi: { title: 'Bản đồ', approx: 'Vị trí gần đúng — hãy xác nhận địa chỉ chính xác trên trang chính thức.', mapView: 'Xem bản đồ', listView: 'Xem danh sách', hotels: 'Khách sạn', attractions: 'Điểm tham quan' },
  zh: { title: '地图', approx: '大致位置——请在官网确认准确地址。', mapView: '地图视图', listView: '列表视图', hotels: '酒店', attractions: '推荐景点' },
  ja: { title: '地図', approx: 'おおよその位置です — 正確な住所は公式サイトでご確認ください。', mapView: '地図で見る', listView: 'リストで見る', hotels: 'ホテル', attractions: 'おすすめ観光地' },
}
