import type { Lang } from '../i18n'

/**
 * Recommended attractions per destination — shown as a separate marker layer on
 * the city map so travelers can see what's worth visiting near the hotels.
 * Coordinates are the well-known public locations of each landmark (street/area
 * level). Names are localized for all 5 languages.
 */
export type AttractionCategory = 'beach' | 'landmark' | 'temple' | 'nature' | 'market' | 'museum'

export interface Attraction {
  id: string
  city: string
  lat: number
  lng: number
  category: AttractionCategory
  name: Record<Lang, string>
}

export const ATTRACTIONS: Attraction[] = [
  // ── Da Nang ──────────────────────────────────────────────
  { id: 'dragon-bridge', city: 'Da Nang', lat: 16.0611, lng: 108.2275, category: 'landmark', name: { en: 'Dragon Bridge', ko: '드래곤 브릿지(용 다리)', vi: 'Cầu Rồng', zh: '龙桥', ja: 'ドラゴン橋' } },
  { id: 'marble-mountains', city: 'Da Nang', lat: 16.0035, lng: 108.2635, category: 'nature', name: { en: 'Marble Mountains', ko: '마블 마운틴(오행산)', vi: 'Ngũ Hành Sơn', zh: '五行山', ja: '五行山(マーブルマウンテン)' } },
  { id: 'my-khe-beach', city: 'Da Nang', lat: 16.0596, lng: 108.247, category: 'beach', name: { en: 'My Khe Beach', ko: '미케 비치', vi: 'Biển Mỹ Khê', zh: '美溪海滩', ja: 'ミーケビーチ' } },
  { id: 'ba-na-hills', city: 'Da Nang', lat: 15.9977, lng: 107.9967, category: 'landmark', name: { en: 'Ba Na Hills (Golden Bridge)', ko: '바나힐(골든브릿지)', vi: 'Bà Nà Hills (Cầu Vàng)', zh: '巴拿山(黄金桥)', ja: 'バーナーヒルズ(ゴールデンブリッジ)' } },
  { id: 'lady-buddha', city: 'Da Nang', lat: 16.1006, lng: 108.2779, category: 'temple', name: { en: 'Lady Buddha (Linh Ung Pagoda)', ko: '레이디 부다(린응 사원)', vi: 'Chùa Linh Ứng (Tượng Phật Bà)', zh: '灵应寺(观音像)', ja: 'レディブッダ(リンウン寺)' } },
  // ── Ho Chi Minh City ─────────────────────────────────────
  { id: 'ben-thanh-market', city: 'Ho Chi Minh City', lat: 10.7723, lng: 106.698, category: 'market', name: { en: 'Ben Thanh Market', ko: '벤탄 시장', vi: 'Chợ Bến Thành', zh: '滨城市场', ja: 'ベンタイン市場' } },
  { id: 'notre-dame-saigon', city: 'Ho Chi Minh City', lat: 10.7797, lng: 106.699, category: 'landmark', name: { en: 'Notre-Dame Cathedral', ko: '노트르담 대성당', vi: 'Nhà thờ Đức Bà', zh: '西贡圣母大教堂', ja: 'サイゴン大聖堂' } },
  { id: 'war-remnants-museum', city: 'Ho Chi Minh City', lat: 10.7797, lng: 106.6923, category: 'museum', name: { en: 'War Remnants Museum', ko: '전쟁 박물관', vi: 'Bảo tàng Chứng tích Chiến tranh', zh: '战争遗迹博物馆', ja: '戦争証跡博物館' } },
  { id: 'independence-palace', city: 'Ho Chi Minh City', lat: 10.7772, lng: 106.6958, category: 'landmark', name: { en: 'Independence Palace', ko: '통일궁', vi: 'Dinh Độc Lập', zh: '统一宫', ja: '統一会堂' } },
  { id: 'bui-vien-street', city: 'Ho Chi Minh City', lat: 10.7677, lng: 106.6931, category: 'landmark', name: { en: 'Bui Vien Walking Street', ko: '부이비엔 거리', vi: 'Phố đi bộ Bùi Viện', zh: '裴援街', ja: 'ブイビエン通り' } },
  // ── Nha Trang ────────────────────────────────────────────
  { id: 'po-nagar', city: 'Nha Trang', lat: 12.2655, lng: 109.1955, category: 'temple', name: { en: 'Po Nagar Cham Towers', ko: '포나가르 참 탑', vi: 'Tháp Bà Ponagar', zh: '婆那加占婆塔', ja: 'ポーナガル塔' } },
  { id: 'nha-trang-beach', city: 'Nha Trang', lat: 12.2388, lng: 109.196, category: 'beach', name: { en: 'Nha Trang Beach', ko: '냐짱 해변', vi: 'Biển Nha Trang', zh: '芽庄海滩', ja: 'ニャチャンビーチ' } },
  { id: 'vinwonders-nha-trang', city: 'Nha Trang', lat: 12.217, lng: 109.249, category: 'landmark', name: { en: 'VinWonders (Hon Tre)', ko: '빈원더스(혼째섬)', vi: 'VinWonders (Hòn Tre)', zh: 'VinWonders珍珠岛', ja: 'ヴィンワンダーズ' } },
  { id: 'hon-chong', city: 'Nha Trang', lat: 12.2727, lng: 109.205, category: 'nature', name: { en: 'Hon Chong Promontory', ko: '혼쫑곶', vi: 'Hòn Chồng', zh: '石岬角', ja: 'ホンチョン岬' } },
  { id: 'long-son-pagoda', city: 'Nha Trang', lat: 12.2506, lng: 109.181, category: 'temple', name: { en: 'Long Son Pagoda', ko: '롱선 사원', vi: 'Chùa Long Sơn', zh: '隆山寺', ja: 'ロンソン寺' } },
  // ── Phu Quoc ─────────────────────────────────────────────
  { id: 'sunset-town', city: 'Phu Quoc', lat: 10.035, lng: 104.016, category: 'landmark', name: { en: 'Sunset Town (An Thoi)', ko: '선셋타운(안터이)', vi: 'Thị trấn Hoàng Hôn', zh: '日落小镇', ja: 'サンセットタウン' } },
  { id: 'vinwonders-phu-quoc', city: 'Phu Quoc', lat: 10.336, lng: 103.86, category: 'landmark', name: { en: 'VinWonders & Safari', ko: '빈원더스 & 사파리', vi: 'VinWonders & Safari', zh: 'VinWonders与野生动物园', ja: 'ヴィンワンダーズ&サファリ' } },
  { id: 'sao-beach', city: 'Phu Quoc', lat: 10.047, lng: 104.029, category: 'beach', name: { en: 'Sao Beach', ko: '사오 비치', vi: 'Bãi Sao', zh: 'Sao海滩', ja: 'サオビーチ' } },
  { id: 'duong-dong-market', city: 'Phu Quoc', lat: 10.217, lng: 103.96, category: 'market', name: { en: 'Duong Dong Night Market', ko: '즈엉동 야시장', vi: 'Chợ đêm Dương Đông', zh: '阳东夜市', ja: 'ズオンドン・ナイトマーケット' } },
  { id: 'ho-quoc-pagoda', city: 'Phu Quoc', lat: 10.136, lng: 104.017, category: 'temple', name: { en: 'Ho Quoc Pagoda', ko: '호꾸옥 사원', vi: 'Chùa Hộ Quốc', zh: '护国寺', ja: 'ホックオック寺' } },
  // ── Hoi An ───────────────────────────────────────────────
  { id: 'ancient-town', city: 'Hoi An', lat: 15.877, lng: 108.327, category: 'landmark', name: { en: 'Hoi An Ancient Town', ko: '호이안 구시가지', vi: 'Phố cổ Hội An', zh: '会安古镇', ja: 'ホイアン旧市街' } },
  { id: 'japanese-bridge', city: 'Hoi An', lat: 15.8773, lng: 108.326, category: 'landmark', name: { en: 'Japanese Covered Bridge', ko: '내원교(일본 다리)', vi: 'Chùa Cầu', zh: '来远桥(日本桥)', ja: '来遠橋(日本橋)' } },
  { id: 'an-bang-beach', city: 'Hoi An', lat: 15.908, lng: 108.34, category: 'beach', name: { en: 'An Bang Beach', ko: '안방 비치', vi: 'Biển An Bàng', zh: '安邦海滩', ja: 'アンバンビーチ' } },
  { id: 'coconut-village', city: 'Hoi An', lat: 15.888, lng: 108.362, category: 'nature', name: { en: 'Cam Thanh Coconut Village', ko: '캄탄 코코넛 빌리지', vi: 'Rừng dừa Cẩm Thanh', zh: '锦滩椰林', ja: 'カムタン・ココナッツ村' } },
  // ── Hanoi ────────────────────────────────────────────────
  { id: 'hoan-kiem-lake', city: 'Hanoi', lat: 21.0287, lng: 105.8524, category: 'nature', name: { en: 'Hoan Kiem Lake', ko: '호안끼엠 호수', vi: 'Hồ Hoàn Kiếm', zh: '还剑湖', ja: 'ホアンキエム湖' } },
  { id: 'old-quarter-hanoi', city: 'Hanoi', lat: 21.034, lng: 105.85, category: 'landmark', name: { en: 'Old Quarter', ko: '하노이 구시가지', vi: 'Phố cổ Hà Nội', zh: '河内老城区', ja: 'ハノイ旧市街' } },
  { id: 'temple-of-literature', city: 'Hanoi', lat: 21.0294, lng: 105.8355, category: 'temple', name: { en: 'Temple of Literature', ko: '문묘(반미에우)', vi: 'Văn Miếu', zh: '文庙', ja: '文廟' } },
  { id: 'hcm-mausoleum', city: 'Hanoi', lat: 21.0367, lng: 105.8347, category: 'landmark', name: { en: 'Ho Chi Minh Mausoleum', ko: '호치민 묘소', vi: 'Lăng Chủ tịch Hồ Chí Minh', zh: '胡志明陵', ja: 'ホーチミン廟' } },
  { id: 'west-lake-hanoi', city: 'Hanoi', lat: 21.058, lng: 105.82, category: 'nature', name: { en: 'West Lake (Ho Tay)', ko: '서호(호떠이)', vi: 'Hồ Tây', zh: '西湖', ja: '西湖(タイ湖)' } },
  // ── Hue ──────────────────────────────────────────────────
  { id: 'imperial-city-hue', city: 'Hue', lat: 16.4695, lng: 107.5792, category: 'landmark', name: { en: 'Imperial City (Citadel)', ko: '후에 왕궁(황성)', vi: 'Đại Nội Huế', zh: '顺化皇城', ja: 'フエ王宮(阮朝王宮)' } },
  { id: 'thien-mu-pagoda', city: 'Hue', lat: 16.4534, lng: 107.5445, category: 'temple', name: { en: 'Thien Mu Pagoda', ko: '티엔무 사원', vi: 'Chùa Thiên Mụ', zh: '天姥寺', ja: 'ティエンムー寺' } },
  { id: 'khai-dinh-tomb', city: 'Hue', lat: 16.3987, lng: 107.5904, category: 'landmark', name: { en: 'Tomb of Khai Dinh', ko: '카이딘 황릉', vi: 'Lăng Khải Định', zh: '启定陵', ja: 'カイディン帝陵' } },
  { id: 'tu-duc-tomb', city: 'Hue', lat: 16.4361, lng: 107.5546, category: 'landmark', name: { en: 'Tomb of Tu Duc', ko: '뜨득 황릉', vi: 'Lăng Tự Đức', zh: '嗣德陵', ja: 'トゥドゥック帝陵' } },
  { id: 'dong-ba-market', city: 'Hue', lat: 16.4713, lng: 107.588, category: 'market', name: { en: 'Dong Ba Market', ko: '동바 시장', vi: 'Chợ Đông Ba', zh: '东巴市场', ja: 'ドンバ市場' } },
  // Da Lat
  { id: 'xuan-huong-lake', city: 'Da Lat', lat: 11.9416, lng: 108.4433, category: 'landmark', name: { en: 'Xuan Huong Lake', ko: '쑤언흐엉 호수', vi: 'Hồ Xuân Hương', zh: '春香湖', ja: 'スアンフーン湖' } },
  { id: 'dalat-market', city: 'Da Lat', lat: 11.9425, lng: 108.4372, category: 'market', name: { en: 'Da Lat Market', ko: '달랏 야시장', vi: 'Chợ Đà Lạt', zh: '大叻市场', ja: 'ダラット市場' } },
  { id: 'crazy-house-dalat', city: 'Da Lat', lat: 11.9328, lng: 108.4318, category: 'landmark', name: { en: 'Hang Nga Guesthouse (Crazy House)', ko: '크레이지 하우스', vi: 'Biệt thự Hằng Nga', zh: '疯狂屋', ja: 'クレイジーハウス' } },
  { id: 'truc-lam-monastery', city: 'Da Lat', lat: 11.9033, lng: 108.4139, category: 'temple', name: { en: 'Truc Lam Zen Monastery', ko: '쭉럼 선원', vi: 'Thiền viện Trúc Lâm', zh: '竹林禅院', ja: 'チュックラム禅院' } },
  { id: 'tuyen-lam-lake', city: 'Da Lat', lat: 11.8969, lng: 108.4194, category: 'landmark', name: { en: 'Tuyen Lam Lake', ko: '뚜옌럼 호수', vi: 'Hồ Tuyền Lâm', zh: '宣林湖', ja: 'トゥエンラム湖' } },
]

/** Attractions for a city, with the name resolved to the active language. */
export function attractionsForCity(city: string, lang: Lang): { name: string; lat: number; lng: number }[] {
  return ATTRACTIONS.filter((a) => a.city === city).map((a) => ({ name: a.name[lang] ?? a.name.en, lat: a.lat, lng: a.lng }))
}
