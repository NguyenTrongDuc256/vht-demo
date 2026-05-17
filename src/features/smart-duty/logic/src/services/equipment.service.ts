import { CV18_FUJIAN_MOCK } from '../data/equipment.mock';
import type { EquipmentDetailData } from '../models/equipment.types';

const API_DELAY_MS = 600;

/** Giả lập HTTP client — thay bằng fetch/axios khi có backend thật */
async function simulateNetwork<T>(data: T, delayMs = API_DELAY_MS): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return data;
}

export async function fetchEquipmentDetail(
  equipmentId: string,
): Promise<EquipmentDetailData> {
  // TODO: return fetch(`/api/equipment/${equipmentId}`).then((r) => r.json());
  if (equipmentId !== CV18_FUJIAN_MOCK.id) {
    throw new Error(`Không tìm thấy trang bị: ${equipmentId}`);
  }
  return simulateNetwork(structuredClone(CV18_FUJIAN_MOCK));
}
