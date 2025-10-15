'use client';

import HealthStatus from '@/components/panels/HealthStatus';
import SlaStatus from '@/components/panels/SlaStatus';
import StatusPill from '@/components/ui/StatusPill';
import { BasinSummary, Station } from '@/types';
import { Battery, SignalHigh, WifiOff } from 'lucide-react';

interface QualityViewProps {
  stations: Station[];
  basins: BasinSummary[];
}

export default function QualityView({ stations, basins }: QualityViewProps) {
  const totalStations = stations.length;
  const onlineStations = stations.filter((station) => station.status !== 'Offline').length;
  const offlineStations = stations.filter((station) => station.status === 'Offline').length;
  const warningStations = stations.filter((station) => station.status === 'Warning').length;
  const dangerStations = stations.filter((station) => station.status === 'Danger').length;

  const averageBattery =
    onlineStations === 0
      ? 0
      : Math.round(
          stations
            .filter((station) => station.status !== 'Offline')
            .reduce((sum, station) => sum + station.lastReading.battery, 0) / onlineStations
        );

  const averageSignal =
    onlineStations === 0
      ? 0
      : Math.round(
          stations
            .filter((station) => station.status !== 'Offline')
            .reduce((sum, station) => sum + station.lastReading.rssi, 0) / onlineStations
        );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Network Uptime</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">
            {totalStations === 0 ? '0%' : `${Math.round((onlineStations / totalStations) * 100)}%`}
          </p>
          <p className="text-[11px] text-zinc-500 mt-2">
            {onlineStations} of {totalStations} stations reporting
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Average Battery</p>
          <div className="flex items-center gap-2 mt-1">
            <Battery size={18} className="text-emerald-300" />
            <p className="text-2xl font-bold text-emerald-300">{averageBattery}%</p>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Across active devices</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Average Signal</p>
          <div className="flex items-center gap-2 mt-1">
            <SignalHigh size={18} className="text-sky-300" />
            <p className="text-2xl font-bold text-sky-300">{averageSignal} dBm</p>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Communication health</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Attention Needed</p>
          <div className="flex items-center gap-2 mt-1">
            <WifiOff size={18} className="text-rose-300" />
            <p className="text-2xl font-bold text-rose-300">
              {offlineStations + warningStations + dangerStations}
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            {dangerStations} danger | {warningStations} warning | {offlineStations} offline
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">Current Network Snapshot</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <StatusPill status="Normal" size="sm" />
            <StatusPill status="Warning" size="sm" />
            <StatusPill status="Danger" size="sm" />
            <StatusPill status="Offline" size="sm" />
          </div>
        </div>
        <div className="p-4 text-[11px] text-zinc-500 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stations.slice(0, 8).map((station) => (
            <div
              key={station.id}
              className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <p className="text-sm font-semibold text-zinc-100 truncate">{station.name}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{station.basin}</p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">{station.lastReading.waterLevel.toFixed(1)} m</span>
                <StatusPill status={station.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthStatus stations={stations} />
        <SlaStatus basins={basins} />
      </div>
    </div>
  );
}
