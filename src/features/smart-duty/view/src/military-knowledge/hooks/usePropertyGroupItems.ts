import { useMemo } from 'react';
import type { IPropGroupItem, IPropGroupItems } from '@smart-duty/logic';
import { useAppSelector } from '@app/hooks';

export function usePropertyGroupItems(
  propertyGroups: IPropGroupItems[] | undefined,
) {
  const activePropertyGroupId = useAppSelector(
    (state) => state.equipmentDetail.activePropertyGroupId,
  );

  return useMemo(() => {
    if (!propertyGroups?.length) return [] as IPropGroupItem[];
    const group =
      propertyGroups.find((g) => g.id === activePropertyGroupId) ??
      propertyGroups[0];
    return group.properties ?? [];
  }, [propertyGroups, activePropertyGroupId]);
}
