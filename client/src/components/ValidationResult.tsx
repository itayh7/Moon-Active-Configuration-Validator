import { observer } from 'mobx-react-lite';
import { useValidatorStore } from '../stores/StoreContext';
import { Stack } from '../common/Stack';
import { TextLine } from '../common/TextLine';
import { StatusBadge } from '../common/StatusBadge';
import { isValidateConfigError, isValidateConfigSuccess } from '../api/validateApi';

export const ValidationResult = observer(() => {
  const validator = useValidatorStore();

  if (validator.isLoading) {
    return <StatusBadge variant="loading" label="Validating..." />;
  }

  if (validator.status === 'error') {
    return <StatusBadge variant="error" label={`Error: ${validator.error ?? 'unknown'}`} />;
  }

  const result = validator.result;
  if (!result) {
    return <TextLine variant="caption" text="No result yet. Submit a configuration to validate." />;
  }

  if (isValidateConfigError(result)) {
    return (
      <Stack spacing={1}>
        <StatusBadge variant="error" label="Server error" />
        <TextLine variant="body" text={result.message} />
      </Stack>
    );
  }

  const schema = result.schema_validation;

  if (!schema.valid) {
    return (
      <Stack spacing={1}>
        <StatusBadge variant="error" label="Schema invalid" />
        {schema.errors.map((e, idx) => (
          <TextLine
            key={`${e.path}-${idx}`}
            variant="body"
            text={`${e.path || '(root)'}: ${e.message}`}
          />
        ))}
      </Stack>
    );
  }

  if (!isValidateConfigSuccess(result)) {
    return <StatusBadge variant="ok" label="Schema valid" />;
  }

  const feedback = result.llm_feedback;

  return (
    <Stack spacing={1}>
      <StatusBadge variant="ok" label={`Schema valid · confidence ${feedback.confidence}`} />
      <TextLine variant="subtitle" text="Analysis" />
      <TextLine variant="body" text={feedback.analysis} />
      <TextLine variant="subtitle" text="Suggested actions" />
      <Stack spacing={0}>
        {feedback.suggested_actions.map((action, idx) => (
          <TextLine key={idx} variant="body" text={`• ${action}`} />
        ))}
      </Stack>
    </Stack>
  );
});
