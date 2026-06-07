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
  BRANCHES,
  buildKnowledgeGraphFromEquipment,
  DANH_SACH_NHANH,
  NODE_GOC,
  ROOT_NODE_CONFIG,
  transformToGraphData,
} from './utils/knowledge-graph.transform';
export type { BranchConfig, CauHinhNhanh } from './utils/knowledge-graph.transform';

export type {
  IEventSituation,
  IEventSituationEntity,
  IEventSituationSource,
} from './models/situation.types';
export {
  SituationThreatLevel,
  situationThreatLevelDefinition,
} from './const/situation-threat-level';
export { resolveThreatLevelThreshHold } from './utils/situation.utils';
export type { SituationThreatLevel } from './const/situation-threat-level';
