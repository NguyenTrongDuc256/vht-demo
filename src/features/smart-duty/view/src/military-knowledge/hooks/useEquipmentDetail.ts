import { useQuery } from '@tanstack/react-query';
import {
  equipmentQueryKeys,
  getEquipmentModelDetail,
} from '@smart-duty/logic';
import { useAppSelector } from '@app/hooks';

export function useEquipmentDetail() {
  const modelId = useAppSelector(
    (state) => state.equipmentDetail.selectedModelId,
  );

  return useQuery({
    queryKey: equipmentQueryKeys.detail(modelId),
    queryFn: () => getEquipmentModelDetail(modelId),
  });
}
