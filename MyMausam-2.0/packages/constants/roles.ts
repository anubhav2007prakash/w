export const USER_ROLES = {
  CITIZEN: "citizen",
  FARMER: "farmer",
  AVIATOR: "aviator",
  MARINER: "mariner",
  DISASTER_OFFICIAL: "disaster_official",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
