import { observer } from 'mobx-react-lite';
import { useModelsStore } from '../stores/StoreContext';
import { SelectField } from '../common/SelectField';
import { TextLine } from '../common/TextLine';

export const ModelSelector = observer(() => {
  const models = useModelsStore();

  if (models.isLoading) {
    return <TextLine variant="body" text="Loading models..." />;
  }

  if (models.status === 'error') {
    return <TextLine variant="body" text={`Error: ${models.error ?? 'unknown'}`} />;
  }

  if (models.models.length === 0 || models.selected === null) {
    return <TextLine variant="body" text="(no models available)" />;
  }

  return (
    <SelectField
      label="Model ID"
      value={models.selected}
      options={models.models}
      onChange={(value) => models.setSelected(value)}
    />
  );
});
