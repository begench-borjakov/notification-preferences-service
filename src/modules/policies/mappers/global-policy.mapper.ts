import type { GlobalPolicy } from '../../../../generated/prisma/client';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';
import { GlobalPolicyEntity } from '../entities/global-policy.entity';
import { DomainPolicyAction } from '../types/policy.types';

const notificationTypeMap: Record<GlobalPolicy['notificationType'], DomainNotificationType> = {
  MARKETING: DomainNotificationType.MARKETING,
  TRANSACTIONAL: DomainNotificationType.TRANSACTIONAL,
  SECURITY: DomainNotificationType.SECURITY,
};

const channelMap: Record<GlobalPolicy['channel'], DomainChannel> = {
  EMAIL: DomainChannel.EMAIL,
  SMS: DomainChannel.SMS,
  PUSH: DomainChannel.PUSH,
  MESSENGER: DomainChannel.MESSENGER,
};

const regionMap: Record<GlobalPolicy['region'], DomainRegion> = {
  GLOBAL: DomainRegion.GLOBAL,
  EU: DomainRegion.EU,
  US: DomainRegion.US,
  TR: DomainRegion.TR,
};

const policyActionMap: Record<GlobalPolicy['action'], DomainPolicyAction> = {
  ALLOW: DomainPolicyAction.ALLOW,
  DENY: DomainPolicyAction.DENY,
};

export const toGlobalPolicyEntity = (policy: GlobalPolicy): GlobalPolicyEntity => ({
  id: policy.id,
  notificationType: notificationTypeMap[policy.notificationType],
  channel: channelMap[policy.channel],
  region: regionMap[policy.region],
  action: policyActionMap[policy.action],
  reason: policy.reason,
  enabled: policy.enabled,
  createdAt: policy.createdAt,
  updatedAt: policy.updatedAt,
});
