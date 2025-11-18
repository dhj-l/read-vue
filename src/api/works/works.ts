import type { WorksSearchQuery } from "@/layout/works/type";
import http from "../http";
import type { UpdateWorkRequest, WorksListResponse } from "./type";

export const getWorksListAPI = async (params: Partial<WorksSearchQuery>) => {
  if (
    params.category_ids &&
    Array.isArray(params.category_ids) &&
    params.category_ids.length > 0
  ) {
    params.category_ids = params.category_ids.join(",");
  }
  console.log(params);

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
