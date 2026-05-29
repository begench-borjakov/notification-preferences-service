jest.mock('../../src/modules/policies/policies.service', () => ({
  PoliciesService: class PoliciesService {},
}));

jest.mock('../../src/modules/preferences/preferences.service', () => ({
  PreferencesService: class PreferencesService {},
}));

import { AppLoggerService } from '../../src/common/logger/logger.service';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../src/common/types/notification.types';
import { EvaluationRequestEntity } from '../../src/modules/evaluation/entities/evaluation-request.entity';
import {
  EvaluationDecision,
  EvaluationReason,
} from '../../src/modules/evaluation/entities/evaluation.types';
import { EvaluationService } from '../../src/modules/evaluation/evaluation.service';
import { PoliciesService } from '../../src/modules/policies/policies.service';
import { DomainPolicyAction } from '../../src/modules/policies/types/policy.types';
import { PreferencesService } from '../../src/modules/preferences/preferences.service';

describe('EvaluationService', () => {
  let service: EvaluationService;

  const preferencesService = {
    getUserPreferences: jest.fn(),
  };

  const policiesService = {
    findGlobalPolicy: jest.fn(),
  };

  const logger = {
    logEvaluation: jest.fn(),
    warnMissingDefaultPreference: jest.fn(),
    warnInvalidQuietHoursTimezone: jest.fn(),
  };

  const request: EvaluationRequestEntity = {
    userId: 'user-1',
    notificationType: DomainNotificationType.MARKETING,
    channel: DomainChannel.EMAIL,
    region: DomainRegion.EU,
    datetime: new Date('2026-05-21T21:30:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new EvaluationService(
      preferencesService as unknown as PreferencesService,
      policiesService as unknown as PoliciesService,
      logger as unknown as AppLoggerService,
    );

    policiesService.findGlobalPolicy.mockResolvedValue(null);

    preferencesService.getUserPreferences.mockResolvedValue({
      userId: request.userId,
      preferences: [],
      defaultPreferences: [
        {
          id: 'default-1',
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: null,
      quietHours: null,
    });
  });

  it('checks both request region and GLOBAL policy', async () => {
    await service.evaluate(request);

    expect(policiesService.findGlobalPolicy).toHaveBeenCalledWith(
      request.notificationType,
      request.channel,
      DomainRegion.EU,
    );

    expect(policiesService.findGlobalPolicy).toHaveBeenCalledWith(
      request.notificationType,
      request.channel,
      DomainRegion.GLOBAL,
    );
  });

  it('checks GLOBAL policy only once when request region is GLOBAL', async () => {
    await service.evaluate({
      ...request,
      region: DomainRegion.GLOBAL,
    });

    expect(policiesService.findGlobalPolicy).toHaveBeenCalledTimes(1);
    expect(policiesService.findGlobalPolicy).toHaveBeenCalledWith(
      request.notificationType,
      request.channel,
      DomainRegion.GLOBAL,
    );
  });

  it('denies when specific global policy denies notification', async () => {
    policiesService.findGlobalPolicy.mockResolvedValueOnce({
      id: 'policy-1',
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
      region: DomainRegion.EU,
      action: DomainPolicyAction.DENY,
      reason: null,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.BLOCKED_BY_GLOBAL_POLICY,
    });

    expect(preferencesService.getUserPreferences).not.toHaveBeenCalled();
  });

  it('denies when GLOBAL policy denies notification', async () => {
    policiesService.findGlobalPolicy.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 'policy-1',
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
      region: DomainRegion.GLOBAL,
      action: DomainPolicyAction.DENY,
      reason: null,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.BLOCKED_BY_GLOBAL_POLICY,
    });

    expect(preferencesService.getUserPreferences).not.toHaveBeenCalled();
  });

  it('does not deny when global policy is disabled', async () => {
    policiesService.findGlobalPolicy.mockResolvedValueOnce({
      id: 'policy-1',
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
      region: DomainRegion.EU,
      action: DomainPolicyAction.DENY,
      reason: null,
      enabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.ALLOW,
      reason: EvaluationReason.ALLOWED,
    });
  });

  it('denies when user preference is disabled', async () => {
    preferencesService.getUserPreferences.mockResolvedValueOnce({
      userId: request.userId,
      preferences: [
        {
          id: 'pref-1',
          userId: request.userId,
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      defaultPreferences: [],
      settings: null,
      quietHours: null,
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.DISABLED_BY_USER,
    });
  });

  it('denies when default preference is disabled', async () => {
    preferencesService.getUserPreferences.mockResolvedValueOnce({
      userId: request.userId,
      preferences: [],
      defaultPreferences: [
        {
          id: 'default-1',
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: null,
      quietHours: null,
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.DISABLED_BY_DEFAULT,
    });
  });

  it('denies when default preference is missing', async () => {
    preferencesService.getUserPreferences.mockResolvedValueOnce({
      userId: request.userId,
      preferences: [],
      defaultPreferences: [],
      settings: null,
      quietHours: null,
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.DISABLED_BY_DEFAULT,
    });

    expect(logger.warnMissingDefaultPreference).toHaveBeenCalledWith({
      notificationType: DomainNotificationType.MARKETING,
      channel: DomainChannel.EMAIL,
    });
  });

  it('denies non-critical notification when optional notifications are disabled', async () => {
    preferencesService.getUserPreferences.mockResolvedValueOnce({
      userId: request.userId,
      preferences: [],
      defaultPreferences: [
        {
          id: 'default-1',
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: {
        id: 'settings-1',
        userId: request.userId,
        optionalNotificationsEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quietHours: null,
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.NOTIFICATIONS_DISABLED_BY_USER,
    });
  });

  it('denies marketing notification during quiet hours', async () => {
    preferencesService.getUserPreferences.mockResolvedValueOnce({
      userId: request.userId,
      preferences: [],
      defaultPreferences: [
        {
          id: 'default-1',
          notificationType: DomainNotificationType.MARKETING,
          channel: DomainChannel.EMAIL,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: null,
      quietHours: {
        id: 'quiet-1',
        userId: request.userId,
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'Europe/Istanbul',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.DENY,
      reason: EvaluationReason.QUIET_HOURS,
    });
  });

  it('allows security notification during quiet hours', async () => {
    const securityRequest: EvaluationRequestEntity = {
      ...request,
      notificationType: DomainNotificationType.SECURITY,
    };

    preferencesService.getUserPreferences.mockResolvedValueOnce({
      userId: request.userId,
      preferences: [],
      defaultPreferences: [
        {
          id: 'default-1',
          notificationType: DomainNotificationType.SECURITY,
          channel: DomainChannel.EMAIL,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: {
        id: 'settings-1',
        userId: request.userId,
        optionalNotificationsEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quietHours: {
        id: 'quiet-1',
        userId: request.userId,
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'Europe/Istanbul',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const result = await service.evaluate(securityRequest);

    expect(result).toEqual({
      decision: EvaluationDecision.ALLOW,
      reason: EvaluationReason.ALLOWED,
    });
  });

  it('allows notification when no rule blocks it', async () => {
    const result = await service.evaluate(request);

    expect(result).toEqual({
      decision: EvaluationDecision.ALLOW,
      reason: EvaluationReason.ALLOWED,
    });
  });

  it('logs final evaluation result', async () => {
    await service.evaluate(request);

    expect(logger.logEvaluation).toHaveBeenCalledWith({
      userId: request.userId,
      notificationType: request.notificationType,
      channel: request.channel,
      region: request.region,
      decision: EvaluationDecision.ALLOW,
      reason: EvaluationReason.ALLOWED,
    });
  });
});
