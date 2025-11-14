export interface GetCategoryListParams {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  works: number;
  createTime: string;
  updateTime: string;
}
export interface CategoryListResponse {
  categories: Category[];
  total: number;
}
