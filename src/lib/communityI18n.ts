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
  // Members-only gate (shown to signed-out visitors — content hidden)
  gateTitle: string
  gateText: string
  lockedCount: string // {n} conversations inside
  join: string
  createHint: string
  participatingAs: string // {name}
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
    gateTitle: 'Members only',
    gateText: 'Sign in to read and join what other travelers are asking about this hotel.',
    lockedCount: '{n} conversations inside',
    join: 'Sign in / Create account',
    createHint: 'Curious about this hotel? Create an account and ask.',
    participatingAs: 'Posting as {name}',
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
    gateTitle: '회원 전용',
    gateText: '로그인하면 다른 여행자들이 이 호텔에 대해 나눈 질문과 인사이트를 보고 참여할 수 있어요.',
    lockedCount: '{n}개의 대화가 있어요',
    join: '로그인 / 계정 만들기',
    createHint: '이 호텔이 궁금해서 오셨나요? 계정을 만들고 물어보세요.',
    participatingAs: '{name}님으로 참여 중',
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
    gateTitle: 'Chỉ dành cho thành viên',
    gateText: 'Đăng nhập để đọc và tham gia những gì du khách khác đang hỏi về khách sạn này.',
    lockedCount: 'Có {n} cuộc trò chuyện bên trong',
    join: 'Đăng nhập / Tạo tài khoản',
    createHint: 'Tò mò về khách sạn này? Tạo tài khoản và đặt câu hỏi.',
    participatingAs: 'Đăng với tên {name}',
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
    gateTitle: '仅限会员',
    gateText: '登录后即可查看并参与其他旅行者关于这家酒店的讨论。',
    lockedCount: '内有 {n} 条讨论',
    join: '登录 / 创建账户',
    createHint: '对这家酒店感兴趣？创建账户来提问吧。',
    participatingAs: '以 {name} 发布',
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
    gateTitle: '会員限定',
    gateText: 'ログインすると、他の旅行者がこのホテルについて交わした質問やインサイトを見て参加できます。',
    lockedCount: '{n}件の会話があります',
    join: 'ログイン / アカウント作成',
    createHint: 'このホテルが気になりますか？アカウントを作って質問しましょう。',
    participatingAs: '{name} として投稿中',
  },
}
