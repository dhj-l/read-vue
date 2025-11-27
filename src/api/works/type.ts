// 作品相关 API 类型定义

/**
 * 用户接口
 */
export interface User {
  id: number;
  username: string;
}

/**
 * 分类接口
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * 作品接口
 */
export interface Work {
  id: number;
  title: string;
  count: number;
  description: string;
  user: User;
  categorys: Category[];
  status: number;
  cover_url: string;
  chapterCount: number;
  readCount: number;
  createTime: string;
  updateTime: string;
}

/**
 * 作品列表响应接口
 */
export interface WorksListResponse {
  works: Work[];
  total: number;
}

/**
 * 创建/更新作品请求接口
 */
export interface CreateWorkRequest {
  title: string;
  description: string;
  category_ids: number[];
  status: number;
  cover_url?: string;
}

export interface UpdateWorkRequest {
  title?: string;
  description?: string;
  status?: number;
  cover_url?: string;
}
