import { z } from 'zod';

export const ConfigSchema = z
  .object({
    level: z.number().int().min(1),
    time_limit: z.number().int().min(1),
    reward: z.number().int().min(0),
    difficulty: z.enum(['easy', 'medium', 'hard'])
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;
