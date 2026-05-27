export type {
  IPropGroupItem,
  IPropGroupItems,
  IEquipmentRelationItem,
  IResEquipmentModelDetail,
} from './models/equipment.types';

export type {
  KnowledgeGraphData,
  KnowledgeGraphIconMap,
  KnowledgeGraphLink,
  KnowledgeGraphNode,
  KnowledgeGraphNodeType,
} from './models/knowledge-graph.types';

export { CV18_FUJIAN_MOCK } from './data/equipment.mock';
export { MkService } from './services';
export type { GetEquipmentModelParams } from './services';
export {
  getEquipmentHeroImage,
  getEquipmentSatelliteImage,
  getEquipmentDisplayTitle,
} from './utils/equipment.utils';
export {
  buildKnowledgeGraphFromEquipment,
  transformToGraphData,
} from './utils/knowledge-graph.transform';
