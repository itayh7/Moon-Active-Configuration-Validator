import { httpClient } from './httpClient';
import { REFERENCE_RANGES_ENDPOINT } from '../definitions/constants';

export interface DifficultyRange {
  reward_min: number;
  reward_max: number;
  time_limit_min?: number;
  time_limit_max?: number;
}

export interface ReferenceRanges {
  difficulties: {
    easy: DifficultyRange;
    medium: DifficultyRange;
    hard: DifficultyRange;
  };
  total_levels: number;
}

export async function fetchReferenceRanges(): Promise<ReferenceRanges> {
  const { data } = await httpClient.get<ReferenceRanges>(REFERENCE_RANGES_ENDPOINT);
  return data;
}

export async function saveReferenceRanges(ranges: ReferenceRanges): Promise<ReferenceRanges> {
  const { data } = await httpClient.put<ReferenceRanges>(REFERENCE_RANGES_ENDPOINT, ranges);
  return data;
}
