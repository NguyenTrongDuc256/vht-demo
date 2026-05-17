import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import type { KnowledgeNode } from '@smart-duty/logic';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

interface KnowledgeGraphSectionProps {
  subtitle: string;
  nodes: KnowledgeNode[];
  stats: { label: string; value: string }[];
}

const DETAIL_TABS = ['Tổng quan', 'Thông số', 'Quan hệ'];

export function KnowledgeGraphSection({
  subtitle,
  nodes,
  stats,
}: KnowledgeGraphSectionProps) {
  const [detailTab, setDetailTab] = useState(0);
  const cx = 120;
  const cy = 100;
  const radius = 72;

  return (
    <DashboardCard
      title="Đồ thị tri thức"
      icon={<HubIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
      sx={{ height: 320 }}
    >
      <Box sx={{ display: 'flex', height: 'calc(100% - 40px)' }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: `1px solid ${equipmentColors.cardBorderSubtle}`,
          }}
        >
          <svg width="240" height="200" viewBox="0 0 240 200">
            {nodes.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const x = cx + radius * Math.cos(rad - Math.PI / 2);
              const y = cy + radius * Math.sin(rad - Math.PI / 2);
              return (
                <g key={node.id}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke={equipmentColors.cardBorder}
                    strokeWidth="1"
                  />
                  <circle cx={x} cy={y} r="14" fill={node.color} opacity="0.9" />
                  <text
                    x={x}
                    y={y + radius + 14}
                    textAnchor="middle"
                    fill={equipmentColors.textSecondary}
                    fontSize="7"
                  >
                    {node.label.length > 14
                      ? `${node.label.slice(0, 12)}…`
                      : node.label}
                  </text>
                </g>
              );
            })}
            <circle
              cx={cx}
              cy={cy}
              r="22"
              fill={equipmentColors.bgElevated}
              stroke={equipmentColors.accent}
              strokeWidth="2"
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fill={equipmentColors.accent}
              fontSize="9"
              fontWeight="bold"
            >
              CV-18
            </text>
          </svg>
        </Box>

        <Box sx={{ flex: 1, p: 1.5, overflow: 'auto' }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: equipmentColors.textPrimary,
              mb: 0.5,
            }}
          >
            {subtitle}
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
            sx={{
              color: equipmentColors.textSecondary,
              display: 'block',
              lineHeight: 1.5,
              mb: 1.5,
            }}
          >
            Tàu sân bay CV-18 Phúc Kiến là tàu sân bay thứ ba của Hải quân Giải phóng Nhân dân
            Trung Quốc, trang bị hệ thống phóng máy bay điện từ EMALS và khả năng vận hành máy
            bay tàng hình J-35.
          </Typography>
          <Grid container spacing={1}>
            {stats.map((s) => (
              <Grid key={s.label} size={4}>
                <Typography variant="caption" sx={{ color: equipmentColors.textMuted }}>
                  {s.label}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: equipmentColors.accentOrange }}>
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
