export type {
  IPropGroupItem,
  IPropGroupItems,
  IResEquipmentModelDetail,
} from './models/equipment.types';

export { CV18_FUJIAN_MOCK } from './data/equipment.mock';
export { MkService } from './services';
export type { GetEquipmentModelParams } from './services';
export {
  getEquipmentHeroImage,
  getEquipmentSatelliteImage,
  getEquipmentDisplayTitle,
} from './utils/equipment.utils';
