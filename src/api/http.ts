import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";
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
    ElMessage.error("请求失败");
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
      localStorage.removeItem("token");
      // 使用 await 确保路由跳转完成
      await router.push("/login");
      ElMessage.error("登录过期，请重新登录");
      // 返回一个resolved的promise，阻止错误继续传播
      return Promise.resolve({ data: null });
    } else {
      ElMessage.error(response?.data?.message || "请求失败");
      return Promise.reject(error);
    }
  }
);

export default http;
