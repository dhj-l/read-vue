import { uploadImageAPI } from "@/api/upload/upload";
import type { UploadImageResponse } from "@/api/upload/type";

export const uploadFile = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await uploadImageAPI(formData);
  return res.data;
};
