import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../common/logger/logger.service';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserPreferencesOverviewEntity } from './entities/user-preferences-overview.entity';
import { PreferencesRepository } from './preferences.repository';

@Injectable()
export class PreferencesService {
  constructor(
    private readonly preferencesRepository: PreferencesRepository,
    private readonly logger: AppLoggerService,
  ) {}

  async getUserPreferences(userId: string): Promise<UserPreferencesOverviewEntity> {
    const [preferences, defaultPreferences, settings, quietHours] = await Promise.all([
      this.preferencesRepository.findUserPreferences(userId),
      this.preferencesRepository.findDefaultPreferences(),
      this.preferencesRepository.findUserSettings(userId),
      this.preferencesRepository.findQuietHours(userId),
    ]);

    return {
      userId,
      preferences,
      defaultPreferences,
      settings,
      quietHours,
    };
  }

  async updateUserPreferences(
    userId: string,
    dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesOverviewEntity> {
    if (dto.preferences) {
      await Promise.all(
        dto.preferences.map((preference) =>
          this.preferencesRepository.upsertUserPreference({
            userId,
            notificationType: preference.notificationType,
            channel: preference.channel,
            enabled: preference.enabled,
          }),
        ),
      );
    }

    if (dto.optionalNotificationsEnabled !== undefined) {
      await this.preferencesRepository.upsertUserSettings(userId, dto.optionalNotificationsEnabled);
    }

    if (dto.quietHours) {
      await this.preferencesRepository.upsertQuietHours({
        userId,
        enabled: dto.quietHours.enabled,
        startTime: dto.quietHours.startTime,
        endTime: dto.quietHours.endTime,
        timezone: dto.quietHours.timezone,
      });
    }

    this.logger.logPreferencesUpdated({
      userId,
      preferencesUpdated: dto.preferences?.length ?? 0,
      settingsUpdated: dto.optionalNotificationsEnabled !== undefined,
      quietHoursUpdated: dto.quietHours !== undefined,
    });

    return this.getUserPreferences(userId);
  }
}
