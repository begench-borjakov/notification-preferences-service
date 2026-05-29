import type { UserSettings } from '../../../../generated/prisma/client';
import { UserSettingsEntity } from '../entities/user-settings.entity';

export const toUserSettingsEntity = (settings: UserSettings): UserSettingsEntity => ({
  id: settings.id,
  userId: settings.userId,
  optionalNotificationsEnabled: settings.optionalNotificationsEnabled,
  createdAt: settings.createdAt,
  updatedAt: settings.updatedAt,
});
