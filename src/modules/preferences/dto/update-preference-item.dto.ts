import { IsBoolean, IsEnum } from 'class-validator';
import { DomainChannel, DomainNotificationType } from '../../../common/types/notification.types';

export class UpdatePreferenceItemDto {
  @IsEnum(DomainNotificationType)
  notificationType!: DomainNotificationType;

  @IsEnum(DomainChannel)
  channel!: DomainChannel;

  @IsBoolean()
  enabled!: boolean;
}
