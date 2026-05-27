export const NotificationType = {
  MARKETING: 'MARKETING',
  TRANSACTIONAL: 'TRANSACTIONAL',
  SECURITY: 'SECURITY',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const Channel = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
  MESSENGER: 'MESSENGER',
} as const;

export type Channel = (typeof Channel)[keyof typeof Channel];

export class PrismaClient {
  async $connect(): Promise<void> {}

  async $disconnect(): Promise<void> {}
}
