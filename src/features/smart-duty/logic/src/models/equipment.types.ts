export type EquipmentSpecTabId = 'tong_quan' | 'hoa_luc' | 'co_dong' | 'phong_thu';

export interface EquipmentMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  subValue?: string;
  color: string;
  icon: string;
}

export interface EquipmentSpecTab {
  id: EquipmentSpecTabId;
  title: string;
  metrics: EquipmentMetric[];
}

export interface KnowledgeNode {
  id: string;
  label: string;
  color: string;
  angle: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  tag?: 'new' | 'hot';
  source: string;
  location: string;
}

export interface ChartPoint {
  month: string;
  events: number;
  alerts: number;
}

export interface LocationFrequency {
  location: string;
  count: number;
}

export interface EquipmentDetailData {
  id: string;
  name: string;
  subtitle: string;
  flagCode: string;
  heroImage: string;
  satelliteImage: string;
  specTabs: EquipmentSpecTab[];
  knowledgeNodes: KnowledgeNode[];
  knowledgeStats: { label: string; value: string }[];
  events: TimelineEvent[];
  monthlyTrend: ChartPoint[];
  locationFrequency: LocationFrequency[];
}
