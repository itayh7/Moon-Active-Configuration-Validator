import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ReferenceRangesSchema, type ReferenceRanges } from '../schemas/reference-ranges.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RANGES_FILE = resolve(__dirname, '../../data/reference-ranges.json');

export class ReferenceRangesError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'ReferenceRangesError';
  }
}

export async function readReferenceRanges(): Promise<ReferenceRanges> {
  let raw: string;
  try {
    raw = await readFile(RANGES_FILE, 'utf8');
  } catch (err) {
    throw new ReferenceRangesError(
      `Failed to read reference-ranges file at ${RANGES_FILE}`,
      err
    );
  }

  if (!raw.trim()) {
    throw new ReferenceRangesError('Reference-ranges file is empty');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new ReferenceRangesError('Reference-ranges file is not valid JSON', err);
  }

  const result = ReferenceRangesSchema.safeParse(parsed);
  if (!result.success) {
    throw new ReferenceRangesError(
      `Reference-ranges file failed schema validation: ${result.error.message}`,
      result.error
    );
  }
  return result.data;
}

export async function writeReferenceRanges(ranges: ReferenceRanges): Promise<void> {
  const validated = ReferenceRangesSchema.parse(ranges);
  try {
    await writeFile(RANGES_FILE, JSON.stringify(validated, null, 2) + '\n', 'utf8');
  } catch (err) {
    throw new ReferenceRangesError(
      `Failed to write reference-ranges file at ${RANGES_FILE}`,
      err
    );
  }
}
