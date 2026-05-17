import { useState } from 'react';
import { Box, IconButton, Slider, Button, Typography } from '@mui/material';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

interface SatelliteSectionProps {
  image: string;
}

export function SatelliteSection({ image }: SatelliteSectionProps) {
  const [timeline, setTimeline] = useState(85);

  return (
    <DashboardCard
      title="Ảnh vệ tinh"
      icon={<SatelliteAltIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
      action={
        <IconButton size="small" sx={{ color: equipmentColors.textSecondary }}>
          <FullscreenIcon fontSize="small" />
        </IconButton>
      }
      sx={{ height: 280 }}
    >
      <Box sx={{ position: 'relative', height: 200 }}>
        <Box
          component="img"
          src={image}
          alt="Satellite"
          sx={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 72,
            height: 52,
            bgcolor: 'rgba(2, 12, 27, 0.85)',
            border: `1px solid ${equipmentColors.cardBorder}`,
            borderRadius: 0.5,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(circle at 70% 40%, ${equipmentColors.accent}33 0%, transparent 50%),
                linear-gradient(135deg, #0a2540 0%, #061220 100%)
              `,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: equipmentColors.accentRed,
              top: '38%',
              left: '68%',
              boxShadow: `0 0 6px ${equipmentColors.accentRed}`,
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderTop: `1px solid ${equipmentColors.cardBorderSubtle}`,
        }}
      >
        <Typography variant="caption" sx={{ color: equipmentColors.textMuted, minWidth: 70 }}>
          20/07/2012
        </Typography>
        <Slider
          value={timeline}
          onChange={(_, v) => setTimeline(v as number)}
          size="small"
          sx={{
            flex: 1,
            color: equipmentColors.accent,
            '& .MuiSlider-thumb': { width: 10, height: 10 },
            '& .MuiSlider-rail': { opacity: 0.3, bgcolor: equipmentColors.textMuted },
          }}
        />
        <Typography variant="caption" sx={{ color: equipmentColors.textMuted, minWidth: 70 }}>
          30/03/2026
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<PlayArrowIcon />}
          sx={{
            borderColor: equipmentColors.cardBorder,
            color: equipmentColors.accent,
            fontSize: '0.7rem',
            minWidth: 72,
            py: 0.25,
          }}
        >
          Play
        </Button>
      </Box>
    </DashboardCard>
  );
}
