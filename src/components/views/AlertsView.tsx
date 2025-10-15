'use client';

import AlertTicker from '@/components/panels/AlertTicker';
import { Alert } from '@/types';
import { AlertTriangle, CheckCircle, Radio, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface AlertsViewProps {
  alerts: Alert[];
  onAlertAcknowledge: (alertId: string) => void;
}

const ALERT_COLORS: Record<Alert['type'], string> = {
  Warning: 'text-amber-300',
  Danger: 'text-rose-300',
  Offline: 'text-slate-300',
  Recovery: 'text-emerald-300',
};

const ALERT_ICONS: Record<Alert['type'], ReactNode> = {
  Warning: <AlertTriangle size={14} />,
  Danger: <XCircle size={14} />,
  Offline: <Radio size={14} />,
  Recovery: <CheckCircle size={14} />,
};

export default function AlertsView({ alerts, onAlertAcknowledge }: AlertsViewProps) {
  const total = alerts.length;
  const acknowledged = alerts.filter((alert) => alert.acknowledged).length;
  const open = total - acknowledged;
  const byType = alerts.reduce<Record<Alert['type'], number>>(
    (acc, alert) => {
      acc[alert.type] = (acc[alert.type] ?? 0) + 1;
      return acc;
    },
    { Warning: 0, Danger: 0, Offline: 0, Recovery: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Open Alerts</p>
          <p className="text-2xl font-bold text-rose-300 mt-1">{open}</p>
          <p className="text-[11px] text-zinc-500 mt-2">
            {open === 0 ? 'No outstanding alerts' : `${open} pending acknowledgement`}
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Acknowledged</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{acknowledged}</p>
          <p className="text-[11px] text-zinc-500 mt-2">
            {total === 0 ? 'No alerts logged' : `${Math.round((acknowledged / total) * 100)}% in control`}
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Danger Level</p>
          <p className="text-2xl font-bold text-rose-300 mt-1">{byType.Danger}</p>
          <p className="text-[11px] text-zinc-500 mt-2">Requires immediate action</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Warning Level</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{byType.Warning}</p>
          <p className="text-[11px] text-zinc-500 mt-2">Monitor for escalation</p>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-100">Alert Breakdown</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Distribution by alert type with acknowledgement status
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(byType) as Array<Alert['type']>).map((type) => (
            <div
              key={type}
              className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-sm font-semibold ${ALERT_COLORS[type]}`}>
                  <span className="h-8 w-8 rounded-lg bg-zinc-900/60 border border-zinc-800 grid place-items-center">
                    {ALERT_ICONS[type]}
                  </span>
                  {type}
                </div>
                <span className="text-sm font-semibold text-zinc-100">{byType[type]}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                {alerts.filter((alert) => alert.type === type && alert.acknowledged).length} acknowledged |{' '}
                {alerts.filter((alert) => alert.type === type && !alert.acknowledged).length} open
              </p>
            </div>
          ))}
        </div>
      </div>

      <AlertTicker alerts={alerts} onAcknowledge={onAlertAcknowledge} />
    </div>
  );
}
