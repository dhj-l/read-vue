import type { CreatePermissionRequest, UpdatePermissionRequest } from "@/api/permission/type";
import type { AddPermissionType } from "../type";

// 添加/编辑权限组件属性
export interface AddPermissionProps {
  type?: AddPermissionType;
  permissionData?: CreatePermissionRequest | UpdatePermissionRequest;
  permissionId?: number;
}

// 添加/编辑权限组件事件
export interface AddPermissionEmits {
  (e: "submit", data: CreatePermissionRequest | UpdatePermissionRequest): void;
  (e: "close"): void;
}
