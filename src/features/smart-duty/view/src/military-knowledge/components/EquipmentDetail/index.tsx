import {
  Box,
  Grid,
  ThemeProvider,
  CssBaseline,
  Alert,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MkService,
  transformToGraphData,
  getEquipmentDisplayTitle,
  getEquipmentHeroImage,
  getEquipmentSatelliteImage,
} from '@smart-duty/logic';
import {
  SituationItem,
  SituationItemHeader,
  SituationItemMention,
  SituationItemRefs,
  SituationItemSources,
  SituationItemSourcesLabel,
  SituationItemThreatBadge,
  SituationItemToggle,
} from '@smart-duty/view';
import { EQUIPMENT_DASHBOARD_MOCK } from '../../constants/equipment-dashboard.mock';
import { equipmentTheme } from './theme';
import { HeroRow } from './components/HeroRow';
import { SatelliteSection } from './components/SatelliteSection';
import { MapSection } from './components/MapSection';
import { KnowledgeGraphSection } from './components/KnowledgeGraphSection';
import { EventTimelineSection } from './components/EventTimelineSection';
import { ChartsSection } from './components/ChartsSection';
import { EquipmentDetailSkeleton } from './components/EquipmentDetailSkeleton';
import { DashboardCard } from './components/DashboardCard';
import { equipmentColors } from './theme';

const dashboard = EQUIPMENT_DASHBOARD_MOCK;
const EQUIPMENT_QUERY_PARAMS = { entityId: 'VES_TYPE054A' };

export function EquipmentDetail() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery(
    MkService.getEquipmentModel(EQUIPMENT_QUERY_PARAMS),
  );

  const knowledgeGraph = useMemo(
    () => (data ? transformToGraphData(data) : null),
    [data],
  );

  const [critical, medium, low] = dashboard.situations;

  return (
    <ThemeProvider theme={equipmentTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading && <EquipmentDetailSkeleton />}

        {isError && (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Thử lại
                </Button>
              }
            >
              {(error as Error)?.message ?? 'Không tải được dữ liệu trang bị'}
            </Alert>
          </Box>
        )}

        {data && !isLoading && (
          <>
            <HeroRow
              title={getEquipmentDisplayTitle(data)}
              heroImage={getEquipmentHeroImage(data)}
              equipmentName={data.name}
              propertyGroups={data.propertyGroups}
            />

            <Box
              sx={{
                flex: 1,
                p: 1.5,
                overflow: 'auto',
                opacity: isFetching ? 0.85 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <SatelliteSection image={getEquipmentSatelliteImage(data)} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <MapSection />
                </Grid>
              </Grid>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {knowledgeGraph && (
                    <KnowledgeGraphSection
                      graph={knowledgeGraph}
                      equipmentName={data.name}
                    />
                  )}
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <DashboardCard
                    title="Tình huống (demo SituationItem)"
                    icon={<ReportIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
                    sx={{ height: 720 }}
                  >
                    <Stack spacing={1.5} sx={{ p: 1.5, overflow: 'auto' }}>
                      {/* Cách 1: compose đầy đủ (compound component) */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: equipmentColors.textMuted, mb: 0.75, display: 'block' }}
                        >
                          Cách 1 — compose từng part (variant=&quot;timeline&quot;)
                        </Typography>
                        {critical && (
                          <SituationItem
                            situation={critical}
                            variant="timeline"
                            onOpenByClick={() => console.log('Mở tình huống:', critical.mention)}
                          >
                            <SituationItemHeader>
                              <SituationItemMention />
                              <SituationItemThreatBadge />
                              <SituationItemToggle />
                            </SituationItemHeader>
                            <SituationItemRefs />
                            <SituationItemSources>
                              <SituationItemSourcesLabel />
                              {critical.sources.map((src) => (
                                <Typography
                                  key={src.id}
                                  component="span"
                                  sx={{ fontSize: 12, color: equipmentColors.accent, cursor: 'pointer' }}
                                >
                                  {src.name}
                                </Typography>
                              ))}
                            </SituationItemSources>
                          </SituationItem>
                        )}
                      </Box>

                      {/* Cách 2: không truyền children → layout mặc định */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: equipmentColors.textMuted, mb: 0.75, display: 'block' }}
                        >
                          Cách 2 — layout mặc định (variant=&quot;list&quot;)
                        </Typography>
                        {medium && <SituationItem situation={medium} variant="list" />}
                      </Box>

                      {/* Cách 3: notification variant */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: equipmentColors.textMuted, mb: 0.75, display: 'block' }}
                        >
                          Cách 3 — notification (defaultExpandAllCards)
                        </Typography>
                        {low && (
                          <SituationItem
                            situation={low}
                            variant="notification"
                            defaultExpandAllCards
                          />
                        )}
                      </Box>
                    </Stack>
                  </DashboardCard>
                </Grid>
              </Grid>

              <Grid container spacing={1.5} sx={{ mt: 0 }}>
                <Grid size={12}>
                  <EventTimelineSection events={dashboard.events} />
                </Grid>
              </Grid>

              <ChartsSection
                monthlyTrend={dashboard.monthlyTrend}
                locationFrequency={dashboard.locationFrequency}
              />
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default EquipmentDetail;
