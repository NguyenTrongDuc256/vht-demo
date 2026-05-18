import type { IResEquipmentModelDetail } from '../models/equipment.types';

const HERO =
  'https://images.unsplash.com/photo-1569098644584-2106f0bb9a3b?w=1200&q=80';
const SATELLITE =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80';

export const CV18_FUJIAN_MOCK: IResEquipmentModelDetail = {
  id: 'cv-18-fujian',
  code: 'CV-18',
  modelCode: 'CV-18',
  modelId: 'model-cv-18-fujian',
  name: 'FUJIAN',
  equipmentType: { equipmentCategory: { id: 'aircraft-carrier' } },
  armaments: [],
  entityLinks: [],
  operators: [],
  variants: [],
  images: [{ id: 'img-hero', url: HERO, type: 'hero' }],
  imagesSatellites: [{ id: 'img-sat', url: SATELLITE, type: 'satellite' }],
  propertyGroups: [
    {
      id: 'pg-tong-quan',
      key: 'tong_quan',
      name: 'Tổng quan',
      properties: [
        { id: 'length', name: 'Chiều dài', value: '316', type: 'm', color: '#00d4ff', icon: 'straighten' },
        { id: 'width', name: 'Chiều rộng', value: '76', type: 'm', color: '#f5a623', icon: 'swap_horiz' },
        { id: 'height', name: 'Chiều cao', value: '65', type: 'm', color: '#ff6b6b', icon: 'height' },
        { id: 'displacement', name: 'Mớn nước', value: '80.000', type: 'tấn', color: '#7c8cff', icon: 'water' },
        { id: 'weight', name: 'Trọng tải', value: '70.000', type: 'tấn', color: '#ff9f43', icon: 'scale' },
        { id: 'crew', name: 'Thủy thủ đoàn', value: '3.200', type: 'người', color: '#38bdf8', icon: 'groups' },
      ],
    },
    {
      id: 'pg-hoa-luc',
      key: 'hoa_luc',
      name: 'Hỏa lực',
      properties: [
        { id: 'missile_sys', name: 'Hệ thống tên lửa', value: 'HHQ-10', key: 'Tên lửa đối không tầm ngắn', color: '#00e5a0', icon: 'gavel' },
        { id: 'ciws', name: 'Pháo cận chiến', value: 'Type 1130 CIWS', key: '11 nòng 30mm', color: '#ff6b6b', icon: 'security' },
        { id: 'asw', name: 'Chống ngầm', value: 'Bệ phóng tự động', color: '#e879f9', icon: 'waves' },
      ],
    },
    {
      id: 'pg-co-dong',
      key: 'co_dong',
      name: 'Cơ động',
      properties: [
        { id: 'engine', name: 'Động cơ', value: 'V-92S2 Diesel', key: 'Turbine hơi tích hợp', color: '#e879f9', icon: 'settings' },
        { id: 'power', name: 'Công suất', value: '220', type: 'MW', color: '#00e5a0', icon: 'bolt' },
        { id: 'speed', name: 'Tốc độ tối đa', value: '31 - 35', type: 'hải lý/h', color: '#38bdf8', icon: 'speed' },
        { id: 'range', name: 'Tầm hoạt động', value: '~10.000', type: 'hải lý', color: '#7c8cff', icon: 'explore' },
      ],
    },
    {
      id: 'pg-phong-thu',
      key: 'phong_thu',
      name: 'Phòng thủ',
      properties: [
        { id: 'radar_main', name: 'Radar cảnh giới', value: 'AESA Type 346B', key: 'Mảng pha chủ động', color: '#00d4ff', icon: 'radar' },
        { id: 'ew_sys', name: 'Tác chiến điện tử', value: 'Hệ thống gây nhiễu', key: 'Tích hợp phóng mồi bẫy', color: '#ff9f43', icon: 'sensors' },
      ],
    },
  ],
};
