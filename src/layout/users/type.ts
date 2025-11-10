import type { RoleItem } from "@/api/user/type";
import type { MessageType } from "element-plus";

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

export interface MessageProps {
  message: string;
  type?: MessageType;
  confirmText?: string;
  cancelText?: string;
  handle: () => Promise<void>;
}
