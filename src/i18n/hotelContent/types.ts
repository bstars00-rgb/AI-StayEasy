import type { Hotel } from '../../types'

/** The translatable text fields of a hotel, keyed by hotel id. */
export type HotelText = Pick<
  Hotel,
  | 'shortDescription'
  | 'positioningLine'
  | 'bestFor'
  | 'notIdealFor'
  | 'mainReason'
  | 'thingsToCheck'
  | 'officialBenefits'
  | 'roomGuide'
  | 'locationGuide'
  | 'cancellationChecklist'
>

export type HotelContentMap = Record<string, HotelText>
