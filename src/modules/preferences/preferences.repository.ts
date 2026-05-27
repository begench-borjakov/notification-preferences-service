import { Injectable } from '@nestjs/common';
import { DomainChannel, DomainNotificationType } from '../../common/types/notification.types';
import { PrismaService } from '../../database/prisma.service';
import { DefaultPreferenceEntity } from './entities/default-preference.entity';
import { QuietHoursEntity } from './entities/quiet-hours.entity';
import { UserPreferenceEntity } from './entities/user-preference.entity';
import { UserSettingsEntity } from './entities/user-settings.entity';
import { toDefaultPreferenceEntity } from './mappers/default-preference.mapper';
import { toPrismaChannel, toPrismaNotificationType } from './mappers/preference-prisma.mapper';
import { toQuietHoursEntity } from './mappers/quiet-hours.mapper';
import { toUserPreferenceEntity } from './mappers/user-preference.mapper';
import { toUserSettingsEntity } from './mappers/user-settings.mapper';
import { UpsertQuietHoursInput, UpsertUserPreferenceInput } from './types/preference.types';

@Injectable()
export class PreferencesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDefaultPreferences(): Promise<DefaultPreferenceEntity[]> {
    const preferences = await this.prisma.defaultPreference.findMany({
      orderBy: [{ notificationType: 'asc' }, { channel: 'asc' }],
    });

    return preferences.map(toDefaultPreferenceEntity);
  }

  async findDefaultPreference(
    notificationType: DomainNotificationType,
    channel: DomainChannel,
  ): Promise<DefaultPreferenceEntity | null> {
    const preference = await this.prisma.defaultPreference.findUnique({
      where: {
        notificationType_channel: {
          notificationType: toPrismaNotificationType(notificationType),
          channel: toPrismaChannel(channel),
        },
      },
    });

    return preference ? toDefaultPreferenceEntity(preference) : null;
  }

  async findUserPreferences(userId: string): Promise<UserPreferenceEntity[]> {
    const preferences = await this.prisma.userPreference.findMany({
      where: { userId },
      orderBy: [{ notificationType: 'asc' }, { channel: 'asc' }],
    });

    return preferences.map(toUserPreferenceEntity);
  }

  async findUserPreference(
    userId: string,
    notificationType: DomainNotificationType,
    channel: DomainChannel,
  ): Promise<UserPreferenceEntity | null> {
    const preference = await this.prisma.userPreference.findUnique({
      where: {
        userId_notificationType_channel: {
          userId,
          notificationType: toPrismaNotificationType(notificationType),
          channel: toPrismaChannel(channel),
        },
      },
    });

    return preference ? toUserPreferenceEntity(preference) : null;
  }

  async findUserSettings(userId: string): Promise<UserSettingsEntity | null> {
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    return settings ? toUserSettingsEntity(settings) : null;
  }

  async findQuietHours(userId: string): Promise<QuietHoursEntity | null> {
    const quietHours = await this.prisma.quietHours.findUnique({
      where: { userId },
    });

    return quietHours ? toQuietHoursEntity(quietHours) : null;
  }

  async upsertUserPreference(input: UpsertUserPreferenceInput): Promise<UserPreferenceEntity> {
    const notificationType = toPrismaNotificationType(input.notificationType);
    const channel = toPrismaChannel(input.channel);

    const preference = await this.prisma.userPreference.upsert({
      where: {
        userId_notificationType_channel: {
          userId: input.userId,
          notificationType,
          channel,
        },
      },
      create: {
        userId: input.userId,
        notificationType,
        channel,
        enabled: input.enabled,
      },
      update: {
        enabled: input.enabled,
      },
    });

    return toUserPreferenceEntity(preference);
  }

  async upsertUserSettings(
    userId: string,
    optionalNotificationsEnabled: boolean,
  ): Promise<UserSettingsEntity> {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        optionalNotificationsEnabled,
      },
      update: {
        optionalNotificationsEnabled,
      },
    });

    return toUserSettingsEntity(settings);
  }

  async upsertQuietHours(input: UpsertQuietHoursInput): Promise<QuietHoursEntity> {
    const quietHours = await this.prisma.quietHours.upsert({
      where: { userId: input.userId },
      create: {
        userId: input.userId,
        enabled: input.enabled,
        startTime: input.startTime,
        endTime: input.endTime,
        timezone: input.timezone,
      },
      update: {
        enabled: input.enabled,
        startTime: input.startTime,
        endTime: input.endTime,
        timezone: input.timezone,
      },
    });

    return toQuietHoursEntity(quietHours);
  }
}
