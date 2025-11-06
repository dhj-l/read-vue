export interface UserListParams {
  page: number;
  pageSize: number;
  username?: string;
  status?: UserStatus;
}

export interface UserItem {
  id: number;
  username: string;
  roles: RoleItem[];
  avatar_url: string;
  email: string;
  createTime: string;
  updateTime: string;
  status: UserStatus;
}
export enum UserStatus {
  Active = "active",
  Disabled = "disabled",
}
export interface RoleItem {
  createTime: string;
  id: number;
  name: string;
  updateTime: string;
  value: string;
}
export interface UserListResponse {
  page: number;
  pageSize: number;
  total: number;
  users: UserItem[];
}
