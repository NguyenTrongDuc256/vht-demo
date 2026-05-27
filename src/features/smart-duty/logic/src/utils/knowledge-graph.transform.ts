/**
 * Chuyển dữ liệu API chi tiết trang bị → graphData cho ForceGraph2D.
 *
 * Luồng xử lý:
 *   buildKnowledgeGraphFromEquipment(dữLiệuApi, danhSachIcon)
 *     → mergeGraphNodes()      : gộp node/link theo cấp
 *     → assignNodePositions()  : gán vị trí fx/fy + màu + icon
 *
 * ─── HƯỚNG DẪN CẤU HÌNH ──────────────────────────────────────────────────
 *
 * 1) THÊM / ĐỔI ICON
 *    → Sửa `KNOWLEDGE_GRAPH_ICONS` trong:
 *      view/.../constants/equipment-dashboard.mock.ts
 *    → Key = `type` của node (carrier | weapon | fleet | air | radar | mission)
 *    → File trong public/ → URL bắt đầu bằng `/` (VD: public/favicon.svg → `/favicon.svg`)
 *
 * 2) THÊM NHÁNH MỚI (VD: nhiệm vụ)
 *    a) Thêm field vào IResEquipmentModelDetail (equipment.types.ts)
 *    b) Thêm key vào BranchKey, BRANCHES, BRANCH_ANGLE, BRANCH_LABEL,
 *       BRANCH_COLOR, BRANCH_NODE_TYPE (cùng thứ tự, cùng chỉ số index)
 *    c) Thêm field vào Pick<> của mergeGraphNodes / buildKnowledgeGraphFromEquipment
 *    d) Thêm icon type tương ứng vào KNOWLEDGE_GRAPH_ICONS
 *
 * 3) THÊM NODE CẤP 2 (từ API)
 *    → Phần tử [0] của mảng nhánh = node cấp 1
 *    → Phần tử [1], [2], … = node cấp 2 (con của phần tử [0])
 *    → Riêng `carriers`: nếu phần tử [0].value là mảng chuỗi → mỗi phần tử = 1 node cấp 2
 *
 * 4) ĐỔI MÀU
 *    → BRANCH_COLOR[branchIndex] = [màu cấp 1, màu cấp 2]
 *    → Node trung tâm: sửa '#00d2ff' trong getNodeStyle()
 *
 * 5) ĐỔI VỊ TRÍ
 *    → BRANCH_ANGLE: góc (radian) của từng nhánh quanh tâm
 *       -Math.PI = trái, 0 = phải, -Math.PI/2 = trên, Math.PI/2 = dưới
 *    → R1: bán kính vòng cấp 1 (khoảng cách từ tâm)
 *    → R2: cộng thêm vào R1 để đẩy node cấp 2 ra xa hơn
 *    → spread (0.35): độ giãn node cấp 2 khi có nhiều con cùng nhánh
 */

import type { IEquipmentRelationItem, IResEquipmentModelDetail } from '../models/equipment.types';
import type {
  KnowledgeGraphData,
  KnowledgeGraphIconMap,
  KnowledgeGraphLink,
  KnowledgeGraphNode,
  KnowledgeGraphNodeType,
} from '../models/knowledge-graph.types';

/** Key trùng tên field API — thêm nhánh mới thì khai báo ở đây trước */
type BranchKey = 'armaments' | 'operators' | 'carriers' | 'sensors';

type DraftNode = {
  id: string;
  name: string;
  level: 0 | 1 | 2;
  type: KnowledgeGraphNodeType;
  branchIndex?: number;
  parentId?: string;
  description?: string;
};

/**
 * Danh sách nhánh — thứ tự quan trọng, index 0..3 phải khớp với các mảng bên dưới.
 * Thêm nhánh: thêm key mới VÀ bổ sung 1 phần tử tương ứng ở BRANCH_ANGLE, BRANCH_LABEL,
 * BRANCH_COLOR, BRANCH_NODE_TYPE.
 */
const BRANCHES: BranchKey[] = ['armaments', 'operators', 'carriers', 'sensors'];

/**
 * Góc đặt nhánh cấp 1 quanh node trung tâm (đơn vị: radian).
 * 4 nhánh → chia đều 4 hướng. Muốn xoay nhánh: tăng/giảm số tại index tương ứng.
 */
const BRANCH_ANGLE = [-2.4, -0.8, 0.8, 2.4];

/** Nhãn hiển thị trên link nối giữa các node */
const BRANCH_LABEL = ['Trang bị', 'Khai thác', 'Triển khai', 'Sử dụng'];

/**
 * Màu theo nhánh: [cấp 1, cấp 2].
 * branchIndex 0 = armaments, 1 = operators, 2 = carriers, 3 = sensors.
 */
const BRANCH_COLOR: [string, string][] = [
  ['#2575fc', '#4dabf7'], // vũ khí (armaments)
  ['#f5a623', '#ff9f43'], // lực lượng khai thác (operators)
  ['#bfff00', '#86efac'], // máy bay mang theo (carriers)
  ['#ff0090', '#f472b6'], // cảm biến (sensors)
];

/**
 * Kiểu (type) node theo nhánh — quyết định icon lấy từ key nào trong KNOWLEDGE_GRAPH_ICONS.
 * Thêm type mới: khai báo trong knowledge-graph.types.ts rồi gán map ở đây.
 */
const BRANCH_NODE_TYPE: Record<BranchKey, KnowledgeGraphNodeType> = {
  armaments: 'weapon',
  operators: 'fleet',
  carriers: 'air',
  sensors: 'radar',
};

function getBranchColor(branchIndex: number, level: 1 | 2): string {
  return BRANCH_COLOR[branchIndex]?.[level === 1 ? 0 : 1] ?? '#888';
}

/**
 * Gộp màu + icon + kích thước cho một node.
 * Icon: lấy theo `type` từ bản đồ icon truyền vào (KNOWLEDGE_GRAPH_ICONS).
 * Dự phòng: nếu thiếu icon cho type → dùng icons.carrier.
 */
export function getNodeStyle(
  type: KnowledgeGraphNodeType,
  level: 0 | 1 | 2,
  branchIndex = 0,
  icons: KnowledgeGraphIconMap,
) {
  const color =
    level === 0 ? '#00d2ff' : BRANCH_COLOR[branchIndex]?.[level === 1 ? 0 : 1] ?? '#888';

  const icon = icons[type] ?? icons.carrier;

  return {
    type,
    color,
    icon,
    size: level === 0 ? 28 : level === 1 ? 18 : 14, // chỉnh kích thước node tại đây
    val: level === 0 ? 100 : level === 1 ? 15 : 60,
  };
}

/**
 * Gán fx/fy (vị trí cố định) cho từng node.
 *
 * Bố cục:
 *   - Cấp 0 (trang bị chính): luôn ở (0, 0)
 *   - Cấp 1: vòng tròn bán kính R1, góc = BRANCH_ANGLE[branchIndex]
 *   - Cấp 2: xa tâm hơn (R1 + R2), xếp quạt quanh góc nhánh cha
 */
export function assignNodePositions(
  drafts: DraftNode[],
  icons: KnowledgeGraphIconMap,
): KnowledgeGraphNode[] {
  const R1 = 165; // ← khoảng cách node cấp 1 tới tâm
  const R2 = 115; // ← thêm khoảng cách cho node cấp 2

  const level2ByParent = new Map<string, DraftNode[]>();
  for (const n of drafts) {
    if (n.level !== 2 || !n.parentId) continue;
    const list = level2ByParent.get(n.parentId) ?? [];
    list.push(n);
    level2ByParent.set(n.parentId, list);
  }

  return drafts.map((n) => {
    const branchIndex = n.branchIndex ?? 0;
    const style = getNodeStyle(n.type, n.level, branchIndex, icons);

    const node: KnowledgeGraphNode = {
      id: n.id,
      name: n.name,
      description: n.description,
      ...style,
    };

    if (n.level === 0) return { ...node, fx: 0, fy: 0 };

    const angle = BRANCH_ANGLE[branchIndex] ?? 0;

    if (n.level === 1) {
      return { ...node, fx: R1 * Math.cos(angle), fy: R1 * Math.sin(angle) };
    }

    const siblings = level2ByParent.get(n.parentId!) ?? [];
    const i = siblings.findIndex((s) => s.id === n.id);
    // 0.35: độ giãn giữa các node cấp 2 — tăng nếu node bị chồng lên nhau
    const spread = siblings.length <= 1 ? 0.3 : 0.35 * (i - (siblings.length - 1) / 2);
    const a = angle + spread;
    const dist = R1 + R2;

    return { ...node, fx: dist * Math.cos(a), fy: dist * Math.sin(a) };
  });
}

function toItems(raw: unknown): IEquipmentRelationItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x) => x?.id && x?.name);
}

function itemDesc(item: IEquipmentRelationItem): string | undefined {
  if (typeof item.value === 'string') return item.value;
  if (Array.isArray(item.value)) return item.value.join('; ');
  return undefined;
}

/**
 * Gộp dữ liệu API thành bản nháp node (drafts) + liên kết (links).
 *
 * Quy tắc phân cấp:
 *   - equipment.id/name → node trung tâm (cấp 0, type: carrier)
 *   - Mỗi field trong BRANCHES (armaments, operators, …):
 *       items[0]            → cấp 1, nối thẳng tới tâm
 *       items[1], [2], …    → cấp 2, nối tới items[0]
 *       carriers[0].value[] → thêm cấp 2 (tên máy bay từ mảng value)
 */
export function mergeGraphNodes(
  equipment: Pick<
    IResEquipmentModelDetail,
    'id' | 'name' | 'armaments' | 'operators' | 'carriers' | 'sensors'
  >,
): { drafts: DraftNode[]; links: KnowledgeGraphLink[] } {
  const centerId = equipment.id;
  const drafts: DraftNode[] = [
    { id: centerId, name: equipment.name, level: 0, type: 'carrier' },
  ];
  const links: KnowledgeGraphLink[] = [];

  BRANCHES.forEach((key, branchIndex) => {
    const items = toItems(equipment[key]);
    if (!items.length) return;

    const nodeType = BRANCH_NODE_TYPE[key];
    const [first, ...rest] = items;
    const parentId = first.id;
    const linkColor = getBranchColor(branchIndex, 1);

    // ── Node cấp 1: phần tử đầu tiên của mảng nhánh ──
    drafts.push({
      id: parentId,
      name: first.name,
      level: 1,
      type: nodeType,
      branchIndex,
      description: itemDesc(first),
    });

    links.push({
      source: centerId,
      target: parentId,
      label: BRANCH_LABEL[branchIndex],
      color: linkColor,
    });

    // ── Node cấp 2: phần tử thứ 2 trở đi ──
    const addChild = (id: string, name: string, description?: string) => {
      drafts.push({
        id,
        name,
        level: 2,
        type: nodeType,
        branchIndex,
        parentId,
        description,
      });
      links.push({
        source: parentId,
        target: id,
        label: BRANCH_LABEL[branchIndex],
        color: getBranchColor(branchIndex, 2),
      });
    };

    rest.forEach((item) => addChild(item.id, item.name, itemDesc(item)));

    // carriers: value là mảng tên máy bay → mỗi phần tử tạo một node cấp 2
    if (key === 'carriers' && Array.isArray(first.value)) {
      first.value.forEach((name, i) => addChild(`${parentId}-v-${i}`, String(name)));
    }
  });

  return { drafts, links };
}

/** Hàm chính — gọi từ EquipmentDetail, truyền bản đồ icon từ tầng view */
export function buildKnowledgeGraphFromEquipment(
  equipment: Pick<
    IResEquipmentModelDetail,
    'id' | 'name' | 'armaments' | 'operators' | 'carriers' | 'sensors'
  >,
  icons: KnowledgeGraphIconMap,
): KnowledgeGraphData {
  const { drafts, links } = mergeGraphNodes(equipment);
  return { nodes: assignNodePositions(drafts, icons), links };
}
