import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../definitions/constants';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' }
});
