import type { Lang } from '../i18n'

/**
 * Copy for the perk-voucher wallet: the My page section, the voucher page behind
 * the emailed link, the hotel-staff check screen and the delivery preview.
 * Placeholders in {braces} are filled in by the page.
 */
export interface WalletStrings {
  wallet: {
    title: string
    intro: string
    period: string
    nextBatch: string
    needSub: string
    needSubCta: string
    newBatch: string
    preview: string
    open: string
    status: { issued: string; used: string; expired: string; void: string }
    guestsOnly: string
    anyone: string
    validUntil: string
    pastTitle: string
    staffLink: string
    prototypeNote: string
  }
  voucher: {
    title: string
    showStaff: string
    codeLabel: string
    member: string
    perk: string
    validUntil: string
    usedAt: string
    notFound: string
    notFoundText: string
    note: string
  }
  staff: {
    title: string
    intro: string
    hotelLabel: string
    codeLabel: string
    codePh: string
    check: string
    noHotels: string
    valid: string
    used: string
    expired: string
    voidState: string
    wrongHotel: string
    notFound: string
    perkLabel: string
    memberLabel: string
    validUntilLabel: string
    eligGuests: string
    eligAnyone: string
    confirm: string
    done: string
    usedAt: string
    another: string
    demoNote: string
  }
  delivery: {
    title: string
    note: string
    emailLabel: string
    messengerLabel: string
    /** Which messenger the language's members get; null = email only. */
    messenger: string | null
    subject: string
    greeting: string
    body: string
    cta: string
    footer: string
    bubbleTitle: string
    bubbleBody: string
    bubbleCta: string
  }
}

export const walletStrings: Record<Lang, WalletStrings> = {
  en: {
    wallet: {
      title: 'Perk vouchers this period',
      intro: 'Each period we send you hotel perk vouchers. They don’t depend on a booking — show one at the hotel within its dates.',
      period: '{from} to {to}',
      nextBatch: 'Your next vouchers are issued on {date}.',
      needSub: 'Subscribe to receive perk vouchers from hotels each period.',
      needSubCta: 'See plans',
      newBatch: '{n} new voucher(s) just arrived',
      preview: 'See the message we send',
      open: 'Open voucher',
      status: { issued: 'Ready to use', used: 'Used', expired: 'Expired', void: 'Cancelled' },
      guestsOnly: 'Staying guests only',
      anyone: 'Visitors welcome',
      validUntil: 'Valid until {date}',
      pastTitle: 'Earlier vouchers',
      staffLink: 'Hotel staff check screen (demo)',
      prototypeNote: 'Demo: vouchers are kept in this browser only and the messages are not actually sent.',
    },
    voucher: {
      title: 'Perk voucher',
      showStaff: 'Show this screen to hotel staff.',
      codeLabel: 'Code',
      member: 'Member',
      perk: 'Perk',
      validUntil: 'Valid until',
      usedAt: 'Used on {when}',
      notFound: 'Voucher not found',
      notFoundText: 'The link is wrong or the voucher was removed.',
      note: 'A voucher works once. If someone else uses it first, it can’t be used again.',
    },
    staff: {
      title: 'Hotel staff check',
      intro: 'Check a member’s voucher and mark the perk as given. Each voucher can be marked once.',
      hotelLabel: 'Your hotel',
      codeLabel: 'Voucher code',
      codePh: 'XXXX-XXXX-XXXX-XXXX',
      check: 'Check',
      noHotels: 'No hotel has joined the voucher program yet.',
      valid: 'Valid voucher',
      used: 'Already used',
      expired: 'Expired',
      voidState: 'No longer valid (subscription ended)',
      wrongHotel: 'This voucher is for another hotel',
      notFound: 'Code not found',
      perkLabel: 'Perk',
      memberLabel: 'Member',
      validUntilLabel: 'Valid until',
      eligGuests: 'Staying guests only — please confirm the guest is staying before giving the perk.',
      eligAnyone: 'Visitors are welcome for this perk.',
      confirm: 'Mark as given',
      done: 'Recorded as given. This voucher can’t be used again.',
      usedAt: 'Used on {when}',
      another: 'Check another voucher',
      demoNote: 'Demo screen. Real hotels will use this from the partner portal, and the ledger will live on a server.',
    },
    delivery: {
      title: 'The message we send',
      note: 'A preview. Nothing is actually sent.',
      emailLabel: 'Email',
      messengerLabel: '',
      messenger: null,
      subject: '[StayEasy] {n} perk voucher(s) arrived for this period',
      greeting: 'Hi {name},',
      body: 'Your subscription includes hotel perk vouchers. Open a voucher and show its QR at the hotel — it works however you booked, within its dates.',
      cta: 'Open voucher',
      footer: 'A voucher can be used once. If someone else uses it first, it can’t be used again.',
      bubbleTitle: '',
      bubbleBody: '',
      bubbleCta: '',
    },
  },
  ko: {
    wallet: {
      title: '이번 기간 특전 바우처',
      intro: '기간마다 호텔 특전 바우처를 보내 드려요. 예약과 상관없이, 유효기간 안에 호텔에서 보여 주면 됩니다.',
      period: '{from} ~ {to}',
      nextBatch: '다음 바우처는 {date}에 발급돼요.',
      needSub: '구독하면 기간마다 호텔 특전 바우처를 받아요.',
      needSubCta: '요금제 보기',
      newBatch: '새 바우처 {n}장이 도착했어요',
      preview: '발송 메시지 미리보기',
      open: '바우처 열기',
      status: { issued: '사용 가능', used: '사용함', expired: '기간 만료', void: '구독 종료로 무효' },
      guestsOnly: '투숙객 전용',
      anyone: '방문객도 가능',
      validUntil: '{date}까지',
      pastTitle: '지난 바우처',
      staffLink: '호텔 직원 확인 화면(시연)',
      prototypeNote: '시연용: 바우처는 이 브라우저에만 저장되고, 메시지는 실제로 발송되지 않아요.',
    },
    voucher: {
      title: '특전 바우처',
      showStaff: '호텔 직원에게 이 화면을 보여 주세요.',
      codeLabel: '코드',
      member: '회원',
      perk: '특전',
      validUntil: '유효기간',
      usedAt: '{when}에 사용함',
      notFound: '바우처를 찾을 수 없어요',
      notFoundText: '링크가 잘못되었거나 지워진 바우처예요.',
      note: '바우처는 한 번만 쓸 수 있어요. 다른 사람이 먼저 쓰면 쓸 수 없어요.',
    },
    staff: {
      title: '호텔 직원 확인',
      intro: '회원의 바우처를 확인하고 특전을 제공했다고 기록하세요. 바우처마다 한 번만 기록할 수 있어요.',
      hotelLabel: '우리 호텔',
      codeLabel: '바우처 코드',
      codePh: 'XXXX-XXXX-XXXX-XXXX',
      check: '확인',
      noHotels: '바우처 프로그램에 참여한 호텔이 아직 없어요.',
      valid: '사용할 수 있는 바우처예요',
      used: '이미 사용한 바우처예요',
      expired: '유효기간이 지났어요',
      voidState: '더는 유효하지 않아요 (구독 종료)',
      wrongHotel: '다른 호텔의 바우처예요',
      notFound: '코드를 찾을 수 없어요',
      perkLabel: '특전',
      memberLabel: '회원',
      validUntilLabel: '유효기간',
      eligGuests: '투숙객 전용이에요. 투숙 중인 손님인지 확인한 뒤 제공해 주세요.',
      eligAnyone: '방문객에게도 제공할 수 있는 특전이에요.',
      confirm: '제공 완료',
      done: '제공 완료로 기록했어요. 이 바우처는 다시 쓸 수 없어요.',
      usedAt: '{when}에 사용함',
      another: '다른 바우처 확인',
      demoNote: '시연 화면이에요. 실제 호텔은 파트너 포털에서 이 화면을 쓰고, 사용 기록은 서버에 저장됩니다.',
    },
    delivery: {
      title: '발송되는 메시지',
      note: '미리보기예요. 실제로 발송되지는 않아요.',
      emailLabel: '메일',
      messengerLabel: '카카오톡',
      messenger: '카카오톡',
      subject: '[StayEasy] 이번 기간 특전 바우처 {n}장이 도착했어요',
      greeting: '{name}님,',
      body: '구독 혜택으로 호텔 특전 바우처를 보내 드려요. 바우처를 열어 호텔에서 QR을 보여 주세요. 어디서 예약했는지와 상관없이 유효기간 안에 쓸 수 있어요.',
      cta: '바우처 열기',
      footer: '바우처는 한 번만 쓸 수 있어요. 다른 사람이 먼저 쓰면 쓸 수 없어요.',
      bubbleTitle: '특전 바우처 도착',
      bubbleBody: '{name}님, 이번 기간 바우처 {n}장이 도착했어요.',
      bubbleCta: '바우처 보기',
    },
  },
  ja: {
    wallet: {
      title: '今期の特典バウチャー',
      intro: '期間ごとにホテルの特典バウチャーをお送りします。ご予約とは関係なく、有効期間内にホテルで提示してください。',
      period: '{from} 〜 {to}',
      nextBatch: '次のバウチャーは{date}に発行されます。',
      needSub: '購読すると、期間ごとにホテルの特典バウチャーが届きます。',
      needSubCta: 'プランを見る',
      newBatch: '新しいバウチャーが{n}枚届きました',
      preview: '送信メッセージを見る',
      open: 'バウチャーを開く',
      status: { issued: '利用可能', used: '使用済み', expired: '期限切れ', void: '購読終了のため無効' },
      guestsOnly: '宿泊者のみ',
      anyone: '宿泊者以外もOK',
      validUntil: '{date}まで',
      pastTitle: '過去のバウチャー',
      staffLink: 'ホテルスタッフ確認画面(デモ)',
      prototypeNote: 'デモ: バウチャーはこのブラウザにのみ保存され、メッセージは実際には送信されません。',
    },
    voucher: {
      title: '特典バウチャー',
      showStaff: 'この画面をホテルスタッフにお見せください。',
      codeLabel: 'コード',
      member: '会員',
      perk: '特典',
      validUntil: '有効期間',
      usedAt: '{when}に使用',
      notFound: 'バウチャーが見つかりません',
      notFoundText: 'リンクが正しくないか、バウチャーが削除されています。',
      note: 'バウチャーは1回だけ使えます。他の人が先に使うと使えなくなります。',
    },
    staff: {
      title: 'ホテルスタッフ確認',
      intro: '会員のバウチャーを確認し、特典を提供したことを記録してください。バウチャーごとに1回だけ記録できます。',
      hotelLabel: 'ご自身のホテル',
      codeLabel: 'バウチャーコード',
      codePh: 'XXXX-XXXX-XXXX-XXXX',
      check: '確認',
      noHotels: 'バウチャープログラムに参加しているホテルはまだありません。',
      valid: '利用できるバウチャーです',
      used: 'すでに使用済みです',
      expired: '有効期間が過ぎています',
      voidState: '無効です(購読終了)',
      wrongHotel: '別のホテルのバウチャーです',
      notFound: 'コードが見つかりません',
      perkLabel: '特典',
      memberLabel: '会員',
      validUntilLabel: '有効期間',
      eligGuests: '宿泊者のみの特典です。ご宿泊中のお客様か確認してから提供してください。',
      eligAnyone: '宿泊者以外にも提供できる特典です。',
      confirm: '提供済みにする',
      done: '提供済みとして記録しました。このバウチャーは再び使えません。',
      usedAt: '{when}に使用',
      another: '別のバウチャーを確認',
      demoNote: 'デモ画面です。実在のホテルではパートナーポータルでこの画面を使い、使用記録はサーバーに保存されます。',
    },
    delivery: {
      title: '送信されるメッセージ',
      note: 'プレビューです。実際には送信されません。',
      emailLabel: 'メール',
      messengerLabel: 'LINE',
      messenger: 'LINE',
      subject: '[StayEasy] 今期の特典バウチャーが{n}枚届きました',
      greeting: '{name}さん',
      body: '購読特典としてホテルの特典バウチャーをお送りします。バウチャーを開き、ホテルでQRをお見せください。どこで予約したかに関係なく、有効期間内にご利用いただけます。',
      cta: 'バウチャーを開く',
      footer: 'バウチャーは1回だけ使えます。他の人が先に使うと使えなくなります。',
      bubbleTitle: '特典バウチャーが届きました',
      bubbleBody: '{name}さん、今期のバウチャーが{n}枚届きました。',
      bubbleCta: 'バウチャーを見る',
    },
  },
  vi: {
    wallet: {
      title: 'Voucher đặc quyền kỳ này',
      intro: 'Mỗi kỳ chúng tôi gửi bạn các voucher đặc quyền của khách sạn. Không phụ thuộc vào việc đặt phòng — hãy xuất trình tại khách sạn trong thời hạn.',
      period: '{from} đến {to}',
      nextBatch: 'Voucher kế tiếp được phát hành vào {date}.',
      needSub: 'Đăng ký gói để nhận voucher đặc quyền từ khách sạn mỗi kỳ.',
      needSubCta: 'Xem các gói',
      newBatch: 'Vừa có {n} voucher mới',
      preview: 'Xem tin nhắn chúng tôi gửi',
      open: 'Mở voucher',
      status: { issued: 'Có thể dùng', used: 'Đã dùng', expired: 'Hết hạn', void: 'Vô hiệu do kết thúc gói' },
      guestsOnly: 'Chỉ dành cho khách lưu trú',
      anyone: 'Khách ghé thăm cũng dùng được',
      validUntil: 'Có hiệu lực đến {date}',
      pastTitle: 'Voucher trước đây',
      staffLink: 'Màn hình kiểm tra cho nhân viên khách sạn (thử nghiệm)',
      prototypeNote: 'Thử nghiệm: voucher chỉ lưu trong trình duyệt này và tin nhắn không thực sự được gửi.',
    },
    voucher: {
      title: 'Voucher đặc quyền',
      showStaff: 'Hãy cho nhân viên khách sạn xem màn hình này.',
      codeLabel: 'Mã',
      member: 'Thành viên',
      perk: 'Đặc quyền',
      validUntil: 'Có hiệu lực đến',
      usedAt: 'Đã dùng lúc {when}',
      notFound: 'Không tìm thấy voucher',
      notFoundText: 'Liên kết sai hoặc voucher đã bị xóa.',
      note: 'Voucher chỉ dùng được một lần. Nếu người khác dùng trước, bạn sẽ không dùng được nữa.',
    },
    staff: {
      title: 'Nhân viên khách sạn kiểm tra',
      intro: 'Kiểm tra voucher của thành viên và ghi nhận đã cung cấp đặc quyền. Mỗi voucher chỉ ghi nhận được một lần.',
      hotelLabel: 'Khách sạn của bạn',
      codeLabel: 'Mã voucher',
      codePh: 'XXXX-XXXX-XXXX-XXXX',
      check: 'Kiểm tra',
      noHotels: 'Chưa có khách sạn nào tham gia chương trình voucher.',
      valid: 'Voucher hợp lệ',
      used: 'Đã được sử dụng',
      expired: 'Đã hết hạn',
      voidState: 'Không còn hiệu lực (đã kết thúc gói)',
      wrongHotel: 'Voucher này của khách sạn khác',
      notFound: 'Không tìm thấy mã',
      perkLabel: 'Đặc quyền',
      memberLabel: 'Thành viên',
      validUntilLabel: 'Có hiệu lực đến',
      eligGuests: 'Chỉ dành cho khách lưu trú. Hãy xác nhận khách đang lưu trú trước khi cung cấp.',
      eligAnyone: 'Đặc quyền này khách ghé thăm cũng được hưởng.',
      confirm: 'Đã cung cấp',
      done: 'Đã ghi nhận là đã cung cấp. Voucher này không thể dùng lại.',
      usedAt: 'Đã dùng lúc {when}',
      another: 'Kiểm tra voucher khác',
      demoNote: 'Màn hình thử nghiệm. Khách sạn thật sẽ dùng màn hình này trong cổng đối tác và sổ ghi nhận nằm trên máy chủ.',
    },
    delivery: {
      title: 'Tin nhắn chúng tôi gửi',
      note: 'Bản xem trước. Thực tế không gửi gì cả.',
      emailLabel: 'Email',
      messengerLabel: 'Zalo',
      messenger: 'Zalo',
      subject: '[StayEasy] Đã có {n} voucher đặc quyền cho kỳ này',
      greeting: 'Chào {name},',
      body: 'Gói đăng ký của bạn có voucher đặc quyền của khách sạn. Hãy mở voucher và xuất trình mã QR tại khách sạn — dùng được dù bạn đặt phòng ở đâu, trong thời hạn.',
      cta: 'Mở voucher',
      footer: 'Voucher chỉ dùng được một lần. Nếu người khác dùng trước, bạn sẽ không dùng được nữa.',
      bubbleTitle: 'Voucher đặc quyền đã đến',
      bubbleBody: '{name} ơi, kỳ này bạn có {n} voucher mới.',
      bubbleCta: 'Xem voucher',
    },
  },
  zh: {
    wallet: {
      title: '本期特权优惠券',
      intro: '每个周期我们会发送酒店特权优惠券给您。无论如何预订都不受影响，在有效期内向酒店出示即可。',
      period: '{from} 至 {to}',
      nextBatch: '下一批优惠券将于{date}发放。',
      needSub: '订阅后，每个周期都会收到酒店的特权优惠券。',
      needSubCta: '查看方案',
      newBatch: '刚刚收到{n}张新优惠券',
      preview: '查看发送的消息',
      open: '打开优惠券',
      status: { issued: '可使用', used: '已使用', expired: '已过期', void: '订阅结束，已失效' },
      guestsOnly: '仅限入住客人',
      anyone: '到店访客也可使用',
      validUntil: '有效期至{date}',
      pastTitle: '以往的优惠券',
      staffLink: '酒店员工核验页面(演示)',
      prototypeNote: '演示：优惠券仅保存在此浏览器中，消息不会真正发送。',
    },
    voucher: {
      title: '特权优惠券',
      showStaff: '请向酒店员工出示此页面。',
      codeLabel: '代码',
      member: '会员',
      perk: '特权',
      validUntil: '有效期',
      usedAt: '已于{when}使用',
      notFound: '未找到优惠券',
      notFoundText: '链接有误，或优惠券已被删除。',
      note: '优惠券只能使用一次。如果别人先使用，您就无法再使用。',
    },
    staff: {
      title: '酒店员工核验',
      intro: '核验会员的优惠券，并记录已提供特权。每张优惠券只能记录一次。',
      hotelLabel: '您的酒店',
      codeLabel: '优惠券代码',
      codePh: 'XXXX-XXXX-XXXX-XXXX',
      check: '核验',
      noHotels: '目前还没有酒店加入优惠券计划。',
      valid: '有效的优惠券',
      used: '已经使用过',
      expired: '已过有效期',
      voidState: '已失效(订阅已结束)',
      wrongHotel: '这是另一家酒店的优惠券',
      notFound: '未找到代码',
      perkLabel: '特权',
      memberLabel: '会员',
      validUntilLabel: '有效期',
      eligGuests: '仅限入住客人。请确认客人正在入住后再提供。',
      eligAnyone: '到店访客也可享受此特权。',
      confirm: '已提供',
      done: '已记录为已提供。此优惠券无法再次使用。',
      usedAt: '已于{when}使用',
      another: '核验另一张',
      demoNote: '这是演示页面。真实酒店将在合作伙伴后台使用，使用记录保存在服务器上。',
    },
    delivery: {
      title: '我们发送的消息',
      note: '仅为预览，不会真正发送。',
      emailLabel: '邮件',
      messengerLabel: '',
      messenger: null,
      subject: '[StayEasy] 本期已发放{n}张特权优惠券',
      greeting: '{name}，您好：',
      body: '您的订阅包含酒店特权优惠券。打开优惠券，在酒店出示二维码即可——无论在哪里预订，只要在有效期内都能使用。',
      cta: '打开优惠券',
      footer: '优惠券只能使用一次。如果别人先使用，您就无法再使用。',
      bubbleTitle: '',
      bubbleBody: '',
      bubbleCta: '',
    },
  },
}

/** Fill {name} placeholders. */
export const fillW = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
