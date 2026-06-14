import type { HotelContentMap } from './types'
import { ko } from './ko'
import { vi } from './vi'
import { zh } from './zh'
import { ja } from './ja'

export const hotelContent: Record<string, HotelContentMap> = { ko, vi, zh, ja }
