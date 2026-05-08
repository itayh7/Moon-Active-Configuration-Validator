import { HealthStore } from './HealthStore';

export class RootStore {
  readonly healthStore: HealthStore;

  constructor() {
    this.healthStore = new HealthStore();
  }
}
