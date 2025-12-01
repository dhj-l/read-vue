

// 移除书架响应
export interface RemoveFromShelfResponse {
  message: string;
}

//获取书架书籍列表参数
export interface GetShelfWorksParams {
  page: number;
  pageSize: number;
}