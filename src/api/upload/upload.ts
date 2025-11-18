import http from "../http";
import type { UploadImageResponse } from "./type";

/**
 * 上传图片
 */
export const uploadImageAPI = async (data: FormData) => {
  return await http.post<UploadImageResponse>("/upload", data);
};
