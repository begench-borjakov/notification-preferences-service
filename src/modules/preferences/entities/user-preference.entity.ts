import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';

export interface UserPreferenceEntity {
  id: string;
  userId: string;
  notificationType: DomainNotificationType;
  channel: DomainChannel;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
