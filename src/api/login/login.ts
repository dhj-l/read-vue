import http from "../http";
import type {
  GetCodeParams,
  LoginParams,
  LoginResponse,
  RegisterParams,
} from "./type";

/**
 * 发送验证码
 */
export const getCodeAPI = async (params: GetCodeParams) => {
  return await http.post("/email/send-code", params);
};
/**
 * 注册
 */
export const registerAPI = async (params: RegisterParams) => {
  return await http.post("/user", params);
};

/**
 * 登录
 */
export const loginAPI = async (params: LoginParams) => {
  return await http.post<LoginResponse>("/user/login", params);
};
