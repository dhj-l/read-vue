import http from "../http";
import type { UserListParams } from "./type";

export const getUserListAPI = async (params: UserListParams) => {
  return await http.get("/user/all", {
    params,
  });
};
