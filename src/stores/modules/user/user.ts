import { defineStore } from "pinia";
import type { LoginParams } from "../../../api/login/type";
import { loginAPI } from "@/api/login/login";

export const useUserStore = defineStore("user", () => {
  const login = async (params: LoginParams) => {
    const { access_token } = (await loginAPI(params)).data;
    if (access_token) {
      localStorage.setItem("token", access_token);
    }
  };

  return {
    login,
  };
});
