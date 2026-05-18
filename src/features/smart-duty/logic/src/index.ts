export type {
  IPropGroupItem,
  IPropGroupItems,
  IResEquipmentModelDetail,
} from './models/equipment.types';

export { CV18_FUJIAN_MOCK } from './data/equipment.mock';
export { equipmentQueryKeys } from './constants/query-keys';
export { getEquipmentModelDetail } from './services/equipment.service';
export {
  getEquipmentHeroImage,
  getEquipmentSatelliteImage,
  getEquipmentDisplayTitle,
} from './utils/equipment.utils';
export {
  equipmentDetailReducer,
  setActivePropertyGroupId,
  setSelectedModelId,
  selectActivePropertyGroupId,
  selectSelectedModelId,
} from './store/equipmentDetailSlice';
export type { EquipmentDetailUiState } from './store/equipmentDetailSlice';
