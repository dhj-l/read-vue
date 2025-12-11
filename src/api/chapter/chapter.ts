import http from "../http";
import type {
  ChapterListParams,
  ChapterListResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
  ChapterItem,
} from "./type";

export const getChapterListAPI = async (params: Partial<ChapterListParams>) => {
  return await http.get<ChapterListResponse>("/chapter", { params });
};

export const getChapterDetailAPI = async (id: number) => {
  return await http.get<ChapterItem>(`/chapter/${id}`);
};

export const createChapterAPI = async (
  workId: number,
  data: CreateChapterRequest
) => {
  return await http.post<{ id: number }>(`/chapter/${workId}`, data);
};

export const updateChapterAPI = async (
  id: number,
  data: UpdateChapterRequest
) => {
  return await http.patch(`/chapter/${id}`, data);
};

export const deleteChapterAPI = async (id: number) => {
  return await http.delete(`/chapter/${id}`);
};

/**
 * 发布章节
 */
export const publishChapterAPI = async (id: number) => {
  return await http.patch(`/chapter/${id}/pending`);
};
