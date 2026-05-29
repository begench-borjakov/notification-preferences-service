import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  DomainChannel,
  DomainNotificationType,
  DomainRegion,
} from '../../../common/types/notification.types';

export class EvaluateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(DomainNotificationType)
  notificationType!: DomainNotificationType;

  @IsEnum(DomainChannel)
  channel!: DomainChannel;

  @IsEnum(DomainRegion)
  region!: DomainRegion;

  @IsDateString()
  datetime!: string;
}
