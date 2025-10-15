import { Alert, BasinSummary, Station, SystemStatus } from '@/types';

// Mock stations data
export const mockStations: Station[] = [
  {
    id: 'ST001',
    name: 'Yamuna Bridge',
    location: { lat: 28.6139, lng: 77.2090 },
    basin: 'Yamuna',
    status: 'Normal',
    lastReading: {
      timestamp: '2025-10-15T06:00:00Z',
      waterLevel: 205.3,
      change1h: 0.2,
      change24h: 1.5,
      battery: 92,
      rssi: -65,
    },
    thresholds: {
      warning: 208.0,
      danger: 210.5,
    },
  },
  {
    id: 'ST002',
    name: 'Ganges Monitoring Point',
    location: { lat: 25.3176, lng: 83.0064 },
    basin: 'Ganges',
    status: 'Warning',
    lastReading: {
      timestamp: '2025-10-15T06:15:00Z',
      waterLevel: 72.8,
      change1h: 0.5,
      change24h: 2.3,
      battery: 85,
      rssi: -72,
    },
    thresholds: {
      warning: 72.0,
      danger: 75.0,
    },
  },
  {
    id: 'ST003',
    name: 'Brahmaputra Station',
    location: { lat: 26.1445, lng: 91.7362 },
    basin: 'Brahmaputra',
    status: 'Danger',
    lastReading: {
      timestamp: '2025-10-15T06:10:00Z',
      waterLevel: 49.8,
      change1h: 0.7,
      change24h: 3.2,
      battery: 78,
      rssi: -68,
    },
    thresholds: {
      warning: 47.0,
      danger: 49.0,
    },
  },
  {
    id: 'ST004',
    name: 'Godavari Monitoring',
    location: { lat: 16.9891, lng: 81.7865 },
    basin: 'Godavari',
    status: 'Normal',
    lastReading: {
      timestamp: '2025-10-15T06:05:00Z',
      waterLevel: 35.2,
      change1h: 0.1,
      change24h: 0.8,
      battery: 95,
      rssi: -60,
    },
    thresholds: {
      warning: 38.0,
      danger: 40.0,
    },
  },
  {
    id: 'ST005',
    name: 'Krishna River Point',
    location: { lat: 16.5062, lng: 80.6480 },
    basin: 'Krishna',
    status: 'Normal',
    lastReading: {
      timestamp: '2025-10-15T06:20:00Z',
      waterLevel: 28.4,
      change1h: -0.1,
      change24h: -0.5,
      battery: 90,
      rssi: -62,
    },
    thresholds: {
      warning: 32.0,
      danger: 35.0,
    },
  },
  {
    id: 'ST006',
    name: 'Cauvery Station',
    location: { lat: 10.8505, lng: 78.6966 },
    basin: 'Cauvery',
    status: 'Offline',
    lastReading: {
      timestamp: '2025-10-14T18:45:00Z',
      waterLevel: 15.6,
      change1h: 0,
      change24h: 0.3,
      battery: 12,
      rssi: -95,
    },
    thresholds: {
      warning: 18.0,
      danger: 20.0,
    },
  },
];

// Mock alerts data
export const mockAlerts: Alert[] = [
  {
    id: 'AL001',
    stationId: 'ST002',
    stationName: 'Ganges Monitoring Point',
    timestamp: '2025-10-15T05:45:00Z',
    type: 'Warning',
    message: 'Water level exceeded warning threshold of 72.0m',
    acknowledged: false,
  },
  {
    id: 'AL002',
    stationId: 'ST003',
    stationName: 'Brahmaputra Station',
    timestamp: '2025-10-15T04:30:00Z',
    type: 'Danger',
    message: 'Water level exceeded danger threshold of 49.0m',
    acknowledged: false,
  },
  {
    id: 'AL003',
    stationId: 'ST006',
    stationName: 'Cauvery Station',
    timestamp: '2025-10-14T18:45:00Z',
    type: 'Offline',
    message: 'Station offline for more than 6 hours',
    acknowledged: true,
  },
];

// Mock basin summaries
export const mockBasinSummaries: BasinSummary[] = [
  {
    name: 'Yamuna',
    stationCount: 1,
    activeStations: 1,
    warningStations: 0,
    dangerStations: 0,
    avgChange24h: 1.5,
  },
  {
    name: 'Ganges',
    stationCount: 1,
    activeStations: 1,
    warningStations: 1,
    dangerStations: 0,
    avgChange24h: 2.3,
  },
  {
    name: 'Brahmaputra',
    stationCount: 1,
    activeStations: 1,
    warningStations: 0,
    dangerStations: 1,
    avgChange24h: 3.2,
  },
  {
    name: 'Godavari',
    stationCount: 1,
    activeStations: 1,
    warningStations: 0,
    dangerStations: 0,
    avgChange24h: 0.8,
  },
  {
    name: 'Krishna',
    stationCount: 1,
    activeStations: 1,
    warningStations: 0,
    dangerStations: 0,
    avgChange24h: -0.5,
  },
  {
    name: 'Cauvery',
    stationCount: 1,
    activeStations: 0,
    warningStations: 0,
    dangerStations: 0,
    avgChange24h: 0.3,
  },
];

// Mock system status
export const mockSystemStatus: SystemStatus = {
  totalStations: 6,
  activeStations: 5,
  warningStations: 1,
  dangerStations: 1,
  offlineStations: 1,
  alertsLast24h: 3,
  dataDeliveryRate7d: 92.5,
};