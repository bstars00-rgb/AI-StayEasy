import type { Lang } from '../i18n'
import type { CompletenessKey, InsightKey } from './partnerInsights'

/**
 * Strings for the partner-portal Insights panel (benchmark + completeness +
 * action cards). Kept in its own file so the large partnerI18n.ts is untouched.
 * Rule/benchmark templates interpolate {you} {peer} {n} {city} {country} {star}.
 */
export interface InsightStrings {
  title: string
  subtitle: string
  // Benchmark
  benchTitle: string
  basisCityStar: string // "vs {n} other {star}★ hotels in {city}"
  basisCity: string     // "vs {n} other hotels in {city}"
  basisCountry: string  // "vs {n} hotels in {country}"
  you: string
  peers: string
  convLabel: string
  viewsLabel: string
  above: string
  onpar: string
  below: string
  // Completeness
  compTitle: string
  compPct: string       // "{n}% complete"
  compAllDone: string
  toFinish: string      // "To finish"
  fix: string           // link label
  items: Record<CompletenessKey, string>
  // Action cards
  rules: Record<InsightKey, string>
}

const en: InsightStrings = {
  title: 'Insights & recommendations',
  subtitle: 'What the numbers mean — and what to do next.',
  benchTitle: 'How you compare',
  basisCityStar: 'vs {n} other {star}★ hotels in {city}',
  basisCity: 'vs {n} other hotels in {city}',
  basisCountry: 'vs {n} hotels in {country}',
  you: 'You',
  peers: 'Peers',
  convLabel: 'Booking-click rate',
  viewsLabel: 'Avg views (30d)',
  above: 'Above peers',
  onpar: 'On par with peers',
  below: 'Below peers',
  compTitle: 'Listing completeness',
  compPct: '{n}% complete',
  compAllDone: 'Your listing is fully complete — nice work.',
  toFinish: 'To finish',
  fix: 'Complete listing →',
  items: {
    photo: 'Main photo',
    gallery: 'Photo gallery (3+)',
    description: 'Description',
    positioning: 'One-line positioning',
    benefits: 'Official-booking benefits',
    facilities: 'Facilities',
    tags: 'Travel-style tags',
    bestFor: 'Best-for audience',
    roomGuide: 'Room guide',
    locationGuide: 'Location guide',
    contact: 'Contact channel',
    website: 'Official website',
  },
  rules: {
    highConv: 'Your {you}% booking-click rate beats the peer average of {peer}%. Keep the official-benefit block near the top.',
    lowConv: 'Your {you}% booking-click rate trails the peer average of {peer}%. Move your official-booking benefit above the fold and cut friction.',
    mobileHeavy: '{n}% of visitors are on mobile — open your official site on a phone and confirm the booking button is one tap away.',
    koreanAudience: '{n}% of your audience browses in Korean. Add Korean descriptions and a Korean contact channel to convert them.',
    strongOrganic: '{n}% of traffic is organic search — your content is ranking. Keep the description keyword-rich and current.',
    completeListing: 'Your listing is {n}% complete. Finishing it lifts search ranking and traveler trust.',
    viewsUp: 'Views are up {n}% vs the previous period. Ride it — refresh your photos and headline benefit.',
    viewsDown: 'Views dropped {n}% vs the previous period. Check seasonality and refresh your headline benefit.',
    addBenefits: 'Add at least two official-booking benefits (e.g. free breakfast, late checkout). It is the top reason travelers book direct.',
    allGood: 'Everything looks healthy — strong completeness, on-par conversion, steady traffic. Keep your benefits current.',
  },
}

const ko: InsightStrings = {
  title: '인사이트 & 추천',
  subtitle: '숫자의 의미와, 다음에 할 일.',
  benchTitle: '동종 대비 위치',
  basisCityStar: '{city} {star}성 호텔 {n}곳 대비',
  basisCity: '{city} 호텔 {n}곳 대비',
  basisCountry: '{country} 호텔 {n}곳 대비',
  you: '귀사',
  peers: '동종 평균',
  convLabel: '예약 클릭률',
  viewsLabel: '평균 조회수 (30일)',
  above: '동종 대비 우수',
  onpar: '동종과 비슷',
  below: '동종 대비 미흡',
  compTitle: '리스팅 완성도',
  compPct: '{n}% 완성',
  compAllDone: '리스팅이 완벽히 채워졌습니다 — 훌륭합니다.',
  toFinish: '남은 항목',
  fix: '리스팅 완성하기 →',
  items: {
    photo: '대표 사진',
    gallery: '사진 갤러리 (3장+)',
    description: '소개 문구',
    positioning: '한 줄 포지셔닝',
    benefits: '공식 예약 혜택',
    facilities: '편의시설',
    tags: '여행 스타일 태그',
    bestFor: '추천 대상',
    roomGuide: '객실 가이드',
    locationGuide: '위치 가이드',
    contact: '연락 채널',
    website: '공식 웹사이트',
  },
  rules: {
    highConv: '예약 클릭률 {you}%로 동종 평균 {peer}%를 앞섭니다. 공식 혜택 블록을 상단에 유지하세요.',
    lowConv: '예약 클릭률 {you}%로 동종 평균 {peer}%에 못 미칩니다. 공식 예약 혜택을 첫 화면 위로 올리고 예약 단계를 줄이세요.',
    mobileHeavy: '방문자의 {n}%가 모바일입니다 — 휴대폰에서 공식 사이트를 열어 예약 버튼이 한 번에 눌리는지 확인하세요.',
    koreanAudience: '방문자의 {n}%가 한국어로 봅니다. 한국어 설명과 한국어 연락 채널을 추가해 전환을 높이세요.',
    strongOrganic: '트래픽의 {n}%가 자연 검색입니다 — 콘텐츠가 상위 노출되고 있어요. 설명을 키워드 중심으로 최신 유지하세요.',
    completeListing: '리스팅이 {n}% 완성입니다. 마저 채우면 검색 노출과 여행자 신뢰가 올라갑니다.',
    viewsUp: '조회수가 이전 기간 대비 {n}% 증가했습니다. 이 흐름을 살려 사진과 대표 혜택을 새로 고치세요.',
    viewsDown: '조회수가 이전 기간 대비 {n}% 감소했습니다. 시즌성을 점검하고 대표 혜택을 새로 고치세요.',
    addBenefits: '공식 예약 혜택을 최소 2개 이상 넣으세요(예: 조식 무료, 레이트 체크아웃). 직접 예약의 가장 큰 이유입니다.',
    allGood: '전반적으로 건강합니다 — 높은 완성도, 무난한 전환, 안정적 트래픽. 혜택만 최신으로 유지하세요.',
  },
}

const vi: InsightStrings = {
  title: 'Phân tích & đề xuất',
  subtitle: 'Các con số nói lên điều gì — và việc cần làm tiếp theo.',
  benchTitle: 'So với đối thủ',
  basisCityStar: 'so với {n} khách sạn {star}★ khác ở {city}',
  basisCity: 'so với {n} khách sạn khác ở {city}',
  basisCountry: 'so với {n} khách sạn ở {country}',
  you: 'Bạn',
  peers: 'Trung bình',
  convLabel: 'Tỷ lệ nhấp đặt phòng',
  viewsLabel: 'Lượt xem TB (30 ngày)',
  above: 'Cao hơn đối thủ',
  onpar: 'Ngang đối thủ',
  below: 'Thấp hơn đối thủ',
  compTitle: 'Mức độ hoàn thiện hồ sơ',
  compPct: 'Hoàn thiện {n}%',
  compAllDone: 'Hồ sơ đã hoàn thiện đầy đủ — tuyệt vời.',
  toFinish: 'Còn thiếu',
  fix: 'Hoàn thiện hồ sơ →',
  items: {
    photo: 'Ảnh chính',
    gallery: 'Thư viện ảnh (3+)',
    description: 'Mô tả',
    positioning: 'Định vị một dòng',
    benefits: 'Ưu đãi đặt trực tiếp',
    facilities: 'Tiện nghi',
    tags: 'Thẻ phong cách du lịch',
    bestFor: 'Đối tượng phù hợp',
    roomGuide: 'Hướng dẫn phòng',
    locationGuide: 'Hướng dẫn vị trí',
    contact: 'Kênh liên hệ',
    website: 'Website chính thức',
  },
  rules: {
    highConv: 'Tỷ lệ nhấp đặt phòng {you}% của bạn vượt mức trung bình {peer}%. Giữ khối ưu đãi chính thức ở phía trên.',
    lowConv: 'Tỷ lệ nhấp đặt phòng {you}% của bạn thấp hơn mức trung bình {peer}%. Đưa ưu đãi đặt trực tiếp lên đầu trang và giảm bước đặt.',
    mobileHeavy: '{n}% khách truy cập bằng điện thoại — hãy mở website chính thức trên điện thoại và kiểm tra nút đặt phòng chỉ cách một chạm.',
    koreanAudience: '{n}% khách xem bằng tiếng Hàn. Thêm mô tả tiếng Hàn và kênh liên hệ tiếng Hàn để tăng chuyển đổi.',
    strongOrganic: '{n}% lưu lượng đến từ tìm kiếm tự nhiên — nội dung của bạn đang lên hạng. Giữ mô tả giàu từ khóa và cập nhật.',
    completeListing: 'Hồ sơ của bạn hoàn thiện {n}%. Hoàn tất giúp tăng thứ hạng tìm kiếm và niềm tin của khách.',
    viewsUp: 'Lượt xem tăng {n}% so với kỳ trước. Tận dụng — làm mới ảnh và ưu đãi nổi bật.',
    viewsDown: 'Lượt xem giảm {n}% so với kỳ trước. Kiểm tra tính mùa vụ và làm mới ưu đãi nổi bật.',
    addBenefits: 'Thêm ít nhất hai ưu đãi đặt trực tiếp (ví dụ: bữa sáng miễn phí, trả phòng muộn). Đây là lý do hàng đầu khiến khách đặt trực tiếp.',
    allGood: 'Mọi thứ đều ổn — hồ sơ đầy đủ, chuyển đổi ngang bằng, lưu lượng ổn định. Chỉ cần giữ ưu đãi luôn mới.',
  },
}

const zh: InsightStrings = {
  title: '洞察与建议',
  subtitle: '数据意味着什么——以及接下来该做什么。',
  benchTitle: '同行对比',
  basisCityStar: '对比 {city} 其他 {n} 家 {star}★ 酒店',
  basisCity: '对比 {city} 其他 {n} 家酒店',
  basisCountry: '对比 {country} 的 {n} 家酒店',
  you: '贵店',
  peers: '同行平均',
  convLabel: '预订点击率',
  viewsLabel: '平均浏览量（30天）',
  above: '高于同行',
  onpar: '与同行持平',
  below: '低于同行',
  compTitle: '资料完整度',
  compPct: '完成 {n}%',
  compAllDone: '资料已完全填写——做得好。',
  toFinish: '待完成',
  fix: '完善资料 →',
  items: {
    photo: '主图',
    gallery: '图库（3张以上）',
    description: '简介',
    positioning: '一句话定位',
    benefits: '官方预订礼遇',
    facilities: '设施',
    tags: '旅行风格标签',
    bestFor: '适合人群',
    roomGuide: '房型指南',
    locationGuide: '位置指南',
    contact: '联系渠道',
    website: '官方网站',
  },
  rules: {
    highConv: '贵店 {you}% 的预订点击率高于同行平均 {peer}%。请将官方礼遇模块保持在页面上方。',
    lowConv: '贵店 {you}% 的预订点击率低于同行平均 {peer}%。请把官方预订礼遇移到首屏并减少预订步骤。',
    mobileHeavy: '{n}% 的访客使用手机——请在手机上打开官网，确认预订按钮一触即达。',
    koreanAudience: '{n}% 的访客以韩语浏览。请添加韩语简介和韩语联系渠道以提升转化。',
    strongOrganic: '{n}% 的流量来自自然搜索——你的内容排名良好。请保持简介关键词丰富且及时更新。',
    completeListing: '你的资料完成度为 {n}%。补全后可提升搜索排名和旅客信任。',
    viewsUp: '浏览量较上期上升 {n}%。趁势更新照片和主打礼遇。',
    viewsDown: '浏览量较上期下降 {n}%。请检查季节性并更新主打礼遇。',
    addBenefits: '请至少添加两项官方预订礼遇（如免费早餐、延迟退房）。这是旅客选择直接预订的首要原因。',
    allGood: '一切良好——资料完整、转化持平、流量稳定。保持礼遇更新即可。',
  },
}

const ja: InsightStrings = {
  title: 'インサイトと提案',
  subtitle: '数字の意味と、次にやるべきこと。',
  benchTitle: '同業との比較',
  basisCityStar: '{city}の他の{star}★ホテル{n}軒と比較',
  basisCity: '{city}の他のホテル{n}軒と比較',
  basisCountry: '{country}のホテル{n}軒と比較',
  you: '貴施設',
  peers: '同業平均',
  convLabel: '予約クリック率',
  viewsLabel: '平均閲覧数（30日）',
  above: '同業より上',
  onpar: '同業と同程度',
  below: '同業より下',
  compTitle: '掲載情報の充実度',
  compPct: '{n}% 完成',
  compAllDone: '掲載情報は完全に揃っています — 素晴らしいです。',
  toFinish: '未完了',
  fix: '掲載情報を仕上げる →',
  items: {
    photo: 'メイン写真',
    gallery: '写真ギャラリー（3枚以上）',
    description: '紹介文',
    positioning: '一言ポジショニング',
    benefits: '公式予約特典',
    facilities: '設備',
    tags: '旅行スタイルタグ',
    bestFor: 'おすすめ客層',
    roomGuide: '客室ガイド',
    locationGuide: '立地ガイド',
    contact: '連絡チャネル',
    website: '公式サイト',
  },
  rules: {
    highConv: '予約クリック率{you}%は同業平均{peer}%を上回っています。公式特典ブロックを上部に維持しましょう。',
    lowConv: '予約クリック率{you}%は同業平均{peer}%を下回っています。公式予約特典を最初の画面上部に移し、予約の手間を減らしましょう。',
    mobileHeavy: '訪問者の{n}%がモバイルです — スマホで公式サイトを開き、予約ボタンがワンタップで押せるか確認しましょう。',
    koreanAudience: '訪問者の{n}%が韓国語で閲覧しています。韓国語の紹介文と韓国語の連絡チャネルを追加して転換を高めましょう。',
    strongOrganic: 'トラフィックの{n}%が自然検索です — コンテンツが上位表示されています。紹介文をキーワード豊富に最新へ保ちましょう。',
    completeListing: '掲載情報は{n}%完成です。仕上げると検索順位と旅行者の信頼が上がります。',
    viewsUp: '閲覧数が前期比{n}%増加しました。この波に乗り、写真と目玉特典を更新しましょう。',
    viewsDown: '閲覧数が前期比{n}%減少しました。季節要因を確認し、目玉特典を更新しましょう。',
    addBenefits: '公式予約特典を最低2つ追加しましょう（例：朝食無料、レイトチェックアウト）。旅行者が直接予約する最大の理由です。',
    allGood: '全体的に良好です — 高い充実度、同程度の転換、安定したトラフィック。特典を最新に保つだけでOKです。',
  },
}

export const insightStrings: Record<Lang, InsightStrings> = { en, ko, vi, zh, ja }
