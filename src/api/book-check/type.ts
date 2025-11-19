export interface BookCheckUser {
  id: number;
  username: string;
  email: string;
}

export interface BookCheckWork {
  id: number;
  title: string;
  status: number;
  cover_url: string;
  description?: string;
  count?: number;
}

export interface BookCheckItem {
  id: number;
  status: number;
  createTime: string;
  updateTime: string;
  user: BookCheckUser;
  work: BookCheckWork;
}

export interface BookCheckListParams {
  page: number;
  pageSize: number;
  status?: number;
  userId?: number;
  workId?: number;
}

export interface BookCheckListResponse {
  data: BookCheckItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateBookCheckRequest {
  status: number;
}