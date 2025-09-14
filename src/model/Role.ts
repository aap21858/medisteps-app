export type Role = "ADMIN" | "RECEPTIONIST" | "DOCTOR" | "BILLING";

export enum RoleEnum {
    ADMIN = "ADMIN",
    RECEPTIONIST = "RECEPTIONIST",
    DOCTOR = "DOCTOR",
    BILLING = "BILLING",
}

export const ALL_ROLES: Role[] = Object.values(RoleEnum) as Role[];

export const isRole = (value: unknown): value is Role =>
  typeof value === "string" && ALL_ROLES.includes(value as Role);