import type { AddRoleRequest } from "@/api/role/type";

export type AddRolesType = "add" | "edit";
export interface AddRolesProps {
  type: AddRolesType;
  roleData?: AddRoleRequest;
  roleId?: number;
}

export interface AddRolesEmits {
  (e: "submit", data: AddRoleRequest): void;
  (e: "close"): void;
}
