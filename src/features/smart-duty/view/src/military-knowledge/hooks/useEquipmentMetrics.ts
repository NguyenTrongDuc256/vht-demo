import { useMemo } from 'react';
import type { EquipmentMetric, EquipmentSpecTab } from '@smart-duty/logic';
import { useAppSelector } from '@app/hooks';

export function useEquipmentMetrics(specTabs: EquipmentSpecTab[] | undefined) {
  const activeSpecTabId = useAppSelector(
    (state) => state.equipmentDetail.activeSpecTabId,
  );

  return useMemo(() => {
    if (!specTabs?.length) return [] as EquipmentMetric[];
    const tab =
      specTabs.find((t) => t.id === activeSpecTabId) ?? specTabs[0];
    return tab.metrics;
  }, [specTabs, activeSpecTabId]);
}
