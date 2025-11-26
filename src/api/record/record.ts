import http from "../http";
import type { RecordItem } from "./type";

/**
 * 获取个人对应书籍阅读记录
 */
export const getRecordAPI = async (workId: number) => {
  return await http.get<RecordItem>(`/record/${workId}`);
};
