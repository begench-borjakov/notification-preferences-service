import { DefaultPreferenceEntity } from './default-preference.entity';
import { QuietHoursEntity } from './quiet-hours.entity';
import { UserPreferenceEntity } from './user-preference.entity';
import { UserSettingsEntity } from './user-settings.entity';

export interface UserPreferencesOverviewEntity {
  userId: string;
  preferences: UserPreferenceEntity[];
  defaultPreferences: DefaultPreferenceEntity[];
  settings: UserSettingsEntity | null;
  quietHours: QuietHoursEntity | null;
}
