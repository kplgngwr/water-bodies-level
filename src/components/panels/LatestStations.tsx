'use client';

import { Station } from '@/types';
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from '@tremor/react';
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

  return (
    <Card className="shadow-lg border-2 border-white h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title className="text-slate-800">Latest Stations</Title>
          <p className="text-xs text-slate-500 mt-1">Most recently updated stations</p>
        </div>
      </div>

      <Table className="mt-2">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="text-xs">Station</TableHeaderCell>
            <TableHeaderCell className="text-xs">Basin</TableHeaderCell>
            <TableHeaderCell className="text-xs">Level</TableHeaderCell>
            <TableHeaderCell className="text-xs">Time</TableHeaderCell>
            <TableHeaderCell className="text-xs">Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {latestStations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                <p className="text-sm text-slate-500">No station data available</p>
              </TableCell>
            </TableRow>
          ) : (
            latestStations.map((station) => (
              <TableRow key={station.id}>
                <TableCell className="font-medium text-sm">{station.name}</TableCell>
                <TableCell className="text-xs text-slate-600">{station.basin}</TableCell>
                <TableCell className="text-xs">
                  <span className="font-medium">{station.lastReading.waterLevel} m</span>
                  <span className={`ml-1 text-xs ${station.lastReading.change1h > 0 ? 'text-red-500' : station.lastReading.change1h < 0 ? 'text-green-500' : 'text-slate-500'}`}>
                    ({station.lastReading.change1h > 0 ? '+' : ''}{station.lastReading.change1h} m)
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-600">{formatTime(station.lastReading.timestamp)}</TableCell>
                <TableCell>
                  <StatusPill status={station.status} size="sm" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}