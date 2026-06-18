import type { Lang } from '../i18n'

/**
 * Direct-Stay Inbox (StayEasy Concierge) dictionary.
 *
 * Structured guest requests are keyed, so the same request renders in the
 * guest's language on the guest side and in the hotel's language on the hotel
 * side — real translation without a translation API. Free-text notes are passed
 * through (a production build would machine-translate those on delivery).
 */
export type RequestKey =
  | 'airportPickup'
  | 'earlyCheckIn'
  | 'lateCheckout'
  | 'quietRoom'
  | 'highFloor'
  | 'extraBed'
  | 'twinBeds'
  | 'dietary'
  | 'occasion'

export const REQUEST_KEYS: RequestKey[] = [
  'airportPickup', 'earlyCheckIn', 'lateCheckout', 'quietRoom', 'highFloor', 'extraBed', 'twinBeds', 'dietary', 'occasion',
]

export interface ConciergeStrings {
  messageBtn: string
  guestTitle: string
  guestSubtitle: string
  name: string
  bookingRef: string
  bookingRefPh: string
  language: string
  requestsLabel: string
  noteLabel: string
  notePh: string
  send: string
  sentTitle: string
  sentText: string
  close: string
  // hotel inbox
  inboxTitle: string
  inboxEmpty: string
  guestLabel: string
  refLabel: string
  requestsHeading: string
  noteHeading: string
  replyPh: string
  replyBtn: string
  translated: string
  request: Record<RequestKey, string>
}

export const conciergeStrings: Record<Lang, ConciergeStrings> = {
  en: {
    messageBtn: 'Message this hotel',
    guestTitle: 'Message the hotel',
    guestSubtitle: 'Your requests are translated for the hotel — no language barrier.',
    name: 'Your name',
    bookingRef: 'Booking reference',
    bookingRefPh: 'e.g. confirmation number',
    language: 'Your language',
    requestsLabel: 'Common requests',
    noteLabel: 'Message (optional)',
    notePh: 'Anything else for the hotel…',
    send: 'Send to hotel',
    sentTitle: 'Sent!',
    sentText: 'The hotel can read your requests in their language and will reply here.',
    close: 'Close',
    inboxTitle: 'Guest messages',
    inboxEmpty: 'No guest messages yet.',
    guestLabel: 'Guest',
    refLabel: 'Booking',
    requestsHeading: 'Requests',
    noteHeading: 'Message',
    replyPh: 'Reply to the guest…',
    replyBtn: 'Send reply',
    translated: 'translated',
    request: {
      airportPickup: 'Airport pickup', earlyCheckIn: 'Early check-in', lateCheckout: 'Late checkout',
      quietRoom: 'Quiet room', highFloor: 'High floor', extraBed: 'Extra bed', twinBeds: 'Twin beds',
      dietary: 'Dietary request', occasion: 'Special occasion',
    },
  },
  ko: {
    messageBtn: '호텔에 메시지',
    guestTitle: '호텔에 메시지 보내기',
    guestSubtitle: '요청이 호텔 언어로 번역돼 전달돼요 — 언어 걱정 없이.',
    name: '이름',
    bookingRef: '예약 번호',
    bookingRefPh: '예: 예약 확인번호',
    language: '내 언어',
    requestsLabel: '자주 하는 요청',
    noteLabel: '메시지 (선택)',
    notePh: '호텔에 전할 내용을 적어주세요…',
    send: '호텔로 보내기',
    sentTitle: '전송됨!',
    sentText: '호텔이 여러분의 요청을 자기 언어로 읽고 여기에 답장합니다.',
    close: '닫기',
    inboxTitle: '게스트 메시지',
    inboxEmpty: '아직 게스트 메시지가 없어요.',
    guestLabel: '게스트',
    refLabel: '예약',
    requestsHeading: '요청',
    noteHeading: '메시지',
    replyPh: '게스트에게 답장…',
    replyBtn: '답장 보내기',
    translated: '번역됨',
    request: {
      airportPickup: '공항 픽업', earlyCheckIn: '얼리 체크인', lateCheckout: '레이트 체크아웃',
      quietRoom: '조용한 객실', highFloor: '높은 층', extraBed: '엑스트라 베드', twinBeds: '트윈 베드',
      dietary: '식이 요청', occasion: '기념일/특별한 날',
    },
  },
  vi: {
    messageBtn: 'Nhắn tin cho khách sạn',
    guestTitle: 'Nhắn tin cho khách sạn',
    guestSubtitle: 'Yêu cầu của bạn được dịch sang ngôn ngữ của khách sạn — không rào cản ngôn ngữ.',
    name: 'Tên của bạn',
    bookingRef: 'Mã đặt phòng',
    bookingRefPh: 'vd: số xác nhận',
    language: 'Ngôn ngữ của bạn',
    requestsLabel: 'Yêu cầu phổ biến',
    noteLabel: 'Tin nhắn (tùy chọn)',
    notePh: 'Điều gì khác cho khách sạn…',
    send: 'Gửi cho khách sạn',
    sentTitle: 'Đã gửi!',
    sentText: 'Khách sạn có thể đọc yêu cầu của bạn bằng ngôn ngữ của họ và sẽ trả lời tại đây.',
    close: 'Đóng',
    inboxTitle: 'Tin nhắn của khách',
    inboxEmpty: 'Chưa có tin nhắn nào của khách.',
    guestLabel: 'Khách',
    refLabel: 'Đặt phòng',
    requestsHeading: 'Yêu cầu',
    noteHeading: 'Tin nhắn',
    replyPh: 'Trả lời khách…',
    replyBtn: 'Gửi trả lời',
    translated: 'đã dịch',
    request: {
      airportPickup: 'Đón sân bay', earlyCheckIn: 'Nhận phòng sớm', lateCheckout: 'Trả phòng muộn',
      quietRoom: 'Phòng yên tĩnh', highFloor: 'Tầng cao', extraBed: 'Giường phụ', twinBeds: 'Giường đôi (twin)',
      dietary: 'Yêu cầu ăn uống', occasion: 'Dịp đặc biệt',
    },
  },
  zh: {
    messageBtn: '联系酒店',
    guestTitle: '给酒店留言',
    guestSubtitle: '您的请求会翻译成酒店的语言——没有语言障碍。',
    name: '您的姓名',
    bookingRef: '预订编号',
    bookingRefPh: '例如确认号',
    language: '您的语言',
    requestsLabel: '常见请求',
    noteLabel: '留言（可选）',
    notePh: '还有什么需要告诉酒店…',
    send: '发送给酒店',
    sentTitle: '已发送！',
    sentText: '酒店可用自己的语言阅读您的请求，并在此回复。',
    close: '关闭',
    inboxTitle: '住客留言',
    inboxEmpty: '暂无住客留言。',
    guestLabel: '住客',
    refLabel: '预订',
    requestsHeading: '请求',
    noteHeading: '留言',
    replyPh: '回复住客…',
    replyBtn: '发送回复',
    translated: '已翻译',
    request: {
      airportPickup: '机场接机', earlyCheckIn: '提前入住', lateCheckout: '延迟退房',
      quietRoom: '安静房间', highFloor: '高楼层', extraBed: '加床', twinBeds: '双床',
      dietary: '饮食需求', occasion: '特殊场合',
    },
  },
  ja: {
    messageBtn: 'ホテルにメッセージ',
    guestTitle: 'ホテルにメッセージ',
    guestSubtitle: 'ご要望はホテルの言語に翻訳されて届きます — 言葉の壁なし。',
    name: 'お名前',
    bookingRef: '予約番号',
    bookingRefPh: '例：確認番号',
    language: 'あなたの言語',
    requestsLabel: 'よくあるご要望',
    noteLabel: 'メッセージ（任意）',
    notePh: 'ホテルへのその他のご要望…',
    send: 'ホテルへ送信',
    sentTitle: '送信しました！',
    sentText: 'ホテルは自社の言語でご要望を読み、ここで返信します。',
    close: '閉じる',
    inboxTitle: 'ゲストメッセージ',
    inboxEmpty: 'まだゲストメッセージはありません。',
    guestLabel: 'ゲスト',
    refLabel: '予約',
    requestsHeading: 'ご要望',
    noteHeading: 'メッセージ',
    replyPh: 'ゲストへ返信…',
    replyBtn: '返信を送る',
    translated: '翻訳済み',
    request: {
      airportPickup: '空港送迎', earlyCheckIn: 'アーリーチェックイン', lateCheckout: 'レイトチェックアウト',
      quietRoom: '静かな部屋', highFloor: '高層階', extraBed: 'エキストラベッド', twinBeds: 'ツインベッド',
      dietary: '食事のリクエスト', occasion: '記念日・特別な日',
    },
  },
}
