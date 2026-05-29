import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';
import { DomainPolicyAction } from '../types/policy.types';

export class CreateGlobalPolicyDto {
  @IsEnum(DomainNotificationType)
  notificationType!: DomainNotificationType;

  @IsEnum(DomainChannel)
  channel!: DomainChannel;

  @IsEnum(DomainRegion)
  region!: DomainRegion;

  @IsEnum(DomainPolicyAction)
  action!: DomainPolicyAction;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason?: string;

  @IsBoolean()
  enabled!: boolean;
}
