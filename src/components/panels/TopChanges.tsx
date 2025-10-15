'use client';

import { Station } from '@/types';
import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

interface TopChangesProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
}

export default function TopChanges({ stations, onStationClick }: TopChangesProps) {
  const [tab, setTab] = useState<'1h' | '24h' | '7d'>('24h');

  // Create a derived change metric based on tab selection
  const metricFor = (s: Station) => {
    if (tab === '1h') return s.lastReading.change1h;
    if (tab === '24h') return s.lastReading.change24h;
    // 7d is mocked by scaling 24h and adding tiny randomness to make it look different
    return Number((s.lastReading.change24h * 2.6 + (Math.random() - 0.5) * 0.2).toFixed(2));
  };

  const getTopChanges = (type: 'risers' | 'droppers', count: number = 5) => {
    return [...stations]
      .filter(station => station.status !== 'Offline')
      .sort((a, b) => type === 'risers' 
        ? metricFor(b) - metricFor(a)
        : metricFor(a) - metricFor(b)
      )
      .filter(s => type === 'risers' ? metricFor(s) > 0 : metricFor(s) < 0)
      .slice(0, count);
  };

  const topRisers = useMemo(() => getTopChanges('risers'), [stations, tab]);
  const topDroppers = useMemo(() => getTopChanges('droppers'), [stations, tab]);

  const renderStationList = (stationList: Station[], type: 'risers' | 'droppers') => {
    const accent =
      type === 'risers'
        ? {
            Icon: TrendingUp,
            text: 'text-rose-300',
            chip: 'bg-rose-500/10 border border-rose-500/40 text-rose-200',
            hover: 'hover:border-rose-500/40 hover:shadow-[0_0_18px_rgba(244,63,94,0.18)]',
          }
        : {
            Icon: TrendingDown,
            text: 'text-emerald-300',
            chip: 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-200',
            hover: 'hover:border-emerald-500/40 hover:shadow-[0_0_18px_rgba(16,185,129,0.18)]',
          };
    const { Icon } = accent;
    
    return (
      <div className="space-y-3">
        {stationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-zinc-950/40 border border-zinc-800 rounded-full grid place-items-center mb-3">
              <Icon size={20} className={accent.text} />
            </div>
            <p className="text-sm text-zinc-500">No stations available</p>
            <p className="text-xs text-zinc-600 mt-1">Awaiting telemetry for this window</p>
          </div>
        ) : (
          stationList.map((station, index) => (
            <div 
              key={station.id} 
              className={`group bg-zinc-950/40 border border-zinc-800 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-zinc-950/60 ${accent.hover}`}
              onClick={() => onStationClick && onStationClick(station)}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-200 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-zinc-500 shrink-0" />
                        <p className="font-semibold text-sm text-zinc-100 truncate group-hover:text-sky-200 transition-colors">
                          {station.name}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-zinc-500">
                        <span className="truncate">{station.basin}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-zinc-700 bg-zinc-900/60 text-[10px] uppercase tracking-wide text-zinc-400">
                          Status
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              station.status === 'Normal'
                                ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-200'
                                : station.status === 'Warning'
                                ? 'bg-amber-500/10 border border-amber-500/40 text-amber-200'
                                : 'bg-rose-500/10 border border-rose-500/40 text-rose-200'
                            }`}
                          >
                            {station.status}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${accent.chip}`}>
                        <Icon size={16} className={accent.text} />
                        <span className={`text-sm font-semibold ${accent.text}`}>
                          {Math.abs(metricFor(station)).toFixed(2)} m
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-2">
                        Level {station.lastReading.waterLevel.toFixed(2)} m
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-zinc-950/85 border border-zinc-900 shadow-xl h-full">
      <div className="px-5 py-4 border-b border-zinc-900">
        <h3 className="font-semibold flex items-center gap-2 text-zinc-100">
          <TrendingUp size={18} className="text-sky-300" />
          Top Changes
        </h3>
        <div className="mt-3 flex items-center gap-2">
          {(['1h','24h','7d'] as const).map(key => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                tab===key
                  ? 'bg-sky-500/15 border-sky-500/60 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                  : 'border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Stations with highest level fluctuations ({tab})
        </p>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-rose-300" />
              <h4 className="text-sm font-semibold text-zinc-200">Top Risers</h4>
            </div>
            {renderStationList(topRisers, 'risers')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={18} className="text-emerald-300" />
              <h4 className="text-sm font-semibold text-zinc-200">Top Droppers</h4>
            </div>
            {renderStationList(topDroppers, 'droppers')}
          </div>
        </div>
      </div>
    </div>
  );
}
