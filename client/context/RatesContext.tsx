import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { DEFAULT_RATES, RateSet } from "@/lib/rates";

const STORAGE_KEY = "dcc_default_rates";

function loadDefaultRates(): RateSet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RATES;
    return { ...DEFAULT_RATES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RATES;
  }
}

interface RatesContextValue {
  databaseRates: RateSet;
  sessionRates: RateSet;
  setSessionRate: (key: keyof RateSet, value: number) => void;
  setDatabaseRate: (key: keyof RateSet, value: number) => void;
}

const RatesContext = createContext<RatesContextValue | null>(null);

export function RatesProvider({ children }: { children: ReactNode }) {
  const [databaseRates, setDatabaseRates] = useState<RateSet>(loadDefaultRates);
  const [sessionOverrides, setSessionOverrides] = useState<Partial<RateSet>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(databaseRates));
  }, [databaseRates]);

  const sessionRates = useMemo(
    () => ({ ...databaseRates, ...sessionOverrides }),
    [databaseRates, sessionOverrides],
  );

  const setSessionRate = (key: keyof RateSet, value: number) => {
    setSessionOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const setDatabaseRate = (key: keyof RateSet, value: number) => {
    setDatabaseRates((prev) => ({ ...prev, [key]: value }));
    setSessionOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <RatesContext.Provider
      value={{ databaseRates, sessionRates, setSessionRate, setDatabaseRate }}
    >
      {children}
    </RatesContext.Provider>
  );
}

export function useRates() {
  const ctx = useContext(RatesContext);
  if (!ctx) throw new Error("useRates must be used within RatesProvider");
  return ctx;
}
