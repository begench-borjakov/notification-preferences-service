import type { QuietHours } from '../../../../generated/prisma/client';
import { QuietHoursEntity } from '../entities/quiet-hours.entity';

export const toQuietHoursEntity = (quietHours: QuietHours): QuietHoursEntity => ({
  id: quietHours.id,
  userId: quietHours.userId,
  enabled: quietHours.enabled,
  startTime: quietHours.startTime,
  endTime: quietHours.endTime,
  timezone: quietHours.timezone,
  createdAt: quietHours.createdAt,
  updatedAt: quietHours.updatedAt,
});
