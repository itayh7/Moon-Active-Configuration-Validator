import { makeAutoObservable, runInAction } from 'mobx';
import {
  validateConfig,
  type ConfigPayload,
  type ValidateConfigResponse
} from '../api/validateApi';
import type { Difficulty } from '../definitions/constants';
import type { ModelsStore } from './ModelsStore';

type Status = 'idle' | 'loading' | 'done' | 'error';

const INITIAL_FORM: ConfigPayload = {
  level: 1,
  time_limit: 30,
  reward: 100,
  difficulty: 'easy'
};

export class ValidatorStore {
  status: Status = 'idle';
  form: ConfigPayload = { ...INITIAL_FORM };
  result: ValidateConfigResponse | null = null;
  error: string | null = null;

  constructor(private readonly modelsStore: ModelsStore) {
    makeAutoObservable(this);
  }

  get isLoading(): boolean {
    return this.status === 'loading';
  }

  setLevel(value: number): void {
    this.form.level = value;
  }

  setTimeLimit(value: number): void {
    this.form.time_limit = value;
  }

  setReward(value: number): void {
    this.form.reward = value;
  }

  setDifficulty(value: Difficulty): void {
    this.form.difficulty = value;
  }

  async submit(): Promise<void> {
    const model = this.modelsStore.selected;
    if (!model) {
      this.status = 'error';
      this.error = 'Please choose a model first.';
      this.result = null;
      return;
    }

    this.status = 'loading';
    this.error = null;
    this.result = null;

    try {
      const result = await validateConfig({ ...this.form }, model);
      runInAction(() => {
        this.status = 'done';
        this.result = result;
      });
    } catch (err) {
      runInAction(() => {
        this.status = 'error';
        this.error = err instanceof Error ? err.message : 'Unknown error';
      });
    }
  }
}
