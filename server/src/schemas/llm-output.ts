import { z } from 'zod';

export const FindingRule = z.enum([
  'reward_vs_difficulty',
  'time_vs_difficulty',
  'level_vs_difficulty',
  'economy_risk',
  'frustration_risk'
]);

export const FindingSchema = z.object({
  rule: FindingRule,
  suggested_action: z.string(),
  confidence: z.number().min(0).max(1)
});

export const LlmOutputSchema = z.object({
  analysis: z.string(),
  findings: z.array(FindingSchema),
  verdict_confidence: z.number().min(0).max(1)
});

export type LlmOutput = z.infer<typeof LlmOutputSchema>;
export type Finding = z.infer<typeof FindingSchema>;
