import http from "../http";
import type {
  ChapterCheckListParams,
  ChapterCheckListResponse,
  UpdateChapterCheckRequest,
} from "./type";

export const getChapterChecksAPI = async (
  params: Partial<ChapterCheckListParams>
) => {
  return await http.get<ChapterCheckListResponse>("/chapter-check", { params });
};

export const updateChapterCheckAPI = async (
  id: number,
  data: UpdateChapterCheckRequest
) => {
  return await http.patch(`/chapter-check/${id}`, data);
};