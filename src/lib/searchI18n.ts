import type { Lang } from '../i18n'
import type { Signal } from './searchEngine'

export interface SearchStrings {
  nav: string
  title: string
  subtitle: string
  placeholder: string
  button: string
  thinking: string
  examplesLabel: string
  examples: string[]
  understood: string
  genericNote: string
  comingSoonNote: string // {city}
  noMatchTitle: string
  noMatchText: string
  matchSuffix: string
  reasonsLabel: string
  poweredNote: string
  reason: Record<Signal, string>
}

export const searchStrings: Record<Lang, SearchStrings> = {
  en: {
    nav: 'AI Search',
    title: 'Describe your ideal stay',
    subtitle: 'Tell our AI what you want in plain words — we’ll recommend the best-matching Vietnam hotels and explain why.',
    placeholder: 'e.g. A beachfront family hotel with a kids pool, breakfast and airport pickup, Korean-friendly',
    button: 'Recommend hotels',
    thinking: 'Finding your best matches…',
    examplesLabel: 'Try:',
    examples: [
      'Romantic quiet resort for our honeymoon with a spa',
      'Family beach hotel with a kids pool, Korean-friendly',
      'Long stay apartment with a kitchen for remote work',
      'Central city hotel for a short business trip',
    ],
    understood: 'What we understood',
    genericNote: 'Tell us more about your trip for tailored picks. Meanwhile, here are popular hotels.',
    comingSoonNote: '{city} isn’t on StayEasy yet — here are hotels in our live cities meanwhile.',
    noMatchTitle: 'No strong match found',
    noMatchText: 'Try describing your trip differently — for example a travel style, area, or amenity.',
    matchSuffix: 'match',
    reasonsLabel: 'Why it fits',
    poweredNote: 'On-device recommendation — runs in your browser, no data leaves your device.',
    reason: {
      family: 'Family-friendly', couple: 'Great for couples', business: 'Business-ready', beach: 'By the beach',
      longstay: 'Good for long stays', korean: 'Korean-friendly', pool: 'Swimming pool', breakfast: 'Breakfast',
      kids: 'Kids facilities', spa: 'Spa', gym: 'Fitness center', airport: 'Airport transfer', kitchen: 'Kitchen',
      city: 'Central / walkable', quiet: 'Quiet & relaxing', golf: 'Golf nearby', luxury: 'Upscale resort',
      budget: 'Good value', firsttime: 'Easy for first-timers', hoian: 'Hoi An', danang: 'Da Nang', hcmc: 'Ho Chi Minh City', nhatrang: 'Nha Trang', phuquoc: 'Phu Quoc', hanoi: 'Hanoi',
    },
  },
  ko: {
    nav: 'AI 검색',
    title: '원하는 숙소를 설명해 주세요',
    subtitle: 'AI에게 원하는 조건을 자유롭게 말해 주세요 — 가장 잘 맞는 베트남 호텔을 추천하고 이유까지 알려드립니다.',
    placeholder: '예: 키즈풀과 조식, 공항 픽업이 있는 해변 가족 호텔, 한국어 가능',
    button: '호텔 추천받기',
    thinking: '가장 잘 맞는 호텔을 찾는 중…',
    examplesLabel: '예시:',
    examples: [
      '스파가 있는 조용하고 로맨틱한 신혼여행 리조트',
      '키즈풀이 있는 해변 가족 호텔, 한국어 가능',
      '주방이 있는 장기 숙박 아파트, 원격근무용',
      '짧은 출장을 위한 시내 중심 호텔',
    ],
    understood: 'AI가 이해한 조건',
    genericNote: '여행에 대해 더 알려주시면 맞춤 추천을 드릴게요. 우선 인기 호텔을 보여드립니다.',
    comingSoonNote: '{city}는 아직 StayEasy에 없어요 — 우선 서비스 중인 도시의 호텔을 보여드립니다.',
    noMatchTitle: '딱 맞는 호텔을 찾지 못했어요',
    noMatchText: '여행 스타일, 지역, 편의시설 등으로 다르게 설명해 보세요.',
    matchSuffix: '일치',
    reasonsLabel: '추천 이유',
    poweredNote: '기기 내 추천 — 브라우저에서 동작하며 데이터가 외부로 전송되지 않습니다.',
    reason: {
      family: '가족 친화', couple: '커플에게 좋음', business: '비즈니스 적합', beach: '해변 인접',
      longstay: '장기 숙박에 좋음', korean: '한국어 가능', pool: '수영장', breakfast: '조식',
      kids: '키즈 시설', spa: '스파', gym: '피트니스', airport: '공항 셔틀', kitchen: '주방',
      city: '시내 중심·도보 편리', quiet: '조용하고 편안함', golf: '골프 인접', luxury: '고급 리조트',
      budget: '가성비 좋음', firsttime: '첫 방문에 편리', hoian: '호이안', danang: '다낭', hcmc: '호치민', nhatrang: '냐짱', phuquoc: '푸꾸옥', hanoi: '하노이',
    },
  },
  vi: {
    nav: 'Tìm kiếm AI',
    title: 'Mô tả kỳ nghỉ lý tưởng của bạn',
    subtitle: 'Hãy nói với AI điều bạn muốn bằng lời tự nhiên — chúng tôi sẽ gợi ý các khách sạn Việt Nam phù hợp nhất và giải thích lý do.',
    placeholder: 'VD: Khách sạn gia đình ven biển có hồ bơi trẻ em, bữa sáng và đưa đón sân bay, thân thiện với khách Hàn',
    button: 'Gợi ý khách sạn',
    thinking: 'Đang tìm lựa chọn phù hợp nhất…',
    examplesLabel: 'Thử:',
    examples: [
      'Resort yên tĩnh lãng mạn cho tuần trăng mật có spa',
      'Khách sạn biển cho gia đình có hồ bơi trẻ em, thân thiện khách Hàn',
      'Căn hộ lưu trú dài hạn có bếp để làm việc từ xa',
      'Khách sạn trung tâm cho chuyến công tác ngắn',
    ],
    understood: 'Điều chúng tôi hiểu',
    genericNote: 'Hãy cho biết thêm về chuyến đi để có gợi ý riêng. Trong khi đó, đây là các khách sạn phổ biến.',
    comingSoonNote: '{city} chưa có trên StayEasy — trong khi đó, đây là khách sạn ở các thành phố đang hoạt động.',
    noMatchTitle: 'Chưa tìm thấy lựa chọn thật phù hợp',
    noMatchText: 'Hãy mô tả chuyến đi theo cách khác — ví dụ phong cách du lịch, khu vực hoặc tiện ích.',
    matchSuffix: 'phù hợp',
    reasonsLabel: 'Vì sao phù hợp',
    poweredNote: 'Gợi ý trên thiết bị — chạy trong trình duyệt, không gửi dữ liệu ra ngoài.',
    reason: {
      family: 'Thân thiện gia đình', couple: 'Tuyệt cho cặp đôi', business: 'Sẵn sàng cho công tác', beach: 'Gần biển',
      longstay: 'Tốt cho lưu trú dài', korean: 'Thân thiện khách Hàn', pool: 'Hồ bơi', breakfast: 'Bữa sáng',
      kids: 'Tiện ích trẻ em', spa: 'Spa', gym: 'Phòng gym', airport: 'Đưa đón sân bay', kitchen: 'Bếp',
      city: 'Trung tâm / dễ đi bộ', quiet: 'Yên tĩnh & thư giãn', golf: 'Gần sân golf', luxury: 'Resort cao cấp',
      budget: 'Giá trị tốt', firsttime: 'Dễ cho người lần đầu', hoian: 'Hội An', danang: 'Đà Nẵng', hcmc: 'TP. Hồ Chí Minh', nhatrang: 'Nha Trang', phuquoc: 'Phú Quốc', hanoi: 'Hà Nội',
    },
  },
  zh: {
    nav: 'AI 搜索',
    title: '描述你理想的住宿',
    subtitle: '用平实的话告诉 AI 你的需求——我们会推荐最匹配的越南酒店并说明理由。',
    placeholder: '例如：带儿童泳池、含早餐和机场接送的海滨亲子酒店，韩国游客友好',
    button: '推荐酒店',
    thinking: '正在为你寻找最佳匹配…',
    examplesLabel: '试试：',
    examples: [
      '带水疗、安静浪漫的蜜月度假村',
      '带儿童泳池的海滩亲子酒店，韩国游客友好',
      '带厨房、适合远程办公的长住公寓',
      '适合短期商务出行的市中心酒店',
    ],
    understood: '我们理解到的需求',
    genericNote: '多告诉我们一些行程信息即可获得定制推荐。先为你呈现热门酒店。',
    comingSoonNote: '{city} 暂未上线 StayEasy——先为你显示已上线城市的酒店。',
    noMatchTitle: '未找到非常匹配的酒店',
    noMatchText: '换个方式描述行程吧——例如出行风格、区域或设施。',
    matchSuffix: '匹配',
    reasonsLabel: '推荐理由',
    poweredNote: '设备端推荐——在你的浏览器中运行，数据不会离开你的设备。',
    reason: {
      family: '亲子友好', couple: '适合情侣', business: '商务无忧', beach: '临近海滩',
      longstay: '适合长住', korean: '韩国游客友好', pool: '泳池', breakfast: '早餐',
      kids: '儿童设施', spa: '水疗', gym: '健身房', airport: '机场接送', kitchen: '厨房',
      city: '市中心·步行便利', quiet: '安静放松', golf: '邻近高尔夫', luxury: '高档度假村',
      budget: '高性价比', firsttime: '适合初次到访', hoian: '会安', danang: '岘港', hcmc: '胡志明市', nhatrang: '芽庄', phuquoc: '富国岛', hanoi: '河内',
    },
  },
  ja: {
    nav: 'AI検索',
    title: '理想の滞在を教えてください',
    subtitle: 'ご希望を自由な言葉でAIにお伝えください — 最適なベトナムのホテルを理由とともにおすすめします。',
    placeholder: '例：キッズプール・朝食・空港送迎付きのビーチファミリーホテル、韓国人向け',
    button: 'ホテルを提案',
    thinking: '最適なホテルを探しています…',
    examplesLabel: '例：',
    examples: [
      'スパ付きの静かでロマンチックな新婚旅行向けリゾート',
      'キッズプールのあるビーチファミリーホテル、韓国人向け',
      'キッチン付きのロングステイ向けアパート、リモートワーク用',
      '短い出張向けの市内中心ホテル',
    ],
    understood: 'AIが理解した条件',
    genericNote: 'ご旅行について詳しく教えていただくと、ぴったりの提案ができます。まずは人気のホテルをどうぞ。',
    comingSoonNote: '{city}はまだStayEasyにありません — まずは対応中の都市のホテルをどうぞ。',
    noMatchTitle: 'ぴったりのホテルが見つかりませんでした',
    noMatchText: '旅のスタイル、エリア、設備など、別の言い方で説明してみてください。',
    matchSuffix: '一致',
    reasonsLabel: 'おすすめの理由',
    poweredNote: 'デバイス内でのレコメンド — ブラウザ上で動作し、データは外部に送信されません。',
    reason: {
      family: 'ファミリー向け', couple: 'カップルに最適', business: 'ビジネス対応', beach: 'ビーチそば',
      longstay: 'ロングステイ向き', korean: '韓国人向け', pool: 'プール', breakfast: '朝食',
      kids: 'キッズ設備', spa: 'スパ', gym: 'フィットネス', airport: '空港送迎', kitchen: 'キッチン',
      city: '市内中心・徒歩便利', quiet: '静かでくつろげる', golf: 'ゴルフ近く', luxury: '高級リゾート',
      budget: 'コスパ良好', firsttime: '初訪問に便利', hoian: 'ホイアン', danang: 'ダナン', hcmc: 'ホーチミン', nhatrang: 'ニャチャン', phuquoc: 'フーコック', hanoi: 'ハノイ',
    },
  },
}
