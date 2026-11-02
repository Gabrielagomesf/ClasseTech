import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  deleteRegistration as deleteRegistrationRepo,
  getDashboardStats,
  listRegistrations,
  saveRegistration as saveRegistrationRepo,
  type RegistrationFilters,
} from '../repositories/registrationRepository';
import {clearAllRegistrations, initDatabase} from '../services/database';
import {clearAllStoredDocuments} from '../services/storage/documents';
import type {Registration} from '../types';

type DashboardStats = {
  total: number;
  pf: number;
  pj: number;
  pending: number;
  recent: Registration[];
};

type RegistrationsContextValue = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  items: Registration[];
  stats: DashboardStats;
  refresh: (filters?: RegistrationFilters) => Promise<void>;
  save: (registration: Registration) => Promise<Registration>;
  remove: (id: string) => Promise<void>;
  clearLocalData: () => Promise<void>;
};

const RegistrationsContext = createContext<RegistrationsContextValue | null>(
  null,
);

const EMPTY_STATS: DashboardStats = {
  total: 0,
  pf: 0,
  pj: 0,
  pending: 0,
  recent: [],
};

export function RegistrationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Registration[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const filtersRef = useRef<RegistrationFilters>({});

  const refresh = useCallback(async (nextFilters?: RegistrationFilters) => {
    if (nextFilters) {
      filtersRef.current = nextFilters;
    }
    setLoading(true);
    setError(null);
    try {
      const [list, nextStats] = await Promise.all([
        listRegistrations(filtersRef.current),
        getDashboardStats(),
      ]);
      setItems(list);
      setStats(nextStats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Falha ao carregar cadastros',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initDatabase();
        if (!mounted) {
          return;
        }
        setReady(true);
        await refresh({});
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Não foi possível iniciar o banco local',
          );
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const save = useCallback(
    async (registration: Registration) => {
      const saved = await saveRegistrationRepo(registration);
      await refresh();
      return saved;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteRegistrationRepo(id);
      await refresh();
    },
    [refresh],
  );

  const clearLocalData = useCallback(async () => {
    await clearAllRegistrations();
    await clearAllStoredDocuments();
    await refresh({});
  }, [refresh]);

  const value = useMemo(
    () => ({
      ready,
      loading,
      error,
      items,
      stats,
      refresh,
      save,
      remove,
      clearLocalData,
    }),
    [ready, loading, error, items, stats, refresh, save, remove, clearLocalData],
  );

  return (
    <RegistrationsContext.Provider value={value}>
      {children}
    </RegistrationsContext.Provider>
  );
}

export function useRegistrations() {
  const ctx = useContext(RegistrationsContext);
  if (!ctx) {
    throw new Error('useRegistrations must be used within RegistrationsProvider');
  }
  return ctx;
}
