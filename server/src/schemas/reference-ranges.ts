import { z } from 'zod';

const DifficultyRangeSchema = z
  .object({
    reward_min: z.number().int().min(0),
    reward_max: z.number().int().min(0),
    time_limit_min: z.number().int().min(1).optional(),
    time_limit_max: z.number().int().min(1).optional()
  })
  .strict()
  .refine((d) => d.reward_max >= d.reward_min, {
    message: 'reward_max must be >= reward_min'
  })
  .refine((d) => d.time_limit_min !== undefined || d.time_limit_max !== undefined, {
    message: 'at least one of time_limit_min / time_limit_max is required'
  })
  .refine(
    (d) =>
      d.time_limit_min === undefined ||
      d.time_limit_max === undefined ||
      d.time_limit_max >= d.time_limit_min,
    { message: 'time_limit_max must be >= time_limit_min' }
  );

export const ReferenceRangesSchema = z
  .object({
    difficulties: z
      .object({
        easy: DifficultyRangeSchema,
        medium: DifficultyRangeSchema,
        hard: DifficultyRangeSchema
      })
      .strict(),
    total_levels: z.number().int().min(1)
  })
  .strict();

export type ReferenceRanges = z.infer<typeof ReferenceRangesSchema>;
export type DifficultyRange = z.infer<typeof DifficultyRangeSchema>;
