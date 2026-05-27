/**
 * Kiểu node trên đồ thị — cấu hình icon/màu tại BRANCHES (knowledge-graph.transform.ts).
 * Thêm type mới: bổ sung union ở đây + bản đồ icon + BRANCH_NODE_TYPE nếu có nhánh API mới.
 */
export type KnowledgeGraphNodeType =
  | 'carrier'
  | 'weapon'
  | 'fleet'
  | 'air'
  | 'radar'
  | 'mission';

/** Bản đồ icon theo type — truyền từ bên ngoài khi dựng đồ thị */
export type KnowledgeGraphIconMap = Partial<Record<KnowledgeGraphNodeType, string>>;

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  size: number;
  type: KnowledgeGraphNodeType;
  fx?: number;
  fy?: number;
  icon?: string;
  description?: string;
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
