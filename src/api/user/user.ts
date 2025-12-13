import http from "../http";
import type { UserInfo, UserListParams, UserListResponse } from "./type";

/**
 * 获取用户列表
 * @param params
 * @returns
 */
export const getUserListAPI = async (params: Partial<UserListParams>) => {
  return await http.get<UserListResponse>("/user/all", {
    params,
  });
};

/**
 * 封禁用户
 * @param id
 * @returns
 */

export const banUserAPI = async (id: number) => {
  return await http.patch(`/user/disabled/${id}`);
};

/**
 * 解封用户
 * @param id
 * @returns
 */
export const unbanUserAPI = async (id: number) => {
  return await http.patch(`/user/unblock/${id}`);
};

/**
 * 分配角色
 * @param id
 * @param roles
 * @returns
 */
export const assignRolesAPI = async (id: number, roles: number[]) => {
  return await http.post(`/user/role/${id}`, roles);
};

/**
 * 获取个人信息
 */
export const getUserInfoAPI = async () => {
  return await http.get<UserInfo>("/user/info");
};

/**
 * 更新个人信息
 */
export const updateUserInfoAPI = async (data: Partial<UserInfo>) => {
  return await http.put<UserInfo>("/user/info", data);
};

/**
 * 修改密码
 */
export const updatePasswordAPI = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return await http.put("/user/password", data);
};

/**
 * 更新用户名
 */
export const updateUsernameAPI = async (username: string) => {
  return await http.put<UserInfo>("/user/username", { username });
};
