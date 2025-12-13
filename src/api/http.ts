import axios from "axios";
import emitter from "@/utils/eventEmitter";
import { API_BASE_URL_V1 } from "@/config/config";
import { getItem } from "@/utils/storage";
const http = axios.create({
  baseURL: API_BASE_URL_V1,
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => {
    const token = getItem("token", false);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    emitter.emit("requestError", error.message || "请求失败");
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const { response } = error;
    // 处理网络错误（无响应情况）
    if (!response) {
      emitter.emit("requestError", "网络错误，无法连接到服务器");
      return Promise.reject(error);
    }
    // 处理401情况，去除token并且跳转到登录页
    if (response.status === 401) {
      emitter.emit("noAuth");
      // 返回一个resolved的promise，阻止错误继续传播
      return Promise.resolve({ data: null });
    } else {
      if (Array.isArray(response?.data?.message)) {
        emitter.emit("requestError", response?.data?.message[0] || "请求失败");
      } else {
        emitter.emit("requestError", response?.data?.message || "请求失败");
      }
      return Promise.reject(error);
    }
  }
);

export default http;
