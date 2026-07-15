import type { Hotel } from '../types'
import { BM_ENABLED } from './bm'

/** Diacritic-insensitive normalization so unaccented Vietnamese typing
 *  ("gia dinh", "bien") matches the accented synonyms; CJK is unaffected. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')

/**
 * On-device hotel recommender. Parses a free-text request (in any of the 5
 * supported languages) into weighted "signals", scores each hotel against the
 * detected signals, and ranks with human-readable reasons.
 *
 * No backend / no API key — it runs entirely in the browser. The same interface
 * could later be backed by a real LLM via a serverless proxy.
 */
export type Signal =
  | 'family'
  | 'couple'
  | 'business'
  | 'beach'
  | 'longstay'
  | 'korean'
  | 'pool'
  | 'breakfast'
  | 'kids'
  | 'spa'
  | 'gym'
  | 'airport'
  | 'kitchen'
  | 'city'
  | 'quiet'
  | 'golf'
  | 'luxury'
  | 'budget'
  | 'firsttime'
  | 'hoian'
  | 'danang'
  | 'hcmc'
  | 'nhatrang'
  | 'phuquoc'
  | 'hanoi'

export const ALL_SIGNALS: Signal[] = [
  'family', 'couple', 'business', 'beach', 'longstay', 'korean', 'pool', 'breakfast',
  'kids', 'spa', 'gym', 'airport', 'kitchen', 'city', 'quiet', 'golf', 'luxury', 'budget', 'firsttime',
  'hoian', 'danang', 'hcmc', 'nhatrang', 'phuquoc', 'hanoi',
]

/** Destination signals act as hard filters: asking for Hanoi means Hanoi. */
const CITY_SIGNALS: Partial<Record<Signal, Hotel['city']>> = {
  danang: 'Da Nang',
  hcmc: 'Ho Chi Minh City',
  nhatrang: 'Nha Trang',
  phuquoc: 'Phu Quoc',
  hoian: 'Hoi An',
  hanoi: 'Hanoi',
}

// Strong "what kind of trip" signals weigh more than individual amenities.
const WEIGHT: Record<Signal, number> = {
  family: 3, couple: 3, business: 3, beach: 3, longstay: 3, korean: 3, firsttime: 2,
  city: 2, quiet: 2, luxury: 2, budget: 2, golf: 2,
  hoian: 2, danang: 2, hcmc: 2, nhatrang: 2, phuquoc: 2, hanoi: 2,
  pool: 1, breakfast: 1, kids: 2, spa: 1, gym: 1, airport: 1, kitchen: 1,
}

// Multilingual trigger words (en/ko/vi/zh/ja). Matched as substrings of the
// lowercased query, so CJK works without tokenization.
const SYNONYMS: Record<Signal, string[]> = {
  family: ['family', 'families', 'kid', 'kids', 'child', 'children', 'toddler', '가족', '아이', '애들', '자녀', '아기', 'gia đình', 'trẻ em', 'con nhỏ', '家庭', '孩子', '亲子', '带娃', '家族', '子供', 'こども', '子連れ'],
  couple: ['couple', 'romantic', 'romance', 'honeymoon', 'anniversary', '커플', '연인', '로맨틱', '신혼', '허니문', '기념일', 'cặp đôi', 'lãng mạn', 'tuần trăng mật', 'kỷ niệm', '情侣', '浪漫', '蜜月', '纪念日', 'カップル', 'ロマン', '新婚', 'ハネムーン', '記念日'],
  business: ['business', 'work trip', 'meeting', 'conference', 'corporate', '출장', '업무', '비즈니스', '회의', 'công tác', 'công việc', 'hội nghị', '商务', '出差', '会议', 'ビジネス', '出張', '会議'],
  beach: ['beach', 'seaside', 'ocean', 'sea view', 'seafront', 'sand', 'my khe', 'non nuoc', '해변', '바다', '해수욕', '비치', '오션뷰', '미케', '논느억', 'biển', 'bãi biển', 'view biển', 'mỹ khê', '海滩', '海边', '沙滩', '海景', '美溪', 'ビーチ', '海辺', 'オーシャン', '海', 'ミーケ'],
  longstay: ['long stay', 'long-stay', 'monthly', 'a month', 'weekly', 'a week', 'extended', 'digital nomad', 'remote work', 'workation', '장기', '한달', '한 달', '월세', '워케이션', 'dài hạn', 'dài ngày', 'hàng tháng', 'một tháng', '长住', '长期', '一个月', '月租', '長期', '長期滞在', 'ワーケーション', '一ヶ月'],
  korean: ['korean', 'korea', 'korean town', 'an thuong', '한국', '한국인', '한국어', '한국적', '한국 사람', '코리아타운', '한국타운', '안탄', 'hàn quốc', 'người hàn', 'tiếng hàn', 'phố hàn', '韩国', '韩语', '韩国人', '韩国城', '韓国', '韓国語', '韓国人', 'コリアンタウン'],
  pool: ['pool', 'swim', 'swimming', 'infinity pool', '수영', '수영장', '풀', '인피니티', 'bể bơi', 'hồ bơi', 'bơi', '泳池', '游泳', '无边泳池', 'プール', '泳ぎ', 'インフィニティ'],
  breakfast: ['breakfast', 'brunch', 'buffet', '조식', '아침', '뷔페', 'bữa sáng', 'ăn sáng', '早餐', '早饭', '自助早餐', '朝食', '朝ごはん', 'モーニング', 'ビュッフェ'],
  kids: ['kids club', 'kids', 'playground', 'playroom', 'kid friendly', 'kids pool', '키즈', '놀이방', '키즈클럽', '놀이터', '아이 수영', 'khu vui chơi', 'trẻ em chơi', 'sân chơi', '儿童', '儿童俱乐部', '游乐', '亲子设施', 'キッズ', '子供向け', 'プレイルーム'],
  spa: ['spa', 'massage', 'wellness', 'sauna', '스파', '마사지', '웰니스', '사우나', 'mát-xa', 'mát xa', 'thư giãn spa', '水疗', '按摩', '桑拿', 'スパ', 'マッサージ', 'サウナ'],
  gym: ['gym', 'fitness', 'workout', 'exercise', '헬스', '피트니스', '운동', '체육관', 'phòng gym', 'tập gym', 'thể dục', '健身', '健身房', 'フィットネス', 'ジム', '運動'],
  airport: ['airport', 'shuttle', 'transfer', 'pickup', 'pick up', 'pick-up', '공항', '셔틀', '픽업', '공항 픽업', 'sân bay', 'đưa đón', 'đón sân bay', '机场', '接送', '机场接送', '空港', '送迎', '空港送迎'],
  kitchen: ['kitchen', 'cook', 'cooking', 'self-cater', 'kitchenette', 'self catering', '주방', '부엌', '취사', '요리', '조리', 'bếp', 'nấu ăn', 'tự nấu', '厨房', '做饭', '自炊', 'キッチン', '自炊', '料理'],
  city: ['city', 'downtown', 'central', 'city center', 'nightlife', 'walkable', 'urban', 'shopping', 'han river', 'dragon bridge', 'riverside', '시내', '도심', '중심가', '번화가', '야경', '쇼핑', '걷기 좋', '한강', '드래곤브리지', '강변', 'trung tâm', 'thành phố', 'mua sắm', 'sông hàn', 'cầu rồng', '市中心', '市区', '夜生活', '逛街', '韩江', '龙桥', '市内', '繁華街', '街中', '夜景', 'ハン川', 'ドラゴン橋'],
  quiet: ['quiet', 'calm', 'peaceful', 'relax', 'relaxing', 'secluded', 'tranquil', 'getaway', 'son tra', '조용', '한적', '휴식', '힐링', '평화', '여유', '손짜', '손트라', 'yên tĩnh', 'thư giãn', 'yên bình', 'sơn trà', '安静', '宁静', '放松', '山茶', '静か', 'のんびり', 'リラックス', '癒やし', 'ソンチャ'],
  golf: ['golf', '골프', 'gôn', 'đánh gôn', '高尔夫', 'ゴルフ'],
  luxury: ['luxury', 'luxurious', '5-star', '5 star', 'five star', 'premium', 'high-end', 'upscale', '럭셔리', '고급', '5성', '프리미엄', '최고급', 'sang trọng', 'cao cấp', '5 sao', '奢华', '豪华', '五星', '高级', 'ラグジュアリー', '高級', '五つ星'],
  budget: ['budget', 'cheap', 'affordable', 'value', 'inexpensive', 'low cost', '저렴', '가성비', '싼', '예산', '알뜰', 'giá rẻ', 'tiết kiệm', 'bình dân', '便宜', '实惠', '性价比', '经济', '格安', '安い', 'リーズナブル', 'コスパ'],
  firsttime: ['first time', 'first-time', 'first visit', 'first trip', 'beginner', 'never been', '처음', '첫 베트남', '초행', '처음 가', 'lần đầu', 'mới đến', 'chưa từng', '第一次', '初次', '首次', '初めて', '初訪問', '初ベトナム'],
  hoian: ['hoi an', 'hoian', 'hoi-an', '호이안', 'hội an', '会安', 'ホイアン'],
  danang: ['da nang', 'danang', 'đà nẵng', '다낭', '岘港', 'ダナン'],
  hcmc: ['ho chi minh', 'hcmc', 'saigon', 'sài gòn', 'sai gon', '호치민', '사이공', '胡志明', '西贡', 'ホーチミン', 'サイゴン'],
  nhatrang: ['nha trang', 'nhatrang', '냐짱', '나트랑', '芽庄', 'ニャチャン'],
  phuquoc: ['phu quoc', 'phú quốc', 'phuquoc', '푸꾸옥', '푸쿠옥', '富国岛', '富国', 'フーコック'],
  hanoi: ['hanoi', 'ha noi', 'hà nội', '하노이', '河内', 'ハノイ'],
}

// Precompute diacritic-normalized synonym lists once.
const NORM_SYNONYMS: Record<Signal, string[]> = Object.fromEntries(
  (Object.entries(SYNONYMS) as [Signal, string[]][]).map(([k, ws]) => [k, ws.map(norm)]),
) as Record<Signal, string[]>

// Area groupings so location signals work in every city, not just Da Nang.
const CITYISH_AREAS = new Set<Hotel['area']>(['City Center', 'Han River', 'District 1', 'Old Quarter', 'French Quarter', 'Ancient Town', 'Thao Dien'])
const QUIET_AREAS = new Set<Hotel['area']>(['Resort Area', 'Cam Thanh', 'West Lake', 'Sao Beach', 'North Nha Trang'])

// Whether a hotel satisfies a given signal (uses canonical English data).
const SATISFIES: Record<Signal, (h: Hotel) => boolean> = {
  family: (h) => h.tags.includes('Family') || h.facilities.some((f) => /kids/i.test(f)),
  couple: (h) => h.tags.includes('Couple'),
  business: (h) => h.tags.includes('Business') || h.hotelType === 'Business hotel',
  beach: (h) => h.tags.includes('Beach') || h.conditions.beachfront,
  longstay: (h) => h.tags.includes('Long Stay') || h.hotelType === 'Long stay serviced apartment' || h.facilities.includes('Kitchen'),
  korean: (h) => h.koreanFriendly,
  pool: (h) => h.facilities.includes('Pool'),
  breakfast: (h) => h.facilities.includes('Breakfast'),
  kids: (h) => h.facilities.some((f) => /kids/i.test(f)),
  spa: (h) => h.facilities.includes('Spa'),
  gym: (h) => h.facilities.includes('Gym'),
  airport: (h) => h.facilities.includes('Airport transfer'),
  kitchen: (h) => h.facilities.includes('Kitchen'),
  city: (h) => CITYISH_AREAS.has(h.area),
  quiet: (h) => QUIET_AREAS.has(h.area) || (h.tags.includes('Couple') && !CITYISH_AREAS.has(h.area)),
  golf: (h) => /golf/i.test(h.name),
  luxury: (h) => h.priceTier === 'premium',
  budget: (h) => h.priceTier === 'budget',
  firsttime: (h) => h.koreanFriendly || h.facilities.includes('Airport transfer') || CITYISH_AREAS.has(h.area),
  hoian: (h) => h.city === 'Hoi An',
  danang: (h) => h.city === 'Da Nang',
  hcmc: (h) => h.city === 'Ho Chi Minh City',
  nhatrang: (h) => h.city === 'Nha Trang',
  phuquoc: (h) => h.city === 'Phu Quoc',
  hanoi: (h) => h.city === 'Hanoi',
}

// Composite intents pull in related signals so "honeymoon" implies couple+quiet+spa, etc.
const EXPANSIONS: { test: string[]; add: Signal[] }[] = [
  { test: ['honeymoon', 'anniversary', '신혼', '허니문', '기념일', 'tuần trăng mật', '蜜月', 'ハネムーン'], add: ['couple', 'quiet', 'spa'] },
  { test: ['with kids', 'with children', '아이와', '애들과', '가족여행', '带娃', '子連れ', 'có trẻ em'], add: ['family', 'kids', 'pool'] },
  { test: ['digital nomad', 'remote work', 'workation', '워케이션', 'リモート', '远程办公'], add: ['longstay', 'kitchen', 'business'] },
]

export interface SearchResult {
  hotel: Hotel
  score: number
  pct: number
  reasons: Signal[]
}

export interface Recommendation {
  detected: Signal[]
  generic: boolean
  results: SearchResult[]
}

/** Editorial-quality tie-break — never raw id order (that systematically
 *  favored Da Nang's h01–h20). Sponsored priority applies ONLY when the
 *  business model is on, so a paid boost can never run without its label. */
function tieBreak(a: Hotel, b: Hotel): number {
  if (BM_ENABLED && a.isSponsored !== b.isSponsored) return a.isSponsored ? -1 : 1
  return b.conditions.stayEasyScore - a.conditions.stayEasyScore || a.slug.localeCompare(b.slug)
}

export function recommend(query: string, hotels: Hotel[], limit = 6): Recommendation {
  const q = norm(query.trim())

  const detected = new Set<Signal>()
  if (q) {
    for (const sig of ALL_SIGNALS) {
      if (NORM_SYNONYMS[sig].some((w) => q.includes(w))) detected.add(sig)
    }
    for (const exp of EXPANSIONS) {
      if (exp.test.some((w) => q.includes(norm(w)))) exp.add.forEach((s) => detected.add(s))
    }
  }

  const detectedList = ALL_SIGNALS.filter((s) => detected.has(s))

  // No recognizable intent → a sensible editorial default.
  if (detectedList.length === 0) {
    const results = [...hotels]
      .sort(tieBreak)
      .slice(0, limit)
      .map((hotel) => ({ hotel, score: 0, pct: 0, reasons: [] as Signal[] }))
    return { detected: [], generic: true, results }
  }

  // Destination signals are hard filters: "하노이 호텔" must return Hanoi.
  const wantedCities = detectedList.map((s) => CITY_SIGNALS[s]).filter(Boolean) as Hotel['city'][]
  const pool = wantedCities.length ? hotels.filter((h) => wantedCities.includes(h.city)) : hotels

  const possible = detectedList.reduce((sum, s) => sum + WEIGHT[s], 0)

  const scored: SearchResult[] = pool.map((hotel) => {
    const reasons = detectedList.filter((s) => SATISFIES[s](hotel))
    const score = reasons.reduce((sum, s) => sum + WEIGHT[s], 0)
    return { hotel, score, pct: Math.round((score / possible) * 100), reasons }
  })

  const results = scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.pct - a.pct || tieBreak(a.hotel, b.hotel))
    .slice(0, limit)

  return { detected: detectedList, generic: false, results }
}
