import { Alert, BasinSummary, Station, SystemStatus } from '@/types';
import { onValue, ref } from 'firebase/database';
import { mockAlerts, mockBasinSummaries, mockStations, mockSystemStatus } from './mockData';
import { getFirebaseDatabase } from '../firebase';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions to fetch data
export const fetchStations = async (): Promise<Station[]> => {
  const database = getFirebaseDatabase();
  if (!database) {
    await delay(200);
    return [...mockStations];
  }

  return new Promise<Station[]>((resolve, reject) => {
    const stationsRef = ref(database, 'stations');
    const unsubscribe = onValue(
      stationsRef,
      snapshot => {
        unsubscribe();
        const value = snapshot.val();
        if (!value) {
          resolve([]);
          return;
        }
        const parsed: Station[] = Object.keys(value).map(key => ({
          id: key,
          ...value[key],
        }));
        resolve(parsed);
      },
      error => {
        console.error('Failed to fetch stations from Firebase', error);
        unsubscribe();
        reject(error);
      },
      {
        onlyOnce: true,
      }
    );
  }).catch(() => {
    return [...mockStations];
  });
};

export const fetchStation = async (id: string): Promise<Station | null> => {
  await delay(500);
  const station = mockStations.find(s => s.id === id);
  return station ? { ...station } : null;
};

export const fetchAlerts = async (acknowledged: boolean = false): Promise<Alert[]> => {
  await delay(600);
  return mockAlerts
    .filter(alert => acknowledged || !alert.acknowledged)
    .map(alert => ({ ...alert }));
};

export const fetchBasinSummaries = async (): Promise<BasinSummary[]> => {
  await delay(700);
  return [...mockBasinSummaries];
};

export const fetchSystemStatus = async (): Promise<SystemStatus> => {
  await delay(400);
  return { ...mockSystemStatus };
};

export const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
  await delay(300);
  const alertIndex = mockAlerts.findIndex(a => a.id === alertId);
  if (alertIndex >= 0) {
    mockAlerts[alertIndex].acknowledged = true;
    return true;
  }
  return false;
};
