'use client';

import { Station } from '@/types';
import { Activity, Clock3, MapPin } from 'lucide-react';
import StatusPill from '../ui/StatusPill';

interface LatestStationsProps {
  stations: Station[];
  limit?: number;
}

export default function LatestStations({ stations, limit = 3 }: LatestStationsProps) {
  // Sort stations by timestamp (descending) and limit to specified number
  const latestStations = [...stations]
    .sort((a, b) => {
      const dateA = new Date(a.lastReading.timestamp).getTime();
      const dateB = new Date(b.lastReading.timestamp).getTime();
      return dateB - dateA; // Descending order (newest first)
    })
    .slice(0, limit);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderLevelChange = (value: number) => {
    if (value === 0) {
      return <span className="text-[11px] text-zinc-400">0.00 m</span>;
    }
    const positive = value > 0;
    return (
      <span className={`text-[11px] font-semibold ${positive ? 'text-rose-300' : 'text-emerald-300'}`}>
        {positive ? '+' : ''}{value.toFixed(2)} m
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg h-full">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300 flex items-center justify-center">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Latest Stations</h3>
            <p className="text-xs text-zinc-500">Most recent telemetry updates</p>
          </div>
        </div>
        <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
          {latestStations.length} entries
        </span>
      </div>

      <div className="divide-y divide-zinc-800/70">
        {latestStations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-500">
            <Clock3 size={32} className="text-zinc-600" />
            <p className="text-sm">No station data available</p>
          </div>
        ) : (
          latestStations.map((station) => (
            <div key={station.id} className="px-4 py-3 hover:bg-zinc-900/80 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-zinc-200 truncate">
                      {station.name}
                    </h4>
                    <StatusPill status={station.status} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {station.basin}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={12} />
                      {formatTime(station.lastReading.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-zinc-100">
                    {station.lastReading.waterLevel.toFixed(2)} m
                  </p>
                  <p>{renderLevelChange(station.lastReading.change1h)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
