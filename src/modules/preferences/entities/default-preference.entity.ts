import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';

export interface DefaultPreferenceEntity {
  id: string;
  notificationType: DomainNotificationType;
  channel: DomainChannel;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
