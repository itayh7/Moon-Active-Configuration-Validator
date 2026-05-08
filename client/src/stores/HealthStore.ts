import { makeAutoObservable, runInAction } from 'mobx';
import { fetchHealth } from '../api/healthApi';

export type HealthStatus = 'idle' | 'loading' | 'ok' | 'error';

export class HealthStore {
  status: HealthStatus = 'idle';
  message = '';
  timestamp = '';
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoading(): boolean {
    return this.status === 'loading';
  }

  get isConnected(): boolean {
    return this.status === 'ok';
  }

  async fetchHealth(): Promise<void> {
    this.status = 'loading';
    this.error = null;
    try {
      const result = await fetchHealth();
      runInAction(() => {
        this.status = 'ok';
        this.message = result.message;
        this.timestamp = result.timestamp;
      });
    } catch (err) {
      runInAction(() => {
        this.status = 'error';
        this.error = err instanceof Error ? err.message : 'Unknown error';
      });
    }
  }
}
