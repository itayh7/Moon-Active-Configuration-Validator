import { HealthStore } from './HealthStore';
import { ModelsStore } from './ModelsStore';
import { SettingsStore } from './SettingsStore';
import { ValidatorStore } from './ValidatorStore';

export class RootStore {
  readonly healthStore: HealthStore;
  readonly modelsStore: ModelsStore;
  readonly settingsStore: SettingsStore;
  readonly validatorStore: ValidatorStore;

  constructor() {
    this.healthStore = new HealthStore();
    this.modelsStore = new ModelsStore();
    this.settingsStore = new SettingsStore();
    this.validatorStore = new ValidatorStore(this.modelsStore);
  }
}
