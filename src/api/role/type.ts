import type { RoleItem } from "../user/type";

export interface RolesResponse {
  roles: RoleItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RoleListParams {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface AddRoleRequest {
  id?: number;
  name: string;
  value: string;
}

/**
 * 分配权限请求
 */
export interface AssignPermissionRequest {
  roleId: number;
  permissionIds: number[];
}
