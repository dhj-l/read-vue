import { ref } from "vue";
import { removeFromShelfAPI } from "@/api/book-shelf/book-shelf";
import emitter from "@/utils/eventEmitter";
import { messageHandle } from "@/layout/users/config";
import { useBookShelfStore } from "@/stores/modules/book-shelf/book-shelf";

export const useShelf = () => {
  const { getBookShelfList, removeFromShelf } = useBookShelfStore();

  const loading = ref(false);
  const page = ref(1);
  const pageSize = ref(10);
  // 获取书架列表
  const getShelfList = async () => {
    try {
      loading.value = true;
      await getBookShelfList({
        page: page.value,
        pageSize: pageSize.value,
      });
    } finally {
      loading.value = false;
    }
  };

  // 从书架移除书籍
  const removeFromShelfHadnle = async (workId: number) => {
    messageHandle({
      type: "warning",
      message: "确定要从书架移除这本书吗？",
      handle: async () => {
        await removeFromShelf(workId);
        emitter.emit("message", {
          type: "success",
          content: "移除成功",
        });
        await getShelfList();
      },
    });
  };

  return {
    loading,
    page,
    pageSize,
    getShelfList,
    removeFromShelfHadnle,
  };
};
