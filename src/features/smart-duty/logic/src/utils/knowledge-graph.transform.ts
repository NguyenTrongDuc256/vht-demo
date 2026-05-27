import type { IEquipmentRelationItem, IResEquipmentModelDetail } from '../models/equipment.types';
import type {
  KnowledgeGraphData,
  KnowledgeGraphIconMap,
  KnowledgeGraphLink,
  KnowledgeGraphNode,
  KnowledgeGraphNodeType,
} from '../models/knowledge-graph.types';

// ─── Cấu hình màu / vị trí / nhãn (sửa trực tiếp tại đây) ───────────────────

const MAU: Record<string, [string, string]> = {
  weapon: ['#2575fc', '#4dabf7'],  // [cấp 1, cấp 2] — vũ khí
  fleet: ['#f5a623', '#ff9f43'],   // lực lượng khai thác
  air: ['#bfff00', '#86efac'],     // máy bay mang theo
  radar: ['#ff0090', '#f472b6'],   // cảm biến
};

const GOC_NHANH = [-2.4, -0.8, 0.8, 2.4]; // góc 4 nhánh quanh tâm (radian)
const R1 = 165; // khoảng cách node cấp 1
const R2 = 115; // thêm khoảng cách cho node cấp 2

/** Lấy icon theo type — cấu hình icon tại KNOWLEDGE_GRAPH_ICONS (view layer) */
function iconTheoType(type: KnowledgeGraphNodeType, icons: KnowledgeGraphIconMap) {
  return icons[type] ?? icons.carrier;
}

/** Gán fx/fy cho node theo cấp và góc nhánh */
function datViTri(
  node: KnowledgeGraphNode,
  cap: 0 | 1 | 2,
  goc: number,
  thuTuCon = 0,
  tongCon = 1,
) {
  if (cap === 0) {
    node.fx = 0;
    node.fy = 0;
    return;
  }
  if (cap === 1) {
    node.fx = R1 * Math.cos(goc);
    node.fy = R1 * Math.sin(goc);
    return;
  }
  const lech = tongCon <= 1 ? 0.3 : 0.35 * (thuTuCon - (tongCon - 1) / 2);
  const a = goc + lech;
  const dist = R1 + R2;
  node.fx = dist * Math.cos(a);
  node.fy = dist * Math.sin(a);
}

function moTa(item: IEquipmentRelationItem): string | undefined {
  if (typeof item.value === 'string') return item.value;
  if (Array.isArray(item.value)) return item.value.join('; ');
  return undefined;
}

/** Tạo node nhanh */
function taoNode(
  id: string,
  name: string,
  type: KnowledgeGraphNodeType,
  cap: 0 | 1 | 2,
  mau: string,
  icons: KnowledgeGraphIconMap,
  description?: string,
): KnowledgeGraphNode {
  return {
    id,
    name,
    type,
    color: mau,
    icon: iconTheoType(type, icons),
    size: cap === 0 ? 28 : cap === 1 ? 18 : 14,
    val: cap === 0 ? 100 : cap === 1 ? 15 : 60,
    description,
  };
}

/**
 * Chuyển dữ liệu API → graphData.
 *
 * Quy tắc:
 *   - Phần tử [0] của mỗi nhánh = node cấp 1 (nối tới gốc)
 *   - Phần tử [1], [2], … = node cấp 2 (nối tới phần tử [0])
 *   - Hoặc API dạng `{ items: [...] }` bên trong phần tử [0]
 *   - Riêng carriers: mảng `value` của phần tử [0] → thêm node cấp 2
 *
 * Icon: truyền từ KNOWLEDGE_GRAPH_ICONS (equipment-dashboard.mock.ts)
 */
export function transformToGraphData(
  apiData: Pick<
    IResEquipmentModelDetail,
    'id' | 'name' | 'armaments' | 'operators' | 'carriers' | 'sensors'
  >,
  icons: KnowledgeGraphIconMap,
): KnowledgeGraphData {
  const nodes: KnowledgeGraphNode[] = [];
  const links: KnowledgeGraphLink[] = [];
  const rootId = apiData.id;

  // 1. Node gốc
  const root = taoNode(rootId, apiData.name, 'carrier', 0, '#00d2ff', icons);
  datViTri(root, 0, 0);
  nodes.push(root);

  /** Xử lý một nhánh: armaments | operators | carriers | sensors */
  const themNhanh = (
    danhSach: IEquipmentRelationItem[] | undefined,
    type: KnowledgeGraphNodeType,
    nhan: string,
    goc: number,
  ) => {
    if (!danhSach?.length) return;

    const first = danhSach[0] as IEquipmentRelationItem & { items?: IEquipmentRelationItem[] };

    // API dạng armaments[0].items hoặc mảng phẳng [0], [1], …
    const conCap2: IEquipmentRelationItem[] = first.items?.length
      ? first.items
      : danhSach.slice(1);

    const [mauCap1, mauCap2] = MAU[type === 'carrier' ? 'weapon' : type] ?? ['#888', '#aaa'];

    // Node cấp 1
    const cha = taoNode(first.id, first.name, type, 1, mauCap1, icons, moTa(first));
    datViTri(cha, 1, goc);
    nodes.push(cha);

    links.push({ source: rootId, target: first.id, label: nhan, color: mauCap1 });

    // Node cấp 2
    const dsCon = [...conCap2];

    // carriers: thêm từ mảng value
    if (type === 'air' && Array.isArray(first.value)) {
      first.value.forEach((ten, i) => {
        dsCon.push({ id: `${first.id}-v-${i}`, name: String(ten) });
      });
    }

    dsCon.forEach((item, i) => {
      const con = taoNode(item.id, item.name, type, 2, mauCap2, icons, moTa(item));
      datViTri(con, 2, goc, i, dsCon.length);
      nodes.push(con);
      links.push({ source: first.id, target: item.id, label: nhan, color: mauCap2 });
    });
  };

  // 2. Vũ khí
  themNhanh(apiData.armaments, 'weapon', 'Trang bị', GOC_NHANH[0]);

  // 3. Lực lượng khai thác
  themNhanh(apiData.operators, 'fleet', 'Khai thác', GOC_NHANH[1]);

  // 4. Máy bay mang theo
  themNhanh(apiData.carriers, 'air', 'Triển khai', GOC_NHANH[2]);

  // 5. Cảm biến
  themNhanh(apiData.sensors, 'radar', 'Sử dụng', GOC_NHANH[3]);

  return { nodes, links };
}

/** Tên cũ — giữ để không phải sửa chỗ đang gọi */
export const buildKnowledgeGraphFromEquipment = transformToGraphData;
