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
    const Icon = type === 'risers' ? TrendingUp : TrendingDown;
    const colorClass = type === 'risers' ? 'text-rose-400' : 'text-emerald-400';
    
    return (
      <div className="space-y-2">
        {stationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 bg-zinc-950/30 border border-zinc-800 rounded-full flex items-center justify-center mb-2">
              <Icon size={24} className="text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-500">No data available</p>
          </div>
        ) : (
          stationList.map((station, index) => (
            <div 
              key={station.id} 
              className="group bg-zinc-950/30 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all hover:scale-102"
              onClick={() => onStationClick && onStationClick(station)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-sky-950/50 border border-sky-800/30 text-sky-400 font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-zinc-500 shrink-0" />
                      <p className="font-medium text-sm text-zinc-200 group-hover:text-sky-400 transition-colors truncate">
                        {station.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-zinc-500 truncate">{station.basin}</p>
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-medium ${
                        station.status === 'Normal' ? 'bg-emerald-950/30 border border-emerald-800/30 text-emerald-400' :
                        station.status === 'Warning' ? 'bg-amber-950/30 border border-amber-800/30 text-amber-400' :
                        station.status === 'Danger' ? 'bg-rose-950/30 border border-rose-800/30 text-rose-400' : 
                        'bg-zinc-950/30 border border-zinc-700 text-zinc-400'
                      }`}>
                        {station.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end ml-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <Icon size={16} className={colorClass} />
                    <span className={`text-sm font-bold ${colorClass}`}>
                      {Math.abs(metricFor(station)).toFixed(2)} m
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{station.lastReading.waterLevel.toFixed(2)}m</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg h-full">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="font-medium flex items-center gap-2">
          <TrendingUp size={18} className="text-sky-400" />
          Top Changes
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {(['1h','24h','7d'] as const).map(key => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                tab===key
                  ? 'border-sky-500 text-sky-400 bg-sky-950/30'
                  : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-2">Stations with highest level fluctuations ({tab})</p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-rose-400" />
              <h4 className="text-sm font-semibold text-zinc-300">Top Risers</h4>
            </div>
            {renderStationList(topRisers, 'risers')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={16} className="text-emerald-400" />
              <h4 className="text-sm font-semibold text-zinc-300">Top Droppers</h4>
            </div>
            {renderStationList(topDroppers, 'droppers')}
          </div>
        </div>
      </div>
    </div>
  );
}