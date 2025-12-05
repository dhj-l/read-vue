import type { Work } from "@/api/works/type";
import type { SortOrder } from "@/layout/works/type";
import type { LibrarySort } from "@/views/library/type";

export interface BookListProps {
  sortConfig: LibrarySort[];
  workList: Work[];
  cardType: "plan" | "detail";
  showTotal: boolean;
}

export interface BookListEmits {
  (e: "change", params: BookListChangeParams): void;
}

export interface BookListChangeParams {
  page: number;
  pageSize: number;
  sort: SortOrder;
}
