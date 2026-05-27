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

export const Region = {
  GLOBAL: 'GLOBAL',
  EU: 'EU',
  US: 'US',
  TR: 'TR',
} as const;

export type Region = (typeof Region)[keyof typeof Region];

export const PolicyAction = {
  ALLOW: 'ALLOW',
  DENY: 'DENY',
} as const;

export type PolicyAction = (typeof PolicyAction)[keyof typeof PolicyAction];

export class PrismaClient {
  async $connect(): Promise<void> {}

  async $disconnect(): Promise<void> {}
}
