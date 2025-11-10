import axios from "axios";
import emitter from "@/utils/eventEmitter";
const http = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1",
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
    // 处理401情况，去除token并且跳转到登录页
    if (response.status === 401) {
      emitter.emit("noAuth");
      // 返回一个resolved的promise，阻止错误继续传播
      return Promise.resolve({ data: null });
    } else {
      emitter.emit("requestError", response?.data?.message || "请求失败");
      return Promise.reject(error);
    }
  }
);

export default http;
