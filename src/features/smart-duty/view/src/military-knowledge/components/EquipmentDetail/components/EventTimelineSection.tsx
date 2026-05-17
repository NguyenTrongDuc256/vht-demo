import { Box, Typography, Chip, Button, Stack } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ReportIcon from '@mui/icons-material/Report';
import type { TimelineEvent } from '@smart-duty/logic';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

interface EventTimelineSectionProps {
  events: TimelineEvent[];
}

const FILTERS = ['Sự kiện thông tin', 'Xuất hiện nhà: Du Lâm', 'Đơn vị: AAAA'];

export function EventTimelineSection({ events }: EventTimelineSectionProps) {
  return (
    <DashboardCard
      title="Lịch sử sự kiện CV-18"
      icon={<HistoryIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
      sx={{ height: 320 }}
    >
      <Stack direction="row" spacing={0.75} sx={{ px: 1.5, py: 1, flexWrap: 'wrap', gap: 0.5 }}>
        {FILTERS.map((f, i) => (
          <Chip
            key={f}
            label={f}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.65rem',
              bgcolor: i === 0 ? equipmentColors.chipBg : 'transparent',
              color: i === 0 ? equipmentColors.accent : equipmentColors.textSecondary,
              border: `1px solid ${equipmentColors.cardBorderSubtle}`,
            }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          px: 1.5,
          pb: 1.5,
          overflow: 'auto',
          maxHeight: 250,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: equipmentColors.textMuted, borderRadius: 2 },
        }}
      >
        {events.map((event, idx) => (
          <Box
            key={event.id}
            sx={{
              display: 'flex',
              gap: 1.5,
              mb: idx < events.length - 1 ? 2 : 0,
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56 }}>
              <Box
                sx={{
                  bgcolor: equipmentColors.timelineBadge,
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  px: 0.75,
                  py: 0.5,
                  borderRadius: 0.5,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  minWidth: 52,
                }}
              >
                {event.date}
              </Box>
              {idx < events.length - 1 && (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    bgcolor: equipmentColors.cardBorderSubtle,
                    mt: 0.5,
                    minHeight: 24,
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: equipmentColors.bgElevated,
                border: `1px solid ${equipmentColors.cardBorderSubtle}`,
                borderRadius: 1,
                p: 1.25,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1 }}>
                  {event.title}
                </Typography>
                {event.tag === 'hot' && (
                  <Chip label="Hot" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#ff4d6a33', color: '#ff6b8a' }} />
                )}
                {event.tag === 'new' && (
                  <Chip label="New" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#00d4ff22', color: equipmentColors.accent }} />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: equipmentColors.textSecondary, display: 'block', mb: 1, lineHeight: 1.5 }}>
                {event.description}
              </Typography>
              <Typography variant="caption" sx={{ color: equipmentColors.textMuted, display: 'block' }}>
                {event.source}
              </Typography>
              <Typography variant="caption" sx={{ color: equipmentColors.textMuted, display: 'block', mb: 1 }}>
                {event.location}
              </Typography>
              <Stack direction="row" spacing={0.75}>
                <Button
                  size="small"
                  startIcon={<MapOutlinedIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: '0.6rem', color: equipmentColors.accent, py: 0.25 }}
                >
                  Xem bản đồ
                </Button>
                <Button
                  size="small"
                  startIcon={<ReportIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: '0.6rem', color: equipmentColors.textSecondary, py: 0.25 }}
                >
                  Báo cáo
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
    </DashboardCard>
  );
}
