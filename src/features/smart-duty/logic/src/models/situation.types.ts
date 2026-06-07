export interface IEventSituationSource {
  from: string;
  id: string;
  type: string;
  name: string;
  storageFileName?: string;
}

export interface IEventSituationEntity {
  type: string;
}

export interface IEventSituation {
  mention: string;
  refs: string[];
  sources: IEventSituationSource[];
  threatLevel: number;
  entities: IEventSituationEntity[];
}
