export interface UserSettingsEntity {
  id: string;
  userId: string;
  optionalNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
