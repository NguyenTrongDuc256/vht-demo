export interface IPropGroupItem {
  id: string;
  key?: string;
  name: string;
  value: string;
  type?: string;
  icon?: string;
  color?: string;
  index?: number;
  lang?: string;
  refs?: unknown[];
}

export interface IPropGroupItems {
  id: string;
  key: string;
  name: string;
  parent?: string | null;
  status?: string;
  properties?: IPropGroupItem[];
  type?: string;
  value?: string;
  refs?: unknown[];
  deepLevel?: boolean;
}

/** Một mục trong armaments / operators / carriers / sensors */
export interface IEquipmentRelationItem {
  id: string;
  name: string;
  value?: string | string[];
  icon?: string;
  type?: string;
}

export interface IResEquipmentModelDetail {
  id: string;
  code: string;
  modelCode: string;
  modelId: string;
  name: string;
  equipmentType: { equipmentCategory: { id: string } };
  armaments: IEquipmentRelationItem[];
  entityLinks: unknown[];
  images: Array<{ id?: string; url: string; type?: string }>;
  operators: IEquipmentRelationItem[];
  carriers: IEquipmentRelationItem[];
  sensors: IEquipmentRelationItem[];
  propertyGroups: IPropGroupItems[];
  variants: unknown[];
  imagesSatellites: Array<{ id?: string; url: string; type?: string }>;
}
