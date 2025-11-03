import axios from "axios";
import { ElMessage } from "element-plus";
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
  (error) => {
    const { response } = error;
    console.log(response, "123123123");

    ElMessage.error(response?.data?.message || "请求失败");
    return Promise.reject(error);
  }
);

export default http;
