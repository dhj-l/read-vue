import http from "../http";
import type {
  Banner,
  BannerListResponse,
  CreateBannerRequest,
  FindAllBannerParams,
  UpdateBannerRequest,
  UpdateBannerStatusRequest,
} from "./type";

// 获取banner列表
export const getBannerListAPI = async (params?: FindAllBannerParams) => {
  return await http.get<BannerListResponse>("/banner/list", {
    params,
  });
};

// 获取单个banner详情
export const getBannerDetailAPI = async (id: number) => {
  return await http.get<Banner>(`/banner/${id}`);
};

// 创建banner
export const createBannerAPI = async (data: CreateBannerRequest) => {
  return await http.post("/banner", data);
};

// 更新banner
export const updateBannerAPI = async (
  id: number,
  data: UpdateBannerRequest
) => {
  return await http.patch(`/banner/${id}`, data);
};

// 更新banner状态
export const updateBannerStatusAPI = async (
  id: number,
  data: UpdateBannerStatusRequest
) => {
  return await http.patch(`/banner/${id}/status`, data);
};

// 删除banner
export const deleteBannerAPI = async (id: number) => {
  return await http.delete(`/banner/${id}`);
};
