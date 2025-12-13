import type { CategoryForm } from "@/layout/content/type";
import http from "../http";
import type {
  CategoryBookCount,
  CategoryListResponse,
  GetCategoryListParams,
} from "./type";

export const getCategoryListAPI = async (params: GetCategoryListParams) => {
  return await http.get<CategoryListResponse>("/category", {
    params,
  });
};

export const addCategoryAPI = async (data: CategoryForm) => {
  return await http.post("/category", data);
};

export const updateCategoryAPI = async (id: number, data: CategoryForm) => {
  return await http.patch(`/category/${id}`, data);
};

export const deleteCategoryAPI = async (id: number) => {
  return await http.delete(`/category/${id}`);
};

/**
 * 获取所有分类下书籍数量
 */

export const getCategoryBookCountAPI = async () => {
  return await http.get<CategoryBookCount[]>("/category/work-count");
};
