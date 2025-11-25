export interface ChapterWork {
  id: number;
  title: string;
  cover_url?: string;
}

export interface ChapterItem {
  id: number;
  name: string;
  status: number;
  count: number;
  work: ChapterWork;
  createTime: string;
  updateTime: string;
}

export interface ChapterListParams {
  page: number;
  pageSize: number;
  name?: string;
  status?: number;
  workId?: number;
  all?: number;
}

export interface ChapterListResponse {
  chapters: ChapterItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateChapterRequest {
  name: string;
  content: string;
}

export type UpdateChapterRequest = Partial<CreateChapterRequest>;
