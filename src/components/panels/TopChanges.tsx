'use client';

import { Station } from '@/types';
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels, Title } from '@tremor/react';
import { useMemo } from 'react';

interface TopChangesProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
}

export default function TopChanges({ stations, onStationClick }: TopChangesProps) {
  const getTopChanges = (timeframe: '1h' | '24h', count: number = 5) => {
    const field = timeframe === '1h' ? 'change1h' : 'change24h';
    
    // Sort by absolute change value (descending)
    return [...stations]
      .filter(station => station.status !== 'Offline') // Exclude offline stations
      .sort((a, b) => Math.abs(b.lastReading[field]) - Math.abs(a.lastReading[field]))
      .slice(0, count);
  };

  const top1h = useMemo(() => getTopChanges('1h'), [stations]);
  const top24h = useMemo(() => getTopChanges('24h'), [stations]);

  const renderStationList = (stationList: Station[], timeframe: '1h' | '24h') => {
    const field = timeframe === '1h' ? 'change1h' : 'change24h';
    
    return (
      <div className="mt-4">
        {stationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No data available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stationList.map((station, index) => (
              <div 
                key={station.id} 
                className="group relative bg-gradient-to-r from-white to-slate-50 hover:from-blue-50 hover:to-blue-100 border border-slate-200 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-102"
                onClick={() => onStationClick && onStationClick(station)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-800 group-hover:text-blue-700 transition-colors">
                        {station.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500">{station.basin}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          station.status === 'Normal' ? 'bg-green-100 text-green-700' :
                          station.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                          station.status === 'Danger' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {station.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div 
                      className={`text-lg font-bold px-3 py-1 rounded-lg ${
                        station.lastReading[field] > 0 
                          ? 'text-red-600 bg-red-50' 
                          : station.lastReading[field] < 0 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-slate-600 bg-slate-50'
                      }`}
                    >
                      {station.lastReading[field] > 0 ? '↑ +' : station.lastReading[field] < 0 ? '↓ ' : ''}{Math.abs(station.lastReading[field]).toFixed(2)} m
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Level: {station.lastReading.waterLevel}m</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-lg border-2 border-white h-full">
      <div className="mb-4">
        <Title className="text-slate-800">Top Water Level Changes</Title>
        <p className="text-xs text-slate-500 mt-1">Stations with highest level fluctuations</p>
      </div>
      <TabGroup className="mt-4">
        <TabList className="border-b border-slate-200">
          <Tab className="data-[headlessui-state='selected']:border-b-2 data-[headlessui-state='selected']:border-blue-500">
            Last 1 Hour
          </Tab>
          <Tab className="data-[headlessui-state='selected']:border-b-2 data-[headlessui-state='selected']:border-blue-500">
            Last 24 Hours
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {renderStationList(top1h, '1h')}
          </TabPanel>
          <TabPanel>
            {renderStationList(top24h, '24h')}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}