import { defineStore } from "pinia";
import type { LoginParams } from "../../../api/login/type";
import { loginAPI } from "@/api/login/login";
import { computed, ref } from "vue";
import type { UserInfo } from "@/api/user/type";
import {
  getUserInfoAPI,
  updateUserInfoAPI,
  updatePasswordAPI,
  updateUsernameAPI,
} from "@/api/user/user";
import { getItem, setItem } from "@/utils/storage";
import emitter from "@/utils/eventEmitter";

export const useUserStore = defineStore("user", () => {
  const userInfo = computed(() => {
    return getItem<UserInfo>("userInfo");
  });
  const login = async (params: LoginParams) => {
    const { access_token } = (await loginAPI(params)).data;
    if (access_token) {
      setItem<string>("token", access_token);
    }
    getUserInfo();
  };
  const logout = () => {
    emitter.emit("logout");
  };
  const getUserInfo = async () => {
    const res = await getUserInfoAPI();
    if (res.data) {
      setItem<UserInfo>("userInfo", res.data);
    } else {
      emitter.emit("noAuth");
    }
  };
  const updateUserInfo = async (data: Partial<UserInfo>) => {
    const res = await updateUserInfoAPI(data);
    if (res.data) {
      setItem<UserInfo>("userInfo", res.data);
      return res.data;
    }
    throw new Error("更新用户信息失败");
  };
  const updatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return await updatePasswordAPI(data);
  };
  const updateUsername = async (username: string) => {
    const res = await updateUsernameAPI(username);
    if (res.data) {
      setItem<UserInfo>("userInfo", res.data);
      return res.data;
    }
    throw new Error("更新用户名失败");
  };
  return {
    login,
    getUserInfo,
    updateUserInfo,
    updatePassword,
    updateUsername,
    userInfo,
    logout,
  };
});
