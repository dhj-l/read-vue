// 权限列表请求参数
export interface GetPermissionsRequest {
  page?: number;
  pageSize?: number;
  name?: string;
}

// 权限项
export interface PermissionItem {
  id: number;
  name: string;
  value: string;
  description: string;
  createTime: string;
  updateTime: string;
}

// 权限列表响应
export interface GetPermissionsResponse {
  permissions: PermissionItem[];
  total: number;
  page: number;
  pageSize: number;
}

// 创建权限请求
export interface CreatePermissionRequest {
  name: string;
  value: string;
  description: string;
}

// 更新权限请求
export interface UpdatePermissionRequest {
  name: string;
  value: string;
  description: string;
}
