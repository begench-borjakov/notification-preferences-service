import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';
import { DomainPolicyAction } from '../types/policy.types';

export class GlobalPolicyRto {
  id!: string;
  notificationType!: DomainNotificationType;
  channel!: DomainChannel;
  region!: DomainRegion;
  action!: DomainPolicyAction;
  reason!: string | null;
  enabled!: boolean;
  createdAt!: string;
  updatedAt!: string;
}
