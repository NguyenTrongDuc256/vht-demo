import { CV18_FUJIAN_MOCK } from '../data/equipment.mock';
import type { IResEquipmentModelDetail } from '../models/equipment.types';

const API_DELAY_MS = 600;
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function simulateNetwork<T>(data: T, delayMs = API_DELAY_MS): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return data;
}

/**
 * API duy nhất: GET chi tiết model trang bị
 * GET {API_BASE}/equipment-models/{modelId}
 */
export async function getEquipmentModelDetail(
  modelId: string,
): Promise<IResEquipmentModelDetail> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/equipment-models/${modelId}`);
    if (!res.ok) {
      throw new Error(`Không tải được chi tiết trang bị (${res.status})`);
    }
    return res.json() as Promise<IResEquipmentModelDetail>;
  }

  if (modelId !== CV18_FUJIAN_MOCK.id && modelId !== CV18_FUJIAN_MOCK.modelId) {
    throw new Error(`Không tìm thấy model: ${modelId}`);
  }

  return simulateNetwork(structuredClone(CV18_FUJIAN_MOCK));
}
