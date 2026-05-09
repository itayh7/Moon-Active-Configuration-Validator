import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useModelsStore, useSettingsStore } from '../stores/StoreContext';
import { PageLayout } from '../layout/PageLayout';
import { PageTitle } from '../common/PageTitle';
import { SectionCard } from '../common/SectionCard';
import { ConfigurationValidator } from './ConfigurationValidator';
import { GameSettings } from './GameSettings';
import { ModelSelector } from './ModelSelector';
import { APP_TITLE } from '../definitions/constants';

export const Dashboard = observer(() => {
  const models = useModelsStore();
  const settings = useSettingsStore();

  useEffect(() => {
    void models.load();
    void settings.load();
  }, [models, settings]);

  return (
    <PageLayout>
      <PageTitle text={APP_TITLE} />
      <SectionCard title="Configuration Validator">
        <ConfigurationValidator />
      </SectionCard>
      <SectionCard title="Game Settings">
        <GameSettings />
      </SectionCard>
      <SectionCard title="Model ID">
        <ModelSelector />
      </SectionCard>
    </PageLayout>
  );
});
