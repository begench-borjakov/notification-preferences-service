import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';

export interface EvaluationRequestEntity {
  userId: string;
  notificationType: DomainNotificationType;
  channel: DomainChannel;
  region: DomainRegion;
  datetime: Date;
}
