import type { UserPreference } from '../../../../generated/prisma/client';
import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';
import { UserPreferenceEntity } from '../entities/user-preference.entity';

const notificationTypeMap: Record<UserPreference['notificationType'], DomainNotificationType> = {
  MARKETING: DomainNotificationType.MARKETING,
  TRANSACTIONAL: DomainNotificationType.TRANSACTIONAL,
  SECURITY: DomainNotificationType.SECURITY,
};

const channelMap: Record<UserPreference['channel'], DomainChannel> = {
  EMAIL: DomainChannel.EMAIL,
  SMS: DomainChannel.SMS,
  PUSH: DomainChannel.PUSH,
  MESSENGER: DomainChannel.MESSENGER,
};

export const toUserPreferenceEntity = (preference: UserPreference): UserPreferenceEntity => ({
  id: preference.id,
  userId: preference.userId,
  notificationType: notificationTypeMap[preference.notificationType],
  channel: channelMap[preference.channel],
  enabled: preference.enabled,
  createdAt: preference.createdAt,
  updatedAt: preference.updatedAt,
});
