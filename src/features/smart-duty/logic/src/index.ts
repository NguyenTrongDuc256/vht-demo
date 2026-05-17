export type {
  EquipmentSpecTabId,
  EquipmentMetric,
  EquipmentSpecTab,
  KnowledgeNode,
  TimelineEvent,
  ChartPoint,
  LocationFrequency,
  EquipmentDetailData,
} from './models/equipment.types';

export { CV18_FUJIAN_MOCK } from './data/equipment.mock';
export { equipmentQueryKeys } from './constants/query-keys';
export { fetchEquipmentDetail } from './services/equipment.service';
export {
  equipmentDetailReducer,
  setActiveSpecTabId,
  setSelectedEquipmentId,
  selectActiveSpecTabId,
  selectSelectedEquipmentId,
} from './store/equipmentDetailSlice';
export type { EquipmentDetailUiState } from './store/equipmentDetailSlice';
