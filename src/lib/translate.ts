import type { Lang } from '../i18n'

/**
 * Demo phrase translator. A real build calls a machine-translation API; here a
 * small dictionary of common guest⇄hotel phrases is matched exactly so the
 * free-text demo "translates" believably. Unknown text is returned unchanged
 * (flagged as not translated).
 *
 * Each entry carries the phrase in all five languages, keyed by meaning.
 */
const PHRASES: Record<Lang, string>[] = [
  { en: 'Hello', ko: '안녕하세요', vi: 'Xin chào', zh: '你好', ja: 'こんにちは' },
  { en: 'Thank you!', ko: '감사합니다!', vi: 'Cảm ơn!', zh: '谢谢！', ja: 'ありがとうございます！' },
  { en: 'We will arrive late, around 11pm.', ko: '늦게 도착해요, 밤 11시쯤이요.', vi: 'Chúng tôi sẽ đến muộn, khoảng 11 giờ tối.', zh: '我们会晚到，大约晚上11点。', ja: '到着が遅くなります。夜11時ごろです。' },
  { en: 'We will arrive late.', ko: '늦게 도착해요.', vi: 'Chúng tôi sẽ đến muộn.', zh: '我们会晚到。', ja: '到着が遅くなります。' },
  { en: 'Could we have an early check-in?', ko: '얼리 체크인 가능할까요?', vi: 'Chúng tôi nhận phòng sớm được không?', zh: '可以提前入住吗？', ja: 'アーリーチェックインは可能ですか？' },
  { en: 'Could we have a late checkout?', ko: '레이트 체크아웃 가능할까요?', vi: 'Chúng tôi trả phòng muộn được không?', zh: '可以延迟退房吗？', ja: 'レイトチェックアウトは可能ですか？' },
  { en: 'Please prepare a quiet, high-floor room.', ko: '조용한 고층 객실로 부탁드려요.', vi: 'Vui lòng chuẩn bị phòng yên tĩnh ở tầng cao.', zh: '请安排安静的高楼层房间。', ja: '静かな高層階の部屋をお願いします。' },
  { en: 'We are celebrating our honeymoon.', ko: '신혼여행으로 가요.', vi: 'Chúng tôi đang đi tuần trăng mật.', zh: '我们在度蜜月。', ja: '新婚旅行で行きます。' },
  { en: 'Is airport pickup available?', ko: '공항 픽업 되나요?', vi: 'Có dịch vụ đón sân bay không?', zh: '有机场接机吗？', ja: '空港送迎はありますか？' },
  { en: 'We need a baby crib, please.', ko: '아기 침대가 필요해요.', vi: 'Chúng tôi cần nôi em bé.', zh: '我们需要婴儿床。', ja: 'ベビーベッドが必要です。' },
  { en: 'See you then!', ko: '그때 봬요!', vi: 'Hẹn gặp lại!', zh: '到时见！', ja: 'それではお待ちしております！' },
  { en: 'Your room is ready. We look forward to welcoming you.', ko: '객실 준비됐습니다. 곧 뵙겠습니다.', vi: 'Phòng của bạn đã sẵn sàng. Hẹn gặp bạn.', zh: '您的房间已准备好，期待您的到来。', ja: 'お部屋をご用意しました。お待ちしております。' },
]

export interface Translation {
  text: string
  translated: boolean
}

export function translatePhrase(text: string, from: Lang, to: Lang): Translation {
  if (from === to) return { text, translated: false }
  const norm = text.trim()
  const entry = PHRASES.find((p) => p[from].trim() === norm)
  if (entry && entry[to]) return { text: entry[to], translated: true }
  return { text, translated: false }
}
