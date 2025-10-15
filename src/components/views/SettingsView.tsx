'use client';

import { SystemStatus } from '@/types';
import { useState } from 'react';

interface SettingsViewProps {
  systemStatus: SystemStatus;
}

const toggleClasses = (enabled: boolean) =>
  `relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
    enabled
      ? 'bg-sky-500/20 border-sky-500/50'
      : 'bg-zinc-900/70 border-zinc-700'
  }`;

export default function SettingsView({ systemStatus }: SettingsViewProps) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMapTheme, setDarkMapTheme] = useState(true);
  const [includeOffline, setIncludeOffline] = useState(true);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
        <h3 className="text-sm font-semibold text-zinc-100">System Summary</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Monitoring {systemStatus.totalStations} stations with{' '}
          {Math.round((systemStatus.activeStations / systemStatus.totalStations) * 100)}% uptime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">Monitoring Preferences</h4>
            <p className="text-xs text-zinc-500 mt-1">Control update cadence and dashboard behaviour.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-100">Auto-refresh dashboard</p>
                <p className="text-xs text-zinc-500">Refresh every 60 seconds to keep telemetry fresh.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoRefresh}
                className={toggleClasses(autoRefresh)}
                onClick={() => setAutoRefresh((prev) => !prev)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-sky-200 transition-transform ${
                    autoRefresh ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-100">Dark themed map</p>
                <p className="text-xs text-zinc-500">Use low-light friendly tiles for mission control.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={darkMapTheme}
                className={toggleClasses(darkMapTheme)}
                onClick={() => setDarkMapTheme((prev) => !prev)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-sky-200 transition-transform ${
                    darkMapTheme ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-100">Include offline stations</p>
                <p className="text-xs text-zinc-500">Show offline assets in analytics and exports.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={includeOffline}
                className={toggleClasses(includeOffline)}
                onClick={() => setIncludeOffline((prev) => !prev)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-sky-200 transition-transform ${
                    includeOffline ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">Notifications</h4>
            <p className="text-xs text-zinc-500 mt-1">Configure alert delivery channels.</p>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3">
              <span>
                <p className="text-sm font-semibold text-zinc-100">Email alerts</p>
                <p className="text-xs text-zinc-500">Immediate email when danger alerts trigger.</p>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={emailAlerts}
                className={toggleClasses(emailAlerts)}
                onClick={() => setEmailAlerts((prev) => !prev)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-sky-200 transition-transform ${
                    emailAlerts ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between gap-3">
              <span>
                <p className="text-sm font-semibold text-zinc-100">SMS escalations</p>
                <p className="text-xs text-zinc-500">Pager alerts for offline or danger events.</p>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={smsAlerts}
                className={toggleClasses(smsAlerts)}
                onClick={() => setSmsAlerts((prev) => !prev)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-sky-200 transition-transform ${
                    smsAlerts ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-zinc-100">Alert Thresholds</h4>
          <p className="text-xs text-zinc-500 mt-1">
            Define global thresholds for water level warnings and critical events.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-400">
          <label className="space-y-1.5">
            <span className="uppercase tracking-wide text-[11px] text-zinc-500">Warning offset</span>
            <select className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="0.5">0.5 m above normal</option>
              <option value="1">1.0 m above normal</option>
              <option value="1.5">1.5 m above normal</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="uppercase tracking-wide text-[11px] text-zinc-500">Danger offset</span>
            <select className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="1">1.0 m above warning</option>
              <option value="1.5">1.5 m above warning</option>
              <option value="2">2.0 m above warning</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="uppercase tracking-wide text-[11px] text-zinc-500">Offline tolerance</span>
            <select className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="3">3 hours</option>
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
            </select>
          </label>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">
            Reset
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
