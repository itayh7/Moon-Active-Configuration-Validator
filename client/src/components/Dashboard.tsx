import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useHealthStore } from '../stores/StoreContext';
import { PageLayout } from '../layout/PageLayout';
import { PageTitle } from '../common/PageTitle';
import { SectionCard } from '../common/SectionCard';
import { ConnectionStatus } from './ConnectionStatus';
import { WelcomeMessage } from './WelcomeMessage';
import { RefreshButton } from './RefreshButton';
import { APP_TITLE } from '../definitions/constants';

export const Dashboard = observer(() => {
  const health = useHealthStore();

  useEffect(() => {
    void health.fetchHealth();
  }, [health]);

  return (
    <PageLayout>
      <PageTitle text={APP_TITLE} />
      <SectionCard title="Connection Status">
        <ConnectionStatus />
      </SectionCard>
      <SectionCard title="AI Greeting">
        <WelcomeMessage />
      </SectionCard>
      <RefreshButton />
    </PageLayout>
  );
});
