'use client';

import { BasinSummary } from '@/types';
import { BarChart3, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface SlaStatusProps {
  basins: BasinSummary[];
}

export default function SlaStatus({ basins }: SlaStatusProps) {
  // For demo purposes, we'll generate random SLA percentages
  // In a real app, this would come from actual data
  const getRandomSla = () => {
    return Math.floor(Math.random() * 30) + 70; // Random between 70-100%
  };

  const getColorClasses = (sla: number) => {
    if (sla >= 95) return {
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-800/50',
      text: 'text-emerald-400',
      badge: 'bg-emerald-950/50 border-emerald-800/30 text-emerald-400',
      bar: 'bg-emerald-500',
      icon: <CheckCircle size={14} className="text-emerald-400" />
    };
    if (sla >= 85) return {
      bg: 'bg-amber-950/30',
      border: 'border-amber-800/50',
      text: 'text-amber-400',
      badge: 'bg-amber-950/50 border-amber-800/30 text-amber-400',
      bar: 'bg-amber-500',
      icon: <AlertCircle size={14} className="text-amber-400" />
    };
    return {
      bg: 'bg-rose-950/30',
      border: 'border-rose-800/50',
      text: 'text-rose-400',
      badge: 'bg-rose-950/50 border-rose-800/30 text-rose-400',
      bar: 'bg-rose-500',
      icon: <XCircle size={14} className="text-rose-400" />
    };
  };

  const getStatusText = (sla: number) => {
    if (sla >= 95) return 'Excellent';
    if (sla >= 85) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg h-full">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="font-medium flex items-center gap-2">
          <BarChart3 size={18} className="text-sky-400" />
          Data Completeness by Basin
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Service Level Agreement (SLA) performance</p>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
          {basins.map(basin => {
            const slaValue = getRandomSla();
            const colors = getColorClasses(slaValue);
            
            return (
              <div 
                key={basin.name}
                className={`p-3 ${colors.bg} border ${colors.border} rounded-xl transition-all hover:scale-102`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{basin.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${colors.badge}`}>
                        {colors.icon}
                        {getStatusText(slaValue)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {basin.stationCount} stations
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <span className={`text-2xl font-bold ${colors.text}`}>{slaValue}%</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${colors.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${slaValue}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}