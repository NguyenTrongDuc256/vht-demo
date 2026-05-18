/** Dữ liệu UI bổ sung — chưa có trong API get detail, tách riêng đến khi BE bổ sung */

export interface DashboardKnowledgeNode {
  id: string;
  label: string;
  color: string;
  angle: number;
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

export const EQUIPMENT_DASHBOARD_MOCK = {
  subtitle: 'CV-18 Phúc Kiến',
  knowledgeNodes: [
    { id: 'ew', label: 'Tác chiến điện tử', color: '#00d4ff', angle: 0 },
    { id: 'log', label: 'Hậu cần', color: '#f5a623', angle: 45 },
    { id: 'air', label: 'Không quân hải quân', color: '#ff6b6b', angle: 90 },
    { id: 'radar', label: 'Radar & cảm biến', color: '#7c8cff', angle: 135 },
    { id: 'missile', label: 'Tên lửa phòng không', color: '#00e5a0', angle: 180 },
    { id: 'comm', label: 'Thông tin liên lạc', color: '#e879f9', angle: 225 },
    { id: 'nav', label: 'Điều hướng', color: '#38bdf8', angle: 270 },
    { id: 'ops', label: 'Tác nghiệp tàu sân bay', color: '#ff9f43', angle: 315 },
  ] satisfies DashboardKnowledgeNode[],
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
