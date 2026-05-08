import { observer } from 'mobx-react-lite';
import { useHealthStore } from '../stores/StoreContext';
import { TextLine } from '../common/TextLine';

export const WelcomeMessage = observer(() => {
  const health = useHealthStore();

  if (health.isLoading) {
    return <TextLine variant="body" text="Generating welcome message..." />;
  }

  if (!health.message) {
    return <TextLine variant="body" text="(no message yet)" />;
  }

  return <TextLine variant="body" text={health.message} />;
});
