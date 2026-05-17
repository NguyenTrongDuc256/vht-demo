import { useQuery } from '@tanstack/react-query';
import {
  equipmentQueryKeys,
  fetchEquipmentDetail,
} from '@smart-duty/logic';
import { useAppSelector } from '@app/hooks';

export function useEquipmentDetail() {
  const equipmentId = useAppSelector(
    (state) => state.equipmentDetail.selectedEquipmentId,
  );

  return useQuery({
    queryKey: equipmentQueryKeys.detail(equipmentId),
    queryFn: () => fetchEquipmentDetail(equipmentId),
  });
}
