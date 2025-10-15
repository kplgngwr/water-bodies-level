'use client';

import KpiDashboard from '@/components/kpi/KpiDashboard';
import BasinSummary from '@/components/kpi/BasinSummary';
import WaterLevelMap from '@/components/map/WaterLevelMap';
import AlertTicker from '@/components/panels/AlertTicker';
import HealthStatus from '@/components/panels/HealthStatus';
import LatestStations from '@/components/panels/LatestStations';
import SlaStatus from '@/components/panels/SlaStatus';
import TopChanges from '@/components/panels/TopChanges';
import { Alert, BasinSummary as BasinSummaryType, Station, SystemStatus } from '@/types';

interface DashboardViewProps {
  stations: Station[];
  alerts: Alert[];
  basins: BasinSummaryType[];
  systemStatus: SystemStatus;
  regionFilter: string;
  statusFilter: Set<Station['status']>;
  onRegionFilterChange: (region: string) => void;
  onStatusFilterToggle: (status: Station['status']) => void;
  onAlertAcknowledge: (alertId: string) => void;
}

export default function DashboardView({
  stations,
  alerts,
  basins,
  systemStatus,
  regionFilter,
  statusFilter,
  onRegionFilterChange,
  onStatusFilterToggle,
  onAlertAcknowledge,
}: DashboardViewProps) {
  return (
    <>
      <section>
        <KpiDashboard systemStatus={systemStatus} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <WaterLevelMap
            stations={stations}
            regionFilter={regionFilter}
            statusFilter={statusFilter}
            onRegionFilterChange={onRegionFilterChange}
            onStatusFilterChange={onStatusFilterToggle}
            title="Live Station Map"
            subtitle="Real-time monitoring locations with filters"
            showLiveIndicator
          />
        </div>
        <div className="grid grid-cols-1 space-y-4 gap-3">
          <AlertTicker alerts={alerts} onAcknowledge={onAlertAcknowledge} />
          <TopChanges stations={stations} />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-2">
          <BasinSummary basins={basins} />
        </div>
        <div className="xl:col-span-2">
          <LatestStations stations={stations} limit={4} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthStatus stations={stations} />
        <SlaStatus basins={basins} />
      </section>
    </>
  );
}
