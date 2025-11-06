import type { RoleItem } from "@/api/user/type";

export interface TableColumns {
  prop: string;
  label: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  minWidth?: string | number;
}

export interface CheckRolesProps {
  roles: RoleItem[];
  open: boolean;
}
export interface CheckRolesEmits {
  (e: "change", roles: RoleItem[]): void;
}
