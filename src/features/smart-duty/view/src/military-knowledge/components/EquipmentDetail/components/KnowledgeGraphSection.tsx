import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import ForceGraph2D from 'react-force-graph-2d';

import type { KnowledgeGraphData, KnowledgeGraphNode } from '@smart-duty/logic';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

const DETAIL_TABS = ['Tổng quan', 'Thông số', 'Quan hệ'];

export interface KnowledgeGraphSectionProps {
  graph: KnowledgeGraphData;
  equipmentName?: string;
}

export function KnowledgeGraphSection({ graph, equipmentName }: KnowledgeGraphSectionProps) {
  const [detailTab, setDetailTab] = useState(0);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);

  const graphWrapRef = useRef<HTMLDivElement>(null);
  const [graphSize, setGraphSize] = useState({ width: 280, height: 240 });


  const graphRef = useRef(null);
  
  // Giữ Map ảnh ổn định qua các lần re-render
  const nodeImageRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const data = useMemo(() => graph, [graph]);

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
    const urls = [...new Set(data.nodes.map((n) => n.icon).filter(Boolean))] as string[];
    Promise.all(urls.map(preloadImage)).then(() => {
      graphRef.current?.refresh();
    });
  }, [data]);


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

  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
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
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${14 / globalScale}px Sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(node.name, x, y + radius + 10);
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
          cooldownTicks={100}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={(link: any) => link.color}
          onNodeClick={(node: any) => {
            setSelectedNode(node);
            if (node.x == null || node.y == null || !graphRef.current) return;
            graphRef.current.centerAt(node.x, node.y, 1000);
            graphRef.current.zoom(3, 1000);
          }}
          onBackgroundClick={() => setSelectedNode(null)}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={(node, color, ctx) => {
            if (node.x == null || node.y == null) return;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size + 6, 0, 2 * Math.PI);
            ctx.fill();
          }}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={(link: any, ctx) => {
            const start = link.source;
            const end = link.target;

            if (
              typeof start !== 'object' ||
              typeof end !== 'object'
            )
              return;

            // vẽ đường nối
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);

            ctx.strokeStyle = link.color;
            ctx.lineWidth = 2;

            ctx.setLineDash([6, 4]);

            ctx.stroke();

            ctx.setLineDash([]);

            // vẽ nhãn liên kết
            const textPosX = (start.x + end.x) / 2;
            const textPosY = (start.y + end.y) / 2;

            ctx.fillStyle = '#ffffffaa';
            ctx.font = '10px Sans-Serif';

            ctx.fillText(link.label, textPosX, textPosY);
          }}
        />

        </Box>

        <Box sx={{ flex: 1, p: 1.5, overflow: 'auto' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
            {/* {panelTitle} */}
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
              ? selectedNode.description ??
                `Nút "${selectedNode.name}" — loại ${selectedNode.type}, trọng số ${selectedNode.val}.`
              : equipmentName ??
                'Chọn một nút trên đồ thị để xem chi tiết quan hệ trang bị.'}
          </Typography>
          <Grid container spacing={1}>
            {/* {stats.map((s) => (
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
            ))} */}
          </Grid>
        </Box>
      </Box>
    </DashboardCard>
  );
}
