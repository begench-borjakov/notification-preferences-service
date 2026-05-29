export enum EvaluationDecision {
  ALLOW = 'allow',
  DENY = 'deny',
}

export enum EvaluationReason {
  ALLOWED = 'allowed',
  BLOCKED_BY_GLOBAL_POLICY = 'blocked_by_global_policy',
  NOTIFICATIONS_DISABLED_BY_USER = 'notifications_disabled_by_user',
  QUIET_HOURS = 'quiet_hours',
  DISABLED_BY_USER = 'disabled_by_user',
  DISABLED_BY_DEFAULT = 'disabled_by_default',
}
