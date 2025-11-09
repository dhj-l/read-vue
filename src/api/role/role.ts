import http from "../http";
import type { AddRoleRequest, RoleListParams, RolesResponse } from "./type";

export const getRolesAPI = async (params: RoleListParams) => {
  return http.get<RolesResponse>("/role", {
    params,
  });
};

/**
 * 添加角色
 */
export const addRoleAPI = async (data: AddRoleRequest) => {
  return await http.post("/role", data);
};

/**
 * 更新角色
 */
export const updateRoleAPI = async (id: number, data: AddRoleRequest) => {
  return await http.patch(`/role/${id}`, data);
};

/**
 * 删除角色
 */
export const deleteRoleAPI = async (id: number) => {
  return await http.delete(`/role/${id}`);
};
