import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  logEvaluation(params: {
    userId: string;
    notificationType: string;
    channel: string;
    region: string;
    decision: string;
    reason: string;
  }): void {
    this.log(
      `userId=${params.userId} notificationType=${params.notificationType} channel=${params.channel} region=${params.region} decision=${params.decision} reason=${params.reason}`,
      'EvaluationService',
    );
  }

  logPreferencesUpdated(params: {
    userId: string;
    preferencesUpdated: number;
    settingsUpdated: boolean;
    quietHoursUpdated: boolean;
  }): void {
    this.log(
      `userId=${params.userId} preferencesUpdated=${params.preferencesUpdated} settingsUpdated=${params.settingsUpdated} quietHoursUpdated=${params.quietHoursUpdated}`,
      'PreferencesService',
    );
  }

  logGlobalPolicySaved(params: {
    notificationType: string;
    channel: string;
    region: string;
    action: string;
    enabled: boolean;
  }): void {
    this.log(
      `notificationType=${params.notificationType} channel=${params.channel} region=${params.region} action=${params.action} enabled=${params.enabled}`,
      'PoliciesService',
    );
  }

  warnMissingDefaultPreference(params: { notificationType: string; channel: string }): void {
    this.warn(
      `Missing default preference notificationType=${params.notificationType} channel=${params.channel}`,
      'EvaluationService',
    );
  }

  warnInvalidQuietHoursTimezone(params: { userId: string; timezone: string }): void {
    this.warn(
      `Invalid quiet hours timezone userId=${params.userId} timezone=${params.timezone}`,
      'EvaluationService',
    );
  }
}
