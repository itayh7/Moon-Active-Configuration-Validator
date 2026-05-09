import { makeAutoObservable, runInAction } from 'mobx';
import {
  fetchReferenceRanges,
  saveReferenceRanges,
  type ReferenceRanges
} from '../api/referenceRangesApi';
import type { Difficulty, OptionalRangeField, RangeField } from '../definitions/constants';

type Status = 'idle' | 'loading' | 'saving' | 'ok' | 'error';

export class SettingsStore {
  status: Status = 'idle';
  ranges: ReferenceRanges | null = null;
  error: string | null = null;
  saveMessage: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoading(): boolean {
    return this.status === 'loading';
  }

  get isSaving(): boolean {
    return this.status === 'saving';
  }

  setRangeField(difficulty: Difficulty, field: RangeField, value: number): void {
    if (!this.ranges) return;
    this.ranges.difficulties[difficulty][field] = value;
  }

  setOptionalRangeField(
    difficulty: Difficulty,
    field: OptionalRangeField,
    value: number | undefined
  ): void {
    if (!this.ranges) return;
    const target = this.ranges.difficulties[difficulty];
    if (value === undefined) {
      delete target[field];
    } else {
      target[field] = value;
    }
  }

  setTotalLevels(value: number): void {
    if (!this.ranges) return;
    this.ranges.total_levels = value;
  }

  async load(): Promise<void> {
    this.status = 'loading';
    this.error = null;
    this.saveMessage = null;
    try {
      const result = await fetchReferenceRanges();
      runInAction(() => {
        this.status = 'ok';
        this.ranges = result;
      });
    } catch (err) {
      runInAction(() => {
        this.status = 'error';
        this.error = err instanceof Error ? err.message : 'Unknown error';
      });
    }
  }

  async save(): Promise<void> {
    if (!this.ranges) return;
    this.status = 'saving';
    this.error = null;
    this.saveMessage = null;
    try {
      const result = await saveReferenceRanges(this.ranges);
      runInAction(() => {
        this.status = 'ok';
        this.ranges = result;
        this.saveMessage = 'Saved.';
      });
    } catch (err) {
      runInAction(() => {
        this.status = 'error';
        this.error = err instanceof Error ? err.message : 'Unknown error';
      });
    }
  }
}
