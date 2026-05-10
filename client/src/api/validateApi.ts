import axios from 'axios';
import { httpClient } from './httpClient';
import { VALIDATE_CONFIG_ENDPOINT } from '../definitions/constants';
import type { Difficulty } from '../definitions/constants';

export interface ConfigPayload {
  level: number;
  time_limit: number;
  reward: number;
  difficulty: Difficulty;
}

export interface SchemaValidationError {
  path: string;
  message: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: SchemaValidationError[];
}

export interface LlmFeedback {
  analysis: string;
  suggested_actions: string[];
  confidence: number;
}

export interface ValidateConfigSuccess {
  schema_validation: SchemaValidationResult;
  llm_feedback: LlmFeedback;
}

export interface ValidateConfigSchemaFailure {
  schema_validation: SchemaValidationResult;
}

export interface ValidateConfigError {
  status: 'error';
  message: string;
}

export type ValidateConfigResponse =
  | ValidateConfigSuccess
  | ValidateConfigSchemaFailure
  | ValidateConfigError;

export function isValidateConfigError(
  r: ValidateConfigResponse
): r is ValidateConfigError {
  return (r as ValidateConfigError).status === 'error';
}

export function isValidateConfigSuccess(
  r: ValidateConfigResponse
): r is ValidateConfigSuccess {
  return !isValidateConfigError(r) && 'llm_feedback' in r;
}

export async function validateConfig(
  payload: ConfigPayload,
  model: string
): Promise<ValidateConfigResponse> {
  console.log('POST /validate-config — request', { model, payload });
  try {
    const { data } = await httpClient.post<ValidateConfigResponse>(
      VALIDATE_CONFIG_ENDPOINT,
      payload,
      { params: { model } }
    );
    console.log('POST /validate-config — response', data);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      console.log('POST /validate-config — response (error)', err.response.data);
      return err.response.data as ValidateConfigResponse;
    }
    throw err;
  }
}
