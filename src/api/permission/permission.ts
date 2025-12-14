import http from "../http";
import type { CreatePermissionRequest, GetPermissionsRequest, UpdatePermissionRequest } from "./type";

/**
 * 获取权限列表
 */
export const getPermissionsAPI = async (params: GetPermissionsRequest) => {
  return http.get("/permission", {
    params,
  });
};

/**
 * 添加权限
 */
export const createPermissionAPI = async (data: CreatePermissionRequest) => {
  return await http.post("/permission", data);
};

/**
 * 更新权限
 */
export const updatePermissionAPI = async (id: number, data: UpdatePermissionRequest) => {
  return await http.patch(`/permission/${id}`, data);
};

/**
 * 删除权限
 */
export const deletePermissionAPI = async (id: number) => {
  return await http.delete(`/permission/${id}`);
};
