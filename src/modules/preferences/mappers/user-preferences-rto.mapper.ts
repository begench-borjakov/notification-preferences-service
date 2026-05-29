import { UserPreferencesOverviewEntity } from '../entities/user-preferences-overview.entity';
import {
  PreferenceItemRto,
  QuietHoursRto,
  UserPreferencesRto,
  UserSettingsRto,
} from '../rto/user-preferences.rto';

type PreferenceLike = {
  notificationType: UserPreferencesOverviewEntity['preferences'][number]['notificationType'];
  channel: UserPreferencesOverviewEntity['preferences'][number]['channel'];
  enabled: boolean;
};

export const toUserPreferencesRto = (
  entity: UserPreferencesOverviewEntity,
): UserPreferencesRto => ({
  userId: entity.userId,
  preferences: entity.preferences.map(toPreferenceItemRto),
  defaultPreferences: entity.defaultPreferences.map(toPreferenceItemRto),
  settings: toUserSettingsRto(entity.settings),
  quietHours: entity.quietHours ? toQuietHoursRto(entity.quietHours) : null,
});

const toPreferenceItemRto = (preference: PreferenceLike): PreferenceItemRto => ({
  notificationType: preference.notificationType,
  channel: preference.channel,
  enabled: preference.enabled,
});

const toUserSettingsRto = (
  settings: UserPreferencesOverviewEntity['settings'],
): UserSettingsRto => ({
  optionalNotificationsEnabled: settings?.optionalNotificationsEnabled ?? true,
});

const toQuietHoursRto = (
  quietHours: NonNullable<UserPreferencesOverviewEntity['quietHours']>,
): QuietHoursRto => ({
  enabled: quietHours.enabled,
  startTime: quietHours.startTime,
  endTime: quietHours.endTime,
  timezone: quietHours.timezone,
});
