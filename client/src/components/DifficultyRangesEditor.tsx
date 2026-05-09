import { observer } from 'mobx-react-lite';
import { useSettingsStore } from '../stores/StoreContext';
import { NumberField } from '../common/NumberField';
import { TextLine } from '../common/TextLine';
import { Stack } from '../common/Stack';
import { RANGE_FIELDS, type Difficulty, type RangeField } from '../definitions/constants';

interface DifficultyRangesEditorProps {
  difficulty: Difficulty;
}

const FIELD_LABELS: Record<RangeField, string> = {
  reward_min: 'Reward min',
  reward_max: 'Reward max',
  time_limit_min: 'Time limit min',
  time_limit_max: 'Time limit max'
};

export const DifficultyRangesEditor = observer(({ difficulty }: DifficultyRangesEditorProps) => {
  const settings = useSettingsStore();
  const range = settings.ranges?.difficulties[difficulty];

  if (!range) return null;

  return (
    <Stack spacing={1}>
      <TextLine variant="subtitle" text={difficulty} />
      <Stack spacing={1} direction="row">
        {RANGE_FIELDS.map((field) => {
          const value = range[field];
          if (value === undefined) return null;
          return (
            <NumberField
              key={field}
              label={FIELD_LABELS[field]}
              value={value}
              onChange={(v) => settings.setRangeField(difficulty, field, v)}
              disabled={settings.isSaving}
              min={0}
            />
          );
        })}
      </Stack>
    </Stack>
  );
});
