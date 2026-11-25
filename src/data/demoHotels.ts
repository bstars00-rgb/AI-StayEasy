import type { Hotel, Voucher, City, Area, HotelType, TravelStyle } from '../types'
import type { Lang } from '../i18n'
import type { HotelText } from '../i18n/hotelContent/types'
import type { BenefitValue } from './benefitValue'

/**
 * "Lunas Park Hotel" — a FICTIONAL chain, one hotel per live city, made only to
 * show how a hotel's member voucher and benefit figure look on StayEasy.
 *
 * None of this is real: the hotels do not exist, cannot be booked, and the
 * vouchers are not offers. They live apart from the verified 110-hotel
 * catalogue and only enter it while VITE_DEMO_HOTELS is on (see lib/demo.ts).
 * Every surface labels them as fictional, and they link to no booking site.
 *
 * Every benefit is a perk, never a price cut (hotels do not discount their direct
 * rate for StayEasy members): breakfast, an upgrade, a transfer, an experience, a
 * late check-out. Each states a value so the member sees what the perk is worth.
 * They reach the member as wallet vouchers (lib/voucherWallet.ts), not a shared code.
 */

type L5 = Record<Lang, string>
/** Order matches the tables below: en, ko, ja, vi, zh. */
const l5 = (en: string, ko: string, ja: string, vi: string, zh: string): L5 => ({ en, ko, ja, vi, zh })

interface Spec {
  slug: string
  /** Shown as "Lunas Park Hotel {suffix}". */
  suffix: string
  city: City
  area: Area
  hotelType: HotelType
  tags: TravelStyle[]
  heroColor: string
  cityName: L5
  /** The hotel's benefit statement — officialBenefits[0]. */
  benefit: L5
  voucher: { code: string; redeem: 'online' | 'onsite'; label: L5 }
  value: BenefitValue
}

const SPECS: Spec[] = [
  {
    slug: 'lunas-park-hotel-danang', suffix: 'Danang', city: 'Da Nang', area: 'Han River', hotelType: 'City hotel', tags: ['Couple', 'Business'],
    heroColor: 'from-violet-500 to-indigo-600',
    cityName: l5('Da Nang', '다낭', 'ダナン', 'Đà Nẵng', '岘港'),
    benefit: l5(
      'Members get a room upgrade to the next category on arrival (subject to availability), worth USD 30 a night — show your member voucher at check-in',
      '회원은 도착 시 다음 등급 객실로 업그레이드(재고에 따라, 1박당 USD 30 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は到着時に上位カテゴリーのお部屋へアップグレード(空室状況による、1泊あたりUSD 30相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng nâng hạng lên loại phòng kế tiếp khi nhận phòng (tùy tình trạng phòng), trị giá USD 30 mỗi đêm — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送抵达时升级至上一档房型（视空房情况），每晚价值USD 30——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-DN-UPG', redeem: 'onsite', label: l5('Room upgrade, worth USD 30 a night', '객실 업그레이드, 1박당 USD 30 상당', 'お部屋アップグレード、1泊USD 30相当', 'Nâng hạng phòng, trị giá USD 30 mỗi đêm', '房型升级，每晚价值USD 30') },
    value: { kind: 'amount', line: 0, amount: 30, currency: 'USD', perNight: true },
  },
  {
    slug: 'lunas-park-hotel-saigon', suffix: 'Saigon', city: 'Ho Chi Minh City', area: 'District 1', hotelType: 'Business hotel', tags: ['Business'],
    heroColor: 'from-fuchsia-500 to-purple-600',
    cityName: l5('Ho Chi Minh City', '호치민', 'ホーチミン', 'TP. Hồ Chí Minh', '胡志明市'),
    benefit: l5(
      'Members get breakfast for two every morning, worth USD 20 a night — show your member voucher at check-in',
      '회원은 매일 아침 2인 조식(1박당 USD 20 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は毎朝2名分の朝食(1泊あたりUSD 20相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng bữa sáng cho 2 người mỗi sáng, trị giá USD 20 mỗi đêm — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送每天早晨双人早餐，每晚价值USD 20——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-SG-BKFST', redeem: 'onsite', label: l5('2 breakfasts a day, worth USD 20 a night', '매일 2인 조식, 1박당 USD 20 상당', '毎日2名分の朝食、1泊USD 20相当', 'Bữa sáng cho 2 người mỗi ngày, trị giá USD 20 mỗi đêm', '每日双人早餐，每晚价值USD 20') },
    value: { kind: 'amount', line: 0, amount: 20, currency: 'USD', perNight: true },
  },
  {
    slug: 'lunas-park-hotel-nhatrang', suffix: 'Nha Trang', city: 'Nha Trang', area: 'Nha Trang Beach', hotelType: 'Beach resort', tags: ['Beach', 'Family'],
    heroColor: 'from-sky-500 to-cyan-600',
    cityName: l5('Nha Trang', '냐짱', 'ニャチャン', 'Nha Trang', '芽庄'),
    benefit: l5(
      'Members get a beach cabana and welcome drinks for two, worth USD 40 — show your member voucher at check-in',
      '회원은 2인 비치 카바나와 웰컴 드링크(USD 40 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は2名分のビーチカバナとウェルカムドリンク(USD 40相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng chòi bãi biển và đồ uống chào đón cho 2 người, trị giá USD 40 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送双人海滩凉亭和欢迎饮品，价值USD 40——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-NT-CABANA', redeem: 'onsite', label: l5('Beach cabana & drinks for two, worth USD 40', '2인 비치 카바나·드링크, USD 40 상당', '2名分のビーチカバナとドリンク、USD 40相当', 'Chòi bãi biển & đồ uống cho 2 người, trị giá USD 40', '双人海滩凉亭和饮品，价值USD 40') },
    value: { kind: 'amount', line: 0, amount: 40, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-phuquoc', suffix: 'Phu Quoc', city: 'Phu Quoc', area: 'Long Beach', hotelType: 'Beach resort', tags: ['Beach', 'Couple'],
    heroColor: 'from-teal-500 to-emerald-600',
    cityName: l5('Phu Quoc', '푸꾸옥', 'フーコック', 'Phú Quốc', '富国岛'),
    benefit: l5(
      'Members get a one-way private airport transfer, worth USD 25 — show your member voucher at check-in',
      '회원은 편도 공항 프라이빗 픽업(USD 25 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は片道の空港プライベート送迎(USD 25相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng đưa đón sân bay riêng một chiều, trị giá USD 25 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送单程机场专车接送，价值USD 25——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-PQ-XFER', redeem: 'onsite', label: l5('Airport transfer, worth USD 25', '공항 픽업, USD 25 상당', '空港送迎、USD 25相当', 'Đưa đón sân bay, trị giá USD 25', '机场接送，价值USD 25') },
    value: { kind: 'amount', line: 0, amount: 25, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-hoian', suffix: 'Hoi An', city: 'Hoi An', area: 'Ancient Town', hotelType: 'Family hotel', tags: ['Couple', 'Family'],
    heroColor: 'from-amber-500 to-orange-600',
    cityName: l5('Hoi An', '호이안', 'ホイアン', 'Hội An', '会安'),
    benefit: l5(
      'Members get a cooking class for two with a local chef, worth USD 60 — show your member voucher at check-in',
      '회원은 현지 셰프와 함께하는 2인 쿠킹 클래스(USD 60 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は地元シェフと過ごす2名分のクッキングクラス(USD 60相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng lớp học nấu ăn cho 2 người cùng đầu bếp địa phương, trị giá USD 60 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送与当地厨师同行的双人烹饪课，价值USD 60——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-HA-COOK', redeem: 'onsite', label: l5('Cooking class for two, worth USD 60', '2인 쿠킹 클래스, USD 60 상당', '2名クッキングクラス、USD 60相当', 'Lớp nấu ăn cho 2 người, trị giá USD 60', '双人烹饪课，价值USD 60') },
    value: { kind: 'amount', line: 0, amount: 60, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-hanoi', suffix: 'Hanoi', city: 'Hanoi', area: 'Old Quarter', hotelType: 'City hotel', tags: ['Business', 'Couple'],
    heroColor: 'from-rose-500 to-red-600',
    cityName: l5('Hanoi', '하노이', 'ハノイ', 'Hà Nội', '河内'),
    benefit: l5(
      'Members get an Old Quarter street-food walk for two, worth USD 45 — show your member voucher at check-in',
      '회원은 2인 올드쿼터 길거리 음식 투어(USD 45 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は2名分の旧市街ストリートフードウォーク(USD 45相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng tour ẩm thực đường phố Phố Cổ cho 2 người, trị giá USD 45 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送双人老城区街头美食漫步，价值USD 45——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-HN-FOOD', redeem: 'onsite', label: l5('Street-food walk for two, worth USD 45', '2인 길거리 음식 투어, USD 45 상당', '2名分のストリートフードウォーク、USD 45相当', 'Tour ẩm thực đường phố cho 2 người, trị giá USD 45', '双人街头美食漫步，价值USD 45') },
    value: { kind: 'amount', line: 0, amount: 45, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-hue', suffix: 'Hue', city: 'Hue', area: 'Perfume River', hotelType: 'City hotel', tags: ['Couple'],
    heroColor: 'from-indigo-500 to-blue-700',
    cityName: l5('Hue', '후에', 'フエ', 'Huế', '顺化'),
    benefit: l5(
      'Members get a 60-minute spa treatment for two, worth USD 80 — show your member voucher at check-in',
      '회원은 2인 60분 스파 트리트먼트(USD 80 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は2名分の60分スパトリートメント(USD 80相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng liệu trình spa 60 phút cho 2 người, trị giá USD 80 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送双人60分钟水疗，价值USD 80——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-HUE-SPA', redeem: 'onsite', label: l5('Spa for two, worth USD 80', '2인 스파, USD 80 상당', '2名スパ、USD 80相当', 'Spa cho 2 người, trị giá USD 80', '双人水疗，价值USD 80') },
    value: { kind: 'amount', line: 0, amount: 80, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-dalat', suffix: 'Dalat', city: 'Da Lat', area: 'Xuan Huong Lake', hotelType: 'Family hotel', tags: ['Family', 'Couple'],
    heroColor: 'from-lime-500 to-green-600',
    cityName: l5('Da Lat', '달랏', 'ダラット', 'Đà Lạt', '大叻'),
    benefit: l5(
      'Members get late check-out until 4 pm, worth USD 30 — show your member voucher at check-in',
      '회원은 오후 4시까지 레이트 체크아웃(USD 30 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は16時までのレイトチェックアウト(USD 30相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng trả phòng muộn đến 16:00, trị giá USD 30 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送延迟至下午4点退房，价值USD 30——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-DL-LATE', redeem: 'onsite', label: l5('Late check-out until 4 pm, worth USD 30', '오후 4시까지 레이트 체크아웃, USD 30 상당', '16時までのレイトチェックアウト、USD 30相当', 'Trả phòng muộn đến 16:00, trị giá USD 30', '延迟至下午4点退房，价值USD 30') },
    value: { kind: 'amount', line: 0, amount: 30, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-sapa', suffix: 'Sapa', city: 'Sapa', area: 'Sapa Town', hotelType: 'City hotel', tags: ['Family'],
    heroColor: 'from-slate-500 to-gray-700',
    cityName: l5('Sapa', '사파', 'サパ', 'Sa Pa', '沙坝'),
    benefit: l5(
      'Members get a half-day guided village trek for two, worth USD 35 — show your member voucher at check-in',
      '회원은 2인 반나절 마을 트레킹 가이드(USD 35 상당) 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は2名分の半日村トレッキングガイド(USD 35相当)付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng nửa ngày đi bộ thăm bản có hướng dẫn cho 2 người, trị giá USD 35 — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送双人半日村落徒步向导，价值USD 35——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-SP-TREK', redeem: 'onsite', label: l5('Guided trek for two, worth USD 35', '2인 가이드 트레킹, USD 35 상당', '2名ガイド付きトレッキング、USD 35相当', 'Đi bộ có hướng dẫn cho 2 người, trị giá USD 35', '双人向导徒步，价值USD 35') },
    value: { kind: 'amount', line: 0, amount: 35, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-halong', suffix: 'Ha Long', city: 'Ha Long Bay', area: 'Bai Chay', hotelType: 'Family hotel', tags: ['Family', 'Beach'],
    heroColor: 'from-cyan-500 to-blue-600',
    cityName: l5('Ha Long Bay', '하롱베이', 'ハロン湾', 'Vịnh Hạ Long', '下龙湾'),
    benefit: l5(
      'Members get a USD 50 dining credit at the hotel restaurant, used during the stay — show your member voucher at check-in',
      '회원은 숙박 중 호텔 레스토랑에서 쓸 수 있는 USD 50 식사 크레딧 제공 — 체크인 때 회원 바우처를 보여주세요',
      '会員は滞在中にホテルのレストランで使えるUSD 50のお食事クレジット付き — チェックイン時に会員バウチャーをご提示ください',
      'Thành viên được tặng tín dụng ăn uống USD 50 tại nhà hàng của khách sạn trong thời gian lưu trú — xuất trình voucher thành viên khi nhận phòng',
      '会员赠送住宿期间可在酒店餐厅使用的USD 50餐饮额度——入住时出示会员优惠券',
    ),
    voucher: { code: 'LUNAS-HL-DINE', redeem: 'onsite', label: l5('USD 50 dining credit', 'USD 50 식사 크레딧', 'USD 50のお食事クレジット', 'Tín dụng ăn uống USD 50', 'USD 50餐饮额度') },
    value: { kind: 'amount', line: 0, amount: 50, currency: 'USD' },
  },
]

const VALID_UNTIL = '2027-06-30'

const TERMS = l5(
  'Demo voucher for a fictional hotel — not a real offer.',
  '가상 호텔의 시연용 바우처이며 실제 혜택이 아닙니다.',
  '架空のホテルのデモ用バウチャーで、実際の特典ではありません。',
  'Voucher thử nghiệm của khách sạn giả định — không phải ưu đãi thật.',
  '虚构酒店的演示优惠券，并非真实优惠。',
)

/** The translatable text of one hotel, per language. */
function textFor(lang: Lang, s: Spec): HotelText {
  const c = s.cityName[lang]
  const benefit = s.benefit[lang]
  switch (lang) {
    case 'ko':
      return {
        shortDescription: `${c}에 있는 가상의 시연용 호텔입니다. 호텔의 회원 바우처가 어떻게 보이는지 보여 주려고 만들었고, 실제로는 존재하지 않아 예약할 수 없습니다.`,
        positioningLine: `회원 바우처 흐름을 체험해 보는 ${c}의 예시 호텔입니다.`,
        bestFor: ['회원 바우처 흐름 체험하기', '호텔 혜택이 숫자로 보이는 모습 확인하기'],
        notIdealFor: ['실제 여행을 계획하는 분 — 이 호텔은 존재하지 않아요'],
        mainReason: `시연용입니다. ${benefit}`,
        thingsToCheck: ['가상의 호텔이므로 여기 나온 혜택은 실제 혜택이 아니에요', '실제 호텔의 회원 혜택은 각 호텔 공식 사이트에서 확인하세요'],
        officialBenefits: [benefit],
        roomGuide: { couples: '시연용 문구이며 실제 객실은 없어요.', families: '시연용 문구이며 실제 객실은 없어요.', longStay: '시연용 문구이며 실제 객실은 없어요.', checkBeforeBooking: '가상의 호텔이라 예약할 수 있는 것이 없어요.' },
        locationGuide: { nearby: `시연용 지도와 거리 표시를 위해 ${c}에 놓아 둔 위치예요.`, airportDistance: '해당 없음 — 가상의 호텔이에요.', gettingAround: '해당 없음 — 가상의 호텔이에요.', nearbyFood: '해당 없음 — 가상의 호텔이에요.' },
        cancellationChecklist: ['가상의 호텔이라 취소할 예약이 없어요.'],
      }
    case 'ja':
      return {
        shortDescription: `${c}にある架空のデモ用ホテルです。ホテルの会員バウチャーの見え方を示すために作ったもので、実在せず予約もできません。`,
        positioningLine: `会員バウチャーの流れを試すための${c}のサンプルホテルです。`,
        bestFor: ['会員バウチャーの流れを試したい方', 'ホテルの特典が数字で表示される様子を見たい方'],
        notIdealFor: ['実際の旅行を計画中の方 — このホテルは存在しません'],
        mainReason: `デモ用です。${benefit}`,
        thingsToCheck: ['架空のホテルのため、ここにある特典は実際のものではありません', '実在のホテルの会員特典は各ホテルの公式サイトでご確認ください'],
        officialBenefits: [benefit],
        roomGuide: { couples: 'デモ用の文章で、実際の客室はありません。', families: 'デモ用の文章で、実際の客室はありません。', longStay: 'デモ用の文章で、実際の客室はありません。', checkBeforeBooking: '架空のホテルのため、予約できるものはありません。' },
        locationGuide: { nearby: `デモ用の地図と距離表示のために${c}に置いた位置です。`, airportDistance: '該当なし — 架空のホテルです。', gettingAround: '該当なし — 架空のホテルです。', nearbyFood: '該当なし — 架空のホテルです。' },
        cancellationChecklist: ['架空のホテルのため、取り消す予約はありません。'],
      }
    case 'vi':
      return {
        shortDescription: `Khách sạn giả định để trình diễn tại ${c}, chỉ được tạo ra để cho thấy voucher thành viên của khách sạn hoạt động thế nào. Khách sạn này không tồn tại và không thể đặt phòng.`,
        positioningLine: `Khách sạn mẫu tại ${c} để thử luồng voucher thành viên.`,
        bestFor: ['Thử luồng voucher thành viên', 'Xem ưu đãi của khách sạn hiển thị bằng con số'],
        notIdealFor: ['Người đang lên kế hoạch cho chuyến đi thật — khách sạn này không tồn tại'],
        mainReason: `Chỉ để trình diễn. ${benefit}`,
        thingsToCheck: ['Đây là khách sạn giả định — mọi ưu đãi ở đây đều không có thật', 'Khách sạn thật công bố ưu đãi thành viên trên website chính thức của họ'],
        officialBenefits: [benefit],
        roomGuide: { couples: 'Nội dung mẫu để trình diễn — không có phòng thật.', families: 'Nội dung mẫu để trình diễn — không có phòng thật.', longStay: 'Nội dung mẫu để trình diễn — không có phòng thật.', checkBeforeBooking: 'Không có gì để đặt: khách sạn này là giả định.' },
        locationGuide: { nearby: `Đặt tại ${c} chỉ để bản đồ và khoảng cách trình diễn có chỗ hiển thị.`, airportDistance: 'Không áp dụng — khách sạn giả định.', gettingAround: 'Không áp dụng — khách sạn giả định.', nearbyFood: 'Không áp dụng — khách sạn giả định.' },
        cancellationChecklist: ['Khách sạn này là giả định nên không có gì để hủy.'],
      }
    case 'zh':
      return {
        shortDescription: `位于${c}的虚构演示酒店，仅用于展示酒店会员优惠券的运作方式。它并不存在，也无法预订。`,
        positioningLine: `用于体验会员优惠券流程的${c}示例酒店。`,
        bestFor: ['体验会员优惠券流程', '查看酒店优惠以数字呈现的样子'],
        notIdealFor: ['正在计划真实行程的人——这家酒店并不存在'],
        mainReason: `仅供演示。${benefit}`,
        thingsToCheck: ['这是虚构的酒店，这里的优惠并非真实优惠', '真实酒店的会员优惠请以各酒店官网为准'],
        officialBenefits: [benefit],
        roomGuide: { couples: '演示用文字，没有真实客房。', families: '演示用文字，没有真实客房。', longStay: '演示用文字，没有真实客房。', checkBeforeBooking: '这是虚构酒店，没有可预订的内容。' },
        locationGuide: { nearby: `放在${c}只是为了让演示地图和距离有地方显示。`, airportDistance: '不适用——虚构酒店。', gettingAround: '不适用——虚构酒店。', nearbyFood: '不适用——虚构酒店。' },
        cancellationChecklist: ['这是虚构酒店，没有可取消的预订。'],
      }
    default:
      return {
        shortDescription: `A fictional demo hotel in ${c}, made only to show how a hotel’s member voucher works. It does not exist and cannot be booked.`,
        positioningLine: `A sample ${c} hotel for trying the member voucher flow.`,
        bestFor: ['Trying the member voucher flow', 'Seeing a hotel benefit shown as a number'],
        notIdealFor: ['Anyone planning a real trip — this hotel does not exist'],
        mainReason: `Demo only. ${benefit}`,
        thingsToCheck: ['This is a fictional hotel — nothing here is a real offer', 'Real hotels state their own member benefits on their official sites'],
        officialBenefits: [benefit],
        roomGuide: { couples: 'Sample text for the demo — there are no real rooms.', families: 'Sample text for the demo — there are no real rooms.', longStay: 'Sample text for the demo — there are no real rooms.', checkBeforeBooking: 'There is nothing to book: this hotel is fictional.' },
        locationGuide: { nearby: `Placed in ${c} only so the demo map and distances have somewhere to point.`, airportDistance: 'Not applicable — fictional hotel.', gettingAround: 'Not applicable — fictional hotel.', nearbyFood: 'Not applicable — fictional hotel.' },
        cancellationChecklist: ['This hotel is fictional, so there is nothing to cancel.'],
      }
  }
}

const voucherFor = (lang: Lang, s: Spec): Voucher => ({
  code: s.voucher.code,
  discountLabel: s.voucher.label[lang],
  terms: TERMS[lang],
  validUntil: VALID_UNTIL,
  redeem: s.voucher.redeem,
})

function build(s: Spec): Hotel {
  const t = textFor('en', s)
  return {
    id: s.slug,
    slug: s.slug,
    name: `Lunas Park Hotel ${s.suffix}`,
    country: 'Vietnam',
    city: s.city,
    area: s.area,
    hotelType: s.hotelType,
    ...t,
    tags: s.tags,
    priceTier: 'mid',
    facilities: ['Pool', 'Restaurant', 'Free Wi-Fi'],
    // No stars, no free-cancellation claim: a fictional hotel states nothing it can't back.
    conditions: {
      stayEasyScore: 8,
      freeCancellation: false,
      breakfastIncluded: false,
      freeAirportShuttle: false,
      freeParking: false,
      freeWifi: true,
      pool: true,
      beachfront: false,
      familyFriendly: false,
      petFriendly: false,
      spa: false,
      gym: false,
      twentyFourHourFrontDesk: false,
      nonSmoking: false,
      accessible: false,
      walkToBeachMin: 30,
    },
    imageUrl: '',
    officialWebsiteUrl: 'https://lunasparkhotel.example',
    isSponsored: false,
    isDemo: true,
    voucher: voucherFor('en', s),
    similarHotelSlugs: SPECS.filter((o) => o.slug !== s.slug).slice(0, 3).map((o) => o.slug),
    heroColor: s.heroColor,
    emoji: '🌙',
    koreanFriendly: false,
  }
}

export const DEMO_HOTELS: Hotel[] = SPECS.map(build)

/** A demo hotel's translated text plus its translated voucher. */
export type DemoText = HotelText & { voucher: Voucher }

export const DEMO_TEXT: Record<Exclude<Lang, 'en'>, Record<string, DemoText>> = {
  ko: Object.fromEntries(SPECS.map((s) => [s.slug, { ...textFor('ko', s), voucher: voucherFor('ko', s) }])),
  ja: Object.fromEntries(SPECS.map((s) => [s.slug, { ...textFor('ja', s), voucher: voucherFor('ja', s) }])),
  vi: Object.fromEntries(SPECS.map((s) => [s.slug, { ...textFor('vi', s), voucher: voucherFor('vi', s) }])),
  zh: Object.fromEntries(SPECS.map((s) => [s.slug, { ...textFor('zh', s), voucher: voucherFor('zh', s) }])),
}

export const DEMO_BENEFIT_VALUE: Record<string, BenefitValue> = Object.fromEntries(SPECS.map((s) => [s.slug, s.value]))
