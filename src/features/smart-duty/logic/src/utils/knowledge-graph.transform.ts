import type {
  IEquipmentRelationItem,
  IResEquipmentModelDetail,
} from "../models/equipment.types";
import type {
  KnowledgeGraphData,
  KnowledgeGraphLink,
  KnowledgeGraphNode,
  KnowledgeGraphNodeType,
} from "../models/knowledge-graph.types";

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
  key: keyof Pick<
    IResEquipmentModelDetail,
    "armaments" | "operators" | "carriers" | "sensors"
  >;
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
  mau: "#00d2ff",
  icon: "/favicon.svg",
};

/** @deprecated Dùng ROOT_NODE_CONFIG */
export const NODE_GOC = ROOT_NODE_CONFIG;

/**
 * Danh sách nhánh — vị trí góc tự tính, chia đều 360° theo số nhánh có dữ liệu.
 */
export const BRANCHES: BranchConfig[] = [
  {
    key: "armaments", // ← lấy từ apiData.armaments
    type: "weapon", // ← loại node vũ khí
    nhan: "Trang bị", // ← nhãn đường nối
    mau: ["#2575fc", "#4dabf7"], // ← [màu cấp 1, màu cấp 2]
    icon: "/favicon.svg", // ← icon node nhánh
  },
  {
    key: "operators", // ← lấy từ apiData.operators (lực lượng khai thác)
    type: "fleet", // ← loại node hạm đội / đơn vị vận hành
    nhan: "Khai thác", // ← chữ trên đường nối gốc → operators
    mau: ["#f5a623", "#ff9f43"], // ← cam đậm (cấp 1) / cam nhạt (cấp 2)
    icon: "/favicon.svg", // ← icon hiển thị trên mọi node thuộc nhánh này
  },
  {
    key: "carriers",
    type: "air",
    nhan: "Triển khai",
    mau: ["#bfff00", "#86efac"],
    icon: "/favicon.svg",
    layConTuValue: true, // ← value[] trong phần tử [0] → thêm node cấp 2 (tên máy bay)
  },
  {
    key: "sensors",
    type: "radar",
    nhan: "Sử dụng",
    mau: ["#ff0090", "#f472b6"],
    icon: "/favicon.svg",
  },
];

/** @deprecated Dùng BRANCHES */
export const DANH_SACH_NHANH = BRANCHES;

// Bán kính vòng — R1: node cấp 1, R2: thêm khoảng cách cho node cấp 2
const R1 = 180;
const R2 = 140;

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
    let finalAngle = angle;

    if (totalChildren > 1) {
      const spread = 0.28; // Bạn có thể chỉnh thông số này
      const offset = spread * (childIndex - (totalChildren - 1) / 2);
      finalAngle = angle + offset;
    }

    node.fx = R1 * Math.cos(finalAngle);
    node.fy = R1 * Math.sin(finalAngle);
    return;
  }
  if (level === 2) {
    const offset =
      totalChildren <= 1 ? 0 : 0.35 * (childIndex - (totalChildren - 1) / 2);

    const a = angle + offset;
    const dist = R1 + R2;

    node.fx = dist * Math.cos(a);
    node.fy = dist * Math.sin(a);
  }
  // // Node cấp 2: xếp quạt quanh góc nhánh cha
  // const offset = totalChildren <= 1 ? 0.3 : 0.35 * (childIndex - (totalChildren - 1) / 2);
  // const a = angle + offset;
  // const dist = R1 + R2;
  // node.fx = dist * Math.cos(a);
  // node.fy = dist * Math.sin(a);
}

/** Lấy mô tả hiển thị từ field value của API */
function getItemDescription(item: IEquipmentRelationItem): string | undefined {
  if (typeof item.value === "string") return item.value;
  if (Array.isArray(item.value)) return item.value.join("; ");
  return undefined;
}

/** Tạo object node đồ thị */
function createNode(
  id: string,
  name: string,
  type: KnowledgeGraphNodeType,
  level: number,
  color: string,
  icon: string,
  description?: string,
): KnowledgeGraphNode {
  return {
    id,
    name,
    type,
    level,
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
export function transformToGraphData(
  apiData: IResEquipmentModelDetail,
): KnowledgeGraphData {
  const nodes: KnowledgeGraphNode[] = [];
  const links: KnowledgeGraphLink[] = [];
  const rootId = apiData.id;

  // Node gốc — trang bị chính
  const root = createNode(
    rootId,
    apiData.name,
    "carrier",
    0,
    ROOT_NODE_CONFIG.mau,
    ROOT_NODE_CONFIG.icon,
  );
  assignPosition(root, 0, 0);
  nodes.push(root);

  // Chỉ xử lý nhánh có dữ liệu → góc tự cân bằng
  const activeBranches = BRANCHES.filter((cfg) => apiData[cfg.key]?.length);

  activeBranches.forEach((cfg, index) => {
    const list: any[] = apiData[cfg.key] || [];
    if (!list?.length) return;

    const angle = calcEvenAngle(activeBranches.length, index);
    const [colorL1, colorL2] = cfg.mau;

    // ====================== TẠO TẤT CẢ NODE CẤP 1 ======================
    list.forEach((item: any, i: number) => {
      const totalInBranch = list.length;

      // Tính góc offset cho từng node cấp 1
      let finalAngle = angle;
      if (totalInBranch > 1) {
        const spread = 0.25; // điều chỉnh độ lan tỏa (càng nhỏ càng sát nhau)
        const offset = spread * (i - (totalInBranch - 1) / 2);
        finalAngle = angle + offset;
      }
      const node = createNode(
        item.id,
        item.name,
        cfg.type as any,
        1,
        colorL1, // Bạn có thể đổi thành colorL2 nếu muốn
        cfg.icon,
        getItemDescription(item),
      );

      assignPosition(node, 1, finalAngle, i, list.length); // Phân bố vị trí đều

      nodes.push(node);

      // Link từ Root → Node cấp 1
      links.push({
        source: rootId,
        target: node.id,
        label: cfg.nhan,
        color: colorL1,
      });
    });

    // ====================== TẠO NODE CẤP 2 TỪ TẤT CẢ CẤP 1 ======================
    list.forEach((parentItem: any, parentIndex: number) => {
      if (!cfg.layConTuValue) return;

      let valueArray: string[] = [];

      if (Array.isArray(parentItem.value)) {
        valueArray = parentItem.value.map(String);
      } else if (typeof parentItem.value === "string") {
        const val = parentItem.value.trim();
        if (!val) {
          // rỗng thì bỏ qua
        } else if (val.startsWith("[") && val.endsWith("]")) {
          // Trường hợp 2: là chuỗi dạng array ["a","b","c"]
          try {
            // Thử parse như JSON (nếu là chuỗi hợp lệ)
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              valueArray = parsed.map((item) => String(item).trim());
            }
          } catch (e) {
            // Nếu JSON.parse lỗi → fallback tách thủ công
            valueArray = val
              .slice(1, -1) // bỏ dấu []
              .split(/['",]\s*['"]?/) // tách theo dấu , và nháy đơn/đôi
              .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
              .filter((item) => item.length > 0);
          }
        } else {
          // Trường hợp 1: chuỗi phân cách bằng dấu ;
          valueArray = val
            .split(";")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        }
      }

      if (valueArray.length === 0) return;

      // Tính góc chính của parent này (để children nằm quanh parent)
      let parentAngle = angle;
      const totalInBranch = list.length;

      if (totalInBranch > 1) {
        const spread = 0.55; // chỉnh độ tách giữa các parent
        const offset = spread * (parentIndex - (totalInBranch - 1) / 2);
        parentAngle = angle + offset;
      }

      // Tạo children cho parent này
      valueArray.forEach((name: string, j: number) => {
        const childId = `${parentItem.id}-v-${j}`;

        const childNode = createNode(
          childId,
          name,
          cfg.type as any,
          2,
          colorL2,
          cfg.icon,
          name,
        );

        // Truyền parentAngle vào để children nằm quanh parent
        assignPosition(childNode, 2, parentAngle, j, valueArray.length);

        nodes.push(childNode);

        links.push({
          source: parentItem.id,
          target: childId,
          label: cfg.nhan,
          color: colorL2,
        });
      });
    });
  });

  return { nodes, links };
}

/** Tên alias — giữ tương thích code cũ */
export const buildKnowledgeGraphFromEquipment = transformToGraphData;

/** @deprecated Dùng BranchConfig */
export type CauHinhNhanh = BranchConfig;
