import type { EquipmentDetailData } from '../models/equipment.types';

const HERO =
  'https://images.unsplash.com/photo-1569098644584-2106f0bb9a3b?w=1200&q=80';
const SATELLITE =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80';

export const CV18_FUJIAN_MOCK: EquipmentDetailData = {
  id: 'cv-18-fujian',
  name: 'CV-18 - FUJIAN',
  subtitle: 'CV-18 Phúc Kiến',
  flagCode: 'CN',
  heroImage: HERO,
  satelliteImage: SATELLITE,
  
  // Phần chỉnh sửa chính: Chuyển specs thành danh sách Tab động và nội dung động theo tab
  specTabs: [
    {
      id: 'tong_quan',
      title: 'Tổng quan',
      metrics: [
        { id: 'length', label: 'Chiều dài', value: '316', unit: 'm', color: '#00d4ff', icon: 'straighten' },
        { id: 'width', label: 'Chiều rộng', value: '76', unit: 'm', color: '#f5a623', icon: 'swap_horiz' },
        { id: 'height', label: 'Chiều cao', value: '65', unit: 'm', color: '#ff6b6b', icon: 'height' },
        { id: 'displacement', label: 'Mớn nước', value: '80.000', unit: 'tấn', color: '#7c8cff', icon: 'water' },
        { id: 'weight', label: 'Trọng tải', value: '70.000', unit: 'tấn', color: '#ff9f43', icon: 'scale' },
        { id: 'crew', label: 'Thủy thủ đoàn', value: '3.200', unit: 'người', color: '#38bdf8', icon: 'groups' }
      ]
    },
    {
      id: 'hoa_luc',
      title: 'Hỏa lực',
      metrics: [
        { id: 'missile_sys', label: 'Hệ thống tên lửa', value: 'HHQ-10', subValue: 'Tên lửa đối không tầm ngắn', color: '#00e5a0', icon: 'gavel' },
        { id: 'ciws', label: 'Pháo cận chiến', value: 'Type 1130 CIWS', subValue: '11 nòng 30mm', color: '#ff6b6b', icon: 'security' },
        { id: 'asw', label: 'Chống ngầm', value: 'Bệ phóng tự động', color: '#e879f9', icon: 'waves' }
      ]
    },
    {
      id: 'co_dong',
      title: 'Cơ động',
      metrics: [
        { id: 'engine', label: 'Động cơ', value: 'V-92S2 Diesel', subValue: 'Turbine hơi tích hợp', color: '#e879f9', icon: 'settings' },
        { id: 'power', label: 'Công suất', value: '220', unit: 'MW', color: '#00e5a0', icon: 'bolt' },
        { id: 'speed', label: 'Tốc độ tối đa', value: '31 - 35', unit: 'hải lý/h', color: '#38bdf8', icon: 'speed' },
        { id: 'range', label: 'Tầm hoạt động', value: '~10.000', unit: 'hải lý', color: '#7c8cff', icon: 'explore' }
      ]
    },
    {
      id: 'phong_thu',
      title: 'Phòng thủ',
      metrics: [
        { id: 'radar_main', label: 'Radar cảnh giới', value: 'AESA Type 346B', subValue: 'Mảng pha chủ động', color: '#00d4ff', icon: 'radar' },
        { id: 'ew_sys', label: 'Tác chiến điện tử', value: 'Hệ thống gây nhiễu', subValue: 'Tích hợp phóng mồi bẫy', color: '#ff9f43', icon: 'sensors' }
      ]
    }
  ],

  knowledgeNodes: [
    { id: 'ew', label: 'Tác chiến điện tử', color: '#00d4ff', angle: 0 },
    { id: 'log', label: 'Hậu cần', color: '#f5a623', angle: 45 },
    { id: 'air', label: 'Không quân hải quân', color: '#ff6b6b', angle: 90 },
    { id: 'radar', label: 'Radar & cảm biến', color: '#7c8cff', angle: 135 },
    { id: 'missile', label: 'Tên lửa phòng không', color: '#00e5a0', angle: 180 },
    { id: 'comm', label: 'Thông tin liên lạc', color: '#e879f9', angle: 225 },
    { id: 'nav', label: 'Điều hướng', color: '#38bdf8', angle: 270 },
    { id: 'ops', label: 'Tác nghiệp tàu sân bay', color: '#ff9f43', angle: 315 },
  ],
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
        'Hệ thống giám sát vệ tinh ghi nhận CV-18 Fujian di chuyển theo hướng nam đông, tốc độ 18 hải lý. Nguồn ảnh SAR xác nhận chữ ký radar khớp với hồ sơ định danh.',
      tag: 'hot',
      source: 'Nguồn: Vệ tinh SAR',
      location: 'Vị trí: Biển Đông (16.2°N, 112.8°E)',
    },
    {
      id: 'e2',
      date: '15-03-2026',
      title: 'Xuất hiện tại căn cứ Du Lâm',
      description:
        'Tàu được quan sát neo đậu tại căn cứ hải quân Du Lâm trong 72 giờ. Hoạt động bổ sung nhiên liệu và vật tư được ghi nhận qua ảnh vệ tinh thương mại.',
      tag: 'new',
      source: 'Nguồn: Ảnh thương mại',
      location: 'Vị trí: Du Lâm, Hải Nam',
    },
    {
      id: 'e3',
      date: '02-02-2026',
      title: 'Diễn tập hải quân đa phương tiện',
      description:
        'CV-18 tham gia cuộc diễn tập cùng hộ tống và tàu ngầm. Tần suất liên lạc vô tuyến tăng 340% so với mức cơ sở trong 48 giờ.',
      source: 'Nguồn: SIGINT',
      location: 'Vị trí: Biển Hoa Đông',
    },
    {
      id: 'e4',
      date: '18-12-2025',
      title: 'Cập nhật định danh radar mới',
      description:
        'Hệ thống phân loại cập nhật chữ ký RCS cho CV-18 sau lần nâng cấp radar Type-346B. Độ tin cậy định danh tự động: 94.2%.',
      source: 'Nguồn: CSDL nội bộ',
      location: 'Vị trí: —',
    },
  ],
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
  ],
  locationFrequency: [
    { location: 'Hải Nam', count: 42 },
    { location: 'Du Lâm', count: 38 },
    { location: 'Biển Đông', count: 35 },
    { location: 'Hoa Đông', count: 28 },
    { location: 'Vịnh Bắc Bộ', count: 22 },
    { location: 'Đài Loan EO', count: 18 },
    { location: 'Hoàng Sa', count: 14 },
  ],
};