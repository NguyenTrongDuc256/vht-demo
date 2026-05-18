import {
  Box,
  Grid,
  ThemeProvider,
  CssBaseline,
  Alert,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  MkService,
  getEquipmentDisplayTitle,
  getEquipmentHeroImage,
  getEquipmentSatelliteImage,
} from '@smart-duty/logic';
import { EQUIPMENT_DASHBOARD_MOCK } from '../../constants/equipment-dashboard.mock';
import { equipmentTheme } from './theme';
import { HeroRow } from './components/HeroRow';
import { SatelliteSection } from './components/SatelliteSection';
import { MapSection } from './components/MapSection';
import { KnowledgeGraphSection } from './components/KnowledgeGraphSection';
import { EventTimelineSection } from './components/EventTimelineSection';
import { ChartsSection } from './components/ChartsSection';
import { EquipmentDetailSkeleton } from './components/EquipmentDetailSkeleton';

const dashboard = EQUIPMENT_DASHBOARD_MOCK;
const EQUIPMENT_QUERY_PARAMS = { entityId: 'VES_TYPE054A' };

export function EquipmentDetail() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery(
    MkService.getEquipmentModel(EQUIPMENT_QUERY_PARAMS),
  );

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
                  <KnowledgeGraphSection
                    subtitle={dashboard.subtitle}
                    nodes={dashboard.knowledgeNodes}
                    stats={dashboard.knowledgeStats}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
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
