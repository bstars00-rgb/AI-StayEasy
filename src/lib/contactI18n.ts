import type { Lang } from '../i18n'

export interface ContactStrings {
  button: string
  title: string
  subtitle: string
  recommended: string
  chatNote: string
  phoneNote: string
  website: string
  email: string
  phone: string
  noChannels: string
  disclaimer: string
}

export const contactStrings: Record<Lang, ContactStrings> = {
  en: {
    button: 'Contact this hotel',
    title: 'Contact this hotel',
    subtitle: 'Message the hotel directly on the channel it uses.',
    recommended: 'Chat apps are easiest — you can translate as you go.',
    chatNote: 'Chat links are the channels each hotel published on its official site. If one doesn’t connect, use email or the website.',
    phoneNote: 'Calling may be hard across languages — a chat app is easier.',
    website: 'Official website',
    email: 'Email',
    phone: 'Call',
    noChannels: 'This hotel hasn’t added a direct channel yet — use its official website.',
    disclaimer: 'StayEasy doesn’t process bookings or host the chat — you contact the hotel directly.',
  },
  ko: {
    button: '호텔에 연락하기',
    title: '호텔에 연락하기',
    subtitle: '호텔이 사용하는 채널로 바로 연락하세요.',
    recommended: '채팅 앱이 가장 편해요 — 번역하며 대화할 수 있어요.',
    chatNote: '채팅 링크는 각 호텔이 공식 사이트에 게시한 채널이에요. 연결이 안 되면 이메일이나 웹사이트를 이용하세요.',
    phoneNote: '전화는 언어 때문에 어려울 수 있어요 — 채팅 앱이 더 쉬워요.',
    website: '공식 웹사이트',
    email: '이메일',
    phone: '전화',
    noChannels: '아직 직접 채널이 등록되지 않았어요 — 공식 웹사이트를 이용하세요.',
    disclaimer: 'StayEasy는 예약을 처리하거나 대화를 중개하지 않아요 — 호텔에 직접 연락하는 방식이에요.',
  },
  vi: {
    button: 'Liên hệ khách sạn',
    title: 'Liên hệ khách sạn',
    subtitle: 'Nhắn tin trực tiếp cho khách sạn qua kênh họ sử dụng.',
    recommended: 'Ứng dụng chat là tiện nhất — bạn có thể dịch khi trò chuyện.',
    chatNote: 'Liên kết chat là kênh mỗi khách sạn công bố trên trang chính thức. Nếu không kết nối được, hãy dùng email hoặc website.',
    phoneNote: 'Gọi điện có thể khó vì ngôn ngữ — ứng dụng chat dễ hơn.',
    website: 'Website chính thức',
    email: 'Email',
    phone: 'Gọi',
    noChannels: 'Khách sạn chưa thêm kênh trực tiếp — hãy dùng website chính thức.',
    disclaimer: 'StayEasy không xử lý đặt phòng hay làm trung gian trò chuyện — bạn liên hệ trực tiếp với khách sạn.',
  },
  zh: {
    button: '联系酒店',
    title: '联系酒店',
    subtitle: '通过酒店使用的渠道直接联系。',
    recommended: '聊天软件最方便——可以边聊边翻译。',
    chatNote: '聊天链接是各酒店在官网公布的渠道。如无法连接，请使用邮箱或官网。',
    phoneNote: '打电话可能有语言障碍——聊天软件更方便。',
    website: '官方网站',
    email: '邮件',
    phone: '致电',
    noChannels: '该酒店尚未添加直接渠道——请使用其官方网站。',
    disclaimer: 'StayEasy 不处理预订，也不代收消息——您直接联系酒店。',
  },
  ja: {
    button: 'ホテルに連絡',
    title: 'ホテルに連絡',
    subtitle: 'ホテルが使用するチャネルで直接連絡できます。',
    recommended: 'チャットアプリが一番簡単 — 翻訳しながらやり取りできます。',
    chatNote: 'チャットリンクは各ホテルが公式サイトに掲載したチャネルです。つながらない場合はメールや公式サイトをご利用ください。',
    phoneNote: '電話は言語が難しいことも — チャットアプリの方が簡単です。',
    website: '公式サイト',
    email: 'メール',
    phone: '電話',
    noChannels: 'このホテルはまだ直接チャネルを登録していません — 公式サイトをご利用ください。',
    disclaimer: 'StayEasyは予約処理やチャット仲介を行いません — ホテルに直接ご連絡ください。',
  },
}
