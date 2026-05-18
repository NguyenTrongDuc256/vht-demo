import { Box, Tabs, Tab, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import type { IPropGroupItems } from '@smart-duty/logic';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setActivePropertyGroupId } from '@smart-duty/logic';
import { equipmentColors } from '../theme';

const TAB_ICONS: Record<string, React.ReactElement> = {
  tong_quan: <DashboardIcon sx={{ fontSize: 16 }} />,
  hoa_luc: <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />,
  co_dong: <SpeedIcon sx={{ fontSize: 16 }} />,
  phong_thu: <ShieldIcon sx={{ fontSize: 16 }} />,
};

interface HeaderBarProps {
  title: string;
  propertyGroups: IPropGroupItems[];
}

export function HeaderBar({ title, propertyGroups }: HeaderBarProps) {
  const dispatch = useAppDispatch();
  const activePropertyGroupId = useAppSelector(
    (state) => state.equipmentDetail.activePropertyGroupId,
  );

  return (
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
        value={activePropertyGroupId || propertyGroups[0]?.id}
        onChange={(_, groupId: string) =>
          dispatch(setActivePropertyGroupId(groupId))
        }
        sx={{
          minHeight: 36,
          '& .MuiTabs-indicator': { bgcolor: equipmentColors.accent, height: 2 },
          '& .MuiTab-root': {
            minHeight: 36,
            py: 0.5,
            px: 2,
            fontSize: '0.75rem',
            color: equipmentColors.textSecondary,
            textTransform: 'none',
            gap: 0.5,
            '&.Mui-selected': { color: equipmentColors.accent },
          },
        }}
      >
        {propertyGroups.map((group) => (
          <Tab
            key={group.id}
            value={group.id}
            label={group.name}
            icon={TAB_ICONS[group.key] ?? <SettingsIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Box>
  );
}
