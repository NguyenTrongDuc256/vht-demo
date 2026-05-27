import type { IEquipmentRelationItem, IResEquipmentModelDetail } from '../models/equipment.types';
import type {
  KnowledgeGraphData,
  KnowledgeGraphLink,
  KnowledgeGraphNode,
  KnowledgeGraphNodeType,
} from '../models/knowledge-graph.types';

// ═══════════════════════════════════════════════════════════════════════════
// CẤU HÌNH NHÁNH — thêm nhánh mới: chỉ thêm 1 object vào mảng BRANCHES
// (đồng thời thêm field tương ứng vào IResEquipmentModelDetail)
// ═══════════════════════════════════════════════════════════════════════════

export interface BranchConfig {
  /**
   * key — tên field trong response API.
   * Xác định lấy dữ liệu từ đâu: apiData[key] → mảng node của nhánh đó.
   * VD: 'operators' → apiData.operators
   */
  key: keyof Pick<IResEquipmentModelDetail, 'armaments' | 'operators' | 'carriers' | 'sensors'>;
  /**
   * type — loại node trên đồ thị.
   * Gắn vào thuộc tính `type` của node, dùng khi render / phân loại sau này.
   * VD: 'fleet' = nhóm node thuộc lực lượng khai thác.
   */
  type: KnowledgeGraphNodeType;
  /**
   * nhan — nhãn hiển thị trên đường nối (link) giữa các node.
   * VD: 'Khai thác' → link gốc → node operators ghi "Khai thác".
   */
  nhan: string;
  /**
   * mau — bảng màu của nhánh: [màu cấp 1, màu cấp 2].
   * - mau[0]: node cha (phần tử đầu mảng API) + màu link nối tới gốc
   * - mau[1]: node con (phần tử thứ 2 trở đi) + màu link nối tới cha
   */
  mau: [string, string];
  /**
   * icon — đường dẫn ảnh icon vẽ trên node thuộc nhánh này.
   * File đặt trong public/ → URL bắt đầu bằng / (VD: public/favicon.svg → '/favicon.svg')
   */
  icon: string;
  /**
   * layConTuValue — (tuỳ chọn) bật khi phần tử [0].value là mảng chuỗi.
   * Mỗi chuỗi trong value[] sẽ tạo thêm 1 node cấp 2 (dùng cho carriers / máy bay).
   */
  layConTuValue?: boolean;
}

/** Cấu hình node trung tâm (trang bị chính) */
export const ROOT_NODE_CONFIG = {
  mau: '#00d2ff',
  icon: '/favicon.svg',
};

/** @deprecated Dùng ROOT_NODE_CONFIG */
export const NODE_GOC = ROOT_NODE_CONFIG;

/**
 * Danh sách nhánh — vị trí góc tự tính, chia đều 360° theo số nhánh có dữ liệu.
 */
export const BRANCHES: BranchConfig[] = [
  {
    key: 'armaments',       // ← lấy từ apiData.armaments
    type: 'weapon',         // ← loại node vũ khí
    nhan: 'Trang bị',        // ← nhãn đường nối
    mau: ['#2575fc', '#4dabf7'], // ← [màu cấp 1, màu cấp 2]
    icon: '/favicon.svg',   // ← icon node nhánh
  },
  {
    key: 'operators',       // ← lấy từ apiData.operators (lực lượng khai thác)
    type: 'fleet',          // ← loại node hạm đội / đơn vị vận hành
    nhan: 'Khai thác',      // ← chữ trên đường nối gốc → operators
    mau: ['#f5a623', '#ff9f43'], // ← cam đậm (cấp 1) / cam nhạt (cấp 2)
    icon: '/favicon.svg',   // ← icon hiển thị trên mọi node thuộc nhánh này
  },
  {
    key: 'carriers',
    type: 'air',
    nhan: 'Triển khai',
    mau: ['#bfff00', '#86efac'],
    icon: '/favicon.svg',
    layConTuValue: true,    // ← value[] trong phần tử [0] → thêm node cấp 2 (tên máy bay)
  },
  {
    key: 'sensors',
    type: 'radar',
    nhan: 'Sử dụng',
    mau: ['#ff0090', '#f472b6'],
    icon: '/favicon.svg',
  },
];

/** @deprecated Dùng BRANCHES */
export const DANH_SACH_NHANH = BRANCHES;

// Bán kính vòng — R1: node cấp 1, R2: thêm khoảng cách cho node cấp 2
const R1 = 165;
const R2 = 115;

/** Tính góc chia đều quanh tâm — bắt đầu từ phía trên, xoay theo chiều kim đồng hồ */
function calcEvenAngle(totalBranches: number, index: number): number {
  if (totalBranches <= 0) return 0;
  return (2 * Math.PI * index) / totalBranches - Math.PI / 2;
}

/** Gán tọa độ fx/fy cố định cho node theo cấp và góc nhánh */
function assignPosition(
  node: KnowledgeGraphNode,
  level: 0 | 1 | 2,
  angle: number,
  childIndex = 0,
  totalChildren = 1,
) {
  if (level === 0) {
    node.fx = 0;
    node.fy = 0;
    return;
  }
  if (level === 1) {
    node.fx = R1 * Math.cos(angle);
    node.fy = R1 * Math.sin(angle);
    return;
  }
  // Node cấp 2: xếp quạt quanh góc nhánh cha
  const offset = totalChildren <= 1 ? 0.3 : 0.35 * (childIndex - (totalChildren - 1) / 2);
  const a = angle + offset;
  const dist = R1 + R2;
  node.fx = dist * Math.cos(a);
  node.fy = dist * Math.sin(a);
}

/** Lấy mô tả hiển thị từ field value của API */
function getItemDescription(item: IEquipmentRelationItem): string | undefined {
  if (typeof item.value === 'string') return item.value;
  if (Array.isArray(item.value)) return item.value.join('; ');
  return undefined;
}

/** Tạo object node đồ thị */
function createNode(
  id: string,
  name: string,
  type: KnowledgeGraphNodeType,
  level: 0 | 1 | 2,
  color: string,
  icon: string,
  description?: string,
): KnowledgeGraphNode {
  return {
    id,
    name,
    type,
    color,
    icon,
    size: level === 0 ? 28 : level === 1 ? 18 : 14,
    val: level === 0 ? 100 : level === 1 ? 15 : 60,
    description,
  };
}

/**
 * Chuyển response API → graphData cho ForceGraph2D.
 * - Node / link: sinh theo BRANCHES
 * - Vị trí: tự chia góc cân đối theo số nhánh có dữ liệu
 */
export function transformToGraphData(apiData: IResEquipmentModelDetail): KnowledgeGraphData {
  const nodes: KnowledgeGraphNode[] = [];
  const links: KnowledgeGraphLink[] = [];
  const rootId = apiData.id;

  // Node gốc — trang bị chính
  const root = createNode(
    rootId,
    apiData.name,
    'carrier',
    0,
    ROOT_NODE_CONFIG.mau,
    ROOT_NODE_CONFIG.icon,
  );
  assignPosition(root, 0, 0);
  nodes.push(root);

  // Chỉ xử lý nhánh có dữ liệu → góc tự cân bằng
  const activeBranches = BRANCHES.filter((cfg) => apiData[cfg.key]?.length);

  activeBranches.forEach((cfg, index) => {
    const list = apiData[cfg.key];
    if (!list?.length) return;

    const angle = calcEvenAngle(activeBranches.length, index);
    const [colorL1, colorL2] = cfg.mau;

    const first = list[0] as IEquipmentRelationItem & { items?: IEquipmentRelationItem[] };
    const level2Items: IEquipmentRelationItem[] = first.items?.length
      ? first.items
      : list.slice(1);

    // Node cấp 1 — phần tử đầu tiên của mảng API
    const parent = createNode(
      first.id,
      first.name,
      cfg.type,
      1,
      colorL1,
      cfg.icon,
      getItemDescription(first),
    );
    assignPosition(parent, 1, angle);
    nodes.push(parent);
    links.push({ source: rootId, target: first.id, label: cfg.nhan, color: colorL1 });

    // Node cấp 2 — phần tử thứ 2 trở đi (hoặc value[] nếu bật layConTuValue)
    const children = [...level2Items];
    if (cfg.layConTuValue && Array.isArray(first.value)) {
      first.value.forEach((name, i) => {
        children.push({ id: `${first.id}-v-${i}`, name: String(name) });
      });
    }

    children.forEach((item, i) => {
      const child = createNode(
        item.id,
        item.name,
        cfg.type,
        2,
        colorL2,
        cfg.icon,
        getItemDescription(item),
      );
      assignPosition(child, 2, angle, i, children.length);
      nodes.push(child);
      links.push({ source: first.id, target: item.id, label: cfg.nhan, color: colorL2 });
    });
  });

  return { nodes, links };
}

/** Tên alias — giữ tương thích code cũ */
export const buildKnowledgeGraphFromEquipment = transformToGraphData;

/** @deprecated Dùng BranchConfig */
export type CauHinhNhanh = BranchConfig;
