'use client';

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import AnalyticsView from '@/components/views/AnalyticsView';
import AlertsView from '@/components/views/AlertsView';
import DashboardView from '@/components/views/DashboardView';
import DevicesView from '@/components/views/DevicesView';
import MapView from '@/components/views/MapView';
import QualityView from '@/components/views/QualityView';
import ReportsView from '@/components/views/ReportsView';
import SettingsView from '@/components/views/SettingsView';
import { fetchAlerts, fetchBasinSummaries, fetchStations, fetchSystemStatus } from '@/lib/api';
import { Alert, BasinSummary as BasinSummaryType, Station, SystemStatus } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Route =
  | '/'
  | '/map'
  | '/analytics'
  | '/alerts'
  | '/devices'
  | '/quality'
  | '/reports'
  | '/settings';

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [basins, setBasins] = useState<BasinSummaryType[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<Route>('/');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<Set<Station['status']>>(() => new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [stationsData, alertsData, basinsData, statusData] = await Promise.all([
          fetchStations(),
          fetchAlerts(),
          fetchBasinSummaries(),
          fetchSystemStatus(),
        ]);

        setStations(stationsData);
        setAlerts(alertsData);
        setBasins(basinsData);
        setSystemStatus(statusData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAlertAcknowledge = useCallback((alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
  }, []);

  const handleStatusFilterToggle = useCallback((status: Station['status']) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const routeContent = useMemo(() => {
    if (!systemStatus) return null;

    switch (route) {
      case '/':
        return (
          <DashboardView
            stations={stations}
            alerts={alerts}
            basins={basins}
            systemStatus={systemStatus}
            regionFilter={regionFilter}
            statusFilter={statusFilter}
            onRegionFilterChange={setRegionFilter}
            onStatusFilterToggle={handleStatusFilterToggle}
            onAlertAcknowledge={handleAlertAcknowledge}
          />
        );
      case '/map':
        return (
          <MapView
            stations={stations}
            regionFilter={regionFilter}
            statusFilter={statusFilter}
            onRegionFilterChange={setRegionFilter}
            onStatusFilterToggle={handleStatusFilterToggle}
          />
        );
      case '/analytics':
        return <AnalyticsView stations={stations} basins={basins} />;
      case '/alerts':
        return <AlertsView alerts={alerts} onAlertAcknowledge={handleAlertAcknowledge} />;
      case '/devices':
        return <DevicesView stations={stations} basins={basins} />;
      case '/quality':
        return <QualityView stations={stations} basins={basins} />;
      case '/reports':
        return <ReportsView basins={basins} />;
      case '/settings':
        return systemStatus ? <SettingsView systemStatus={systemStatus} /> : null;
      default:
        return null;
    }
  }, [
    alerts,
    basins,
    regionFilter,
    route,
    stations,
    statusFilter,
    systemStatus,
    handleAlertAcknowledge,
    handleStatusFilterToggle,
  ]);

  if (loading || !systemStatus) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="flex">
          <Sidebar current={route} onNavigate={(href) => setRoute(href as Route)} />
          <main className="flex-1 min-w-0">
            <Topbar />
            <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
              <p className="mt-4 text-zinc-400 font-medium">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex">
        <Sidebar current={route} onNavigate={(href) => setRoute(href as Route)} />
        <main className="flex-1 min-w-0">
          <Topbar />
          <div className="p-4 md:p-6 space-y-6">{routeContent}</div>

          <footer className="mt-8 border-t border-zinc-800 bg-zinc-900/50">
            <div className="px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
                <p>(c) 2025 Water Bodies Monitoring - Central Intelligence Portal</p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
