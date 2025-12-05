import type { WorksSearchQuery } from "@/layout/works/type";
import http from "../http";
import type {
  CreateWorkRequest,
  FindAllByUserParams,
  UpdateWorkRequest,
  Work,
  WorksListResponse,
} from "./type";

export const getWorksListAPI = async (params: Partial<WorksSearchQuery>) => {
  if (
    params.category_ids &&
    Array.isArray(params.category_ids) &&
    params.category_ids.length > 0
  ) {
    params.category_ids = params.category_ids.join(",");
  }

  return await http.get<WorksListResponse>("/works", {
    params,
  });
};

/**
 * 修改书籍
 */
export const updateWorkAPI = async (id: number, data: UpdateWorkRequest) => {
  return await http.patch(`/works/${id}`, data);
};

/**
 * 给书籍设置分类
 */

export const setWorkCategoryAPI = async (
  id: number,
  data: { categoryIds: number[] }
) => {
  return await http.patch(`/works/category/${id}`, data);
};

/**
 * 获取作品详情
 */
export const getWorkDetailAPI = async (id: number) => {
  return await http.get<Work>(`/works/${id}`);
};
/**
 * 获取个人所有书籍
 */
export const getWorksByUserAPI = async (params: FindAllByUserParams) => {
  return await http.get<WorksListResponse>("/works/all", {
    params,
  });
};

/**
 * 创建书籍接口
 */
export const createWorkAPI = async (params: CreateWorkRequest) => {
  if (
    params.category_ids &&
    Array.isArray(params.category_ids) &&
    params.category_ids.length > 0
  ) {
    params.category_ids = params.category_ids.join(",");
  }
  return await http.post<Work>("/works", params);
};
