export interface WorksSearchConfigItem {
  key: keyof WorksSearchQuery;
  component: string;
  props?: any;
}

export interface WorksSearchQuery {
  title: string;
  category_ids: number[];
  status: number;
  username: string;
  count: number;
  page: number;
  pageSize: number;
}
