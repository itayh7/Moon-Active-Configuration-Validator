import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { RootStore } from './RootStore';
import type { ModelsStore } from './ModelsStore';
import type { SettingsStore } from './SettingsStore';
import type { ValidatorStore } from './ValidatorStore';

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

export function useModelsStore(): ModelsStore {
  return useRootStore().modelsStore;
}

export function useSettingsStore(): SettingsStore {
  return useRootStore().settingsStore;
}

export function useValidatorStore(): ValidatorStore {
  return useRootStore().validatorStore;
}
