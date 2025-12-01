import type { Category } from "@/api/category/type";

export interface WorksSearchConfigItem {
  key: keyof WorksSearchQuery;
  component: string;
  props?: any;
}

export enum SortOrder {
  NEW = "new",
  HOT = "hot",
  COUNT = "count",
}

export interface WorksSearchQuery {
  title: string;
  category_ids: number[] | string;
  status: number;
  username: string;
  count: number;
  page: number;
  pageSize: number;
  order: SortOrder;
}

export interface CheckCategoriesProps {
  categories: { id: number; name: string }[];
  open: boolean;
}
export interface CheckCategoriesEmits {
  (e: "change", categories: Category[]): void;
}
