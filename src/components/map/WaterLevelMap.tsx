'use client';

import { Station } from '@/types';
import type { FeatureCollection } from 'geojson';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface WaterLevelMapProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  regionFilter?: string;
  statusFilter?: Set<Station['status']>;
  onRegionFilterChange?: (region: string) => void;
  onStatusFilterChange?: (status: Station['status']) => void;
  title?: string;
  subtitle?: string;
  showLiveIndicator?: boolean;
  showWaterBodies?: boolean;
  onWaterBodiesToggle?: (value: boolean) => void;
}

const STATUS_CONFIG: Record<Station['status'], {
  marker: string;
  legendDot: string;
  legendText: string;
  chipInactive: string;
  chipActive: string;
}> = {
  Normal: {
    marker: '#22c55e',
    legendDot: 'bg-emerald-500',
    legendText: 'text-emerald-400',
    chipInactive: 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300',
    chipActive: 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
  },
  Warning: {
    marker: '#facc15',
    legendDot: 'bg-amber-500',
    legendText: 'text-amber-300',
    chipInactive: 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300',
    chipActive: 'bg-amber-500/20 border border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(250,204,21,0.25)]',
  },
  Danger: {
    marker: '#f43f5e',
    legendDot: 'bg-rose-500',
    legendText: 'text-rose-300',
    chipInactive: 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:border-rose-500/40 hover:text-rose-300',
    chipActive: 'bg-rose-500/20 border border-rose-500/60 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },
  Offline: {
    marker: '#94a3b8',
    legendDot: 'bg-slate-400',
    legendText: 'text-slate-300',
    chipInactive: 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:border-slate-500/40 hover:text-slate-300',
    chipActive: 'bg-slate-500/20 border border-slate-500/60 text-slate-200 shadow-[0_0_15px_rgba(148,163,184,0.25)]',
  },
};

const EMPTY_STATUS_SET = new Set<Station['status']>();

export default function WaterLevelMap({
  stations,
  onStationClick,
  regionFilter = 'All',
  statusFilter,
  onRegionFilterChange,
  onStatusFilterChange,
  title = 'Water Level Monitoring Stations',
  subtitle = 'Click on markers to view station details',
  showLiveIndicator = false,
  showWaterBodies,
  onWaterBodiesToggle,
}: WaterLevelMapProps) {
  interface Bounds {
    west: number;
    south: number;
    east: number;
    north: number;
  }

  const [viewState, setViewState] = useState({
    longitude: 78.9629, // Center of India
    latitude: 20.5937,
    zoom: 4
  });

  const [popupInfo, setPopupInfo] = useState<Station | null>(null);
  const [internalRegion, setInternalRegion] = useState(regionFilter);
  const [internalStatusFilter, setInternalStatusFilter] = useState<Set<Station['status']>>(new Set());
  const [internalShowWaterBodies, setInternalShowWaterBodies] = useState(false);
  const [mapBounds, setMapBounds] = useState<Bounds | null>(null);
  const [waterBodiesData, setWaterBodiesData] = useState<FeatureCollection | null>(null);
  const [waterBodiesLoading, setWaterBodiesLoading] = useState(false);
  const [waterBodiesError, setWaterBodiesError] = useState<string | null>(null);
  const [waterBodyPopup, setWaterBodyPopup] = useState<{
    coordinates: [number, number];
    properties: Record<string, unknown>;
  } | null>(null);

  const mapRef = useRef<MapRef | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapReadyRef = useRef(false);

  useEffect(() => {
    setInternalRegion(regionFilter);
  }, [regionFilter]);

  useEffect(() => {
    if (statusFilter) {
      setInternalStatusFilter(new Set(statusFilter));
    }
  }, [statusFilter]);

  useEffect(() => {
    if (typeof showWaterBodies === 'boolean') {
      setInternalShowWaterBodies(showWaterBodies);
    }
  }, [showWaterBodies]);


  const getMarkerColor = useCallback((status: Station['status']) => {
    return STATUS_CONFIG[status]?.marker ?? '#38bdf8';
  }, []);

  const regionOptions = useMemo(() => {
    const basins = new Set<string>();
    stations.forEach(station => basins.add(station.basin));
    return ['All', ...Array.from(basins).sort()];
  }, [stations]);

  const activeRegion = onRegionFilterChange ? regionFilter : internalRegion;

  const activeStatuses = useMemo(() => {
    if (onStatusFilterChange) {
      return statusFilter ?? EMPTY_STATUS_SET;
    }
    return internalStatusFilter;
  }, [onStatusFilterChange, statusFilter, internalStatusFilter]);

  const showWaterBodiesActive = onWaterBodiesToggle
    ? (typeof showWaterBodies === 'boolean' ? showWaterBodies : internalShowWaterBodies)
    : internalShowWaterBodies;

  const handleRegionChange = (value: string) => {
    if (onRegionFilterChange) {
      onRegionFilterChange(value);
    } else {
      setInternalRegion(value);
    }
  };

  const handleStatusToggle = (status: Station['status']) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(status);
      return;
    }
    setInternalStatusFilter(prev => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const handleWaterBodiesToggle = (checked: boolean) => {
    if (onWaterBodiesToggle) {
      onWaterBodiesToggle(checked);
    } else {
      setInternalShowWaterBodies(checked);
    }
  };

  const updateBoundsFromMap = useCallback(() => {
    if (!mapReadyRef.current) return;
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;
    const bounds = mapInstance.getBounds();
    setMapBounds({
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    });
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // Apply region filter
      if (activeRegion !== 'All' && station.basin !== activeRegion) {
        return false;
      }

      // Apply status filter if any are selected
      if (activeStatuses.size > 0 && !activeStatuses.has(station.status)) {
        return false;
      }

      return true;
    });
  }, [stations, activeRegion, activeStatuses]);

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

  const arcgisUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_ARCGIS_FEATURE_URL;
    if (!base) return null;
    return base.replace(/\/$/, '');
  }, []);

  const fetchWaterBodies = useCallback(async (bounds: Bounds) => {
    if (!arcgisUrl) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setWaterBodiesLoading(true);
    setWaterBodiesError(null);

    try {
      const url = new URL(`${arcgisUrl}/query`);
      url.searchParams.set('f', 'geojson');
      url.searchParams.set('where', '1=1');
      url.searchParams.set('outFields', '*');
      url.searchParams.set('geometry', `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`);
      url.searchParams.set('geometryType', 'esriGeometryEnvelope');
      url.searchParams.set('inSR', '4326');
      url.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
      url.searchParams.set('outSR', '4326');
      url.searchParams.set('resultRecordCount', '2000');
      url.searchParams.set('returnGeometry', 'true');

      const response = await fetch(url.toString(), { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`ArcGIS response ${response.status}`);
      }

      const data = (await response.json()) as FeatureCollection;
      setWaterBodiesData(data);
    } catch (error: unknown) {
      if ((error as Error).name === 'AbortError') {
        return;
      }
      console.error('Failed to load water bodies', error);
      setWaterBodiesError('Unable to load water bodies for this view');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setWaterBodiesLoading(false);
    }
  }, [arcgisUrl]);

  useEffect(() => {
    if (!showWaterBodiesActive) {
      setWaterBodiesData(null);
      setWaterBodyPopup(null);
      abortRef.current?.abort();
      return;
    }
    if (!mapBounds) return;
    fetchWaterBodies(mapBounds);
  }, [showWaterBodiesActive, mapBounds, fetchWaterBodies]);

  const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
    if (!showWaterBodiesActive) return;
    const mapInstance = event.target;
    const features = mapInstance.queryRenderedFeatures(event.point, {
      layers: ['water-bodies-fill'],
    });

    if (features.length > 0) {
      const feature = features[0];
      const lngLat = event.lngLat;
      setWaterBodyPopup({
        coordinates: [lngLat.lng, lngLat.lat],
        properties: feature.properties ?? {},
      });
    } else {
      setWaterBodyPopup(null);
    }
  }, [showWaterBodiesActive]);

  const formatArea = useCallback((properties: Record<string, unknown>) => {
    const candidates = ['AREA_SQKM', 'Area_sqkm', 'area_sqkm', 'AREA', 'Shape_Area'];
    for (const key of candidates) {
      const raw = properties?.[key];
      const value = typeof raw === 'string' ? Number(raw) : raw;
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        if (key.toLowerCase().includes('sqkm')) {
          return `${value.toFixed(2)} sq km`;
        }
        const sqKm = value > 1_000 ? value / 1_000_000 : value;
        return `${sqKm.toFixed(2)} sq km`;
      }
    }
    return null;
  }, []);

  const resolveProperty = useCallback((properties: Record<string, unknown>, keys: string[], fallback = 'Unknown') => {
    for (const key of keys) {
      const value = properties?.[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    return fallback;
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      mapReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    if (!mapContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!mapReadyRef.current || !mapRef.current) return;
      try {
        mapRef.current.resize();
        updateBoundsFromMap();
      } catch (error) {
        console.warn('Map resize failed', error);
      }
    });

    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [updateBoundsFromMap]);

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg overflow-hidden">
      <div className="flex flex-col gap-4 px-4 py-3 border-b border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
          {showLiveIndicator && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-800/50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-glow" />
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {(Object.keys(STATUS_CONFIG) as Array<Station['status']>).map(status => (
            <div key={status} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-950/40 border border-zinc-800/70">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[status].legendDot}`} />
              <span className={`${STATUS_CONFIG[status].legendText} font-medium`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Map Toolbar */}
      <div className="flex flex-col gap-3 md:gap-4 px-4 py-3 border-b border-zinc-800 bg-zinc-950/40">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="uppercase tracking-wide text-[11px] text-zinc-500">Overview</span>
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300">
            {filteredStations.length} of {stations.length} stations visible
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <label htmlFor="region-filter" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Region
            </label>
            <div className="relative">
              <select
                id="region-filter"
                className="text-sm bg-zinc-900/80 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none"
                value={activeRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
              >
                {regionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500 text-sm">
                ▾
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(STATUS_CONFIG) as Array<Station['status']>).map(status => {
              const isActive = activeStatuses.has(status);
              const styles = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${isActive ? styles.chipActive : styles.chipInactive}`}
                  onClick={() => handleStatusToggle(status)}
                >
                  {status}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <label
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 transition-colors ${
                arcgisUrl ? 'cursor-pointer hover:border-zinc-700' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border border-zinc-600 bg-zinc-950 text-sky-500 focus:ring-sky-500"
                checked={showWaterBodiesActive}
                onChange={(event) => handleWaterBodiesToggle(event.target.checked)}
                disabled={!arcgisUrl}
              />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Water Bodies
              </span>
              {waterBodiesLoading && (
                <span className="flex h-1.5 w-1.5">
                  <span className="animate-ping inline-flex h-full w-full rounded-full bg-sky-400/70 opacity-75" />
                </span>
              )}
            </label>
            {!arcgisUrl && (
              <span className="text-[11px] text-zinc-500">ArcGIS endpoint not configured</span>
            )}
            {waterBodiesError && (
              <span className="text-[11px] text-rose-300">{waterBodiesError}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="h-[520px] w-full bg-zinc-950" ref={mapContainerRef}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onMoveEnd={updateBoundsFromMap}
          onLoad={() => {
            mapReadyRef.current = true;
            updateBoundsFromMap();
          }}
          onClick={handleMapClick}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        >
          {showWaterBodiesActive && waterBodiesData && (
            <Source id="water-bodies-source" type="geojson" data={waterBodiesData}>
              <Layer
                id="water-bodies-fill"
                type="fill"
                paint={{
                  'fill-color': '#38bdf8',
                  'fill-opacity': 0.28,
                }}
              />
              <Layer
                id="water-bodies-outline"
                type="line"
                paint={{
                  'line-color': '#38bdf8',
                  'line-width': 1,
                  'line-opacity': 0.6,
                }}
              />
            </Source>
          )}
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
              <div className="p-3 min-w-[220px]">
                <h3 className="font-semibold text-sm text-zinc-100 mb-2">{popupInfo.name}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Basin</span>
                    <span className="font-medium text-zinc-200">{popupInfo.basin}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Level</span>
                    <span className="font-semibold text-zinc-200">{popupInfo.lastReading.waterLevel} m</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Change (1h)</span>
                    <span className={`font-semibold ${popupInfo.lastReading.change1h > 0 ? 'text-rose-400' : popupInfo.lastReading.change1h < 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      {popupInfo.lastReading.change1h > 0 ? '+' : ''}{popupInfo.lastReading.change1h} m
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Battery</span>
                    <span className={`font-semibold ${popupInfo.lastReading.battery > 50 ? 'text-emerald-400' : popupInfo.lastReading.battery > 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {popupInfo.lastReading.battery}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <span>Status</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      popupInfo.status === 'Normal' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200' :
                      popupInfo.status === 'Warning' ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200' :
                      popupInfo.status === 'Danger' ? 'bg-rose-500/20 border border-rose-500/50 text-rose-200' :
                      'bg-slate-500/20 border border-slate-500/40 text-slate-200'
                    }`}>
                      {popupInfo.status}
                    </span>
                  </div>
                </div>
                {onStationClick && (
                  <button 
                    className="mt-3 w-full text-xs bg-sky-500/10 text-sky-200 px-3 py-2 rounded-md border border-sky-500/40 hover:bg-sky-500/20 transition-colors font-medium"
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
          {showWaterBodiesActive && waterBodyPopup && (
            <Popup
              longitude={waterBodyPopup.coordinates[0]}
              latitude={waterBodyPopup.coordinates[1]}
              anchor="top"
              onClose={() => setWaterBodyPopup(null)}
              closeButton
              closeOnClick={false}
            >
              <div className="p-3 min-w-[220px] space-y-1 text-[11px] text-zinc-400">
                <h3 className="font-semibold text-sm text-zinc-100 mb-1">
                  {resolveProperty(waterBodyPopup.properties, ['NAME', 'Name', 'WATERBODY', 'Waterbody', 'waterbody'], 'Water Body')}
                </h3>
                <div className="flex justify-between">
                  <span className="text-zinc-500">State</span>
                  <span className="text-zinc-200 font-medium">
                    {resolveProperty(waterBodyPopup.properties, ['STATE', 'STATE_NAME', 'State'], 'Unknown')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Area</span>
                  <span className="text-zinc-200 font-medium">
                    {formatArea(waterBodyPopup.properties) ?? 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Category</span>
                  <span className="text-zinc-200 font-medium">
                    {resolveProperty(waterBodyPopup.properties, ['CATEGORY', 'Type', 'TYPE'], 'N/A')}
                  </span>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}