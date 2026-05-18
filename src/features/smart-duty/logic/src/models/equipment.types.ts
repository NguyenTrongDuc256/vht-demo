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

export interface IResEquipmentModelDetail {
  id: string;
  code: string;
  modelCode: string;
  modelId: string;
  name: string;
  equipmentType: { equipmentCategory: { id: string } };
  armaments: unknown[];
  entityLinks: unknown[];
  images: Array<{ id?: string; url: string; type?: string }>;
  operators: unknown[];
  propertyGroups: IPropGroupItems[];
  variants: unknown[];
  imagesSatellites: Array<{ id?: string; url: string; type?: string }>;
}
