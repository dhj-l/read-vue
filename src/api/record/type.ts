export interface RecordItem {
  id: number;
  user: {
    id: number;
    username: string;
  };
  work: RecordWork;
  chapter: RecordChapter;
  createTime: string;
  updateTime: string;
}

export interface RecordWork {
  id: number;
  title: string;
  cover_url: string;
}

export interface RecordChapter {
  id: number;
  name: string;
}
