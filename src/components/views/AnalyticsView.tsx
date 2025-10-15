'use client';

import StatusCard from '@/components/kpi/StatusCard';
import { BasinSummary, Station } from '@/types';
import { Activity, AlertTriangle, Droplet, LineChart, TrendingDown, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  stations: Station[];
  basins: BasinSummary[];
}

const STATUS_COLORS: Record<Station['status'], { bar: string; text: string }> = {
  Normal: { bar: 'bg-emerald-500', text: 'text-emerald-300' },
  Warning: { bar: 'bg-amber-500', text: 'text-amber-300' },
  Danger: { bar: 'bg-rose-500', text: 'text-rose-300' },
  Offline: { bar: 'bg-slate-500', text: 'text-slate-300' },
};

export default function AnalyticsView({ stations, basins }: AnalyticsViewProps) {
  const totalStations = stations.length;
  const safeTotalStations = Math.max(1, totalStations);
  const activeStations = stations.filter((station) => station.status !== 'Offline').length;
  const warningStations = stations.filter((station) => station.status === 'Warning').length;
  const dangerStations = stations.filter((station) => station.status === 'Danger').length;
  const offlineStations = stations.filter((station) => station.status === 'Offline').length;

  const averageLevel =
    totalStations === 0
      ? 0
      : stations.reduce((sum, station) => sum + station.lastReading.waterLevel, 0) / safeTotalStations;
  const averageChange24h =
    totalStations === 0
      ? 0
      : stations.reduce((sum, station) => sum + station.lastReading.change24h, 0) / safeTotalStations;

  const risers = [...stations]
    .sort((a, b) => b.lastReading.change24h - a.lastReading.change24h)
    .slice(0, 5);
  const droppers = [...stations]
    .sort((a, b) => a.lastReading.change24h - b.lastReading.change24h)
    .slice(0, 5);

  const statusDistribution = stations.reduce<Record<Station['status'], number>>(
    (acc, station) => {
      acc[station.status] = (acc[station.status] ?? 0) + 1;
      return acc;
    },
    { Normal: 0, Warning: 0, Danger: 0, Offline: 0 }
  );

  const basinTrends = [...basins].sort((a, b) => Math.abs(b.avgChange24h) - Math.abs(a.avgChange24h));

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard
          title="Active Coverage"
          value={`${activeStations}/${totalStations}`}
          description={`${totalStations === 0 ? 0 : Math.round((activeStations / totalStations) * 100)}% stations reporting`}
          color="sky"
          icon={<Activity size={22} />}
        />
        <StatusCard
          title="Avg Water Level"
          value={`${averageLevel.toFixed(1)} m`}
          description="Network-wide mean stage"
          color="blue"
          icon={<Droplet size={22} />}
        />
        <StatusCard
          title="24h Net Change"
          value={`${averageChange24h >= 0 ? '+' : ''}${averageChange24h.toFixed(2)} m`}
          description="Average movement across stations"
          color={averageChange24h >= 0 ? 'red' : 'emerald'}
          icon={<LineChart size={22} />}
        />
        <StatusCard
          title="Active Alerts"
          value={warningStations + dangerStations + offlineStations}
          description={`${dangerStations} danger | ${warningStations} warning`}
          color={dangerStations > 0 ? 'red' : warningStations > 0 ? 'yellow' : 'emerald'}
          icon={<AlertTriangle size={22} />}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Status Distribution</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Current station state mix across the network
              </p>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
              {totalStations} stations
            </span>
          </div>
          <div className="p-4 space-y-3">
            {(Object.keys(statusDistribution) as Array<Station['status']>).map((status) => {
              const count = statusDistribution[status];
              const percentage = totalStations === 0 ? 0 : Math.round((count / totalStations) * 100);
              const colors = STATUS_COLORS[status];
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="uppercase tracking-wide">{status}</span>
                    <span className={`${colors.text} font-semibold`}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`${colors.bar} h-full rounded-full transition-all`}
                      style={{ width: percentage === 0 ? '0%' : `${Math.max(6, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Basin Change (24h)</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Highest magnitude average movements</p>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
              Top {Math.min(5, basinTrends.length)}
            </span>
          </div>
          <div className="p-4 space-y-3">
            {basinTrends.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No basin analytics available</p>
            ) : (
              basinTrends.slice(0, 6).map((basin) => {
                const positive = basin.avgChange24h >= 0;
                const color = positive ? 'text-rose-300' : 'text-emerald-300';
                return (
                  <div
                    key={basin.name}
                    className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-200">{basin.name}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {basin.activeStations}/{basin.stationCount} stations active
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${color}`}>
                      {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {positive ? '+' : ''}
                      {basin.avgChange24h.toFixed(2)} m
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-rose-300" />
              <h3 className="text-sm font-semibold text-zinc-100">Top Risers (24h)</h3>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
              {risers.length} records
            </span>
          </div>
          <div className="p-4 space-y-2">
            {risers.map((station, index) => (
              <div
                key={station.id}
                className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold grid place-items-center">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{station.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{station.basin}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-rose-300">
                    +{station.lastReading.change24h.toFixed(2)} m
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Level {station.lastReading.waterLevel.toFixed(1)} m
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-emerald-300" />
              <h3 className="text-sm font-semibold text-zinc-100">Top Droppers (24h)</h3>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
              {droppers.length} records
            </span>
          </div>
          <div className="p-4 space-y-2">
            {droppers.map((station, index) => (
              <div
                key={station.id}
                className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold grid place-items-center">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{station.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{station.basin}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-emerald-300">
                    {station.lastReading.change24h.toFixed(2)} m
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Level {station.lastReading.waterLevel.toFixed(1)} m
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
