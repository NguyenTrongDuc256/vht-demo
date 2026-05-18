import type { IResEquipmentModelDetail } from '../models/equipment.types';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1569098644584-2106f0bb9a3b?w=1200&q=80';
const FALLBACK_SATELLITE =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80';

export function getEquipmentHeroImage(detail: IResEquipmentModelDetail): string {
  return detail.images[0]?.url ?? FALLBACK_HERO;
}

export function getEquipmentSatelliteImage(
  detail: IResEquipmentModelDetail,
): string {
  return detail.imagesSatellites[0]?.url ?? FALLBACK_SATELLITE;
}

export function getEquipmentDisplayTitle(detail: IResEquipmentModelDetail): string {
  return detail.code ? `${detail.code} - ${detail.name}` : detail.name;
}
