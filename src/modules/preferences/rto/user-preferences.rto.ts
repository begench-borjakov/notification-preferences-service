import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';

export class PreferenceItemRto {
  notificationType!: DomainNotificationType;
  channel!: DomainChannel;
  enabled!: boolean;
}

export class QuietHoursRto {
  enabled!: boolean;
  startTime!: string;
  endTime!: string;
  timezone!: string;
}

export class UserSettingsRto {
  optionalNotificationsEnabled!: boolean;
}

export class UserPreferencesRto {
  userId!: string;
  preferences!: PreferenceItemRto[];
  defaultPreferences!: PreferenceItemRto[];
  settings!: UserSettingsRto;
  quietHours!: QuietHoursRto | null;
}
