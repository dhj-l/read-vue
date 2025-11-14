// 分类相关类型定义

import type { Category } from "@/api/category/type";

export interface CategoryForm {
  name: string;
  description: string;
}

export interface ButtonConfig {
  label: string;
  props: any;
  click: (row: Category) => void;
}
