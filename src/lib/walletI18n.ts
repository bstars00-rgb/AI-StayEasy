import type { Lang } from '../i18n'

/**
 * Copy for the perk-voucher wallet: the My page section, the voucher page behind
 * the emailed link (where hotel staff confirm use with the hotel's PIN) and the
 * delivery preview. Placeholders in {braces} are filled in by the page.
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
    /** Shown on a used voucher. {date} */
    usedOn: string
    validUntil: string
    pastTitle: string
    prototypeNote: string
  }
  voucher: {
    title: string
    showStaff: string
    bookCta: string
    codeLabel: string
    member: string
    validUntil: string
    usedAt: string
    notFound: string
    notFoundText: string
    note: string
    subscribersOnly: string
    /** Opens the PIN box — the hotel staff's button. */
    useBtn: string
    pinTitle: string
    pinLabel: string
    pinPh: string
    pinConfirm: string
    pinCancel: string
    /** {n} tries left */
    pinWrong: string
    /** {m} minutes */
    pinLocked: string
    /** Demo only: tells testers the PIN. {pin} */
    demoPin: string
    /** Label of the live clock that makes a screenshot easy to spot. */
    now: string
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
      intro: 'Each period we send you hotel perk vouchers. Show one on your phone at check-in — the hotel staff confirm it with the hotel’s PIN.',
      period: '{from} to {to}',
      nextBatch: 'Your next vouchers are issued on {date}.',
      needSub: 'Subscribe to receive perk vouchers from hotels each period.',
      needSubCta: 'See plans',
      newBatch: '{n} new voucher(s) just arrived',
      preview: 'See the message we send',
      open: 'Open voucher',
      status: { issued: 'Ready to use', used: 'Used', expired: 'Expired', void: 'Cancelled' },
      usedOn: 'Used {date}',
      validUntil: 'Valid until {date}',
      pastTitle: 'Earlier vouchers',
      prototypeNote: 'Demo: vouchers are kept in this browser only and the messages are not actually sent.',
    },
    voucher: {
      title: 'Perk voucher',
      showStaff: 'At check-in, show this screen to the hotel staff.',
      bookCta: 'See the hotel',
      codeLabel: 'Voucher no.',
      member: 'Member',
      validUntil: 'Valid until',
      usedAt: 'Used on {when}',
      notFound: 'Voucher not found',
      notFoundText: 'The link is wrong, the voucher was removed, or it belongs to another account.',
      note: 'A voucher works once. Screenshots and forwarded links don’t open it: it opens only for the subscriber who owns it.',
      subscribersOnly: 'This voucher opens for active subscribers only.',
      useBtn: 'Hotel staff: confirm use',
      pinTitle: 'Hotel staff only',
      pinLabel: 'Hotel PIN',
      pinPh: '4-digit PIN',
      pinConfirm: 'Confirm',
      pinCancel: 'Cancel',
      pinWrong: 'Wrong PIN. {n} tries left.',
      pinLocked: 'Too many wrong tries. Try again in {m} minutes.',
      demoPin: 'Demo only — the PIN is {pin}.',
      now: 'Now',
    },
    delivery: {
      title: 'The message we send',
      note: 'A preview. Nothing is actually sent.',
      emailLabel: 'Email',
      messengerLabel: '',
      messenger: null,
      subject: '[StayEasy] {n} perk voucher(s) arrived for this period',
      greeting: 'Hi {name},',
      body: 'Your subscription includes hotel perk vouchers. Open a voucher on your phone and show it at check-in.',
      cta: 'Open voucher',
      footer: 'A voucher can be used once, and opens only for you.',
      bubbleTitle: '',
      bubbleBody: '',
      bubbleCta: '',
    },
  },
  ko: {
    wallet: {
      title: '이번 기간 특전 바우처',
      intro: '기간마다 호텔 특전 바우처를 보내 드려요. 체크인할 때 휴대폰으로 보여 주면, 호텔 직원이 호텔 번호로 확인해요.',
      period: '{from} ~ {to}',
      nextBatch: '다음 바우처는 {date}에 발급돼요.',
      needSub: '구독하면 기간마다 호텔 특전 바우처를 받아요.',
      needSubCta: '요금제 보기',
      newBatch: '새 바우처 {n}장이 도착했어요',
      preview: '발송 메시지 미리보기',
      open: '바우처 열기',
      status: { issued: '사용 가능', used: '사용함', expired: '기간 만료', void: '구독 종료로 무효' },
      usedOn: '{date} 사용',
      validUntil: '{date}까지',
      pastTitle: '지난 바우처',
      prototypeNote: '시연용: 바우처는 이 브라우저에만 저장되고, 메시지는 실제로 발송되지 않아요.',
    },
    voucher: {
      title: '특전 바우처',
      showStaff: '체크인할 때 호텔 직원에게 이 화면을 보여 주세요.',
      bookCta: '호텔 보기',
      codeLabel: '바우처 번호',
      member: '회원',
      validUntil: '유효기간',
      usedAt: '{when}에 사용함',
      notFound: '바우처를 찾을 수 없어요',
      notFoundText: '링크가 잘못되었거나, 지워진 바우처이거나, 다른 계정의 바우처예요.',
      note: '바우처는 한 번만 쓸 수 있어요. 캡처 화면이나 전달받은 링크로는 열리지 않고, 구독한 본인에게만 열려요.',
      subscribersOnly: '구독 중인 회원에게만 열리는 바우처예요.',
      useBtn: '호텔 직원 확인',
      pinTitle: '호텔 직원 전용',
      pinLabel: '호텔 번호',
      pinPh: '숫자 4자리',
      pinConfirm: '확인',
      pinCancel: '취소',
      pinWrong: '번호가 맞지 않아요. {n}번 남았어요.',
      pinLocked: '여러 번 틀려서 잠겼어요. {m}분 뒤에 다시 시도해 주세요.',
      demoPin: '시연용: 호텔 번호는 {pin}이에요.',
      now: '지금',
    },
    delivery: {
      title: '발송되는 메시지',
      note: '미리보기예요. 실제로 발송되지는 않아요.',
      emailLabel: '메일',
      messengerLabel: '카카오톡',
      messenger: '카카오톡',
      subject: '[StayEasy] 이번 기간 특전 바우처 {n}장이 도착했어요',
      greeting: '{name}님,',
      body: '구독 혜택으로 호텔 특전 바우처를 보내 드려요. 휴대폰에서 바우처를 열어 체크인할 때 보여 주세요.',
      cta: '바우처 열기',
      footer: '바우처는 한 번만 쓸 수 있고, 본인에게만 열려요.',
      bubbleTitle: '특전 바우처 도착',
      bubbleBody: '{name}님, 이번 기간 바우처 {n}장이 도착했어요.',
      bubbleCta: '바우처 보기',
    },
  },
  ja: {
    wallet: {
      title: '今期の特典バウチャー',
      intro: '期間ごとにホテルの特典バウチャーをお送りします。チェックイン時にスマートフォンでご提示いただくと、ホテルのスタッフがホテルの暗証番号で確認します。',
      period: '{from} 〜 {to}',
      nextBatch: '次のバウチャーは{date}に発行されます。',
      needSub: '購読すると、期間ごとにホテルの特典バウチャーが届きます。',
      needSubCta: 'プランを見る',
      newBatch: '新しいバウチャーが{n}枚届きました',
      preview: '送信メッセージを見る',
      open: 'バウチャーを開く',
      status: { issued: '利用可能', used: '使用済み', expired: '期限切れ', void: '購読終了のため無効' },
      usedOn: '{date}に使用',
      validUntil: '{date}まで',
      pastTitle: '過去のバウチャー',
      prototypeNote: 'デモ: バウチャーはこのブラウザにのみ保存され、メッセージは実際には送信されません。',
    },
    voucher: {
      title: '特典バウチャー',
      showStaff: 'チェックイン時に、この画面をホテルスタッフにお見せください。',
      bookCta: 'ホテルを見る',
      codeLabel: 'バウチャー番号',
      member: '会員',
      validUntil: '有効期間',
      usedAt: '{when}に使用',
      notFound: 'バウチャーが見つかりません',
      notFoundText: 'リンクが正しくないか、バウチャーが削除されているか、別のアカウントのバウチャーです。',
      note: 'バウチャーは1回だけ使えます。スクリーンショットや転送されたリンクでは開けず、購読している本人だけに開きます。',
      subscribersOnly: '購読中の会員だけが開けるバウチャーです。',
      useBtn: 'ホテルスタッフ確認',
      pinTitle: 'ホテルスタッフ専用',
      pinLabel: 'ホテルの暗証番号',
      pinPh: '数字4桁',
      pinConfirm: '確認',
      pinCancel: 'キャンセル',
      pinWrong: '番号が違います。あと{n}回です。',
      pinLocked: '誤りが続いたためロックされました。{m}分後にもう一度お試しください。',
      demoPin: 'デモ用: 暗証番号は{pin}です。',
      now: '現在',
    },
    delivery: {
      title: '送信されるメッセージ',
      note: 'プレビューです。実際には送信されません。',
      emailLabel: 'メール',
      messengerLabel: 'LINE',
      messenger: 'LINE',
      subject: '[StayEasy] 今期の特典バウチャーが{n}枚届きました',
      greeting: '{name}さん',
      body: '購読特典としてホテルの特典バウチャーをお送りします。スマートフォンでバウチャーを開き、チェックイン時にご提示ください。',
      cta: 'バウチャーを開く',
      footer: 'バウチャーは1回だけ使え、ご本人にだけ開きます。',
      bubbleTitle: '特典バウチャーが届きました',
      bubbleBody: '{name}さん、今期のバウチャーが{n}枚届きました。',
      bubbleCta: 'バウチャーを見る',
    },
  },
  vi: {
    wallet: {
      title: 'Voucher đặc quyền kỳ này',
      intro: 'Mỗi kỳ chúng tôi gửi bạn các voucher đặc quyền của khách sạn. Hãy xuất trình trên điện thoại khi nhận phòng — nhân viên khách sạn xác nhận bằng mã PIN của khách sạn.',
      period: '{from} đến {to}',
      nextBatch: 'Voucher kế tiếp được phát hành vào {date}.',
      needSub: 'Đăng ký gói để nhận voucher đặc quyền từ khách sạn mỗi kỳ.',
      needSubCta: 'Xem các gói',
      newBatch: 'Vừa có {n} voucher mới',
      preview: 'Xem tin nhắn chúng tôi gửi',
      open: 'Mở voucher',
      status: { issued: 'Có thể dùng', used: 'Đã dùng', expired: 'Hết hạn', void: 'Vô hiệu do kết thúc gói' },
      usedOn: 'Đã dùng ngày {date}',
      validUntil: 'Có hiệu lực đến {date}',
      pastTitle: 'Voucher trước đây',
      prototypeNote: 'Thử nghiệm: voucher chỉ lưu trong trình duyệt này và tin nhắn không thực sự được gửi.',
    },
    voucher: {
      title: 'Voucher đặc quyền',
      showStaff: 'Khi nhận phòng, hãy cho nhân viên khách sạn xem màn hình này.',
      bookCta: 'Xem khách sạn',
      codeLabel: 'Số voucher',
      member: 'Thành viên',
      validUntil: 'Có hiệu lực đến',
      usedAt: 'Đã dùng lúc {when}',
      notFound: 'Không tìm thấy voucher',
      notFoundText: 'Liên kết sai, voucher đã bị xóa hoặc thuộc về tài khoản khác.',
      note: 'Voucher chỉ dùng được một lần. Ảnh chụp màn hình hay liên kết được chuyển tiếp đều không mở được: chỉ chính người đăng ký mới mở được.',
      subscribersOnly: 'Voucher này chỉ mở cho thành viên đang đăng ký gói.',
      useBtn: 'Nhân viên khách sạn xác nhận',
      pinTitle: 'Chỉ dành cho nhân viên khách sạn',
      pinLabel: 'Mã PIN khách sạn',
      pinPh: 'PIN 4 chữ số',
      pinConfirm: 'Xác nhận',
      pinCancel: 'Hủy',
      pinWrong: 'Sai mã PIN. Còn {n} lần thử.',
      pinLocked: 'Nhập sai quá nhiều lần. Hãy thử lại sau {m} phút.',
      demoPin: 'Chỉ để thử nghiệm — mã PIN là {pin}.',
      now: 'Bây giờ',
    },
    delivery: {
      title: 'Tin nhắn chúng tôi gửi',
      note: 'Bản xem trước. Thực tế không gửi gì cả.',
      emailLabel: 'Email',
      messengerLabel: 'Zalo',
      messenger: 'Zalo',
      subject: '[StayEasy] Đã có {n} voucher đặc quyền cho kỳ này',
      greeting: 'Chào {name},',
      body: 'Gói đăng ký của bạn có voucher đặc quyền của khách sạn. Hãy mở voucher trên điện thoại và xuất trình khi nhận phòng.',
      cta: 'Mở voucher',
      footer: 'Voucher chỉ dùng được một lần và chỉ mở cho bạn.',
      bubbleTitle: 'Voucher đặc quyền đã đến',
      bubbleBody: '{name} ơi, kỳ này bạn có {n} voucher mới.',
      bubbleCta: 'Xem voucher',
    },
  },
  zh: {
    wallet: {
      title: '本期特权优惠券',
      intro: '每个周期我们会发送酒店特权优惠券给您。入住时在手机上出示，酒店员工会用酒店的PIN码确认。',
      period: '{from} 至 {to}',
      nextBatch: '下一批优惠券将于{date}发放。',
      needSub: '订阅后，每个周期都会收到酒店的特权优惠券。',
      needSubCta: '查看方案',
      newBatch: '刚刚收到{n}张新优惠券',
      preview: '查看发送的消息',
      open: '打开优惠券',
      status: { issued: '可使用', used: '已使用', expired: '已过期', void: '订阅结束，已失效' },
      usedOn: '已于{date}使用',
      validUntil: '有效期至{date}',
      pastTitle: '以往的优惠券',
      prototypeNote: '演示：优惠券仅保存在此浏览器中，消息不会真正发送。',
    },
    voucher: {
      title: '特权优惠券',
      showStaff: '入住时，请向酒店员工出示此页面。',
      bookCta: '查看酒店',
      codeLabel: '优惠券编号',
      member: '会员',
      validUntil: '有效期',
      usedAt: '已于{when}使用',
      notFound: '未找到优惠券',
      notFoundText: '链接有误、优惠券已被删除，或它属于另一个账号。',
      note: '优惠券只能使用一次。截图或转发的链接无法打开，只有订阅的本人才能打开。',
      subscribersOnly: '此优惠券仅对订阅中的会员开放。',
      useBtn: '酒店员工确认',
      pinTitle: '仅限酒店员工',
      pinLabel: '酒店PIN码',
      pinPh: '4位数字',
      pinConfirm: '确认',
      pinCancel: '取消',
      pinWrong: 'PIN码不正确，还可尝试{n}次。',
      pinLocked: '错误次数过多，已锁定。请{m}分钟后再试。',
      demoPin: '仅演示：PIN码为{pin}。',
      now: '现在',
    },
    delivery: {
      title: '我们发送的消息',
      note: '仅为预览，不会真正发送。',
      emailLabel: '邮件',
      messengerLabel: '',
      messenger: null,
      subject: '[StayEasy] 本期已发放{n}张特权优惠券',
      greeting: '{name}，您好：',
      body: '您的订阅包含酒店特权优惠券。请在手机上打开优惠券，入住时出示即可。',
      cta: '打开优惠券',
      footer: '优惠券只能使用一次，且只对您本人开放。',
      bubbleTitle: '',
      bubbleBody: '',
      bubbleCta: '',
    },
  },
}

/** Fill {name} placeholders. */
export const fillW = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
