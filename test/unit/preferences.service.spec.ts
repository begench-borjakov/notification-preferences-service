jest.mock('../../src/modules/preferences/preferences.repository', () => ({
  PreferencesRepository: class PreferencesRepository {},
}));

import { AppLoggerService } from '../../src/common/logger/logger.service';
import { DomainChannel, DomainNotificationType } from '../../src/common/types/notification.types';
import { PreferencesRepository } from '../../src/modules/preferences/preferences.repository';
import { PreferencesService } from '../../src/modules/preferences/preferences.service';

describe('PreferencesService', () => {
  let service: PreferencesService;

  const repository = {
    findUserPreferences: jest.fn(),
    findDefaultPreferences: jest.fn(),
    findUserSettings: jest.fn(),
    findQuietHours: jest.fn(),
    upsertUserPreference: jest.fn(),
    upsertUserSettings: jest.fn(),
    upsertQuietHours: jest.fn(),
  };

  const logger = {
    logPreferencesUpdated: jest.fn(),
  };

  const userId = 'user-1';

  beforeEach(() => {
    jest.clearAllMocks();

    service = new PreferencesService(
      repository as unknown as PreferencesRepository,
      logger as unknown as AppLoggerService,
    );

    repository.findUserPreferences.mockResolvedValue([]);
    repository.findDefaultPreferences.mockResolvedValue([]);
    repository.findUserSettings.mockResolvedValue(null);
    repository.findQuietHours.mockResolvedValue(null);
  });

  it('returns user preferences overview', async () => {
    repository.findUserPreferences.mockResolvedValueOnce([
      {
        id: 'pref-1',
        userId,
        notificationType: DomainNotificationType.MARKETING,
        channel: DomainChannel.EMAIL,
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    repository.findDefaultPreferences.mockResolvedValueOnce([
      {
        id: 'default-1',
        notificationType: DomainNotificationType.TRANSACTIONAL,
        channel: DomainChannel.EMAIL,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    repository.findUserSettings.mockResolvedValueOnce({
      id: 'settings-1',
      userId,
      optionalNotificationsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findQuietHours.mockResolvedValueOnce({
      id: 'quiet-1',
      userId,
      enabled: true,
      startTime: '22:00',
      endTime: '08:00',
      timezone: 'Europe/Istanbul',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.getUserPreferences(userId);

    expect(result.userId).toBe(userId);
    expect(result.preferences).toHaveLength(1);
    expect(result.defaultPreferences).toHaveLength(1);
    expect(result.settings?.optionalNotificationsEnabled).toBe(true);
    expect(result.quietHours?.timezone).toBe('Europe/Istanbul');

    expect(repository.findUserPreferences).toHaveBeenCalledWith(userId);
    expect(repository.findDefaultPreferences).toHaveBeenCalled();
    expect(repository.findUserSettings).toHaveBeenCalledWith(userId);
    expect(repository.findQuietHours).toHaveBeenCalledWith(userId);
  });

  it('updates preference items with upsert', async () => {
    await service.updateUserPreferences(userId, {
      preferences: [
        {
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: false,
        },
        {
          notificationType: DomainNotificationType.TRANSACTIONAL,
          channel: DomainChannel.SMS,
          enabled: true,
        },
      ],
    });

    expect(repository.upsertUserPreference).toHaveBeenCalledTimes(2);

    expect(repository.upsertUserPreference).toHaveBeenCalledWith({
      userId,
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
      enabled: false,
    });

    expect(repository.upsertUserPreference).toHaveBeenCalledWith({
      userId,
      notificationType: DomainNotificationType.TRANSACTIONAL,
      channel: DomainChannel.SMS,
      enabled: true,
    });
  });

  it('updates user settings when optionalNotificationsEnabled is provided', async () => {
    await service.updateUserPreferences(userId, {
      optionalNotificationsEnabled: false,
    });

    expect(repository.upsertUserSettings).toHaveBeenCalledWith(userId, false);
  });

  it('updates quiet hours when quietHours is provided', async () => {
    await service.updateUserPreferences(userId, {
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'Europe/Istanbul',
      },
    });

    expect(repository.upsertQuietHours).toHaveBeenCalledWith({
      userId,
      enabled: true,
      startTime: '22:00',
      endTime: '08:00',
      timezone: 'Europe/Istanbul',
    });
  });

  it('logs update summary', async () => {
    await service.updateUserPreferences(userId, {
      preferences: [
        {
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: false,
        },
      ],
      optionalNotificationsEnabled: true,
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'Europe/Istanbul',
      },
    });

    expect(logger.logPreferencesUpdated).toHaveBeenCalledWith({
      userId,
      preferencesUpdated: 1,
      settingsUpdated: true,
      quietHoursUpdated: true,
    });
  });

  it('uses idempotent upsert input for repeated same update', async () => {
    const dto = {
      preferences: [
        {
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: false,
        },
      ],
    };

    await service.updateUserPreferences(userId, dto);
    await service.updateUserPreferences(userId, dto);

    expect(repository.upsertUserPreference).toHaveBeenCalledTimes(2);

    expect(repository.upsertUserPreference).toHaveBeenNthCalledWith(1, {
      userId,
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
      enabled: false,
    });

    expect(repository.upsertUserPreference).toHaveBeenNthCalledWith(2, {
      userId,
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
      enabled: false,
    });
  });
});
