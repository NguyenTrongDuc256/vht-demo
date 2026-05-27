/** Dữ liệu UI bổ sung — chưa có trong API get detail, tách riêng đến khi BE bổ sung */

export type KnowledgeGraphNodeType =
  | 'carrier'
  | 'weapon'
  | 'fleet'
  | 'air'
  | 'radar'
  | 'mission';

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  size: number;
  type: KnowledgeGraphNodeType;
  /** Vị trí cố định (force-graph pin) */
  fx?: number;
  fy?: number;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  label: string;
  color: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
}

export interface DashboardTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  tag?: 'new' | 'hot';
  source: string;
  location: string;
}

export interface DashboardChartPoint {
  month: string;
  events: number;
  alerts: number;
}

export interface DashboardLocationFrequency {
  location: string;
  count: number;
}

/** Đồ thị tri thức CV-18 — cấp 1 (vòng quanh tâm) + cấp 2 (nhánh con) */
export const CV18_KNOWLEDGE_GRAPH: KnowledgeGraphData = {
  nodes: [
    {
      id: 'cv18',
      name: 'CV-18 PHÚC KIẾN',
      val: 100,
      color: '#00d2ff',
      size: 28,
      type: 'carrier',
      fx: 0,
      fy: 0,
    },
    // —— cấp 1 ——
    {
      id: 'vukhi',
      name: 'HỆ THỐNG VŨ KHÍ',
      val: 15,
      color: '#2575fc',
      size: 18,
      type: 'weapon',
      fx: -150,
      fy: -90,
    },
    {
      id: 'hotong',
      name: 'HẠM ĐỘI HỘ TỐNG',
      val: 15,
      color: '#f5a623',
      size: 18,
      type: 'fleet',
      fx: 170,
      fy: -70,
    },
    {
      id: 'kq',
      name: 'KHÔNG QUÂN',
      val: 15,
      color: '#bfff00',
      size: 18,
      type: 'air',
      fx: 40,
      fy: 160,
    },
    {
      id: 'radar',
      name: 'RADAR & TÁC CHIẾN',
      val: 15,
      color: '#ff0090',
      size: 18,
      type: 'radar',
      fx: -160,
      fy: 120,
    },
    {
      id: 'nhiemvu',
      name: 'NHIỆM VỤ',
      val: 15,
      color: '#a855f7',
      size: 18,
      type: 'mission',
      fx: 200,
      fy: 100,
    },
    // —— cấp 2 ——
    {
      id: 'vukhi1',
      name: 'TÊN LỬA ĐIỆN TỬ',
      val: 80,
      color: '#4dabf7',
      size: 14,
      type: 'weapon',
      fx: -60,
      fy: -220,
    },
    {
      id: 'vukhi2',
      name: 'PHÁO CỰ LY',
      val: 60,
      color: '#4dabf7',
      size: 12,
      type: 'weapon',
      fx: -220,
      fy: -180,
    },
    {
      id: 'hotong1',
      name: 'TYPE-055',
      val: 70,
      color: '#ff9f43',
      size: 14,
      type: 'fleet',
      fx: 280,
      fy: -160,
    },
    {
      id: 'kq1',
      name: 'J-15B',
      val: 70,
      color: '#86efac',
      size: 14,
      type: 'air',
      fx: 120,
      fy: 260,
    },
    {
      id: 'kq2',
      name: 'KJ-600',
      val: 60,
      color: '#86efac',
      size: 12,
      type: 'air',
      fx: -40,
      fy: 280,
    },
    {
      id: 'radar1',
      name: 'TYPE-346B',
      val: 70,
      color: '#f472b6',
      size: 14,
      type: 'radar',
      fx: -280,
      fy: 200,
    },
  ],
  links: [
    { source: 'cv18', target: 'vukhi', label: 'Trang bị', color: '#00d2ff' },
    { source: 'cv18', target: 'hotong', label: 'Được hỗ trợ', color: '#f5a623' },
    { source: 'cv18', target: 'kq', label: 'Triển khai', color: '#bfff00' },
    { source: 'cv18', target: 'radar', label: 'Sử dụng', color: '#ff0090' },
    { source: 'cv18', target: 'nhiemvu', label: 'Có khả năng', color: '#a855f7' },
    // cấp 2
    { source: 'vukhi', target: 'vukhi1', label: 'Trang bị', color: '#4dabf7' },
    { source: 'vukhi', target: 'vukhi2', label: 'Trang bị', color: '#4dabf7' },
    { source: 'hotong', target: 'hotong1', label: 'Hộ tống', color: '#ff9f43' },
    { source: 'kq', target: 'kq1', label: 'Triển khai', color: '#86efac' },
    { source: 'kq', target: 'kq2', label: 'Triển khai', color: '#86efac' },
    { source: 'radar', target: 'radar1', label: 'Định vị', color: '#f472b6' },
  ],
};

export const EQUIPMENT_DASHBOARD_MOCK = {
  subtitle: 'CV-18 Phúc Kiến',
  knowledgeGraph: CV18_KNOWLEDGE_GRAPH,
  knowledgeStats: [
    { label: 'Trọng tải', value: '80.000 tấn' },
    { label: 'Chiều dài', value: '316 m' },
    { label: 'Hệ thống phóng', value: 'EMALS' },
    { label: 'Tốc độ', value: '30+ hải lý' },
    { label: 'Máy bay', value: '40–50' },
    { label: 'Hạ thủy', value: '2022' },
  ],
  events: [
    {
      id: 'e1',
      date: '28-03-2026',
      title: 'Phát hiện tàu sân bay CV-18 tại vùng biển Đông',
      description:
        'Hệ thống giám sát vệ tinh ghi nhận CV-18 Fujian di chuyển theo hướng nam đông, tốc độ 18 hải lý.',
      tag: 'hot' as const,
      source: 'Nguồn: Vệ tinh SAR',
      location: 'Vị trí: Biển Đông (16.2°N, 112.8°E)',
    },
    {
      id: 'e2',
      date: '15-03-2026',
      title: 'Xuất hiện tại căn cứ Du Lâm',
      description: 'Tàu neo đậu tại căn cứ hải quân Du Lâm trong 72 giờ.',
      tag: 'new' as const,
      source: 'Nguồn: Ảnh thương mại',
      location: 'Vị trí: Du Lâm, Hải Nam',
    },
    {
      id: 'e3',
      date: '02-02-2026',
      title: 'Diễn tập hải quân đa phương tiện',
      description: 'CV-18 tham gia diễn tập cùng hộ tống và tàu ngầm.',
      source: 'Nguồn: SIGINT',
      location: 'Vị trí: Biển Hoa Đông',
    },
    {
      id: 'e4',
      date: '18-12-2025',
      title: 'Cập nhật định danh radar mới',
      description: 'Cập nhật chữ ký RCS sau nâng cấp radar Type-346B.',
      source: 'Nguồn: CSDL nội bộ',
      location: 'Vị trí: —',
    },
  ] satisfies DashboardTimelineEvent[],
  monthlyTrend: [
    { month: 'T1', events: 4, alerts: 2 },
    { month: 'T2', events: 7, alerts: 4 },
    { month: 'T3', events: 12, alerts: 8 },
    { month: 'T4', events: 9, alerts: 5 },
    { month: 'T5', events: 15, alerts: 11 },
    { month: 'T6', events: 11, alerts: 7 },
    { month: 'T7', events: 18, alerts: 14 },
    { month: 'T8', events: 14, alerts: 9 },
    { month: 'T9', events: 20, alerts: 16 },
    { month: 'T10', events: 17, alerts: 12 },
    { month: 'T11', events: 22, alerts: 18 },
    { month: 'T12', events: 19, alerts: 15 },
  ] satisfies DashboardChartPoint[],
  locationFrequency: [
    { location: 'Hải Nam', count: 42 },
    { location: 'Du Lâm', count: 38 },
    { location: 'Biển Đông', count: 35 },
    { location: 'Hoa Đông', count: 28 },
    { location: 'Vịnh Bắc Bộ', count: 22 },
    { location: 'Đài Loan EO', count: 18 },
    { location: 'Hoàng Sa', count: 14 },
  ] satisfies DashboardLocationFrequency[],
};
