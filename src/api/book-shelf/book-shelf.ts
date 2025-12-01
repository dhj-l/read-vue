import http from "../http";
import type { WorksListResponse } from "../works/type";
import type { RemoveFromShelfResponse, GetShelfWorksParams } from "./type";

// 获取书架书籍列表
export const getShelfWorksAPI = async (params: GetShelfWorksParams) => {
  return await http.get<WorksListResponse>("/book-shelf/works", { params });
};

// 从书架移除书籍
export const removeFromShelfAPI = async (workId: number) => {
  return await http.delete<RemoveFromShelfResponse>(
    `/book-shelf/works/${workId}`
  );
};

/**
 * 添加书籍进入书架
 */
export const addToShelfAPI = async (workId: number) => {
  return await http.post(`/book-shelf/works/${workId}`);
};
