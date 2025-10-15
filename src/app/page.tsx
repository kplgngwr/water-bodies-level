'use client';

import KpiDashboard from '@/components/kpi/KpiDashboard';
import BasinSummary from '@/components/kpi/BasinSummary';
import WaterLevelMap from '@/components/map/WaterLevelMap';
import AlertTicker from '@/components/panels/AlertTicker';
import HealthStatus from '@/components/panels/HealthStatus';
import SlaStatus from '@/components/panels/SlaStatus';
import TopChanges from '@/components/panels/TopChanges';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { fetchAlerts, fetchBasinSummaries, fetchStations, fetchSystemStatus } from '@/lib/api';
import { Alert, BasinSummary as BasinSummaryType, Station, SystemStatus } from '@/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [basins, setBasins] = useState<BasinSummaryType[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  
  // New state for filters
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [stationsData, alertsData, basinsData, statusData] = await Promise.all([
          fetchStations(),
          fetchAlerts(),
          fetchBasinSummaries(),
          fetchSystemStatus()
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

  }, []);

  const handleAlertAcknowledge = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== alertId)
    );
  };

  if (loading || !systemStatus) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Topbar />
            <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
              <p className="mt-4 text-zinc-400 font-medium">Loading Dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Topbar />
          
          <div className="p-4 md:p-6 space-y-6">
            {/* KPI Dashboard - Top Row */}
            <section>
              <KpiDashboard systemStatus={systemStatus} />
            </section>

            {/* Main Grid - Map + Panels */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Hero Map - 2/3 width */}
              <div className="xl:col-span-2">
                <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
                  <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Live Station Map</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Real-time monitoring locations</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-glow"></div>
                      <span className="text-xs font-medium text-emerald-400">Live</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <WaterLevelMap stations={stations} />
                  </div>
                </div>
              </div>

              {/* Right Sidebar Panels - 1/3 width */}
              <div className="space-y-4">
                <AlertTicker alerts={alerts} onAcknowledge={handleAlertAcknowledge} />
                <TopChanges stations={stations} />
              </div>
            </section>

            {/* Basin Summary - Full Width */}
            <section>
              <BasinSummary basins={basins} />
            </section>

            {/* Health & SLA Status */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HealthStatus stations={stations} />
              <SlaStatus basins={basins} />
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-8 border-t border-zinc-800 bg-zinc-900/50">
            <div className="px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
                <p>© 2025 Water Bodies Monitoring • Central Intelligence Portal</p>
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
