import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';

export interface UpsertUserPreferenceInput {
  userId: string;
  notificationType: DomainNotificationType;
  channel: DomainChannel;
  enabled: boolean;
}

export interface UpsertQuietHoursInput {
  userId: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
}
