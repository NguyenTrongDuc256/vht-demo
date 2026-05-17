import { useEffect } from 'react';
import {
  Box,
  Grid,
  ThemeProvider,
  CssBaseline,
  Alert,
  Button,
} from '@mui/material';
import { setActiveSpecTabId } from '@smart-duty/logic';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { useEquipmentDetail } from '../../hooks/useEquipmentDetail';
import { useEquipmentMetrics } from '../../hooks/useEquipmentMetrics';
import { equipmentTheme } from './theme';
import { HeaderBar } from './components/HeaderBar';
import { HeroRow } from './components/HeroRow';
import { SatelliteSection } from './components/SatelliteSection';
import { MapSection } from './components/MapSection';
import { KnowledgeGraphSection } from './components/KnowledgeGraphSection';
import { EventTimelineSection } from './components/EventTimelineSection';
import { ChartsSection } from './components/ChartsSection';
import { EquipmentDetailSkeleton } from './components/EquipmentDetailSkeleton';

export function EquipmentDetail() {
  const dispatch = useAppDispatch();
  const activeSpecTabId = useAppSelector(
    (state) => state.equipmentDetail.activeSpecTabId,
  );
  const { data, isLoading, isError, error, refetch, isFetching } =
    useEquipmentDetail();

  const metrics = useEquipmentMetrics(data?.specTabs);

  useEffect(() => {
    if (!data?.specTabs.length) return;
    const validIds = data.specTabs.map((t) => t.id);
    if (!validIds.includes(activeSpecTabId)) {
      dispatch(setActiveSpecTabId(data.specTabs[0].id));
    }
  }, [data?.specTabs, activeSpecTabId, dispatch]);

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
              {(error as Error).message ?? 'Không tải được dữ liệu trang bị'}
            </Alert>
          </Box>
        )}

        {data && !isLoading && (
          <>
            <HeaderBar name={data.name} specTabs={data.specTabs} />

            <Box
              sx={{
                flex: 1,
                p: 1.5,
                overflow: 'auto',
                opacity: isFetching ? 0.85 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <HeroRow heroImage={data.heroImage} metrics={metrics} />

              <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <SatelliteSection image={data.satelliteImage} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <MapSection />
                </Grid>
              </Grid>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <KnowledgeGraphSection
                    subtitle={data.subtitle}
                    nodes={data.knowledgeNodes}
                    stats={data.knowledgeStats}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <EventTimelineSection events={data.events} />
                </Grid>
              </Grid>

              <ChartsSection
                monthlyTrend={data.monthlyTrend}
                locationFrequency={data.locationFrequency}
              />
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default EquipmentDetail;
