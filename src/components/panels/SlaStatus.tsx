'use client';

import { BasinSummary } from '@/types';
import { Card, ProgressBar, Title } from '@tremor/react';

interface SlaStatusProps {
  basins: BasinSummary[];
}

export default function SlaStatus({ basins }: SlaStatusProps) {
  // For demo purposes, we'll generate random SLA percentages
  // In a real app, this would come from actual data
  const getRandomSla = () => {
    return Math.floor(Math.random() * 30) + 70; // Random between 70-100%
  };

  const getColorForSla = (sla: number) => {
    if (sla >= 95) return 'emerald';
    if (sla >= 85) return 'yellow';
    return 'red';
  };

  const getBadgeColor = (sla: number) => {
    if (sla >= 95) return 'bg-green-100 text-green-700';
    if (sla >= 85) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatusText = (sla: number) => {
    if (sla >= 95) return 'Excellent';
    if (sla >= 85) return 'Good';
    return 'Needs Attention';
  };

  return (
    <Card className="shadow-lg border-2 border-white h-full">
      <div className="mb-4">
        <Title className="text-slate-800">Data Completeness by Basin</Title>
        <p className="text-xs text-slate-500 mt-1">Service Level Agreement (SLA) performance</p>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {basins.map(basin => {
          const slaValue = getRandomSla();
          return (
            <div 
              key={basin.name}
              className="p-3 bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-800">{basin.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeColor(slaValue)}`}>
                      {getStatusText(slaValue)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {basin.stationCount} stations
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-800">{slaValue}%</span>
                </div>
              </div>
              <ProgressBar value={slaValue} color={getColorForSla(slaValue)} className="mt-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}