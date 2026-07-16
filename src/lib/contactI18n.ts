import type { Lang } from '../i18n'

export interface ContactStrings {
  button: string
  title: string
  subtitle: string
  previewLabel: string
  copy: string
  copied: string
  recommended: string
  chatNote: string
  phoneNote: string
  website: string
  email: string
  phone: string
  noChannels: string
}

export const contactStrings: Record<Lang, ContactStrings> = {
  en: {
    button: 'Contact this hotel',
    title: 'Contact this hotel',
    subtitle: 'Reach the hotel on the channel it prefers. Pick requests and we’ll write them in the hotel’s language.',
    previewLabel: 'Your message (in the hotel’s language)',
    copy: 'Copy',
    copied: 'Copied!',
    recommended: 'Chat apps are easiest — you can translate as you go.',
    chatNote: 'Chat links are the channels each hotel published on its official site. If one doesn’t connect, use email or the website.',
    phoneNote: 'Calling may be hard across languages — a chat app is easier.',
    website: 'Official website',
    email: 'Email',
    phone: 'Call',
    noChannels: 'This hotel hasn’t added a direct channel yet — use its official website.',
  },
  ko: {
    button: '호텔에 연락하기',
    title: '호텔에 연락하기',
    subtitle: '호텔이 선호하는 채널로 바로 연락하세요. 요청을 고르면 호텔 언어로 메시지를 만들어 드려요.',
    previewLabel: '내 메시지 (호텔 언어로)',
    copy: '복사',
    copied: '복사됨!',
    recommended: '채팅 앱이 가장 편해요 — 번역하며 대화할 수 있어요.',
    chatNote: '채팅 링크는 각 호텔이 공식 사이트에 게시한 채널이에요. 연결이 안 되면 이메일이나 웹사이트를 이용하세요.',
    phoneNote: '전화는 언어 때문에 어려울 수 있어요 — 채팅 앱이 더 쉬워요.',
    website: '공식 웹사이트',
    email: '이메일',
    phone: '전화',
    noChannels: '아직 직접 채널이 등록되지 않았어요 — 공식 웹사이트를 이용하세요.',
  },
  vi: {
    button: 'Liên hệ khách sạn',
    title: 'Liên hệ khách sạn',
    subtitle: 'Liên hệ khách sạn qua kênh họ ưa thích. Chọn yêu cầu và chúng tôi viết bằng ngôn ngữ của khách sạn.',
    previewLabel: 'Tin nhắn của bạn (bằng ngôn ngữ khách sạn)',
    copy: 'Sao chép',
    copied: 'Đã sao chép!',
    recommended: 'Ứng dụng chat là tiện nhất — bạn có thể dịch khi trò chuyện.',
    chatNote: 'Liên kết chat là kênh mỗi khách sạn công bố trên trang chính thức. Nếu không kết nối được, hãy dùng email hoặc website.',
    phoneNote: 'Gọi điện có thể khó vì ngôn ngữ — ứng dụng chat dễ hơn.',
    website: 'Website chính thức',
    email: 'Email',
    phone: 'Gọi',
    noChannels: 'Khách sạn chưa thêm kênh trực tiếp — hãy dùng website chính thức.',
  },
  zh: {
    button: '联系酒店',
    title: '联系酒店',
    subtitle: '通过酒店偏好的渠道直接联系。选择请求，我们会用酒店的语言为您撰写。',
    previewLabel: '您的留言（酒店语言）',
    copy: '复制',
    copied: '已复制！',
    recommended: '聊天软件最方便——可以边聊边翻译。',
    chatNote: '聊天链接是各酒店在官网公布的渠道。如无法连接，请使用邮箱或官网。',
    phoneNote: '打电话可能有语言障碍——聊天软件更方便。',
    website: '官方网站',
    email: '邮件',
    phone: '致电',
    noChannels: '该酒店尚未添加直接渠道——请使用其官方网站。',
  },
  ja: {
    button: 'ホテルに連絡',
    title: 'ホテルに連絡',
    subtitle: 'ホテルが希望するチャネルで直接連絡できます。要望を選ぶとホテルの言語で文面を作成します。',
    previewLabel: 'あなたのメッセージ（ホテルの言語）',
    copy: 'コピー',
    copied: 'コピーしました！',
    recommended: 'チャットアプリが一番簡単 — 翻訳しながらやり取りできます。',
    chatNote: 'チャットリンクは各ホテルが公式サイトに掲載したチャネルです。つながらない場合はメールや公式サイトをご利用ください。',
    phoneNote: '電話は言語が難しいことも — チャットアプリの方が簡単です。',
    website: '公式サイト',
    email: 'メール',
    phone: '電話',
    noChannels: 'このホテルはまだ直接チャネルを登録していません — 公式サイトをご利用ください。',
  },
}
