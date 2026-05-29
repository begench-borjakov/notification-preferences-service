import {
  Channel,
  NotificationType,
  PolicyAction,
  Region,
} from '../../../../generated/prisma/client';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';
import { DomainPolicyAction } from '../types/policy.types';

const notificationTypeMap: Record<DomainNotificationType, NotificationType> = {
  [DomainNotificationType.MARKETING]: NotificationType.MARKETING,
  [DomainNotificationType.TRANSACTIONAL]: NotificationType.TRANSACTIONAL,
  [DomainNotificationType.SECURITY]: NotificationType.SECURITY,
};

const channelMap: Record<DomainChannel, Channel> = {
  [DomainChannel.EMAIL]: Channel.EMAIL,
  [DomainChannel.SMS]: Channel.SMS,
  [DomainChannel.PUSH]: Channel.PUSH,
  [DomainChannel.MESSENGER]: Channel.MESSENGER,
};

const regionMap: Record<DomainRegion, Region> = {
  [DomainRegion.GLOBAL]: Region.GLOBAL,
  [DomainRegion.EU]: Region.EU,
  [DomainRegion.US]: Region.US,
  [DomainRegion.TR]: Region.TR,
};

const policyActionMap: Record<DomainPolicyAction, PolicyAction> = {
  [DomainPolicyAction.ALLOW]: PolicyAction.ALLOW,
  [DomainPolicyAction.DENY]: PolicyAction.DENY,
};

export const toPrismaNotificationType = (
  notificationType: DomainNotificationType,
): NotificationType => notificationTypeMap[notificationType];

export const toPrismaChannel = (channel: DomainChannel): Channel => channelMap[channel];

export const toPrismaRegion = (region: DomainRegion): Region => regionMap[region];

export const toPrismaPolicyAction = (action: DomainPolicyAction): PolicyAction =>
  policyActionMap[action];
