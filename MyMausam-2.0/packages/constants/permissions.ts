export const PERMISSIONS = {
  VIEW_WEATHER: "view:weather",
  VIEW_RADAR: "view:radar",
  SUBMIT_CROWD_REPORT: "submit:crowd_report",
  BROADCAST_ALERT: "broadcast:alert",
  MANAGE_USERS: "manage:users",
  VIEW_ANALYTICS: "view:analytics",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
