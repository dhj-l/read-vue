// Banner状态枚举
export enum BannerStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  ALL = 2,
}

// Banner数据类型
export interface Banner {
  id: number;
  imgUrl: string;
  title?: string;
  status: BannerStatus;
  createdAt?: string;
  updatedAt?: string;
}

// 创建Banner请求数据类型
export interface CreateBannerRequest {
  imgUrl: string;
  title?: string;
  status?: BannerStatus;
}

// 更新Banner请求数据类型
export interface UpdateBannerRequest {
  imgUrl?: string;
  title?: string;
  status?: BannerStatus;
}

// 更新Banner状态请求数据类型
export interface UpdateBannerStatusRequest {
  status: BannerStatus;
}

// Banner列表响应数据类型
export interface BannerListResponse {
  list: Banner[];
  total: number;
}

export interface FindAllBannerParams {
  status?: BannerStatus;
  page?: number;
  pageSize?: number;
}
