import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import ForceGraph2D from 'react-force-graph-2d';
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import type {
  KnowledgeGraphData,
  KnowledgeGraphLink,
  KnowledgeGraphNode,
} from '../../../constants/equipment-dashboard.mock';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

type SimNode = NodeObject<KnowledgeGraphNode>;

function hexWithAlpha(hex: string, alphaHex: string): string {
  if (hex.startsWith('#') && hex.length === 7) {
    return `${hex}${alphaHex}`;
  }
  return hex;
}

function truncateLabel(label: string, maxLen = 16): string {
  if (label.length <= maxLen) return label;
  return `${label.slice(0, maxLen - 1)}…`;
}

/** Vẽ cạnh từ mép nút → mép nút; nhãn nằm giữa đoạn thẳng */
function paintLink(
  link: KnowledgeGraphLink,
  start: SimNode,
  end: SimNode,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
): void {
  if (
    start.x === undefined ||
    start.y === undefined ||
    end.x === undefined ||
    end.y === undefined
  ) {
    return;
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;

  const ux = dx / len;
  const uy = dy / len;
  const startR = start.size ?? 14;
  const endR = end.size ?? 14;
  const x1 = start.x + ux * startR;
  const y1 = start.y + uy * startR;
  const x2 = end.x - ux * endR;
  const y2 = end.y - uy * endR;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = link.color;
  ctx.lineWidth = Math.max(1, 1.5 / globalScale);
  ctx.setLineDash([6 / globalScale, 4 / globalScale]);
  ctx.stroke();
  ctx.setLineDash([]);

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const fontSize = Math.max(8, 10 / globalScale);
  const label = link.label;

  ctx.font = `${fontSize}px Sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textW = ctx.measureText(label).width;
  const padX = 4 / globalScale;
  const padY = 2 / globalScale;

  ctx.fillStyle = 'rgba(6, 19, 37, 0.88)';
  ctx.fillRect(
    midX - textW / 2 - padX,
    midY - fontSize / 2 - padY,
    textW + padX * 2,
    fontSize + padY * 2,
  );

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(label, midX, midY);
  ctx.restore();
}

interface KnowledgeGraphSectionProps {
  subtitle: string;
  graph: KnowledgeGraphData;
  stats: { label: string; value: string }[];
}

const DETAIL_TABS = ['Tổng quan', 'Thông số', 'Quan hệ'];

export function KnowledgeGraphSection({
  subtitle,
  graph,
  stats,
}: KnowledgeGraphSectionProps) {
  const [detailTab, setDetailTab] = useState(0);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const graphRef = useRef<ForceGraphMethods<KnowledgeGraphNode, KnowledgeGraphLink> | undefined>(
    undefined,
  );
  const graphWrapRef = useRef<HTMLDivElement>(null);
  const [graphSize, setGraphSize] = useState({ width: 280, height: 240 });

  const graphData = useMemo(
    () => ({
      nodes: graph.nodes.map((n) => ({ ...n })),
      links: graph.links.map((l) => ({ ...l })),
    }),
    [graph],
  );

  const panelTitle = selectedNode?.name ?? subtitle;

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

  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;
    fg.d3Force('charge')?.strength(-120);
    fg.d3Force('link')?.distance(70);
    const t = window.setTimeout(() => {
      fg.zoomToFit(400, 48);
    }, 350);
    return () => window.clearTimeout(t);
  }, [graphData, graphSize.width, graphSize.height]);

  return (
    <DashboardCard
      title="Đồ thị tri thức"
      icon={<HubIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
      sx={{ height: 320 }}
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
          <ForceGraph2D<KnowledgeGraphNode, KnowledgeGraphLink>
            ref={graphRef}
            width={graphSize.width}
            height={graphSize.height}
            graphData={graphData}
            backgroundColor={equipmentColors.bgElevated}
            cooldownTicks={80}
            enableNodeDrag={false}
            linkVisibility={() => false}
            linkCanvasObjectMode={() => 'replace'}
            linkCanvasObject={(link, ctx, globalScale) => {
              const start = link.source;
              const end = link.target;
              if (typeof start !== 'object' || typeof end !== 'object') return;
              paintLink(link, start as SimNode, end as SimNode, ctx, globalScale);
            }}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleColor={(link) => link.color}
            nodePointerAreaPaint={(node, color, ctx) => {
              if (node.x === undefined || node.y === undefined) return;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size + 6, 0, 2 * Math.PI, false);
              ctx.fill();
            }}
            nodeCanvasObjectMode={() => 'replace'}
            nodeCanvasObject={(node, ctx, globalScale) => {
              if (node.x === undefined || node.y === undefined) return;
              const label = truncateLabel(node.name);
              const fontSize = 12 / globalScale;
              const isCore = node.type === 'carrier';

              ctx.shadowColor = node.color;
              ctx.shadowBlur = isCore ? 22 : 14;

              const fillGlow = hexWithAlpha(node.color, '33');
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size + 8, 0, 2 * Math.PI);
              ctx.fillStyle = fillGlow;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
              ctx.fillStyle = fillGlow;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size * 0.58, 0, 2 * Math.PI);
              ctx.fillStyle = fillGlow;
              ctx.fill();

              ctx.shadowBlur = 0;

              ctx.font = `bold ${fontSize}px Sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = isCore ? equipmentColors.accent : equipmentColors.textSecondary;
              ctx.fillText(label, node.x, node.y + node.size + 16 / globalScale);
            }}
            onNodeClick={(node) => {
              setSelectedNode(node);
              if (node.x === undefined || node.y === undefined || !graphRef.current) return;
              graphRef.current.centerAt(node.x, node.y, 500);
              graphRef.current.zoom(2.5, 500);
            }}
            onBackgroundClick={() => setSelectedNode(null)}
          />
        </Box>

        <Box sx={{ flex: 1, p: 1.5, overflow: 'auto' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
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
            {selectedNode
              ? `Nút "${selectedNode.name}" — loại ${selectedNode.type}, trọng số ${selectedNode.val}.`
              : 'Tàu sân bay CV-18 Phúc Kiến — trang bị hệ thống phóng EMALS và máy bay tàng hình J-35.'}
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
      </Box>
    </DashboardCard>
  );
}
