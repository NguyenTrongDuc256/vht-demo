import { Paper, type PaperProps, Typography, Box } from '@mui/material';
import { equipmentColors } from '../theme';

interface DashboardCardProps extends PaperProps {
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function DashboardCard({
  title,
  icon,
  action,
  children,
  sx,
  ...rest
}: DashboardCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: equipmentColors.card,
        border: `1px solid ${equipmentColors.cardBorderSubtle}`,
        borderRadius: 1,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...rest}
    >
      {title && (
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${equipmentColors.cardBorderSubtle}`,
            minHeight: 40,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography
              variant="subtitle2"
              sx={{
                color: equipmentColors.accent,
                textTransform: 'uppercase',
                fontSize: '0.72rem',
              }}
            >
              {title}
            </Typography>
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}
