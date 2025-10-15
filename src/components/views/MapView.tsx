'use client';

import WaterLevelMap from '@/components/map/WaterLevelMap';
import LatestStations from '@/components/panels/LatestStations';
import TopChanges from '@/components/panels/TopChanges';
import { Station } from '@/types';

interface MapViewProps {
  stations: Station[];
  regionFilter: string;
  statusFilter: Set<Station['status']>;
  onRegionFilterChange: (region: string) => void;
  onStatusFilterToggle: (status: Station['status']) => void;
  onStationSelect?: (station: Station) => void;
}

export default function MapView({
  stations,
  regionFilter,
  statusFilter,
  onRegionFilterChange,
  onStatusFilterToggle,
  onStationSelect,
}: MapViewProps) {
  return (
    <div className="grid grid-cols-1 2xl:grid-cols-[2fr_1fr] gap-4">
      <div className="space-y-4">
        <WaterLevelMap
          stations={stations}
          onStationClick={onStationSelect}
          regionFilter={regionFilter}
          statusFilter={statusFilter}
          onRegionFilterChange={onRegionFilterChange}
          onStatusFilterChange={onStatusFilterToggle}
          title="Map Explorer"
          subtitle="Filter, inspect and interact with live stations"
          showLiveIndicator
        />
      </div>
      <div className="space-y-4">
        <LatestStations stations={stations} limit={6} />
        <TopChanges stations={stations} onStationClick={onStationSelect} />
      </div>
    </div>
  );
}
