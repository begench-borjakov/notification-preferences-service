import type { DefaultPreference } from '../../../../generated/prisma/client';
import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';
import { DefaultPreferenceEntity } from '../entities/default-preference.entity';

const notificationTypeMap: Record<DefaultPreference['notificationType'], DomainNotificationType> = {
  MARKETING: DomainNotificationType.MARKETING,
  TRANSACTIONAL: DomainNotificationType.TRANSACTIONAL,
  SECURITY: DomainNotificationType.SECURITY,
};

const channelMap: Record<DefaultPreference['channel'], DomainChannel> = {
  EMAIL: DomainChannel.EMAIL,
  SMS: DomainChannel.SMS,
  PUSH: DomainChannel.PUSH,
  MESSENGER: DomainChannel.MESSENGER,
};

export const toDefaultPreferenceEntity = (
  preference: DefaultPreference,
): DefaultPreferenceEntity => ({
  id: preference.id,
  notificationType: notificationTypeMap[preference.notificationType],
  channel: channelMap[preference.channel],
  enabled: preference.enabled,
  createdAt: preference.createdAt,
  updatedAt: preference.updatedAt,
});
