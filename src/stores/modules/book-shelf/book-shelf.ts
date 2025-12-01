import {
  addToShelfAPI,
  getShelfWorksAPI,
  removeFromShelfAPI,
} from "@/api/book-shelf/book-shelf";
import type { GetShelfWorksParams } from "@/api/book-shelf/type";
import type { Work } from "@/api/works/type";
import { getItem, setItem } from "@/utils/storage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBookShelfStore = defineStore("bookShelf", () => {
  const bookShelfList = ref<Work[]>(getItem<Work[]>("bookShelfList") || []);
  const total = ref(0);
  const getBookShelfList = async (parmas: GetShelfWorksParams) => {
    const res = await getShelfWorksAPI(parmas);
    bookShelfList.value = res.data.works;
    total.value = res.data.total;
    setItem("bookShelfList", bookShelfList.value);
  };
  /**
   * 判断书籍是否在书架中
   */
  const isInShelf = (id: number) => {
    return bookShelfList.value.findIndex((item) => item.id === id) !== -1;
  };
  /**
   * 将当前书籍添加到书架中
   */
  const addToShelf = async (workId: number) => {
    await addToShelfAPI(workId);
    getBookShelfList({ page: 1, pageSize: 10 });
  };

  const removeFromShelf = async (workId: number) => {
    await removeFromShelfAPI(workId);
    getBookShelfList({ page: 1, pageSize: 10 });
  };
  return {
    bookShelfList,
    total,
    getBookShelfList,
    isInShelf,
    addToShelf,
    removeFromShelf,
  };
});
