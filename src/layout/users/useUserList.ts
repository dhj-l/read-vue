import { getUserListAPI } from "@/api/user/user";
import { ref } from "vue";

export const useUserList = () => {
  // 搜索关键词
  const searchKeyword = ref("");
  // 分页数据
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);

  /**
   * 获取用户列表
   */
  const getUserList = async () => {
    const res = await getUserListAPI({
      page: page.value,
      pageSize: pageSize.value,
      username: searchKeyword.value,
    });
    console.log(res, "res");
  };

  return {
    searchKeyword,
    page,
    pageSize,
    total,
    getUserList,
  };
};
