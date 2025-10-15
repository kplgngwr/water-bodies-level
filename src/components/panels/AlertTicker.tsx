'use client';

import { Alert } from '@/types';
import { acknowledgeAlert } from '@/lib/api';
import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Radio } from 'lucide-react';

interface AlertTickerProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
}

export default function AlertTicker({ alerts, onAcknowledge }: AlertTickerProps) {
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  const handleAcknowledge = async (alertId: string) => {
    setAcknowledging(alertId);
    try {
      const success = await acknowledgeAlert(alertId);
      if (success && onAcknowledge) {
        onAcknowledge(alertId);
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setAcknowledging(null);
    }
  };

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'Warning': 
        return {
          bg: 'bg-amber-950/30',
          border: 'border-amber-800/50',
          text: 'text-amber-400',
          icon: <AlertTriangle size={16} className="text-amber-400" />
        };
      case 'Danger': 
        return {
          bg: 'bg-rose-950/30',
          border: 'border-rose-800/50',
          text: 'text-rose-400',
          icon: <XCircle size={16} className="text-rose-400" />
        };
      case 'Offline': 
        return {
          bg: 'bg-zinc-950/30',
          border: 'border-zinc-700/50',
          text: 'text-zinc-400',
          icon: <Radio size={16} className="text-zinc-400" />
        };
      case 'Recovery': 
        return {
          bg: 'bg-emerald-950/30',
          border: 'border-emerald-800/50',
          text: 'text-emerald-400',
          icon: <CheckCircle size={16} className="text-emerald-400" />
        };
      default: 
        return {
          bg: 'bg-sky-950/30',
          border: 'border-sky-800/50',
          text: 'text-sky-400',
          icon: <AlertTriangle size={16} className="text-sky-400" />
        };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg h-full">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <AlertTriangle size={18} className="text-sky-400" />
            Recent Alerts
          </h3>
          <p className="text-xs text-zinc-500 mt-1">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
        </div>
        {alerts.length > 0 && (
          <div className="px-2.5 py-1 bg-rose-950/50 border border-rose-800/50 rounded-full">
            <span className="text-xs font-semibold text-rose-400">{alerts.length}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-emerald-950/30 border border-emerald-800/30 rounded-full flex items-center justify-center mb-3">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <p className="text-zinc-300 font-medium">All Clear</p>
            <p className="text-xs text-zinc-500 mt-1">No recent alerts</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {alerts.map((alert) => {
              const styles = getAlertStyles(alert.type);
              return (
                <div 
                  key={alert.id} 
                  className={`${styles.bg} border ${styles.border} border-l-4 rounded-xl p-3 transition-all hover:scale-102`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {styles.icon}
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${styles.text}`}>
                          {alert.type}
                        </span>
                        <span className="text-xs text-zinc-500">{formatTime(alert.timestamp)}</span>
                      </div>
                      <p className="font-semibold text-sm text-zinc-200 truncate">{alert.stationName}</p>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{alert.message}</p>
                    </div>
                    {!alert.acknowledged && onAcknowledge && (
                      <button
                        className="shrink-0 px-3 py-1.5 text-xs border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={acknowledging === alert.id}
                      >
                        {acknowledging === alert.id ? 'ACK...' : 'ACK'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}