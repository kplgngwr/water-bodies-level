'use client';

import { Alert } from '@/types';
import { acknowledgeAlert } from '@/lib/api';
import { Card, List, ListItem, Text, Title } from '@tremor/react';
import { useState } from 'react';

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
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-500',
          textColor: 'text-yellow-700',
          iconBg: 'bg-yellow-100'
        };
      case 'Danger': 
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-700',
          iconBg: 'bg-red-100'
        };
      case 'Offline': 
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-l-gray-500',
          textColor: 'text-gray-700',
          iconBg: 'bg-gray-100'
        };
      case 'Recovery': 
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-500',
          textColor: 'text-green-700',
          iconBg: 'bg-green-100'
        };
      default: 
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          textColor: 'text-blue-700',
          iconBg: 'bg-blue-100'
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
    <Card className="shadow-lg border-2 border-white h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title className="text-slate-800">Recent Alerts</Title>
          <p className="text-xs text-slate-500 mt-1">{alerts.length} active alerts</p>
        </div>
        {alerts.length > 0 && (
          <div className="px-2 py-1 bg-red-100 rounded-full">
            <span className="text-xs font-semibold text-red-700">{alerts.length}</span>
          </div>
        )}
      </div>
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <Text className="text-slate-600 font-medium">All Clear</Text>
          <Text className="text-xs text-slate-500">No recent alerts</Text>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.type);
            return (
              <div 
                key={alert.id} 
                className={`${styles.bgColor} ${styles.borderColor} border-l-4 rounded-r-lg p-3 transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles.textColor} ${styles.iconBg}`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-slate-500">{formatTime(alert.timestamp)}</span>
                    </div>
                    <Text className="font-semibold text-sm text-slate-800">{alert.stationName}</Text>
                    <Text className="text-xs text-slate-600 mt-1">{alert.message}</Text>
                  </div>
                  {!alert.acknowledged && onAcknowledge && (
                    <button
                      className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                      onClick={() => {
                        console.log('Acknowledging alert:', alert.id);
                        handleAcknowledge(alert.id);
                      }}
                      disabled={acknowledging === alert.id}
                    >
                      {acknowledging === alert.id ? 'Processing...' : 'Acknowledge'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}