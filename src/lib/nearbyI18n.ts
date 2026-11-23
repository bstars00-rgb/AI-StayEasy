import type { Lang } from '../i18n'
import type { AttractionCategory } from '../data/attractions'

export interface NearbyStrings {
  title: string
  subtitle: string
  /** Prefix for the distance, e.g. "about 2.3 km". */
  about: string
  openMap: string
  note: string
  /** Shown only when the hotel's own pin is unconfirmed (area-centre fallback). */
  areaPinNote: string
  category: Record<AttractionCategory, string>
}

export const nearbyStrings: Record<Lang, NearbyStrings> = {
  en: {
    title: 'Places worth visiting nearby',
    subtitle: 'Sorted by distance from this hotel, straight-line.',
    about: 'about',
    openMap: 'View on map',
    note: 'Distances are straight-line from the hotel’s map pin. Real travel time depends on the route, so check a maps app before you go.',
    areaPinNote: 'This hotel’s exact pin isn’t confirmed, so distances are measured from its area centre.',
    category: { beach: 'Beach', landmark: 'Landmark', temple: 'Temple', nature: 'Nature', market: 'Market', museum: 'Museum' },
  },
  ko: {
    title: '근처 가볼 만한 곳',
    subtitle: '이 호텔에서 가까운 순서이고, 직선거리 기준입니다.',
    about: '약',
    openMap: '지도에서 보기',
    note: '호텔 지도 표시를 기준으로 잰 직선거리입니다. 실제 이동 시간은 경로에 따라 다르니 출발 전에 지도 앱에서 확인하세요.',
    areaPinNote: '이 호텔은 정확한 위치를 확인하지 못해 지역 중심에서 거리를 쟀습니다.',
    category: { beach: '해변', landmark: '명소', temple: '사원', nature: '자연', market: '시장', museum: '박물관' },
  },
  vi: {
    title: 'Địa điểm đáng ghé gần đây',
    subtitle: 'Sắp xếp theo khoảng cách từ khách sạn, tính theo đường chim bay.',
    about: 'khoảng',
    openMap: 'Xem trên bản đồ',
    note: 'Khoảng cách tính theo đường chim bay từ vị trí ghim của khách sạn. Thời gian di chuyển thực tế tùy tuyến đường, hãy kiểm tra trên ứng dụng bản đồ trước khi đi.',
    areaPinNote: 'Chưa xác nhận được vị trí chính xác của khách sạn này, nên khoảng cách được đo từ trung tâm khu vực.',
    category: { beach: 'Bãi biển', landmark: 'Danh thắng', temple: 'Chùa', nature: 'Thiên nhiên', market: 'Chợ', museum: 'Bảo tàng' },
  },
  zh: {
    title: '附近值得一去的地方',
    subtitle: '按与本酒店的距离由近到远排列，为直线距离。',
    about: '约',
    openMap: '在地图上查看',
    note: '距离为酒店地图标注位置的直线距离。实际耗时因路线而异，出发前请用地图应用确认。',
    areaPinNote: '该酒店的精确位置尚未确认，距离从所在区域中心起算。',
    category: { beach: '海滩', landmark: '地标', temple: '寺庙', nature: '自然', market: '市场', museum: '博物馆' },
  },
  ja: {
    title: '周辺のおすすめスポット',
    subtitle: 'このホテルから近い順で、直線距離です。',
    about: '約',
    openMap: '地図で見る',
    note: 'ホテルの地図上の位置からの直線距離です。実際の所要時間はルートによって変わるため、出発前に地図アプリでご確認ください。',
    areaPinNote: 'このホテルは正確な位置が未確認のため、エリア中心からの距離です。',
    category: { beach: 'ビーチ', landmark: '名所', temple: '寺院', nature: '自然', market: '市場', museum: '博物館' },
  },
}
