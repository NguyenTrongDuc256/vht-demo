import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d';

import type { KnowledgeGraphData, KnowledgeGraphNode } from '@smart-duty/logic';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

const DETAIL_TABS = ['Tổng quan', 'Thông số', 'Quan hệ'];

/** Zoom khi vừa load trang — chỉnh số này nếu đồ thị quá to/nhỏ */
const INITIAL_ZOOM = 0.55;
/** Zoom khi click vào node */
const NODE_CLICK_ZOOM = 2.5;

type ForceGraphNode = KnowledgeGraphNode & { 
  x?: number; 
  y?: number; 
  fx?: number | null; 
  fy?: number | null;
  __bckp_fx?: number;
  __bckp_fy?: number;
};
type ForceGraphLink = KnowledgeGraphData['links'][number] & {
  source: ForceGraphNode | string;
  target: ForceGraphNode | string;
};

/** Tiện ích vẽ văn bản tự xuống dòng */
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let testY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, testY);
      line = words[n] + ' ';
      testY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, testY);
  return testY;
}

function isForceGraphNode(value: ForceGraphNode | string): value is ForceGraphNode {
  return typeof value === 'object' && value != null && value.x != null && value.y != null;
}

export interface KnowledgeGraphSectionProps {
  graph: KnowledgeGraphData;
  equipmentName?: string;
}

export function KnowledgeGraphSection({ graph, equipmentName }: KnowledgeGraphSectionProps) {
  const [detailTab, setDetailTab] = useState(0);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const graphWrapRef = useRef<HTMLDivElement>(null);
  const [graphSize, setGraphSize] = useState({ width: 280, height: 240 });


  const graphRef = useRef<ForceGraphMethods<ForceGraphNode> | undefined>(undefined);
  const initialViewApplied = useRef(false);
  
  // Giữ Map ảnh ổn định qua các lần re-render
  const nodeImageRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const data = useMemo(() => {
    // Chỉ hiển thị node level 0, level 1, và level 2 của những node level 1 đã được expand
    const visibleNodeIds = new Set<string>();
    
    graph.nodes.forEach(node => {
      if (node.level <= 1) {
        visibleNodeIds.add(node.id);
      }
    });

    // Thêm các node con của node đã expanded
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as any).id;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as any).id;
      
      if (expandedNodes.has(sourceId)) {
        visibleNodeIds.add(targetId);
      }
    });

    return {
      nodes: graph.nodes.filter(n => visibleNodeIds.has(n.id)),
      links: graph.links.filter(l => {
        const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return visibleNodeIds.has(sId) && visibleNodeIds.has(tId);
      })
    };
  }, [graph, expandedNodes]);

  const panelTitle = selectedNode?.name ?? equipmentName ?? 'Chi tiết trang bị';

  const stats = useMemo(() => {
    if (!selectedNode) return [];

    switch (detailTab) {
      case 0:
        return [
          { label: 'Loại', value: selectedNode.type },
          { label: 'Trọng số', value: String(selectedNode.val) },
          { label: 'Kích thước', value: String(selectedNode.size) },
        ];
      case 1:
        return [
          { label: 'Màu', value: selectedNode.color },
          { label: 'Trọng số', value: String(selectedNode.val) },
          { label: 'Kích thước node', value: String(selectedNode.size) },
        ];
      case 2: {
        const related = data.links.filter(
          (link) => link.source === selectedNode.id || link.target === selectedNode.id,
        );
        if (!related.length) {
          return [{ label: 'Quan hệ', value: 'Không có liên kết' }];
        }
        return related.map((link, index) => ({
          label: `Liên kết ${index + 1}`,
          value: link.label,
        }));
      }
      default:
        return [];
    }
  }, [selectedNode, detailTab, data.links]);

  const tabDescription = useMemo(() => {
    if (!selectedNode) {
      return equipmentName ?? 'Chọn một nút trên đồ thị để xem chi tiết quan hệ trang bị.';
    }
    if (detailTab === 0) {
      return selectedNode.description ?? `Tổng quan nút "${selectedNode.name}".`;
    }
    if (detailTab === 1) {
      return `Thông số hiển thị của nút "${selectedNode.name}".`;
    }
    return `Các quan hệ liên quan tới nút "${selectedNode.name}".`;
  }, [selectedNode, detailTab, equipmentName]);

  const applyInitialView = useCallback(() => {
    const fg = graphRef.current;
    if (!fg || initialViewApplied.current || graphSize.width <= 0) return;

    initialViewApplied.current = true;
    fg.centerAt(0, 0, 400);
    fg.zoom(INITIAL_ZOOM, 400);
  }, [graphSize.width]);

  const preloadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const map = nodeImageRef.current;

      if (map.has(url)) {
        resolve(map.get(url)!);
        return;
      }

      const img = new Image();
      img.src = url;

      img.onload = () => {
        map.set(url, img);
        resolve(img);
      };

      img.onerror = () => {
        resolve(new Image());
      };
    });
  };

  useEffect(() => {
    initialViewApplied.current = false;
  }, [data]);

  useEffect(() => {
    applyInitialView();
  }, [applyInitialView, data]);

  useEffect(() => {
    const urls = [...new Set(data.nodes.map((n) => n.icon).filter(Boolean))] as string[];
    Promise.all(urls.map(preloadImage)).then(() => {
      // API không có refresh() — resumeAnimation() để canvas vẽ lại icon
      graphRef.current?.resumeAnimation();
      applyInitialView();
    });
  }, [data, applyInitialView]);

  useEffect(() => {
    const el = graphWrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }
    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) {
        setGraphSize({
          width: Math.floor(clientWidth),
          height: Math.floor(clientHeight),
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nodeCanvasObject = (node: ForceGraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y } = node;
    if (x == null || y == null) return;
  
    const radius = node.size;
  
    // hiệu ứng phát sáng
    ctx.shadowColor = node.color;
    ctx.shadowBlur = 25;

    // vòng sáng ngoài
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size + 8, 0, 2 * Math.PI);
    ctx.fillStyle = `${node.color}22`;
    ctx.fill();

    // vòng node chính
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();

    // vòng trong
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff22';
    ctx.fill();
  
    // vẽ icon
    if (node.icon && nodeImageRef.current.has(node.icon)) {
      const img = nodeImageRef.current.get(node.icon)!;
      const iconSize = radius * 1.08;
      ctx.save();
      ctx.drawImage(img, x - iconSize/2, y - iconSize/2, iconSize, iconSize);
      ctx.restore();
    }
  
    // vẽ tên node
    ctx.shadowBlur = 0;
    const fontSize = 16 / globalScale; 
    ctx.font = `bold ${fontSize}px Sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const labelY = y + radius + 12;
    const maxWidth = 120 / globalScale;
    const lineHeight = fontSize * 1.2;

    // Vẽ bóng đổ cho chữ để nổi bật trên nền tối
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#ffffff';
    wrapText(ctx, node.name, x, labelY, maxWidth, lineHeight);
    ctx.shadowBlur = 0;
  };

  return (
    <DashboardCard
      title="Đồ thị tri thức"
      icon={<HubIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
      sx={{ height: 720 }}
    >
      <Box sx={{ display: 'flex', height: 'calc(100% - 40px)' }}>
        <Box
          ref={graphWrapRef}
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 200,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            borderRight: `1px solid ${equipmentColors.cardBorderSubtle}`,
            bgcolor: equipmentColors.bg,
          }}
        >
        
          <ForceGraph2D
          ref={graphRef}
          width={graphSize.width}
          height={graphSize.height}
          graphData={data}
          backgroundColor="#061122"
          autoPauseRedraw={false}
          cooldownTicks={100}
          onEngineStop={applyInitialView}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={(link: ForceGraphLink) => link.color}
          onNodeClick={(node: ForceGraphNode) => {
            setSelectedNode(node);
            setIsPanelOpen(true);

            // Toggle expand nếu là node cấp 1
            if (node.level === 1) {
              setExpandedNodes(prev => {
                const next = new Set(prev);
                if (next.has(node.id)) {
                  next.delete(node.id);
                } else {
                  next.add(node.id);
                }
                return next;
              });
            }

            if (node.x == null || node.y == null || !graphRef.current) return;
            graphRef.current.centerAt(node.x, node.y, 1000);
            graphRef.current.zoom(NODE_CLICK_ZOOM, 1000);
          }}
          onBackgroundClick={() => {
            setSelectedNode(null);
            setIsPanelOpen(false);
          }}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={(node, color, ctx) => {
            if (node.x == null || node.y == null) return;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size + 6, 0, 2 * Math.PI);
            ctx.fill();
          }}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={(link: ForceGraphLink, ctx) => {
            const { source, target } = link;
            if (!isForceGraphNode(source) || !isForceGraphNode(target)) return;

            const { x: x1, y: y1 } = source;
            const { x: x2, y: y2 } = target;

            // vẽ đường nối
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            ctx.strokeStyle = link.color;
            ctx.lineWidth = 2;

            ctx.setLineDash([6, 4]);

            ctx.stroke();

            ctx.setLineDash([]);

            // vẽ nhãn liên kết
            const textPosX = (x1 + x2) / 2;
            const textPosY = (y1 + y2) / 2;

            ctx.fillStyle = '#ffffffaa';
            ctx.font = '10px Sans-Serif';

            ctx.fillText(link.label, textPosX, textPosY);
          }}
        />

        </Box>

        {isPanelOpen && (
          <Box sx={{ flex: 0.8, p: 1.5, overflow: 'auto', position: 'relative', borderLeft: `1px solid ${equipmentColors.cardBorderSubtle}` }}>
            <Box 
              onClick={() => setIsPanelOpen(false)}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                cursor: 'pointer',
                color: equipmentColors.textMuted,
                '&:hover': { color: '#ffffff' },
                fontSize: '1rem',
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              ✕
            </Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.5, pr: 3 }}>
              {panelTitle}
            </Typography>
            <Tabs
              value={detailTab}
              onChange={(_, v) => setDetailTab(v)}
              sx={{
                minHeight: 28,
                mb: 1,
                '& .MuiTab-root': {
                  minHeight: 28,
                  py: 0,
                  px: 1,
                  fontSize: '0.65rem',
                  minWidth: 60,
                  color: equipmentColors.textMuted,
                  '&.Mui-selected': { color: equipmentColors.accent },
                },
                '& .MuiTabs-indicator': { bgcolor: equipmentColors.accent, height: 2 },
              }}
            >
              {DETAIL_TABS.map((t) => (
                <Tab key={t} label={t} />
              ))}
            </Tabs>
            <Typography
              variant="caption"
              sx={{ color: equipmentColors.textSecondary, display: 'block', lineHeight: 1.5, mb: 1.5 }}
            >
              {tabDescription}
            </Typography>
            <Grid container spacing={1}>
              {stats.map((s) => (
                <Grid key={s.label} size={4}>
                  <Typography variant="caption" sx={{ color: equipmentColors.textMuted }}>
                    {s.label}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.72rem', fontWeight: 600, color: equipmentColors.accentOrange }}
                  >
                    {s.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </DashboardCard>
  );
}
