export interface QuietHoursEntity {
  id: string;
  userId: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
