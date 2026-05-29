import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../common/logger/logger.service';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../common/types/notification.types';
import { CreateGlobalPolicyDto } from './dto/create-global-policy.dto';
import { GlobalPolicyEntity } from './entities/global-policy.entity';
import { PoliciesRepository } from './policies.repository';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly policiesRepository: PoliciesRepository,
    private readonly logger: AppLoggerService,
  ) {}

  async findGlobalPolicies(): Promise<GlobalPolicyEntity[]> {
    return this.policiesRepository.findGlobalPolicies();
  }

  async findGlobalPolicy(
    notificationType: DomainNotificationType,
    channel: DomainChannel,
    region: DomainRegion,
  ): Promise<GlobalPolicyEntity | null> {
    return this.policiesRepository.findGlobalPolicy(notificationType, channel, region);
  }

  async saveGlobalPolicy(dto: CreateGlobalPolicyDto): Promise<GlobalPolicyEntity> {
    const policy = await this.policiesRepository.upsertGlobalPolicy({
      notificationType: dto.notificationType,
      channel: dto.channel,
      region: dto.region,
      action: dto.action,
      reason: dto.reason,
      enabled: dto.enabled,
    });

    this.logger.logGlobalPolicySaved({
      notificationType: dto.notificationType,
      channel: dto.channel,
      region: dto.region,
      action: dto.action,
      enabled: dto.enabled,
    });

    return policy;
  }
}
