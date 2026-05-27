import { GlobalPolicyEntity } from '../entities/global-policy.entity';
import { GlobalPolicyRto } from '../rto/global-policy.rto';

export const toGlobalPolicyRto = (
  policy: GlobalPolicyEntity,
): GlobalPolicyRto => ({
  id: policy.id,
  notificationType: policy.notificationType,
  channel: policy.channel,
  region: policy.region,
  action: policy.action,
  reason: policy.reason,
  enabled: policy.enabled,
  createdAt: policy.createdAt.toISOString(),
  updatedAt: policy.updatedAt.toISOString(),
});
