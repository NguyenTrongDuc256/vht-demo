import { Box, Typography, Stack } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

const POIS = [
  {
    label: 'Căn cứ Du Lâm',
    image:
      'https://images.unsplash.com/photo-1586500036706-0994e45f1244?w=200&q=80',
  },
  {
    label: 'CV-18 Fujian',
    image:
      'https://images.unsplash.com/photo-1569098644584-2106f0bb9a3b?w=200&q=80',
  },
];

export function MapSection() {
  return (
    <DashboardCard
      title="Bản đồ & ngữ cảnh địa lý"
      icon={<MapIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
      sx={{ height: 280 }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ flex: 1, position: 'relative', minHeight: 240 }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 240,
              background: `
                linear-gradient(180deg, rgba(2,12,27,0.3) 0%, rgba(2,12,27,0.6) 100%),
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%230a2540' width='800' height='400'/%3E%3Cpath fill='%231a4a6e' d='M0 200 Q200 150 400 180 T800 160 L800 400 L0 400Z'/%3E%3Cpath fill='%232d6a8f' d='M100 220 Q300 190 500 210 T750 200' stroke='%234a9bc4' stroke-width='1' fill='none'/%3E%3C/svg%3E")
              `,
              backgroundSize: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '35%',
              left: '55%',
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `2px solid ${equipmentColors.accentRed}`,
              bgcolor: 'rgba(255, 77, 106, 0.15)',
              boxShadow: `0 0 24px ${equipmentColors.accentRed}66`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '28%',
              left: '48%',
              bgcolor: 'rgba(13, 31, 53, 0.95)',
              border: `1px solid ${equipmentColors.cardBorder}`,
              borderRadius: 1,
              p: 1,
              maxWidth: 160,
            }}
          >
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: equipmentColors.accent }}>
              CV-18 Fujian
            </Typography>
            <Typography variant="caption" sx={{ color: equipmentColors.textSecondary }}>
              16.2°N, 112.8°E
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: equipmentColors.textMuted }}>
              Tốc độ: 18 kn
            </Typography>
          </Box>
        </Box>
        <Stack
          spacing={1}
          sx={{
            width: 100,
            p: 1,
            borderLeft: `1px solid ${equipmentColors.cardBorderSubtle}`,
          }}
        >
          {POIS.map((poi) => (
            <Box key={poi.label}>
              <Box
                component="img"
                src={poi.image}
                alt={poi.label}
                sx={{
                  width: '100%',
                  height: 56,
                  objectFit: 'cover',
                  borderRadius: 0.5,
                  border: `1px solid ${equipmentColors.cardBorderSubtle}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.25,
                  color: equipmentColors.textSecondary,
                  fontSize: '0.6rem',
                  lineHeight: 1.2,
                }}
              >
                {poi.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </DashboardCard>
  );
}
