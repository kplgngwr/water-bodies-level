export interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  basin: string;
  status: 'Normal' | 'Warning' | 'Danger' | 'Offline';
  lastReading: {
    timestamp: string;
    waterLevel: number;
    change1h: number;
    change24h: number;
    battery: number;
    rssi: number;
  };
  thresholds: {
    warning: number;
    danger: number;
  };
}

export interface Alert {
  id: string;
  stationId: string;
  stationName: string;
  timestamp: string;
  type: 'Warning' | 'Danger' | 'Offline' | 'Recovery';
  message: string;
  acknowledged: boolean;
}

export interface BasinSummary {
  name: string;
  stationCount: number;
  activeStations: number;
  warningStations: number;
  dangerStations: number;
  avgChange24h: number;
}

export interface SystemStatus {
  totalStations: number;
  activeStations: number;
  warningStations: number;
  dangerStations: number;
  offlineStations: number;
  alertsLast24h: number;
  dataDeliveryRate7d: number;
}