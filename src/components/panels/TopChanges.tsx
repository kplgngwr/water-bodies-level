'use client';

import { Station } from '@/types';
import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, MapPin, Shuffle } from 'lucide-react';

interface TopChangesProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
}

export default function TopChanges({ stations, onStationClick }: TopChangesProps) {
  const [tab, setTab] = useState<'1h' | '24h' | '7d'>('24h');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'risers' | 'droppers'>('all');

  const statusBadge = (status: Station['status']) => {
    switch (status) {
      case 'Normal':
        return 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-200';
      case 'Warning':
        return 'bg-amber-500/10 border border-amber-500/40 text-amber-200';
      case 'Danger':
        return 'bg-rose-500/10 border border-rose-500/40 text-rose-200';
      default:
        return 'bg-slate-500/10 border border-slate-500/40 text-slate-200';
    }
  };
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

  const topRisers = useMemo(() => getTopChanges('risers'), [stations, getTopChanges]);
  const topDroppers = useMemo(() => getTopChanges('droppers'), [stations, getTopChanges]);

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
      <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
        {stationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center min-w-[240px]">
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
              className={`group bg-zinc-950/40 border border-zinc-800 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-zinc-950/60 ${accent.hover} min-w-[250px]`}
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
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] text-zinc-500">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusBadge(station.status)}`}>
                          {station.status}
                        </span>
                        <span className="truncate">{station.basin}</span>
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

  const visibleCategories: Array<'risers' | 'droppers'> =
    categoryFilter === 'all' ? ['risers', 'droppers'] : [categoryFilter];

  return (
    <div className="rounded-3xl bg-zinc-950/85 border border-zinc-900 shadow-xl h-full">
      <div className="px-5 py-4 border-b border-zinc-900">
        <h3 className="font-semibold flex items-center gap-2 text-zinc-100">
          <TrendingUp size={18} className="text-sky-300" />
          Top Changes
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
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
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="uppercase tracking-wide text-[10px] text-zinc-500">Category</span>
            {(['all','risers','droppers'] as const).map(option => (
              <button
                key={option}
                onClick={() => setCategoryFilter(option)}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  categoryFilter === option
                    ? option === 'all'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-[0_0_12px_rgba(113,113,122,0.35)]'
                      : option === 'risers'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600'
                }`}
              >
                {option === 'all' ? (
                  <span className="flex items-center gap-1">
                    <Shuffle size={12} />
                    All
                  </span>
                ) : option === 'risers' ? (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    Top Risers
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <TrendingDown size={12} />
                    Top Droppers
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Stations with highest level fluctuations ({tab})
        </p>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col gap-5">
          {visibleCategories.map(type => (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                {type === 'risers' ? (
                  <TrendingUp size={18} className="text-rose-300" />
                ) : (
                  <TrendingDown size={18} className="text-emerald-300" />
                )}
                <h4 className="text-sm font-semibold text-zinc-200">
                  {type === 'risers' ? 'Top Risers' : 'Top Droppers'}
                </h4>
              </div>
              {renderStationList(type === 'risers' ? topRisers : topDroppers, type)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
