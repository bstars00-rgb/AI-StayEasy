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
 * Each hotel's benefit differs on purpose — a percentage, free nights, or a
 * fixed value the "hotel" states — so each kind of figure can be seen.
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
      'Members get 15% off the room rate when booking direct — the code is in your member voucher',
      '회원은 직접 예약하면 객실 요금 15% 할인 — 코드는 회원 바우처에서 확인하세요',
      '会員は直接予約で客室料金が15%オフ — コードは会員バウチャーでご確認ください',
      'Thành viên được giảm 15% giá phòng khi đặt trực tiếp — mã nằm trong voucher thành viên',
      '会员直订房价立减15%——优惠码见会员优惠券',
    ),
    voucher: { code: 'LUNAS-DN15', redeem: 'online', label: l5('15% off your direct booking', '직접 예약 15% 할인', '直接予約15%オフ', 'Giảm 15% khi đặt trực tiếp', '直订立减15%') },
    value: { line: 0, pct: 15 },
  },
  {
    slug: 'lunas-park-hotel-saigon', suffix: 'Saigon', city: 'Ho Chi Minh City', area: 'District 1', hotelType: 'Business hotel', tags: ['Business'],
    heroColor: 'from-fuchsia-500 to-purple-600',
    cityName: l5('Ho Chi Minh City', '호치민', 'ホーチミン', 'TP. Hồ Chí Minh', '胡志明市'),
    benefit: l5(
      'Members get breakfast for two every morning, worth USD 20 a night — show the voucher at check-in',
      '회원은 매일 아침 2인 조식 제공(1박당 USD 20 상당) — 체크인 때 바우처를 보여주세요',
      '会員は毎朝2名分の朝食付き(1泊あたりUSD 20相当)— チェックイン時にバウチャーをご提示ください',
      'Thành viên được tặng bữa sáng cho 2 người mỗi sáng, trị giá USD 20 mỗi đêm — xuất trình voucher khi nhận phòng',
      '会员每天早晨赠送双人早餐，每晚价值USD 20——入住时出示优惠券',
    ),
    voucher: { code: 'LUNAS-SG-BKFST', redeem: 'onsite', label: l5('2 breakfasts a day, worth USD 20 a night', '매일 2인 조식, 1박당 USD 20 상당', '毎日2名分の朝食、1泊USD 20相当', 'Bữa sáng cho 2 người mỗi ngày, trị giá USD 20 mỗi đêm', '每日双人早餐，每晚价值USD 20') },
    value: { kind: 'amount', line: 0, amount: 20, currency: 'USD', perNight: true },
  },
  {
    slug: 'lunas-park-hotel-nhatrang', suffix: 'Nha Trang', city: 'Nha Trang', area: 'Nha Trang Beach', hotelType: 'Beach resort', tags: ['Beach', 'Family'],
    heroColor: 'from-sky-500 to-cyan-600',
    cityName: l5('Nha Trang', '냐짱', 'ニャチャン', 'Nha Trang', '芽庄'),
    benefit: l5(
      'Stay 3 nights or more and get 1 night free when you book direct — the code is in your member voucher',
      '직접 예약하면 3박 이상 숙박 시 1박 무료 — 코드는 회원 바우처에서 확인하세요',
      '直接予約で3泊以上ご宿泊で1泊無料 — コードは会員バウチャーでご確認ください',
      'Đặt trực tiếp, ở từ 3 đêm được tặng 1 đêm — mã nằm trong voucher thành viên',
      '直订住满3晚免费1晚——优惠码见会员优惠券',
    ),
    voucher: { code: 'LUNAS-NT3', redeem: 'online', label: l5('3 nights, 1 free', '3박 이상 1박 무료', '3泊以上で1泊無料', 'Ở từ 3 đêm, tặng 1 đêm', '住满3晚免费1晚') },
    value: { kind: 'nights', line: 0, minNights: 3, freeNights: 1 },
  },
  {
    slug: 'lunas-park-hotel-phuquoc', suffix: 'Phu Quoc', city: 'Phu Quoc', area: 'Long Beach', hotelType: 'Beach resort', tags: ['Beach', 'Couple'],
    heroColor: 'from-teal-500 to-emerald-600',
    cityName: l5('Phu Quoc', '푸꾸옥', 'フーコック', 'Phú Quốc', '富国岛'),
    benefit: l5(
      'Members get a one-way private airport transfer, worth USD 25 — show the voucher at check-in',
      '회원은 편도 공항 프라이빗 픽업 제공(USD 25 상당) — 체크인 때 바우처를 보여주세요',
      '会員は片道の空港プライベート送迎付き(USD 25相当)— チェックイン時にバウチャーをご提示ください',
      'Thành viên được đưa đón sân bay riêng một chiều, trị giá USD 25 — xuất trình voucher khi nhận phòng',
      '会员赠送单程机场专车接送，价值USD 25——入住时出示优惠券',
    ),
    voucher: { code: 'LUNAS-PQ-XFER', redeem: 'onsite', label: l5('Airport transfer, worth USD 25', '공항 픽업, USD 25 상당', '空港送迎、USD 25相当', 'Đưa đón sân bay, trị giá USD 25', '机场接送，价值USD 25') },
    value: { kind: 'amount', line: 0, amount: 25, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-hoian', suffix: 'Hoi An', city: 'Hoi An', area: 'Ancient Town', hotelType: 'Family hotel', tags: ['Couple', 'Family'],
    heroColor: 'from-amber-500 to-orange-600',
    cityName: l5('Hoi An', '호이안', 'ホイアン', 'Hội An', '会安'),
    benefit: l5(
      'Members get a cooking class for two with a local chef, worth USD 60 — show the voucher at check-in',
      '회원은 현지 셰프와 함께하는 2인 쿠킹 클래스 제공(USD 60 상당) — 체크인 때 바우처를 보여주세요',
      '会員は地元シェフと過ごす2名分のクッキングクラス付き(USD 60相当)— チェックイン時にバウチャーをご提示ください',
      'Thành viên được tặng lớp học nấu ăn cho 2 người cùng đầu bếp địa phương, trị giá USD 60 — xuất trình voucher khi nhận phòng',
      '会员赠送与当地厨师同行的双人烹饪课，价值USD 60——入住时出示优惠券',
    ),
    voucher: { code: 'LUNAS-HA-COOK', redeem: 'onsite', label: l5('Cooking class for two, worth USD 60', '2인 쿠킹 클래스, USD 60 상당', '2名クッキングクラス、USD 60相当', 'Lớp nấu ăn cho 2 người, trị giá USD 60', '双人烹饪课，价值USD 60') },
    value: { kind: 'amount', line: 0, amount: 60, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-hanoi', suffix: 'Hanoi', city: 'Hanoi', area: 'Old Quarter', hotelType: 'City hotel', tags: ['Business', 'Couple'],
    heroColor: 'from-rose-500 to-red-600',
    cityName: l5('Hanoi', '하노이', 'ハノイ', 'Hà Nội', '河内'),
    benefit: l5(
      'Up to 20% off the room rate for stays of 2 nights or more when you book direct — the code is in your member voucher',
      '직접 예약하면 2박 이상 숙박 시 객실 요금 최대 20% 할인 — 코드는 회원 바우처에서 확인하세요',
      '直接予約で2泊以上ご宿泊で客室料金が最大20%オフ — コードは会員バウチャーでご確認ください',
      'Giảm tới 20% giá phòng khi ở từ 2 đêm và đặt trực tiếp — mã nằm trong voucher thành viên',
      '直订住满2晚房价最高减20%——优惠码见会员优惠券',
    ),
    voucher: { code: 'LUNAS-HN20', redeem: 'online', label: l5('Up to 20% off, 2+ nights', '2박 이상 최대 20% 할인', '2泊以上で最大20%オフ', 'Giảm tới 20% khi ở từ 2 đêm', '住满2晚最高减20%') },
    value: { line: 0, pct: 20, upTo: true },
  },
  {
    slug: 'lunas-park-hotel-hue', suffix: 'Hue', city: 'Hue', area: 'Perfume River', hotelType: 'City hotel', tags: ['Couple'],
    heroColor: 'from-indigo-500 to-blue-700',
    cityName: l5('Hue', '후에', 'フエ', 'Huế', '顺化'),
    benefit: l5(
      'Members get a 60-minute spa treatment for two, worth USD 80 — show the voucher at check-in',
      '회원은 2인 60분 스파 트리트먼트 제공(USD 80 상당) — 체크인 때 바우처를 보여주세요',
      '会員は2名分の60分スパトリートメント付き(USD 80相当)— チェックイン時にバウチャーをご提示ください',
      'Thành viên được tặng liệu trình spa 60 phút cho 2 người, trị giá USD 80 — xuất trình voucher khi nhận phòng',
      '会员赠送双人60分钟水疗，价值USD 80——入住时出示优惠券',
    ),
    voucher: { code: 'LUNAS-HUE-SPA', redeem: 'onsite', label: l5('Spa for two, worth USD 80', '2인 스파, USD 80 상당', '2名スパ、USD 80相当', 'Spa cho 2 người, trị giá USD 80', '双人水疗，价值USD 80') },
    value: { kind: 'amount', line: 0, amount: 80, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-dalat', suffix: 'Dalat', city: 'Da Lat', area: 'Xuan Huong Lake', hotelType: 'Family hotel', tags: ['Family', 'Couple'],
    heroColor: 'from-lime-500 to-green-600',
    cityName: l5('Da Lat', '달랏', 'ダラット', 'Đà Lạt', '大叻'),
    benefit: l5(
      'Stay 4 nights or more and get 1 night free when you book direct — the code is in your member voucher',
      '직접 예약하면 4박 이상 숙박 시 1박 무료 — 코드는 회원 바우처에서 확인하세요',
      '直接予約で4泊以上ご宿泊で1泊無料 — コードは会員バウチャーでご確認ください',
      'Đặt trực tiếp, ở từ 4 đêm được tặng 1 đêm — mã nằm trong voucher thành viên',
      '直订住满4晚免费1晚——优惠码见会员优惠券',
    ),
    voucher: { code: 'LUNAS-DL4', redeem: 'online', label: l5('4 nights, 1 free', '4박 이상 1박 무료', '4泊以上で1泊無料', 'Ở từ 4 đêm, tặng 1 đêm', '住满4晚免费1晚') },
    value: { kind: 'nights', line: 0, minNights: 4, freeNights: 1 },
  },
  {
    slug: 'lunas-park-hotel-sapa', suffix: 'Sapa', city: 'Sapa', area: 'Sapa Town', hotelType: 'City hotel', tags: ['Family'],
    heroColor: 'from-slate-500 to-gray-700',
    cityName: l5('Sapa', '사파', 'サパ', 'Sa Pa', '沙坝'),
    benefit: l5(
      'Members get a half-day guided village trek for two, worth USD 35 — show the voucher at check-in',
      '회원은 2인 반나절 마을 트레킹 가이드 제공(USD 35 상당) — 체크인 때 바우처를 보여주세요',
      '会員は2名分の半日村トレッキングガイド付き(USD 35相当)— チェックイン時にバウチャーをご提示ください',
      'Thành viên được tặng nửa ngày đi bộ thăm bản có hướng dẫn cho 2 người, trị giá USD 35 — xuất trình voucher khi nhận phòng',
      '会员赠送双人半日村落徒步向导，价值USD 35——入住时出示优惠券',
    ),
    voucher: { code: 'LUNAS-SP-TREK', redeem: 'onsite', label: l5('Guided trek for two, worth USD 35', '2인 가이드 트레킹, USD 35 상당', '2名ガイド付きトレッキング、USD 35相当', 'Đi bộ có hướng dẫn cho 2 người, trị giá USD 35', '双人向导徒步，价值USD 35') },
    value: { kind: 'amount', line: 0, amount: 35, currency: 'USD' },
  },
  {
    slug: 'lunas-park-hotel-halong', suffix: 'Ha Long', city: 'Ha Long Bay', area: 'Bai Chay', hotelType: 'Family hotel', tags: ['Family', 'Beach'],
    heroColor: 'from-cyan-500 to-blue-600',
    cityName: l5('Ha Long Bay', '하롱베이', 'ハロン湾', 'Vịnh Hạ Long', '下龙湾'),
    benefit: l5(
      'Members get a USD 50 dining credit at the hotel restaurant, used during the stay',
      '회원은 숙박 중 호텔 레스토랑에서 쓸 수 있는 USD 50 식사 크레딧 제공',
      '会員は滞在中にホテルのレストランで使えるUSD 50のお食事クレジット付き',
      'Thành viên nhận tín dụng ăn uống USD 50 tại nhà hàng của khách sạn trong thời gian lưu trú',
      '会员在住宿期间可在酒店餐厅使用USD 50餐饮额度',
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
