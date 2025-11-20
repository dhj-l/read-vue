export interface ChapterCheckUser {
  id: number;
  username: string;
}

export interface ChapterCheckWork {
  id: number;
  title: string;
}

export interface ChapterCheckChapter {
  id: number;
  name: string;
  status: number;
  work: ChapterCheckWork;
  content?: string;
}

export interface ChapterCheckItem {
  id: number;
  user: ChapterCheckUser;
  chapter: ChapterCheckChapter;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface ChapterCheckListParams {
  page?: number;
  pageSize?: number;
  status?: number;
}

export interface ChapterCheckListResponse {
  data: ChapterCheckItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateChapterCheckRequest {
  status: number;
}