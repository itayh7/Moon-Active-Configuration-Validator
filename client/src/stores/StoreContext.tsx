import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { RootStore } from './RootStore';
import type { HealthStore } from './HealthStore';

const StoreContext = createContext<RootStore | null>(null);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const store = useMemo(() => new RootStore(), []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export function useRootStore(): RootStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useRootStore must be used inside <StoreProvider>');
  }
  return store;
}

export function useHealthStore(): HealthStore {
  return useRootStore().healthStore;
}
