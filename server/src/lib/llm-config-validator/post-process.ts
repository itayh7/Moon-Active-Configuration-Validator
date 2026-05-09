import type { LlmOutput } from '../../schemas/llm-output.js';

export interface LlmFeedback {
  analysis: string;
  suggested_actions: string[];
  confidence: number;
}

function roundToTwo(n: number): number {
  return Math.round(n * 100) / 100;
}

export function postProcess(output: LlmOutput): LlmFeedback {
  const { analysis, findings, verdict_confidence } = output;

  if (findings.length === 0) {
    return {
      analysis,
      suggested_actions: ['No action needed'],
      confidence: roundToTwo(verdict_confidence)
    };
  }

  const mean = findings.reduce((sum, f) => sum + f.confidence, 0) / findings.length;
  return {
    analysis,
    suggested_actions: findings.map((f) => f.suggested_action),
    confidence: roundToTwo(mean)
  };
}
