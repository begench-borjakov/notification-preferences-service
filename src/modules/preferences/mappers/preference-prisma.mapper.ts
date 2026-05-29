import { Channel, NotificationType } from '../../../../generated/prisma/client';
import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';

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

export const toPrismaNotificationType = (
  notificationType: DomainNotificationType,
): NotificationType => notificationTypeMap[notificationType];

export const toPrismaChannel = (channel: DomainChannel): Channel => channelMap[channel];
