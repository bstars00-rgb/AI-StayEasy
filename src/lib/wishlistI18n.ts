import type { Lang } from '../i18n'

export interface WishlistStrings {
  nav: string
  save: string
  saved: string
  title: string
  subtitle: string
  emptyTitle: string
  emptyText: string
  browse: string
  clear: string
  countSuffix: string
}

export const wishlistStrings: Record<Lang, WishlistStrings> = {
  en: {
    nav: 'Wishlist',
    save: 'Save to wishlist',
    saved: 'Saved to wishlist',
    title: 'Your wishlist',
    subtitle: 'Hotels you saved — compare them and book direct when you’re ready.',
    emptyTitle: 'No saved hotels yet',
    emptyText: 'Tap the heart on any hotel to save it here for later.',
    browse: 'Browse Da Nang hotels',
    clear: 'Clear all',
    countSuffix: 'saved',
  },
  ko: {
    nav: '위시리스트',
    save: '위시리스트에 저장',
    saved: '위시리스트에 저장됨',
    title: '내 위시리스트',
    subtitle: '저장한 호텔이에요 — 비교해 보고 준비되면 공식 사이트에서 직접 예약하세요.',
    emptyTitle: '아직 저장한 호텔이 없어요',
    emptyText: '호텔의 하트를 누르면 여기에 저장됩니다.',
    browse: '다낭 호텔 둘러보기',
    clear: '전체 삭제',
    countSuffix: '개 저장',
  },
  vi: {
    nav: 'Yêu thích',
    save: 'Lưu vào danh sách yêu thích',
    saved: 'Đã lưu vào yêu thích',
    title: 'Danh sách yêu thích',
    subtitle: 'Những khách sạn bạn đã lưu — so sánh và đặt trực tiếp khi sẵn sàng.',
    emptyTitle: 'Chưa có khách sạn nào được lưu',
    emptyText: 'Nhấn vào biểu tượng trái tim trên bất kỳ khách sạn nào để lưu lại đây.',
    browse: 'Xem khách sạn Đà Nẵng',
    clear: 'Xóa tất cả',
    countSuffix: 'đã lưu',
  },
  zh: {
    nav: '心愿单',
    save: '加入心愿单',
    saved: '已加入心愿单',
    title: '我的心愿单',
    subtitle: '您收藏的酒店——对比后准备好即可官网直订。',
    emptyTitle: '还没有收藏的酒店',
    emptyText: '点按任意酒店上的爱心，即可收藏到这里。',
    browse: '浏览岘港酒店',
    clear: '清空',
    countSuffix: '个收藏',
  },
  ja: {
    nav: 'お気に入り',
    save: 'お気に入りに保存',
    saved: 'お気に入りに保存済み',
    title: 'お気に入り',
    subtitle: '保存したホテルです — 比較して、準備ができたら公式サイトで直接予約しましょう。',
    emptyTitle: 'まだ保存したホテルがありません',
    emptyText: 'ホテルのハートをタップすると、ここに保存されます。',
    browse: 'ダナンのホテルを見る',
    clear: 'すべて削除',
    countSuffix: '件保存',
  },
}
