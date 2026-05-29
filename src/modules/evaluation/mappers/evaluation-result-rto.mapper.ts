import { EvaluationResultEntity } from '../entities/evaluation-result.entity';
import { EvaluationResultRto } from '../rto/evaluation-result.rto';

export const toEvaluationResultRto = (result: EvaluationResultEntity): EvaluationResultRto => ({
  decision: result.decision,
  reason: result.reason,
});
