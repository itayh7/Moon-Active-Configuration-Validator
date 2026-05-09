import type { Config } from '../../schemas/config.js';
import type { DifficultyRange, ReferenceRanges } from '../../schemas/reference-ranges.js';

function timePhrase(range: DifficultyRange): string {
  const { time_limit_min: min, time_limit_max: max } = range;
  if (min !== undefined && max !== undefined) return `${min}–${max}s`;
  if (min !== undefined) return `≥ ${min}s`;
  if (max !== undefined) return `≤ ${max}s`;
  // Schema guarantees at least one bound; this is unreachable.
  throw new Error('DifficultyRange has no time bounds');
}

export function renderUserPrompt(ranges: ReferenceRanges, config: Config): string {
  const { easy, medium, hard } = ranges.difficulties;
  const configJson = JSON.stringify(config, null, 2);

  return [
    '## Reference Balancing Ranges',
    '',
    `- Easy: reward ${easy.reward_min}–${easy.reward_max}, time_limit ${timePhrase(easy)}`,
    `- Medium: reward ${medium.reward_min}–${medium.reward_max}, time_limit ${timePhrase(medium)}`,
    `- Hard: reward ${hard.reward_min}–${hard.reward_max}, time_limit ${timePhrase(hard)}`,
    `- Total levels in this game: ${ranges.total_levels}`,
    '',
    '## Configuration',
    '',
    '```json',
    configJson,
    '```',
    ''
  ].join('\n');
}
