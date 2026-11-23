import type { Lang } from '../i18n'

/** Labels that mark the fictional "Lunas Park Hotel" demo chain wherever it appears. */
export interface DemoStrings {
  /** Chip on the hotel card. */
  chip: string
  bannerTitle: string
  bannerText: string
  pageTitle: string
  pageText: string
  pageBack: string
}

export const demoStrings: Record<Lang, DemoStrings> = {
  en: {
    chip: 'Fictional demo hotel',
    bannerTitle: 'This hotel is fictional',
    bannerText: 'Lunas Park Hotel exists only to show how a hotel’s member voucher and benefit figure look. It cannot be booked, and none of the offers here are real.',
    pageTitle: 'This is a demo hotel',
    pageText: 'Lunas Park Hotel is a fictional chain with no website and no rooms. It is here only to show how member vouchers work on StayEasy. For real hotels, the official-site button goes to the hotel’s own site.',
    pageBack: 'Back to hotels',
  },
  ko: {
    chip: '시연용 가상 호텔',
    bannerTitle: '이 호텔은 가상이에요',
    bannerText: 'Lunas Park Hotel은 호텔의 회원 바우처와 혜택 숫자가 어떻게 보이는지 보여 주려고 만든 호텔입니다. 예약할 수 없고, 여기 나온 혜택도 모두 실제가 아니에요.',
    pageTitle: '시연용 호텔이에요',
    pageText: 'Lunas Park Hotel은 웹사이트도 객실도 없는 가상의 체인입니다. StayEasy에서 회원 바우처가 어떻게 동작하는지 보여 주려고만 있어요. 실제 호텔은 공식 웹사이트 버튼이 그 호텔의 공식 사이트로 연결됩니다.',
    pageBack: '호텔 목록으로',
  },
  vi: {
    chip: 'Khách sạn giả định để trình diễn',
    bannerTitle: 'Khách sạn này là giả định',
    bannerText: 'Lunas Park Hotel chỉ tồn tại để cho thấy voucher thành viên và con số ưu đãi của một khách sạn trông thế nào. Không thể đặt phòng và mọi ưu đãi ở đây đều không có thật.',
    pageTitle: 'Đây là khách sạn trình diễn',
    pageText: 'Lunas Park Hotel là chuỗi giả định, không có website và không có phòng. Nó chỉ có ở đây để cho thấy voucher thành viên hoạt động thế nào trên StayEasy. Với khách sạn thật, nút trang chính thức dẫn tới website của chính khách sạn đó.',
    pageBack: 'Quay lại danh sách khách sạn',
  },
  zh: {
    chip: '虚构演示酒店',
    bannerTitle: '这家酒店是虚构的',
    bannerText: 'Lunas Park Hotel 只是为了展示酒店的会员优惠券和优惠数字是什么样子。它无法预订，这里的优惠也都不是真实的。',
    pageTitle: '这是一家演示酒店',
    pageText: 'Lunas Park Hotel 是一个没有网站、也没有客房的虚构连锁酒店，只用于展示会员优惠券在 StayEasy 上如何运作。对于真实酒店，官网按钮会跳转到该酒店自己的官方网站。',
    pageBack: '返回酒店列表',
  },
  ja: {
    chip: '架空のデモ用ホテル',
    bannerTitle: 'このホテルは架空です',
    bannerText: 'Lunas Park Hotelは、ホテルの会員バウチャーと特典の数字がどう見えるかを示すためだけに作ったホテルです。予約はできず、ここにある特典もすべて実際のものではありません。',
    pageTitle: 'デモ用のホテルです',
    pageText: 'Lunas Park Hotelはウェブサイトも客室もない架空のチェーンです。StayEasyで会員バウチャーがどう動くかを示すためだけにあります。実在のホテルでは、公式サイトのボタンがそのホテル自身の公式サイトにつながります。',
    pageBack: 'ホテル一覧へ',
  },
}
