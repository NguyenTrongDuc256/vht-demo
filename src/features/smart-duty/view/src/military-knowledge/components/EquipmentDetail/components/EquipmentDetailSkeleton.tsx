import { Box, Grid, Skeleton } from '@mui/material';
import { equipmentColors } from '../theme';

export function EquipmentDetailSkeleton() {
  return (
    <Box sx={{ p: 1.5 }}>
      <Skeleton
        variant="rectangular"
        height={48}
        sx={{ mb: 1.5, bgcolor: equipmentColors.card }}
      />
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rectangular" height={220} sx={{ bgcolor: equipmentColors.card }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" height={220} sx={{ bgcolor: equipmentColors.card }} />
        </Grid>
      </Grid>
      <Grid container spacing={1.5}>
        {[0, 1].map((i) => (
          <Grid key={i} size={{ xs: 12, lg: 6 }}>
            <Skeleton variant="rectangular" height={280} sx={{ bgcolor: equipmentColors.card }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
