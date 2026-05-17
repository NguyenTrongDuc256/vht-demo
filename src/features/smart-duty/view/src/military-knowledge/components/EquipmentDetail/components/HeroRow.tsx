import { Box, Grid, Typography } from '@mui/material';
import StraightenIcon from '@mui/icons-material/Straighten';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HeightIcon from '@mui/icons-material/Height';
import BoltIcon from '@mui/icons-material/Bolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScaleIcon from '@mui/icons-material/Scale';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import WavesIcon from '@mui/icons-material/Waves';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import RadarIcon from '@mui/icons-material/Radar';
import SensorsIcon from '@mui/icons-material/Sensors';
import type { EquipmentMetric } from '@smart-duty/logic';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

const ICON_MAP: Record<string, React.ReactElement> = {
  straighten: <StraightenIcon sx={{ fontSize: 18 }} />,
  swap_horiz: <SwapHorizIcon sx={{ fontSize: 18 }} />,
  height: <HeightIcon sx={{ fontSize: 18 }} />,
  bolt: <BoltIcon sx={{ fontSize: 18 }} />,
  water: <WaterDropIcon sx={{ fontSize: 18 }} />,
  scale: <ScaleIcon sx={{ fontSize: 18 }} />,
  settings: <SettingsIcon sx={{ fontSize: 18 }} />,
  groups: <GroupsIcon sx={{ fontSize: 18 }} />,
  gavel: <GavelIcon sx={{ fontSize: 18 }} />,
  security: <SecurityIcon sx={{ fontSize: 18 }} />,
  waves: <WavesIcon sx={{ fontSize: 18 }} />,
  speed: <SpeedIcon sx={{ fontSize: 18 }} />,
  explore: <ExploreIcon sx={{ fontSize: 18 }} />,
  radar: <RadarIcon sx={{ fontSize: 18 }} />,
  sensors: <SensorsIcon sx={{ fontSize: 18 }} />,
};

interface HeroRowProps {
  heroImage: string;
  metrics: EquipmentMetric[];
}

export function HeroRow({ heroImage, metrics }: HeroRowProps) {
  const gridSize = metrics.length <= 4 ? 12 : 6;

  return (
    <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <DashboardCard sx={{ height: 220 }}>
          <Box
            component="img"
            src={heroImage}
            alt="CV-18 Fujian"
            sx={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </DashboardCard>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <DashboardCard sx={{ height: 220, overflow: 'auto' }}>
          <Grid container sx={{ p: 1.5, height: '100%' }}>
            {metrics.map((metric) => (
              <Grid key={metric.id} size={gridSize} sx={{ py: 0.75, px: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ color: metric.color, mt: 0.25 }}>
                    {ICON_MAP[metric.icon] ?? (
                      <SettingsIcon sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: equipmentColors.textMuted,
                        display: 'block',
                        lineHeight: 1.2,
                      }}
                    >
                      {metric.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: metric.color,
                        fontWeight: 700,
                        fontSize: metrics.length <= 4 ? '1rem' : '0.9rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {metric.value}
                      {metric.unit && (
                        <Typography
                          component="span"
                          sx={{ fontSize: '0.7rem', fontWeight: 400, ml: 0.25 }}
                        >
                          {metric.unit}
                        </Typography>
                      )}
                    </Typography>
                    {metric.subValue && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: equipmentColors.textSecondary,
                          display: 'block',
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        {metric.subValue}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </Grid>
    </Grid>
  );
}
