import { queryOptions } from '@tanstack/react-query';
import type { IResEquipmentModelDetail } from '../models/equipment.types';
import { CV18_FUJIAN_MOCK } from '../data/equipment.mock';

const API_DELAY_MS = 600;

export type GetEquipmentModelParams = {
  id?: string;
  code?: string;
  modelId?: string;
  modelCode?: string;
  entityId?: string;
};

export const MkService = {
  getEquipmentModel: (params: GetEquipmentModelParams) =>
    queryOptions({
      queryKey: ['smart-duty', 'military-knowledge', 'equipment-detail', params],
      queryFn: async (): Promise<IResEquipmentModelDetail> => {
        // const { data } = await axios.get<IResEquipmentModelDetail>(
        //   '/api/v2/equipment/model/detail',
        //   { params: body },
        // );
        // return data;

        await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
        return structuredClone(CV18_FUJIAN_MOCK);
      },
    }),
};
