import type { Lang } from '../i18n'

export interface CommunityStrings {
  title: string
  subtitle: string
  namePh: string
  bodyPh: string
  post: string
  empty: string
  anon: string
  demoNote: string
  /** {n} posts */
  count: string
  delete: string
  now: string
  minsAgo: string // {n}m
  hoursAgo: string // {n}h
  daysAgo: string // {n}d
}

export const communityStrings: Record<Lang, CommunityStrings> = {
  en: {
    title: 'Hotel community',
    subtitle: 'Ask questions and share tips about this hotel with other travelers.',
    namePh: 'Your name (optional)',
    bodyPh: 'Share a question or a tip about this hotel…',
    post: 'Post',
    empty: 'No posts yet — be the first to share an insight.',
    anon: 'Anonymous traveler',
    demoNote: 'Please keep it respectful. Demo — posts are saved only in this browser.',
    count: '{n} posts',
    delete: 'Delete',
    now: 'just now',
    minsAgo: '{n}m ago',
    hoursAgo: '{n}h ago',
    daysAgo: '{n}d ago',
  },
  ko: {
    title: '호텔 커뮤니티',
    subtitle: '이 호텔에 대해 다른 여행자들과 질문하고 팁을 나눠보세요.',
    namePh: '이름 (선택)',
    bodyPh: '이 호텔에 대한 질문이나 팁을 남겨보세요…',
    post: '게시',
    empty: '아직 글이 없어요 — 첫 인사이트를 남겨보세요.',
    anon: '익명 여행자',
    demoNote: '서로 존중하는 대화를 부탁드려요. 데모 — 글은 이 브라우저에만 저장됩니다.',
    count: '글 {n}개',
    delete: '삭제',
    now: '방금',
    minsAgo: '{n}분 전',
    hoursAgo: '{n}시간 전',
    daysAgo: '{n}일 전',
  },
  vi: {
    title: 'Cộng đồng khách sạn',
    subtitle: 'Đặt câu hỏi và chia sẻ mẹo về khách sạn này với những du khách khác.',
    namePh: 'Tên của bạn (tuỳ chọn)',
    bodyPh: 'Chia sẻ câu hỏi hoặc mẹo về khách sạn này…',
    post: 'Đăng',
    empty: 'Chưa có bài viết — hãy là người đầu tiên chia sẻ.',
    anon: 'Du khách ẩn danh',
    demoNote: 'Vui lòng giữ thái độ tôn trọng. Bản demo — bài viết chỉ lưu trong trình duyệt này.',
    count: '{n} bài viết',
    delete: 'Xoá',
    now: 'vừa xong',
    minsAgo: '{n} phút trước',
    hoursAgo: '{n} giờ trước',
    daysAgo: '{n} ngày trước',
  },
  zh: {
    title: '酒店社区',
    subtitle: '就这家酒店向其他旅行者提问并分享贴士。',
    namePh: '你的昵称（可选）',
    bodyPh: '分享关于这家酒店的问题或贴士……',
    post: '发布',
    empty: '还没有帖子——来分享第一条见解吧。',
    anon: '匿名旅行者',
    demoNote: '请保持友善。演示版——帖子仅保存在此浏览器中。',
    count: '{n} 条帖子',
    delete: '删除',
    now: '刚刚',
    minsAgo: '{n} 分钟前',
    hoursAgo: '{n} 小时前',
    daysAgo: '{n} 天前',
  },
  ja: {
    title: 'ホテルコミュニティ',
    subtitle: 'このホテルについて他の旅行者と質問やヒントを共有しましょう。',
    namePh: 'お名前（任意）',
    bodyPh: 'このホテルについての質問やヒントを投稿…',
    post: '投稿',
    empty: 'まだ投稿がありません — 最初のインサイトを共有しましょう。',
    anon: '匿名の旅行者',
    demoNote: '思いやりのある投稿をお願いします。デモ — 投稿はこのブラウザにのみ保存されます。',
    count: '投稿 {n}件',
    delete: '削除',
    now: 'たった今',
    minsAgo: '{n}分前',
    hoursAgo: '{n}時間前',
    daysAgo: '{n}日前',
  },
}
