export const ROLES = ["user", "creator", "admin", "finance"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
}
