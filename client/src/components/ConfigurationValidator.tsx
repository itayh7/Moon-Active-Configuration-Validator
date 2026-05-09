import { observer } from 'mobx-react-lite';
import { useValidatorStore } from '../stores/StoreContext';
import { Stack } from '../common/Stack';
import { NumberField } from '../common/NumberField';
import { SelectField } from '../common/SelectField';
import { ActionButton } from '../common/ActionButton';
import { ValidationResult } from './ValidationResult';
import { DIFFICULTIES } from '../definitions/constants';

export const ConfigurationValidator = observer(() => {
  const validator = useValidatorStore();
  const { form, isLoading } = validator;

  return (
    <Stack spacing={2}>
      <NumberField
        label="Level"
        value={form.level}
        onChange={(v) => validator.setLevel(v)}
        disabled={isLoading}
        min={1}
      />
      <NumberField
        label="Time limit"
        value={form.time_limit}
        onChange={(v) => validator.setTimeLimit(v)}
        disabled={isLoading}
        min={1}
      />
      <NumberField
        label="Reward"
        value={form.reward}
        onChange={(v) => validator.setReward(v)}
        disabled={isLoading}
        min={0}
      />
      <SelectField
        label="Difficulty"
        value={form.difficulty}
        options={DIFFICULTIES}
        onChange={(v) => validator.setDifficulty(v)}
        disabled={isLoading}
      />
      <ActionButton
        label={isLoading ? 'Validating...' : 'Validate'}
        onClick={() => void validator.submit()}
        disabled={isLoading}
      />
      <ValidationResult />
    </Stack>
  );
});
