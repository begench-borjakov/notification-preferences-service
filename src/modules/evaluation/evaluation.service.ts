import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { AppLoggerService } from '../../common/logger/logger.service';
import { DomainNotificationType, DomainRegion } from '../../common/types/notification.types';
import { PoliciesService } from '../policies/policies.service';
import { DomainPolicyAction } from '../policies/types/policy.types';
import { QuietHoursEntity } from '../preferences/entities/quiet-hours.entity';
import { PreferencesService } from '../preferences/preferences.service';
import { EvaluationRequestEntity } from './entities/evaluation-request.entity';
import { EvaluationResultEntity } from './entities/evaluation-result.entity';
import { EvaluationDecision, EvaluationReason } from './entities/evaluation.types';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly preferencesService: PreferencesService,
    private readonly policiesService: PoliciesService,
    private readonly logger: AppLoggerService,
  ) {}

  async evaluate(request: EvaluationRequestEntity): Promise<EvaluationResultEntity> {
    const policyRequests = [
      this.policiesService.findGlobalPolicy(
        request.notificationType,
        request.channel,
        request.region,
      ),
    ];

    if (request.region !== DomainRegion.GLOBAL) {
      policyRequests.push(
        this.policiesService.findGlobalPolicy(
          request.notificationType,
          request.channel,
          DomainRegion.GLOBAL,
        ),
      );
    }

    const policies = await Promise.all(policyRequests);

    const denyPolicy = policies.find(
      (policy) => policy?.enabled && policy.action === DomainPolicyAction.DENY,
    );

    if (denyPolicy) {
      return this.finish(request, this.deny(EvaluationReason.BLOCKED_BY_GLOBAL_POLICY));
    }

    const overview = await this.preferencesService.getUserPreferences(request.userId);

    const userPreference = overview.preferences.find(
      (preference) =>
        preference.notificationType === request.notificationType &&
        preference.channel === request.channel,
    );

    if (userPreference?.enabled === false) {
      return this.finish(request, this.deny(EvaluationReason.DISABLED_BY_USER));
    }

    if (!userPreference) {
      const defaultPreference = overview.defaultPreferences.find(
        (preference) =>
          preference.notificationType === request.notificationType &&
          preference.channel === request.channel,
      );

      if (!defaultPreference) {
        this.logger.warnMissingDefaultPreference({
          notificationType: request.notificationType,
          channel: request.channel,
        });

        return this.finish(request, this.deny(EvaluationReason.DISABLED_BY_DEFAULT));
      }

      if (!defaultPreference.enabled) {
        return this.finish(request, this.deny(EvaluationReason.DISABLED_BY_DEFAULT));
      }
    }

    const isNonCritical = this.isNonCriticalNotificationType(request.notificationType);

    if (isNonCritical && overview.settings?.optionalNotificationsEnabled === false) {
      return this.finish(request, this.deny(EvaluationReason.NOTIFICATIONS_DISABLED_BY_USER));
    }

    if (
      isNonCritical &&
      overview.quietHours?.enabled &&
      this.isInsideQuietHours(request.userId, request.datetime, overview.quietHours)
    ) {
      return this.finish(request, this.deny(EvaluationReason.QUIET_HOURS));
    }

    return this.finish(request, this.allow());
  }

  private allow(): EvaluationResultEntity {
    return {
      decision: EvaluationDecision.ALLOW,
      reason: EvaluationReason.ALLOWED,
    };
  }

  private deny(reason: EvaluationReason): EvaluationResultEntity {
    return {
      decision: EvaluationDecision.DENY,
      reason,
    };
  }

  private finish(
    request: EvaluationRequestEntity,
    result: EvaluationResultEntity,
  ): EvaluationResultEntity {
    this.logger.logEvaluation({
      userId: request.userId,
      notificationType: request.notificationType,
      channel: request.channel,
      region: request.region,
      decision: result.decision,
      reason: result.reason,
    });

    return result;
  }

  private isNonCriticalNotificationType(notificationType: DomainNotificationType): boolean {
    return notificationType === DomainNotificationType.MARKETING;
  }

  private isInsideQuietHours(
    userId: string,
    datetime: Date,
    quietHours: QuietHoursEntity,
  ): boolean {
    const localDateTime = DateTime.fromJSDate(datetime, {
      zone: 'utc',
    }).setZone(quietHours.timezone);

    if (!localDateTime.isValid) {
      this.logger.warnInvalidQuietHoursTimezone({
        userId,
        timezone: quietHours.timezone,
      });

      return false;
    }

    const currentMinutes = localDateTime.hour * 60 + localDateTime.minute;
    const startMinutes = this.toMinutes(quietHours.startTime);
    const endMinutes = this.toMinutes(quietHours.endTime);

    if (startMinutes === endMinutes) {
      return false;
    }

    if (startMinutes < endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }

    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }
}
