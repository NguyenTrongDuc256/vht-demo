// libs/features/smart-duty/logic/src/mocks/equipment.mock.ts
import type { IResEquipmentModelDetail } from '../models/equipment.types';

export const CV18_FUJIAN_MOCK: IResEquipmentModelDetail = {
  id: 'cv-18-fujian',
  code: 'CV-18',
  modelCode: 'TYPE-003',
  modelId: 'm-003',
  name: 'CV-18 - FUJIAN',
  equipmentType: { equipmentCategory: { id: 'AIRCRAFT_CARRIER' } },
  armaments: [
    {
      id: 'arm-1',
      name: 'Vũ khí',
      value:
        '2 bệ phóng tên lửa RIM-7 Sea Sparrow; 2 bệ phóng tên lửa RIM-116 Rolling Airframe Missile',
    },
    {
      id: 'arm-2',
      name: 'Pháo hạm',
      value: '3×20mm Phalanx CIWS',
    },
  ],
  entityLinks: [],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1569098644584-2106f0bb9a3b?w=1200&q=80',
    },
  ],
  operators: [
    {
      id: 'op-1',
      name: 'Lực lượng khai thác',
      value: 'Hải quân Hoa Kỳ',
    },
  ],
  carriers: [
    {
      id: 'car-1',
      name: 'Máy bay mang theo',
      value: [
        'F/A-18E/F Super Hornet',
        'EA-18G Growler',
        'E-2D Hawkeye',
        'CMV-22B Osprey',
        'MH-60 Seahawk',
      ],
    },
  ],
  sensors: [
    {
      id: 'sen-1',
      name: 'Hệ thống cảm biến và xử lý',
      value:
        'Ra đa cảnh giới trên không 3D AN/SPS-48E; ra đa cảnh giới trên không 2D AN/SPS-49(V)',
    },
    {
      id: 'sen-2',
      name: 'Tác chiến điện tử và mồi bẫy',
      value: 'Hệ thống gây nhiễu và phóng mồi bẫy',
    },
  ],
  imagesSatellites: [
    {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80',
    },
  ],
  variants: [],

  // DATA MOCK ĐỘNG THEO TAB VÀ NỘI DUNG MẢNG PROPERTIES
  propertyGroups: [
    {
      id: 'tong_quan',
      key: 'tong_quan',
      name: 'Tổng quan',
      properties: [
        { id: 'length', name: 'Chiều dài', value: '316', type: 'm', color: '#00d4ff', icon: 'straighten' },
        { id: 'width', name: 'Chiều rộng', value: '76', type: 'm', color: '#f5a623', icon: 'swap_horiz' },
        { id: 'height', name: 'Chiều cao', value: '65', type: 'm', color: '#ff6b6b', icon: 'height' },
        { id: 'displacement', name: 'Mớn nước', value: '80.000', type: 'tấn', color: '#7c8cff', icon: 'water' },
        { id: 'weight', name: 'Trọng tải', value: '70.000', type: 'tấn', color: '#ff9f43', icon: 'scale' },
        { id: 'crew', name: 'Thủy thủ đoàn', value: '3.200', type: 'người', color: '#38bdf8', icon: 'groups' }
      ]
    },
    {
      id: 'hoa_luc',
      key: 'hoa_luc',
      name: 'Hỏa lực',
      properties: [
        { id: 'missile_sys', name: 'Hệ thống tên lửa', value: 'HHQ-10', type: 'Tầm ngắn', color: '#00e5a0', icon: 'gavel' },
        { id: 'ciws', name: 'Pháo cận chiến', value: 'Type 1130 CIWS', type: '11 nòng 30mm', color: '#ff6b6b', icon: 'security' },
        { id: 'asw', name: 'Chống ngầm', value: 'Bệ phóng tự động', color: '#e879f9', icon: 'waves' }
      ]
    },
    {
      id: 'co_dong',
      key: 'co_dong',
      name: 'Cơ động',
      properties: [
        { id: 'engine', name: 'Động cơ', value: 'V-92S2 Diesel', type: 'Turbine hơi', color: '#e879f9', icon: 'settings' },
        { id: 'power', name: 'Công suất', value: '220', type: 'MW', color: '#00e5a0', icon: 'bolt' },
        { id: 'speed', name: 'Tốc độ tối đa', value: '31 - 35', type: 'hải lý/h', color: '#38bdf8', icon: 'speed' },
        { id: 'range', name: 'Tầm hoạt động', value: '~10.000', type: 'hải lý', color: '#7c8cff', icon: 'explore' }
      ]
    },
    {
      id: 'phong_thu',
      key: 'phong_thu',
      name: 'Phòng thủ',
      properties: [
        { id: 'radar_main', name: 'Radar cảnh giới', value: 'AESA Type 346B', type: 'Mảng pha chủ động', color: '#00d4ff', icon: 'radar' },
        { id: 'ew_sys', name: 'Tác chiến điện tử', value: 'Hệ thống gây nhiễu', type: 'Phóng mồi bẫy', color: '#ff9f43', icon: 'sensors' }
      ]
    }
  ]
};