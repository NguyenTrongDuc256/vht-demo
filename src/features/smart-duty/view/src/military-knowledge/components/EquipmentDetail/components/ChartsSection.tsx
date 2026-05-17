import { Box } from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaceIcon from '@mui/icons-material/Place';
import type { ChartPoint, LocationFrequency } from '@smart-duty/logic';
import { DashboardCard } from './DashboardCard';
import { equipmentColors } from '../theme';

interface ChartsSectionProps {
  monthlyTrend: ChartPoint[];
  locationFrequency: LocationFrequency[];
}

export function ChartsSection({ monthlyTrend, locationFrequency }: ChartsSectionProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
      <Box sx={{ flex: 1 }}>
        <DashboardCard
          title="Xu hướng sự kiện theo tháng"
          icon={<TrendingUpIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
          sx={{ height: 200 }}
        >
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyTrend} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="alertsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b3a3a" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#8b3a3a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={equipmentColors.cardBorderSubtle} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: equipmentColors.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: equipmentColors.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: equipmentColors.card,
                  border: `1px solid ${equipmentColors.cardBorder}`,
                  borderRadius: 4,
                  fontSize: 11,
                }}
              />
              <Area type="monotone" dataKey="events" stroke="#00d4ff" fill="url(#eventsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="alerts" stroke="#a05252" fill="url(#alertsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>
      </Box>

      <Box sx={{ flex: 1 }}>
        <DashboardCard
          title="Tần suất xuất hiện dựa trên địa điểm"
          icon={<PlaceIcon sx={{ fontSize: 16, color: equipmentColors.accent }} />}
          sx={{ height: 200 }}
        >
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={locationFrequency}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
            >
              <CartesianGrid stroke={equipmentColors.cardBorderSubtle} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: equipmentColors.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="location"
                width={72}
                tick={{ fill: equipmentColors.textSecondary, fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: equipmentColors.card,
                  border: `1px solid ${equipmentColors.cardBorder}`,
                  borderRadius: 4,
                  fontSize: 11,
                }}
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff8a7a" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
              </defs>
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                fill="url(#barGrad)"
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </Box>
    </Box>
  );
}
