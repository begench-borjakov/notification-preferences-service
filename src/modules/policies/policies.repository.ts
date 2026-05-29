import { Injectable } from '@nestjs/common';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../common/types/notification.types';
import { PrismaService } from '../../database/prisma.service';
import { GlobalPolicyEntity } from './entities/global-policy.entity';
import { toGlobalPolicyEntity } from './mappers/global-policy.mapper';
import {
  toPrismaChannel,
  toPrismaNotificationType,
  toPrismaPolicyAction,
  toPrismaRegion,
} from './mappers/policy-prisma.mapper';
import { UpsertGlobalPolicyInput } from './types/policy.types';

@Injectable()
export class PoliciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findGlobalPolicies(): Promise<GlobalPolicyEntity[]> {
    const policies = await this.prisma.globalPolicy.findMany({
      orderBy: [{ notificationType: 'asc' }, { channel: 'asc' }, { region: 'asc' }],
    });

    return policies.map(toGlobalPolicyEntity);
  }

  async findGlobalPolicy(
    notificationType: DomainNotificationType,
    channel: DomainChannel,
    region: DomainRegion,
  ): Promise<GlobalPolicyEntity | null> {
    const policy = await this.prisma.globalPolicy.findUnique({
      where: {
        notificationType_channel_region: {
          notificationType: toPrismaNotificationType(notificationType),
          channel: toPrismaChannel(channel),
          region: toPrismaRegion(region),
        },
      },
    });

    return policy ? toGlobalPolicyEntity(policy) : null;
  }

  async upsertGlobalPolicy(input: UpsertGlobalPolicyInput): Promise<GlobalPolicyEntity> {
    const notificationType = toPrismaNotificationType(input.notificationType);
    const channel = toPrismaChannel(input.channel);
    const region = toPrismaRegion(input.region);
    const action = toPrismaPolicyAction(input.action);
    const reason = input.reason ?? null;

    const policy = await this.prisma.globalPolicy.upsert({
      where: {
        notificationType_channel_region: {
          notificationType,
          channel,
          region,
        },
      },
      create: {
        notificationType,
        channel,
        region,
        action,
        reason,
        enabled: input.enabled,
      },
      update: {
        action,
        reason,
        enabled: input.enabled,
      },
    });

    return toGlobalPolicyEntity(policy);
  }
}
