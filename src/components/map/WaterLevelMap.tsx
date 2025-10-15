'use client';

import { Station } from '@/types';
import { Card, Title } from '@tremor/react';
import { useCallback, useMemo, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface WaterLevelMapProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  regionFilter?: string;
  statusFilter?: Set<string>;
  onRegionFilterChange?: (region: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

export default function WaterLevelMap({ 
  stations, 
  onStationClick, 
  regionFilter = 'All', 
  statusFilter = new Set(),
  onRegionFilterChange,
  onStatusFilterChange
}: WaterLevelMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 78.9629, // Center of India
    latitude: 20.5937,
    zoom: 4
  });

  const [popupInfo, setPopupInfo] = useState<Station | null>(null);

  const getMarkerColor = useCallback((status: Station['status']) => {
    switch (status) {
      case 'Normal': return '#10b981'; // green
      case 'Warning': return '#f59e0b'; // yellow
      case 'Danger': return '#ef4444'; // red
      case 'Offline': return '#6b7280'; // gray
      default: return '#3b82f6'; // blue
    }
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // Apply region filter
      if (regionFilter !== 'All' && station.basin !== regionFilter) {
        return false;
      }
      
      // Apply status filter if any are selected
      if (statusFilter.size > 0 && !statusFilter.has(station.status)) {
        return false;
      }
      
      return true;
    });
  }, [stations, regionFilter, statusFilter]);

  const markers = useMemo(() => {
    return filteredStations.map(station => (
      <Marker
        key={station.id}
        longitude={station.location.lng}
        latitude={station.location.lat}
        color={getMarkerColor(station.status)}
        onClick={e => {
          e.originalEvent.stopPropagation();
          setPopupInfo(station);
        }}
      />
    ));
  }, [filteredStations, getMarkerColor]);

  return (
    <Card className="shadow-lg border-2 border-white overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title className="text-slate-800">Water Level Monitoring Stations</Title>
          <p className="text-xs text-slate-500 mt-1">Click on markers to view station details</p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-600">Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-600">Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-600">Danger</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-slate-600">Offline</span>
          </div>
        </div>
      </div>
      {/* Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <label htmlFor="region-filter" className="text-xs font-medium text-slate-700">Region:</label>
          <select 
            id="region-filter"
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={regionFilter}
            onChange={(e) => onRegionFilterChange && onRegionFilterChange(e.target.value)}
          >
            <option value="All">All Regions</option>
            <option value="Yamuna">Yamuna</option>
            <option value="Ganges">Ganges</option>
            <option value="Brahmaputra">Brahmaputra</option>
            <option value="Godavari">Godavari</option>
            <option value="Krishna">Krishna</option>
            <option value="Cauvery">Cauvery</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          {['Normal', 'Warning', 'Danger', 'Offline'].map((status) => (
            <button
              key={status}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${statusFilter.has(status) 
                ? `bg-${status === 'Normal' ? 'green' : status === 'Warning' ? 'yellow' : status === 'Danger' ? 'red' : 'gray'}-500 text-white` 
                : `bg-${status === 'Normal' ? 'green' : status === 'Warning' ? 'yellow' : status === 'Danger' ? 'red' : 'gray'}-100 text-${status === 'Normal' ? 'green' : status === 'Warning' ? 'yellow' : status === 'Danger' ? 'red' : 'gray'}-700`
              }`}
              onClick={() => onStatusFilterChange && onStatusFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[560px] w-full rounded-lg overflow-hidden border-2 border-slate-200 shadow-inner">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        >
          {markers}
          <NavigationControl position="top-right" />
          
          {popupInfo && (
            <Popup
              longitude={popupInfo.location.lng}
              latitude={popupInfo.location.lat}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
              className="station-popup"
            >
              <div className="p-3 min-w-[200px]">
                <h3 className="font-bold text-base text-slate-800 mb-2">{popupInfo.name}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Basin:</span>
                    <span className="font-medium text-slate-800">{popupInfo.basin}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Level:</span>
                    <span className="font-medium text-slate-800">{popupInfo.lastReading.waterLevel} m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Change (1h):</span>
                    <span className={`font-medium ${popupInfo.lastReading.change1h > 0 ? 'text-red-500' : popupInfo.lastReading.change1h < 0 ? 'text-green-500' : 'text-slate-500'}`}>
                      {popupInfo.lastReading.change1h > 0 ? '+' : ''}{popupInfo.lastReading.change1h} m
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Battery:</span>
                    <span className={`font-medium ${popupInfo.lastReading.battery > 50 ? 'text-green-600' : popupInfo.lastReading.battery > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {popupInfo.lastReading.battery}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium px-2 py-0.5 rounded-full text-white text-xs ${
                      popupInfo.status === 'Normal' ? 'bg-green-500' :
                      popupInfo.status === 'Warning' ? 'bg-yellow-500' :
                      popupInfo.status === 'Danger' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      {popupInfo.status}
                    </span>
                  </div>
                </div>
                {onStationClick && (
                  <button 
                    className="mt-3 w-full text-xs bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
                    onClick={() => {
                      onStationClick(popupInfo);
                      setPopupInfo(null);
                    }}
                  >
                    View Full Details
                  </button>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </Card>
  );
}