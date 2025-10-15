'use client';

import StatusPill from '@/components/ui/StatusPill';
import { BasinSummary, Station } from '@/types';
import { Activity, AlertTriangle, MapPin, Power, ShieldAlert } from 'lucide-react';

interface DevicesViewProps {
  stations: Station[];
  basins: BasinSummary[];
}

const STATUS_ORDER: Station['status'][] = ['Danger', 'Warning', 'Offline', 'Normal'];

export default function DevicesView({ stations, basins }: DevicesViewProps) {
  const totalStations = stations.length;
  const statusGroups = stations.reduce<Record<Station['status'], Station[]>>(
    (acc, station) => {
      (acc[station.status] ||= []).push(station);
      return acc;
    },
    { Normal: [], Warning: [], Danger: [], Offline: [] }
  );

  const maintenanceQueue = [
    ...statusGroups.Danger,
    ...statusGroups.Warning,
    ...statusGroups.Offline,
  ].slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Total Devices</p>
          <p className="text-2xl font-bold text-sky-300 mt-1">{totalStations}</p>
          <p className="text-[11px] text-zinc-500 mt-2">{basins.length} basins monitored</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Operational</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">
            {statusGroups.Normal.length + statusGroups.Warning.length + statusGroups.Danger.length}
          </p>
          <p className="text-[11px] text-zinc-500 mt-2">Including degraded states</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Critical Issues</p>
          <p className="text-2xl font-bold text-rose-300 mt-1">{statusGroups.Danger.length}</p>
          <p className="text-[11px] text-zinc-500 mt-2">Immediate field escalation</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Offline</p>
          <p className="text-2xl font-bold text-slate-300 mt-1">{statusGroups.Offline.length}</p>
          <p className="text-[11px] text-zinc-500 mt-2">Requires connectivity check</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-sky-300" />
              <h3 className="text-sm font-semibold text-zinc-100">Device Status Overview</h3>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
              {totalStations} records
            </span>
          </div>
          <div className="divide-y divide-zinc-800">
            {STATUS_ORDER.map((status) => (
              <div key={status} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusPill status={status} size="md" />
                    <span className="text-xs text-zinc-500">
                      {statusGroups[status].length} device{statusGroups[status].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {statusGroups[status].length > 0 && (
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
                      {Math.round((statusGroups[status].length / Math.max(1, totalStations)) * 100)}%
                    </span>
                  )}
                </div>
                {statusGroups[status].length === 0 ? (
                  <p className="text-[11px] text-zinc-500">No devices in this state</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {statusGroups[status].slice(0, 6).map((station) => (
                      <div
                        key={station.id}
                        className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <p className="text-sm font-semibold text-zinc-100 truncate">{station.name}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {station.basin}
                          </span>
                          <span>{station.lastReading.waterLevel.toFixed(1)} m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-300" />
              <h3 className="text-sm font-semibold text-zinc-100">Maintenance Queue</h3>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
              {maintenanceQueue.length} prioritized
            </span>
          </div>
          <div className="p-4 space-y-3">
            {maintenanceQueue.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">All devices operating nominally</p>
            ) : (
              maintenanceQueue.map((station) => (
                <div
                  key={station.id}
                  className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{station.name}</p>
                    <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                      <Power size={12} />
                      Battery {station.lastReading.battery}%
                    </p>
                  </div>
                  <StatusPill status={station.status} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
