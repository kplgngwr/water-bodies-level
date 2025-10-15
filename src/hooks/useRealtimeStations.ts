import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { getFirebaseDatabase } from '@/lib/firebase';
import type { Station } from '@/types';

type RealtimeStation = Station;

export function useRealtimeStations(path: string = 'stations') {
  const [stations, setStations] = useState<RealtimeStation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const database = getFirebaseDatabase();
    if (!database) {
      setLoading(false);
      setStations(null);
      return;
    }

    const stationsRef = ref(database, path);
    const unsubscribe = onValue(
      stationsRef,
      snapshot => {
        const value = snapshot.val();
        if (!value) {
          setStations([]);
          setLoading(false);
          return;
        }

        const parsed: RealtimeStation[] = Object.keys(value).map(key => ({
          id: key,
          ...value[key],
        }));
        setStations(parsed);
        setLoading(false);
      },
      err => {
        console.error('Failed to read stations data:', err);
        setError(err.message ?? 'Failed to read stations');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return { stations, loading, error };
}
