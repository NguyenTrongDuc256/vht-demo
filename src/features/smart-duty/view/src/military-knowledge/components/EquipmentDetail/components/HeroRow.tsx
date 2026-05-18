import {
  Box,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
import type { IPropGroupItems } from '@smart-duty/logic';
import { setSelectedTab } from '@smart-duty/logic';
import { useAppDispatch, useAppSelector } from '@app/hooks';
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

const DEFAULT_COLOR = '#00d4ff';

interface HeroRowProps {
  title: string;
  heroImage: string;
  equipmentName: string;
  propertyGroups: IPropGroupItems[];
}

export function HeroRow({
  title,
  heroImage,
  equipmentName,
  propertyGroups,
}: HeroRowProps) {
  const dispatch = useAppDispatch();
  const selectedTabId = useAppSelector((state) => state.equipment.selectedTabId);

  const activeTabId = selectedTabId || propertyGroups[0]?.id || '';
  const currentActiveGroup = propertyGroups.find((group) => group.id === activeTabId);
  const properties = currentActiveGroup?.properties ?? [];
  const gridSize = properties.length <= 4 ? 12 : 6;

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    dispatch(setSelectedTab(newValue));
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: `1px solid ${equipmentColors.cardBorderSubtle}`,
          bgcolor: equipmentColors.bgElevated,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="span"
            sx={{
              width: 28,
              height: 18,
              borderRadius: 0.5,
              background: '#de2910',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::after': { content: '"★"', color: '#ffde00', fontSize: 10 },
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.02em' }}
          >
            {title}
          </Typography>
          <IconButton size="small" sx={{ color: equipmentColors.textSecondary }}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>

        <Tabs
          value={activeTabId}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              color: '#94a3b8',
              textTransform: 'none',
              fontSize: '14px',
              minWidth: 100,
              py: 1.5,
              px: 2.5,
              '&.Mui-selected': { color: '#00d4ff', fontWeight: 'bold' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#00d4ff', height: 2 },
          }}
        >
          {propertyGroups.map((tab) => (
            <Tab key={tab.id} label={tab.name} value={tab.id} />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={1.5} sx={{ mb: 1.5, mt: 1.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <DashboardCard sx={{ height: 220 }}>
            <Box
              component="img"
              src={heroImage}
              alt={equipmentName}
              sx={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
            />
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard sx={{ height: 220, overflow: 'auto' }}>
            <Grid container sx={{ p: 1.5, height: '100%' }}>
              {properties.length > 0 ? (
                properties.map((item) => {
                  const color = item.color ?? DEFAULT_COLOR;
                  return (
                    <Grid key={item.id} size={gridSize} sx={{ py: 0.75, px: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ color, mt: 0.25 }}>
                          {ICON_MAP[item.icon ?? ''] ?? (
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
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              color,
                              fontWeight: 700,
                              fontSize: properties.length <= 4 ? '1rem' : '0.9rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.value}
                            {item.type && (
                              <Typography
                                component="span"
                                sx={{ fontSize: '0.7rem', fontWeight: 400, ml: 0.25 }}
                              >
                                {item.type}
                              </Typography>
                            )}
                          </Typography>
                          {item.key && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: equipmentColors.textSecondary,
                                display: 'block',
                                lineHeight: 1.3,
                                mt: 0.25,
                              }}
                            >
                              {item.key}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Grid size={12}>
                  <Typography
                    sx={{ color: equipmentColors.textMuted, fontStyle: 'italic', pl: 1 }}
                  >
                    Không có dữ liệu thông số cho mục này.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
    </>
  );
}
