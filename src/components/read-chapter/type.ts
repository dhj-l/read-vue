import type { ChapterItem } from "@/api/chapter/type";

export interface ReadChapterProps {
  chapter: ChapterItem;
  chapterList: ChapterItem[];
}
export interface ReadChapterEmits {
  (event: "change", value: number): void;
}
