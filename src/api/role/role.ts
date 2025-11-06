import http from "../http";
import type { RoleListParams, RolesResponse } from "./type";

export const getRolesAPI = async (params: RoleListParams) => {
  return http.get<RolesResponse>("/role", {
    params,
  });
};
