import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { UpdatePreferenceItemDto } from './update-preference-item.dto';
import { UpdateQuietHoursDto } from './update-quiet-hours.dto';

export class UpdateUserPreferencesDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdatePreferenceItemDto)
  preferences?: UpdatePreferenceItemDto[];

  @IsOptional()
  @IsBoolean()
  optionalNotificationsEnabled?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateQuietHoursDto)
  quietHours?: UpdateQuietHoursDto;
}
