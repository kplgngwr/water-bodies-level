'use client';

import { BasinSummary as BasinSummaryType } from '@/types';
import { Waves, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface BasinSummaryProps {
  basins: BasinSummaryType[];
}

export default function BasinSummary({ basins }: BasinSummaryProps) {
  // Sort basins by absolute average change and take top 5
  const topBasins = [...basins]
    .sort((a, b) => Math.abs(b.avgChange24h) - Math.abs(a.avgChange24h))
    .slice(0, 5);

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="font-medium flex items-center gap-2">
          <Waves size={18} className="text-sky-400" />
          Basin Overview
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Top 5 basins by average stage change (ΔH/24h)</p>
      </div>
      
      <div className="p-4">
        {topBasins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 bg-zinc-950/30 border border-zinc-800 rounded-full flex items-center justify-center mb-2">
              <Waves size={24} className="text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-500">No basin data available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topBasins.map((basin, index) => (
              <div 
                key={basin.name}
                className="group bg-zinc-950/30 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-sky-950/50 border border-sky-800/30 text-sky-400 font-bold text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-zinc-200 group-hover:text-sky-400 transition-colors truncate">
                        {basin.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-zinc-500">{basin.activeStations}/{basin.stationCount} active</span>
                        {basin.dangerStations > 0 && (
                          <span className="px-1.5 py-0.5 bg-rose-950/30 border border-rose-800/30 text-rose-400 rounded text-xs font-medium flex items-center gap-1">
                            <AlertTriangle size={10} />
                            {basin.dangerStations}
                          </span>
                        )}
                        {basin.warningStations > 0 && (
                          <span className="px-1.5 py-0.5 bg-amber-950/30 border border-amber-800/30 text-amber-400 rounded text-xs font-medium flex items-center gap-1">
                            <AlertTriangle size={10} />
                            {basin.warningStations}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end ml-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/50 border ${
                      basin.avgChange24h > 0 
                        ? 'border-rose-800/50' 
                        : basin.avgChange24h < 0 
                        ? 'border-emerald-800/50' 
                        : 'border-zinc-800'
                    }`}>
                      {basin.avgChange24h > 0 ? <TrendingUp size={14} className="text-rose-400" /> : 
                       basin.avgChange24h < 0 ? <TrendingDown size={14} className="text-emerald-400" /> : null}
                      <span className={`text-sm font-bold ${
                        basin.avgChange24h > 0 ? 'text-rose-400' : 
                        basin.avgChange24h < 0 ? 'text-emerald-400' : 
                        'text-zinc-400'
                      }`}>
                        {Math.abs(basin.avgChange24h).toFixed(2)} m
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}