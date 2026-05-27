import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserPreferencesOverviewEntity } from './entities/user-preferences-overview.entity';
import { PreferencesRepository } from './preferences.repository';

@Injectable()
export class PreferencesService {
  private readonly logger = new Logger(PreferencesService.name);

  constructor(private readonly preferencesRepository: PreferencesRepository) {}

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

    this.logger.log(`preferences updated for userId=${userId}`);

    return this.getUserPreferences(userId);
  }
}
