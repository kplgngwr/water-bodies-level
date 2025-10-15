'use client';

import { BasinSummary as BasinSummaryType } from '@/types';
import { Card, List, ListItem, Text, Title } from '@tremor/react';

interface BasinSummaryProps {
  basins: BasinSummaryType[];
}

export default function BasinSummary({ basins }: BasinSummaryProps) {
  // Sort basins by absolute average change and take top 5
  const topBasins = [...basins]
    .sort((a, b) => Math.abs(b.avgChange24h) - Math.abs(a.avgChange24h))
    .slice(0, 5);

  return (
    <Card className="shadow-lg border-2 border-white h-full">
      <div className="mb-4">
        <Title className="text-slate-800">Basin Overview</Title>
        <p className="text-xs text-slate-500 mt-1">Top 5 basins by average stage change (ΔH₍24h₎)</p>
      </div>
      {topBasins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No basin data available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topBasins.map((basin, index) => (
            <div 
              key={basin.name}
              className="group relative bg-gradient-to-r from-white to-slate-50 hover:from-blue-50 hover:to-blue-100 border border-slate-200 rounded-lg p-3 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold text-sm text-slate-800 group-hover:text-blue-700 transition-colors">
                      {basin.name}
                    </Text>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{basin.activeStations}/{basin.stationCount} active</span>
                      {basin.dangerStations > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                          {basin.dangerStations} danger
                        </span>
                      )}
                      {basin.warningStations > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                          {basin.warningStations} warning
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div 
                  className={`text-lg font-bold px-3 py-1 rounded-lg ${
                    basin.avgChange24h > 0 
                      ? 'text-red-600 bg-red-50' 
                      : basin.avgChange24h < 0 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-slate-600 bg-slate-50'
                  }`}
                >
                  {basin.avgChange24h > 0 ? '↑ +' : basin.avgChange24h < 0 ? '↓ ' : ''}{Math.abs(basin.avgChange24h).toFixed(2)} m
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}