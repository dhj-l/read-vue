import { getChapterListAPI } from "../chapter/chapter";

export const getChapterListMethod = async (workId: number) => {
  return await getChapterListAPI({ workId, status: 1, all: 1 });
};
