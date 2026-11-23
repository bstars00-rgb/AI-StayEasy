import type { Lang } from '../i18n'

/**
 * Traveler subscription plans — PROTOTYPE copy. Three plans sized by how often
 * someone travels (Netflix-style ladder). Deliberately contains no prices or
 * usage numbers: those are set after a pilot, and a test pins that.
 */
export type PlanId = 'getaway' | 'voyager' | 'nomad'
export const PLAN_IDS: PlanId[] = ['getaway', 'voyager', 'nomad']

/**
 * Billing period. The monthly price is highest on the 1-month plan and lower at
 * 6 months and lowest at 1 year; the copy states that ORDER only — no amounts
 * and no discount percentages exist yet (they are set after the pilot).
 */
export type PeriodId = 'monthly' | 'semiannual' | 'annual'
export const PERIOD_IDS: PeriodId[] = ['monthly', 'semiannual', 'annual']

export interface PlanCopy {
  name: string
  kicker: string
  forWho: string
  features: string[]
}

export interface PlansStrings {
  nav: string
  /** Link text on the hotel detail page, next to the member voucher. */
  detailLink: string
  metaTitle: string
  metaDesc: string
  eyebrow: string
  title: string
  subtitle: string
  previewTitle: string
  previewText: string
  explainTitle: string
  explain: { t: string; d: string }[]
  periodTitle: string
  periodNote: string
  periods: Record<PeriodId, { label: string; hint: string }>
  plansTitle: string
  forWho: string
  priceTbd: string
  plans: Record<PlanId, PlanCopy>
  interest: string
  interestDone: string
  /** Button on the other plans once the member already has one. */
  change: string
  interestNote: string
  compareTitle: string
  colFeature: string
  rows: { label: string; values: [string, string, string] }[]
  faqTitle: string
  faq: { q: string; a: string }[]
  endTitle: string
  endText: string
  endBtn: string
}

export const plansStrings: Record<Lang, PlansStrings> = {
  en: {
    nav: 'Plans',
    detailLink: 'See subscription plans',
    metaTitle: 'Subscription plans preview — StayEasy',
    metaDesc: 'A preview of StayEasy’s three subscription plans, Getaway, Voyager and Nomad, built around how often you travel.',
    eyebrow: 'Plans preview',
    title: 'How often do you travel?\nPick the plan that fits.',
    subtitle: 'Joining is free. Finding hotels and going to their official sites stays free. As you travel more, we’re preparing three plans with more tools.',
    previewTitle: 'This is a preview before launch',
    previewText: 'We don’t take payments yet. Prices and usage limits will be set after a pilot, and the features below will open in stages.',
    explainTitle: 'How the plans work',
    explain: [
      { t: 'Joining is free', d: 'Sign up and the member-only vouchers hotels offer are unlocked. Choosing a hotel and going to its official site is free whether or not you subscribe.' },
      { t: 'You pay only for tools', d: 'The fee covers StayEasy tools such as AI recommendations, translated hotel inquiries and shared wishlists. It is not a charge for hotel perks.' },
      { t: 'You book on the hotel’s own site', d: 'Booking and payment always happen on the hotel’s official website. StayEasy takes no fee based on the amount or number of your bookings.' },
    ],
    periodTitle: 'Billing period',
    periodNote: 'Every period has the same features. Only how long you pay for at once changes.',
    periods: {
      monthly: { label: '1 month', hint: 'Highest monthly cost' },
      semiannual: { label: '6 months', hint: 'Lower monthly cost than 1 month' },
      annual: { label: '1 year', hint: 'Lowest monthly cost' },
    },
    plansTitle: 'Three plans',
    forWho: 'Best for',
    priceTbd: 'Price not set · shown after the pilot',
    plans: {
      getaway: {
        name: 'Getaway',
        kicker: 'For occasional trips',
        forWho: 'Travelers who book a hotel now and then and take their time choosing',
        features: ['Everything in free membership', 'AI hotel picks and itineraries (monthly limit)', 'Standard hotel inquiry templates', 'A few wishlists'],
      },
      voyager: {
        name: 'Voyager',
        kicker: 'For frequent trips',
        forWho: 'Travelers who go often, compare many hotels and message them a lot',
        features: ['Everything in Getaway', 'Early notice of new hotel benefits', 'More AI picks and itineraries', 'Translated hotel inquiries, prioritized', 'Unlimited wishlists'],
      },
      nomad: {
        name: 'Nomad',
        kicker: 'For business and constant movers',
        forWho: 'People and teams who travel for work or stay on the move and rebook hotels again and again',
        features: ['Everything in Voyager', 'Voucher expiry reminders and room to keep several', 'Unlimited AI picks and itineraries', 'Save your frequent inquiry phrases', 'Share wishlists with your team'],
      },
    },
    interest: 'Subscribe',
    interestDone: 'Request received',
    change: 'Switch to this plan',
    interestNote: 'Subscribing starts with a free account. For now we only take the request on My page and charge nothing; we’ll explain payment after launch.',
    compareTitle: 'Compare the plans',
    colFeature: 'Feature',
    rows: [
      { label: 'Member-only vouchers', values: ['Same as free membership', 'Early notice of new benefits', 'Expiry reminders, keep several'] },
      { label: 'AI hotel picks and itineraries', values: ['Monthly limit', 'More', 'No limit'] },
      { label: 'Hotel inquiries', values: ['Standard templates', 'Translated, prioritized', 'Save frequent phrases'] },
      { label: 'Wishlists', values: ['A few lists', 'Unlimited', 'Share with your team'] },
    ],
    faqTitle: 'Questions',
    faq: [
      { q: 'Is the fee a booking commission?', a: 'No. Booking and payment happen on the hotel’s official website and StayEasy takes no money from bookings. The fee is for StayEasy’s tools.' },
      { q: 'Will hotel rates be cheaper if I subscribe?', a: 'We don’t promise lower rates. Member-only vouchers from hotels unlock with free sign-up, and which perks exist varies by hotel.' },
      { q: 'Which plan should I pick?', a: 'Start with free membership. If AI picks or inquiry translation start to run short as you search more, move to Getaway or a higher plan.' },
      { q: 'When does it start, and what will it cost?', a: 'We’ll set prices and limits after a pilot. For now we only record interest and take no payment. Before any payment we’ll show the auto-renewal and cancellation terms.' },
      { q: 'What changes between 1 month, 6 months and 1 year?', a: 'The features are the same; only the billing period differs. The monthly cost is highest on the 1-month plan, lower at 6 months and lowest at 1 year. Amounts are set after the pilot, and we’ll show refund and cancellation terms before any payment.' },
    ],
    endTitle: 'Start free first',
    endText: 'Sign up and member-only vouchers unlock.',
    endBtn: 'Join for free',
  },
  ko: {
    nav: '요금제',
    detailLink: '구독 단계 보기',
    metaTitle: '구독 요금제 미리보기 — StayEasy',
    metaDesc: '여행 횟수에 맞춰 고르는 StayEasy 구독 3단계, Getaway·Voyager·Nomad를 미리 소개합니다.',
    eyebrow: '구독 미리보기',
    title: '얼마나 자주 떠나세요?\n그만큼만 고르세요',
    subtitle: '가입은 무료입니다. 호텔을 찾고 공식 사이트로 이동하는 기능은 계속 무료이고, 여행이 잦아질수록 필요한 도구를 3단계로 나눠 준비하고 있습니다.',
    previewTitle: '출시 전 미리보기입니다',
    previewText: '아직 결제를 받지 않습니다. 가격과 이용 횟수는 시범 운영 후에 정하고, 아래 기능도 단계적으로 열립니다.',
    explainTitle: '구독이 어떻게 돌아가나요',
    explain: [
      { t: '가입은 무료', d: '회원으로 가입하면 호텔이 내놓은 회원 전용 바우처가 열립니다. 호텔을 고르고 공식 사이트로 이동하는 기능은 구독과 상관없이 무료입니다.' },
      { t: '유료는 도구에만', d: '구독료는 AI 추천, 호텔 문의 번역, 위시리스트 공유 같은 StayEasy 도구 이용료입니다. 호텔 혜택을 파는 것이 아닙니다.' },
      { t: '예약은 호텔 공식 사이트에서', d: '예약과 결제는 늘 호텔 공식 사이트에서 이뤄집니다. StayEasy는 예약 금액이나 건수에 따라 어떤 수수료도 받지 않습니다.' },
    ],
    periodTitle: '결제 주기',
    periodNote: '어느 주기를 골라도 기능은 같고, 한 번에 결제하는 기간만 달라집니다.',
    periods: {
      monthly: { label: '1개월', hint: '개월당 요금이 가장 높음' },
      semiannual: { label: '6개월', hint: '1개월보다 개월당 요금이 낮음' },
      annual: { label: '1년', hint: '개월당 요금이 가장 낮음' },
    },
    plansTitle: '3단계',
    forWho: '이런 분께',
    priceTbd: '가격 미정 · 시범 운영 후 공개',
    plans: {
      getaway: {
        name: 'Getaway',
        kicker: '가끔 떠나는 분',
        forWho: '호텔을 가끔 예약하고, 그때마다 천천히 고르는 여행자',
        features: ['무료 회원 혜택 전부', 'AI 호텔 추천·일정 (월 이용 횟수 제한)', '호텔 문의 기본 문구', '위시리스트 몇 개'],
      },
      voyager: {
        name: 'Voyager',
        kicker: '자주 떠나는 분',
        forWho: '여행이 잦아서 호텔을 여러 곳 비교하고 자주 문의하는 여행자',
        features: ['Getaway의 모든 기능', '새 호텔 혜택을 먼저 알림', 'AI 호텔 추천·일정 더 많이', '호텔 문의 다국어 번역 우선', '위시리스트 제한 없음'],
      },
      nomad: {
        name: 'Nomad',
        kicker: '출장·이동이 잦은 분',
        forWho: '출장이나 장기 이동이 많아 호텔을 반복해서 예약하는 사람과 팀',
        features: ['Voyager의 모든 기능', '바우처 만료 알림, 여러 개 보관', 'AI 호텔 추천·일정 제한 없음', '자주 쓰는 문의 문구 저장', '위시리스트를 팀·동료와 공유'],
      },
    },
    interest: '구독 신청하기',
    interestDone: '신청 접수됨',
    change: '이 단계로 변경',
    interestNote: '구독은 무료 회원가입부터 시작해요. 지금은 신청만 접수하고 요금은 청구하지 않으며, 결제는 정식 출시 후에 안내해 드려요.',
    compareTitle: '단계별 비교',
    colFeature: '기능',
    rows: [
      { label: '회원 전용 바우처', values: ['무료 회원과 같음', '새 혜택 먼저 알림', '만료 알림, 여러 개 보관'] },
      { label: 'AI 호텔 추천·일정', values: ['월 횟수 제한', '더 많이', '제한 없음'] },
      { label: '호텔 문의', values: ['기본 문구', '다국어 번역 우선', '자주 쓰는 문구 저장'] },
      { label: '위시리스트', values: ['몇 개', '제한 없음', '팀·동료와 공유'] },
    ],
    faqTitle: '자주 묻는 질문',
    faq: [
      { q: '구독료가 호텔 예약 수수료인가요?', a: '아닙니다. 예약과 결제는 호텔 공식 사이트에서 이뤄지고, StayEasy는 예약에서 어떤 돈도 받지 않습니다. 구독료는 StayEasy 도구 이용료입니다.' },
      { q: '구독하면 호텔 요금이 더 싸지나요?', a: '요금이 낮아진다고 약속하지 않습니다. 호텔이 내놓은 회원 전용 바우처는 무료 가입만으로 열리고, 어떤 혜택이 있는지는 호텔마다 다릅니다.' },
      { q: '어떤 단계가 맞는지 모르겠어요', a: '무료 회원으로 먼저 써 보세요. 검색이 늘어 AI 추천이나 문의 번역이 모자라다고 느껴지면 Getaway나 그 위 단계를 고르시면 됩니다.' },
      { q: '언제 시작하고 가격은 얼마인가요?', a: '시범 운영을 거쳐 가격과 이용 횟수를 정합니다. 지금은 관심 등록만 받고 결제는 받지 않습니다. 결제 전에 자동 갱신과 해지 조건을 먼저 보여 드리겠습니다.' },
      { q: '1개월, 6개월, 1년은 무엇이 다른가요?', a: '기능은 같고 결제 주기만 다릅니다. 개월당 요금은 1개월이 가장 높고 6개월, 1년 순으로 낮아집니다. 금액은 시범 운영 후에 정하며, 결제 전에 환불과 해지 조건을 먼저 보여 드리겠습니다.' },
    ],
    endTitle: '먼저 무료로 시작해 보세요',
    endText: '가입하면 회원 전용 바우처가 열립니다.',
    endBtn: '무료로 가입하기',
  },
  ja: {
    nav: 'プラン',
    detailLink: 'プランを見る',
    metaTitle: '購読プランのプレビュー — StayEasy',
    metaDesc: '旅行の頻度に合わせて選ぶStayEasyの3つの購読プラン、Getaway・Voyager・Nomadの紹介です。',
    eyebrow: 'プランのプレビュー',
    title: 'どのくらい旅行しますか?\n頻度に合わせて選べます',
    subtitle: '登録は無料です。ホテルを探して公式サイトへ進む機能はこれからも無料で、旅行が増えるほど必要になるツールを3段階に分けて準備しています。',
    previewTitle: '公開前のプレビューです',
    previewText: 'まだお支払いは受け付けていません。料金と利用回数は試験運用のあとで決め、下の機能も段階的に開放します。',
    explainTitle: '購読のしくみ',
    explain: [
      { t: '登録は無料', d: '会員登録をすると、ホテルが用意した会員限定バウチャーが使えるようになります。ホテルを選んで公式サイトへ進む機能は、購読にかかわらず無料です。' },
      { t: '有料なのはツールだけ', d: '購読料はAIのおすすめ、ホテルへの問い合わせ翻訳、ウィッシュリスト共有といったStayEasyのツールの利用料です。ホテルの特典を売るものではありません。' },
      { t: '予約はホテル公式サイトで', d: '予約と決済は常にホテルの公式サイトで行います。StayEasyは予約の金額や件数に応じた手数料を一切受け取りません。' },
    ],
    periodTitle: 'お支払い期間',
    periodNote: 'どの期間を選んでも機能は同じで、一度に支払う期間だけが変わります。',
    periods: {
      monthly: { label: '1か月', hint: 'ひと月あたりの料金が最も高い' },
      semiannual: { label: '6か月', hint: '1か月よりひと月あたりが安い' },
      annual: { label: '1年', hint: 'ひと月あたりが最も安い' },
    },
    plansTitle: '3つのプラン',
    forWho: 'こんな方に',
    priceTbd: '料金は未定・試験運用後に公開',
    plans: {
      getaway: {
        name: 'Getaway',
        kicker: 'ときどき旅行する方',
        forWho: 'ホテルをときどき予約し、そのたびにじっくり選ぶ旅行者',
        features: ['無料会員の特典すべて', 'AIのホテルおすすめ・旅程(月ごとの回数制限)', 'ホテルへの問い合わせの定型文', 'ウィッシュリストを数件'],
      },
      voyager: {
        name: 'Voyager',
        kicker: 'よく旅行する方',
        forWho: '旅行が多く、複数のホテルを比べて頻繁に問い合わせる旅行者',
        features: ['Getawayのすべての機能', 'ホテルの新しい特典をいち早く通知', 'AIのおすすめ・旅程をより多く', 'ホテルへの問い合わせ翻訳を優先', 'ウィッシュリストは無制限'],
      },
      nomad: {
        name: 'Nomad',
        kicker: '出張や移動が多い方',
        forWho: '出張や長期の移動が多く、ホテルを繰り返し予約する人とチーム',
        features: ['Voyagerのすべての機能', 'バウチャーの期限通知と複数保管', 'AIのおすすめ・旅程は無制限', 'よく使う問い合わせ文を保存', 'ウィッシュリストをチームや同僚と共有'],
      },
    },
    interest: '購読を申し込む',
    interestDone: '申し込み済み',
    change: 'このプランに変更',
    interestNote: '購読は無料の会員登録から始まります。現在は申し込みの受け付けのみで料金は請求せず、お支払いは正式リリース後にご案内します。',
    compareTitle: 'プランの比較',
    colFeature: '機能',
    rows: [
      { label: '会員限定バウチャー', values: ['無料会員と同じ', '新しい特典をいち早く通知', '期限通知・複数保管'] },
      { label: 'AIのホテルおすすめ・旅程', values: ['月の回数制限', 'より多く', '制限なし'] },
      { label: 'ホテルへの問い合わせ', values: ['定型文', '翻訳を優先', 'よく使う文を保存'] },
      { label: 'ウィッシュリスト', values: ['数件', '無制限', 'チームと共有'] },
    ],
    faqTitle: 'よくある質問',
    faq: [
      { q: 'この料金はホテル予約の手数料ですか?', a: 'いいえ。予約と決済はホテルの公式サイトで行われ、StayEasyは予約からお金を受け取りません。料金はStayEasyのツールの利用料です。' },
      { q: '購読するとホテルの料金は安くなりますか?', a: '料金が下がるとはお約束しません。ホテルが用意した会員限定バウチャーは無料登録だけで使え、どんな特典があるかはホテルごとに異なります。' },
      { q: 'どのプランを選べばいいですか?', a: 'まず無料会員でお試しください。検索が増えてAIのおすすめや問い合わせ翻訳が足りなくなったら、Getawayかその上のプランをお選びください。' },
      { q: 'いつ始まり、料金はいくらですか?', a: '試験運用を経て料金と利用回数を決めます。今は関心の登録だけを受け付けており、お支払いはありません。お支払い前に自動更新と解約の条件を先にお見せします。' },
      { q: '1か月・6か月・1年は何が違いますか?', a: '機能は同じで、お支払い期間だけが異なります。ひと月あたりの料金は1か月が最も高く、6か月、1年の順に安くなります。金額は試験運用後に決め、お支払い前に返金と解約の条件を先にお見せします。' },
    ],
    endTitle: 'まずは無料で始めましょう',
    endText: '登録すると会員限定バウチャーが使えます。',
    endBtn: '無料で登録する',
  },
  vi: {
    nav: 'Gói đăng ký',
    detailLink: 'Xem các gói đăng ký',
    metaTitle: 'Xem trước các gói đăng ký — StayEasy',
    metaDesc: 'Giới thiệu trước ba gói đăng ký của StayEasy — Getaway, Voyager và Nomad — chọn theo mức độ bạn đi du lịch.',
    eyebrow: 'Xem trước gói đăng ký',
    title: 'Bạn đi du lịch thường xuyên đến đâu?\nChọn gói vừa với bạn',
    subtitle: 'Đăng ký thành viên là miễn phí. Tìm khách sạn và chuyển tới trang chính thức vẫn miễn phí. Khi bạn đi nhiều hơn, chúng tôi đang chuẩn bị ba gói với nhiều công cụ hơn.',
    previewTitle: 'Đây là bản xem trước trước khi ra mắt',
    previewText: 'Chúng tôi chưa nhận thanh toán. Giá và giới hạn sử dụng sẽ được định sau giai đoạn thử nghiệm, và các tính năng bên dưới sẽ mở dần theo từng giai đoạn.',
    explainTitle: 'Các gói hoạt động thế nào',
    explain: [
      { t: 'Đăng ký thành viên miễn phí', d: 'Đăng ký xong, bạn mở được các voucher dành riêng cho thành viên do khách sạn cung cấp. Chọn khách sạn và chuyển tới trang chính thức luôn miễn phí, dù bạn có đăng ký gói hay không.' },
      { t: 'Chỉ trả tiền cho công cụ', d: 'Phí gói là phí dùng các công cụ của StayEasy như gợi ý AI, dịch tin nhắn gửi khách sạn và chia sẻ danh sách yêu thích. Đó không phải khoản thu cho ưu đãi của khách sạn.' },
      { t: 'Đặt phòng trên trang chính thức của khách sạn', d: 'Việc đặt phòng và thanh toán luôn diễn ra trên website chính thức của khách sạn. StayEasy không thu khoản phí nào dựa trên giá trị hay số lượng đặt phòng của bạn.' },
    ],
    periodTitle: 'Chu kỳ thanh toán',
    periodNote: 'Chọn chu kỳ nào thì tính năng cũng như nhau, chỉ khác khoảng thời gian thanh toán một lần.',
    periods: {
      monthly: { label: '1 tháng', hint: 'Giá mỗi tháng cao nhất' },
      semiannual: { label: '6 tháng', hint: 'Giá mỗi tháng thấp hơn gói 1 tháng' },
      annual: { label: '1 năm', hint: 'Giá mỗi tháng thấp nhất' },
    },
    plansTitle: 'Ba gói',
    forWho: 'Phù hợp với',
    priceTbd: 'Chưa có giá · công bố sau thử nghiệm',
    plans: {
      getaway: {
        name: 'Getaway',
        kicker: 'Thỉnh thoảng đi',
        forWho: 'Du khách thỉnh thoảng đặt khách sạn và thong thả chọn mỗi lần',
        features: ['Mọi quyền lợi của thành viên miễn phí', 'Gợi ý khách sạn và lịch trình bằng AI (giới hạn theo tháng)', 'Mẫu tin nhắn cơ bản gửi khách sạn', 'Một vài danh sách yêu thích'],
      },
      voyager: {
        name: 'Voyager',
        kicker: 'Đi thường xuyên',
        forWho: 'Du khách đi nhiều, so sánh nhiều khách sạn và hay liên hệ với khách sạn',
        features: ['Mọi tính năng của Getaway', 'Được báo sớm về ưu đãi mới của khách sạn', 'Nhiều gợi ý và lịch trình AI hơn', 'Dịch tin nhắn gửi khách sạn, ưu tiên xử lý', 'Danh sách yêu thích không giới hạn'],
      },
      nomad: {
        name: 'Nomad',
        kicker: 'Công tác và di chuyển liên tục',
        forWho: 'Người và nhóm hay đi công tác hoặc di chuyển dài ngày, đặt lại khách sạn nhiều lần',
        features: ['Mọi tính năng của Voyager', 'Nhắc voucher sắp hết hạn, lưu được nhiều voucher', 'Gợi ý và lịch trình AI không giới hạn', 'Lưu các câu hay dùng khi hỏi khách sạn', 'Chia sẻ danh sách yêu thích với nhóm, đồng nghiệp'],
      },
    },
    interest: 'Đăng ký gói',
    interestDone: 'Đã nhận yêu cầu',
    change: 'Chuyển sang gói này',
    interestNote: 'Đăng ký gói bắt đầu bằng tài khoản miễn phí. Hiện chỉ nhận yêu cầu và không thu phí; chúng tôi sẽ hướng dẫn thanh toán sau khi chính thức ra mắt.',
    compareTitle: 'So sánh các gói',
    colFeature: 'Tính năng',
    rows: [
      { label: 'Voucher dành riêng cho thành viên', values: ['Như thành viên miễn phí', 'Báo sớm ưu đãi mới', 'Nhắc hết hạn, lưu nhiều voucher'] },
      { label: 'Gợi ý khách sạn và lịch trình AI', values: ['Giới hạn theo tháng', 'Nhiều hơn', 'Không giới hạn'] },
      { label: 'Liên hệ khách sạn', values: ['Mẫu cơ bản', 'Dịch, ưu tiên', 'Lưu câu hay dùng'] },
      { label: 'Danh sách yêu thích', values: ['Vài danh sách', 'Không giới hạn', 'Chia sẻ với nhóm'] },
    ],
    faqTitle: 'Câu hỏi thường gặp',
    faq: [
      { q: 'Phí gói có phải hoa hồng đặt phòng không?', a: 'Không. Đặt phòng và thanh toán diễn ra trên website chính thức của khách sạn, StayEasy không thu tiền từ việc đặt phòng. Phí gói là phí dùng công cụ của StayEasy.' },
      { q: 'Đăng ký gói thì giá phòng có rẻ hơn không?', a: 'Chúng tôi không cam kết giá thấp hơn. Voucher dành riêng cho thành viên của khách sạn mở được chỉ với đăng ký miễn phí, và ưu đãi nào có thì tùy từng khách sạn.' },
      { q: 'Tôi nên chọn gói nào?', a: 'Hãy bắt đầu với thành viên miễn phí. Khi bạn tìm kiếm nhiều hơn và thấy gợi ý AI hoặc dịch tin nhắn không đủ dùng, hãy chọn Getaway hoặc gói cao hơn.' },
      { q: 'Khi nào bắt đầu và giá bao nhiêu?', a: 'Chúng tôi sẽ định giá và giới hạn sau giai đoạn thử nghiệm. Hiện chỉ ghi nhận sự quan tâm và không nhận thanh toán. Trước khi thanh toán, chúng tôi sẽ nêu rõ điều kiện tự động gia hạn và hủy gói.' },
      { q: '1 tháng, 6 tháng và 1 năm khác nhau thế nào?', a: 'Tính năng giống nhau, chỉ khác chu kỳ thanh toán. Giá mỗi tháng cao nhất ở gói 1 tháng, thấp dần ở 6 tháng và thấp nhất ở 1 năm. Số tiền sẽ được định sau giai đoạn thử nghiệm, và chúng tôi sẽ nêu rõ điều kiện hoàn tiền và hủy gói trước khi thanh toán.' },
    ],
    endTitle: 'Hãy bắt đầu miễn phí',
    endText: 'Đăng ký xong, voucher dành riêng cho thành viên sẽ mở.',
    endBtn: 'Đăng ký miễn phí',
  },
  zh: {
    nav: '订阅方案',
    detailLink: '查看订阅方案',
    metaTitle: '订阅方案预览 — StayEasy',
    metaDesc: '预览StayEasy按出行频率划分的三档订阅方案：Getaway、Voyager、Nomad。',
    eyebrow: '方案预览',
    title: '您多久出行一次？\n选择适合自己的方案',
    subtitle: '注册免费。查找酒店并前往官网的功能依旧免费。随着出行变多，我们正准备三档提供更多工具的方案。',
    previewTitle: '这是上线前的预览',
    previewText: '目前不收取任何款项。价格与使用次数将在试运行后确定，下列功能也会分阶段开放。',
    explainTitle: '订阅是怎么运作的',
    explain: [
      { t: '注册免费', d: '注册成为会员后，即可使用酒店提供的会员专属优惠券。挑选酒店并前往官网的功能，无论是否订阅都免费。' },
      { t: '只为工具付费', d: '订阅费是StayEasy工具的使用费，例如AI推荐、酒店咨询翻译和心愿单共享，并不是出售酒店的优惠。' },
      { t: '预订在酒店官网完成', d: '预订与付款始终在酒店官网进行。StayEasy不按您的预订金额或次数收取任何费用。' },
    ],
    periodTitle: '付费周期',
    periodNote: '无论选择哪个周期，功能都相同，只是一次付费的时长不同。',
    periods: {
      monthly: { label: '1个月', hint: '每月费用最高' },
      semiannual: { label: '6个月', hint: '每月费用低于1个月' },
      annual: { label: '1年', hint: '每月费用最低' },
    },
    plansTitle: '三档方案',
    forWho: '适合',
    priceTbd: '价格未定 · 试运行后公布',
    plans: {
      getaway: {
        name: 'Getaway',
        kicker: '偶尔出行',
        forWho: '偶尔订酒店、每次都愿意慢慢挑选的旅行者',
        features: ['免费会员的全部权益', 'AI酒店推荐与行程(每月次数有限)', '酒店咨询的基础模板', '少量心愿单'],
      },
      voyager: {
        name: 'Voyager',
        kicker: '经常出行',
        forWho: '出行频繁、会比较多家酒店并常常联系酒店的旅行者',
        features: ['包含Getaway的全部功能', '酒店新优惠优先通知', '更多AI推荐与行程', '酒店咨询翻译优先处理', '心愿单不限数量'],
      },
      nomad: {
        name: 'Nomad',
        kicker: '出差、频繁移动',
        forWho: '经常出差或长期在外、需要反复订酒店的个人与团队',
        features: ['包含Voyager的全部功能', '优惠券到期提醒，可保存多张', 'AI推荐与行程不限次数', '保存常用咨询话术', '心愿单与团队、同事共享'],
      },
    },
    interest: '申请订阅',
    interestDone: '已申请',
    change: '改为此方案',
    interestNote: '订阅从免费注册开始。目前只受理申请、不收取费用，付款方式将在正式上线后说明。',
    compareTitle: '方案对比',
    colFeature: '功能',
    rows: [
      { label: '会员专属优惠券', values: ['与免费会员相同', '新优惠优先通知', '到期提醒，可保存多张'] },
      { label: 'AI酒店推荐与行程', values: ['每月次数有限', '更多', '不限次数'] },
      { label: '酒店咨询', values: ['基础模板', '翻译优先处理', '保存常用话术'] },
      { label: '心愿单', values: ['少量', '不限数量', '与团队共享'] },
    ],
    faqTitle: '常见问题',
    faq: [
      { q: '订阅费是酒店预订的佣金吗？', a: '不是。预订与付款在酒店官网完成，StayEasy不从预订中收取任何款项。订阅费是StayEasy工具的使用费。' },
      { q: '订阅后酒店房价会更便宜吗？', a: '我们不承诺房价更低。酒店提供的会员专属优惠券注册免费即可使用，具体有哪些优惠因酒店而异。' },
      { q: '我该选哪一档？', a: '先从免费会员开始。当搜索变多、AI推荐或咨询翻译不够用时，再选Getaway或更高的方案。' },
      { q: '什么时候开始，价格是多少？', a: '我们会在试运行后确定价格和使用次数。目前只登记意向，不收款。付款之前，我们会先说明自动续费与取消的条款。' },
      { q: '1个月、6个月和1年有什么区别？', a: '功能相同，只是付费周期不同。每月费用以1个月最高，6个月更低，1年最低。具体金额将在试运行后确定，付款前我们会先说明退款与取消条款。' },
    ],
    endTitle: '先免费开始',
    endText: '注册后即可使用会员专属优惠券。',
    endBtn: '免费注册',
  },
}
