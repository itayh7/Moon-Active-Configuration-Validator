import { observer } from 'mobx-react-lite';
import { useSettingsStore } from '../stores/StoreContext';
import { Stack } from '../common/Stack';
import { TextLine } from '../common/TextLine';
import { ActionButton } from '../common/ActionButton';
import { NumberField } from '../common/NumberField';
import { DifficultyRangesEditor } from './DifficultyRangesEditor';
import { DIFFICULTIES } from '../definitions/constants';

export const GameSettings = observer(() => {
  const settings = useSettingsStore();

  if (settings.isLoading) {
    return <TextLine variant="body" text="Loading settings..." />;
  }

  if (!settings.ranges) {
    return (
      <Stack spacing={1}>
        <TextLine variant="body" text="No settings loaded." />
        {settings.error && <TextLine variant="caption" text={`Error: ${settings.error}`} />}
        <ActionButton
          label="Retry"
          onClick={() => void settings.load()}
          variant="outlined"
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {DIFFICULTIES.map((difficulty) => (
        <DifficultyRangesEditor key={difficulty} difficulty={difficulty} />
      ))}
      <NumberField
        label="Total levels"
        value={settings.ranges.total_levels}
        onChange={(v) => settings.setTotalLevels(v)}
        disabled={settings.isSaving}
        min={1}
      />
      <ActionButton
        label={settings.isSaving ? 'Saving...' : 'Save'}
        onClick={() => void settings.save()}
        disabled={settings.isSaving}
      />
      {settings.saveMessage && (
        <TextLine variant="caption" text={settings.saveMessage} />
      )}
      {settings.error && (
        <TextLine variant="caption" text={`Error: ${settings.error}`} />
      )}
    </Stack>
  );
});
