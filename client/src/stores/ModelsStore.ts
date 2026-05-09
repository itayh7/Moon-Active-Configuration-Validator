import { makeAutoObservable, runInAction } from 'mobx';
import { fetchModels } from '../api/modelsApi';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export class ModelsStore {
  status: Status = 'idle';
  models: string[] = [];
  selected: string | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoading(): boolean {
    return this.status === 'loading';
  }

  setSelected(model: string): void {
    this.selected = model;
  }

  async load(): Promise<void> {
    this.status = 'loading';
    this.error = null;
    try {
      const result = await fetchModels();
      runInAction(() => {
        this.status = 'ok';
        this.models = result.models;
        if (this.selected === null && result.models.length > 0) {
          this.selected = result.models[0];
        }
      });
    } catch (err) {
      runInAction(() => {
        this.status = 'error';
        this.error = err instanceof Error ? err.message : 'Unknown error';
      });
    }
  }
}
