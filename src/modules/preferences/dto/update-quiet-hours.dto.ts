import { IsBoolean, IsString, Matches } from 'class-validator';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateQuietHoursDto {
  @IsBoolean()
  enabled!: boolean;

  @IsString()
  @Matches(TIME_PATTERN)
  startTime!: string;

  @IsString()
  @Matches(TIME_PATTERN)
  endTime!: string;

  @IsString()
  timezone!: string;
}
