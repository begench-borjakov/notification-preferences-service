import { EvaluationDecision, EvaluationReason } from './evaluation.types';

export interface EvaluationResultEntity {
  decision: EvaluationDecision;
  reason: EvaluationReason;
}
