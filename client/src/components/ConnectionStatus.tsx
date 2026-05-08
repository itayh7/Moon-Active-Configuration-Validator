import { observer } from 'mobx-react-lite';
import { useHealthStore } from '../stores/StoreContext';
import { StatusBadge } from '../common/StatusBadge';
import { TextLine } from '../common/TextLine';
import { Stack } from '../common/Stack';

export const ConnectionStatus = observer(() => {
  const health = useHealthStore();

  if (health.isLoading) {
    return <StatusBadge variant="loading" label="Connecting..." />;
  }

  if (health.status === 'error') {
    return <StatusBadge variant="error" label={`Error: ${health.error ?? 'unknown'}`} />;
  }

  if (health.isConnected) {
    return (
      <Stack spacing={1}>
        <StatusBadge variant="ok" label="Connected" />
        <TextLine variant="caption" text={`Last check: ${health.timestamp}`} />
      </Stack>
    );
  }

  return <StatusBadge variant="idle" label="Idle" />;
});
