import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';

export enum DomainPolicyAction {
  ALLOW = 'allow',
  DENY = 'deny',
}

export interface UpsertGlobalPolicyInput {
  notificationType: DomainNotificationType;
  channel: DomainChannel;
  region: DomainRegion;
  action: DomainPolicyAction;
  reason?: string;
  enabled: boolean;
}
