'use client';

import { SystemStatus } from '@/types';
import StatusCard from './StatusCard';
import { Activity, AlertTriangle, Bell, Database, WifiOff, TrendingUp } from 'lucide-react';

interface KpiDashboardProps {
  systemStatus: SystemStatus;
}

export default function KpiDashboard({ systemStatus }: KpiDashboardProps) {
  const {
    totalStations,
    activeStations,
    warningStations,
    dangerStations,
    offlineStations,
    alertsLast24h,
    dataDeliveryRate7d,
  } = systemStatus;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatusCard
        title="Active Stations"
        value={`${activeStations} / ${totalStations}`}
        description={`${Math.round((activeStations / totalStations) * 100)}% operational`}
        color="sky"
        icon={<Activity size={24} />}
      />
      <StatusCard
        title="Warning"
        value={warningStations}
        description={warningStations > 0 ? 'Stations in warning' : 'No warnings'}
        color={warningStations > 0 ? 'yellow' : 'emerald'}
        icon={<AlertTriangle size={24} />}
      />
      <StatusCard
        title="Danger"
        value={dangerStations}
        description={dangerStations > 0 ? 'Immediate action needed' : 'All clear'}
        color={dangerStations > 0 ? 'red' : 'emerald'}
        icon={<AlertTriangle size={24} />}
      />
      <StatusCard
        title="Open Alerts (24h)"
        value={alertsLast24h}
        description={alertsLast24h > 0 ? `${alertsLast24h} active alerts` : 'No active alerts'}
        color={alertsLast24h > 5 ? 'red' : alertsLast24h > 0 ? 'yellow' : 'emerald'}
        icon={<Bell size={24} />}
      />
      <StatusCard
        title="Data Delivery (7d)"
        value={`${dataDeliveryRate7d}%`}
        description={dataDeliveryRate7d >= 95 ? 'Excellent' : dataDeliveryRate7d >= 80 ? 'Good' : 'Needs improvement'}
        color={dataDeliveryRate7d < 80 ? 'red' : dataDeliveryRate7d < 95 ? 'yellow' : 'emerald'}
        icon={<Database size={24} />}
      />
      <StatusCard
        title="Offline > 6h"
        value={offlineStations}
        description={offlineStations > 0 ? 'Check connectivity' : 'All online'}
        color={offlineStations > 0 ? 'red' : 'emerald'}
        icon={<WifiOff size={24} />}
      />
    </div>
  );
}