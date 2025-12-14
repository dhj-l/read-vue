import type { PermissionItem } from "@/api/permission/type";

// 表格列配置类型
export interface TableColumns {
  prop: keyof PermissionItem | "actions";
  label: string;
  align?: "left" | "center" | "right";
  width?: number;
  fixed?: "left" | "right";
}

// 添加/编辑权限类型
export type AddPermissionType = "add" | "edit";
