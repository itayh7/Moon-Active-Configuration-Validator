import { observer } from 'mobx-react-lite';
import { useHealthStore } from '../stores/StoreContext';
import { ActionButton } from '../common/ActionButton';

export const RefreshButton = observer(() => {
  const health = useHealthStore();
  return (
    <ActionButton
      label="Refresh"
      onClick={() => {
        void health.fetchHealth();
      }}
      disabled={health.isLoading}
      variant="outlined"
    />
  );
});
