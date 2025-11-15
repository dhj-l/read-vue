import { ref, computed } from "vue";
import { countOptions, statusOptions } from "./config";
import type { WorksSearchConfigItem, WorksSearchQuery } from "./type";
import { getUserListAPI } from "@/api/user/user";

export const useWorks = () => {
  const worksSearchQuery = ref<WorksSearchQuery>({
    title: "",
    category_ids: [],
    status: -1,
    username: "",
    count: -1,
    page: 1,
    pageSize: 10,
  });

  const userOptions = ref<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const getUserList = async (value: string) => {
    const res = await getUserListAPI({
      username: value,
    });
    userOptions.value = res.data.users.map((item) => {
      return {
        label: item.username,
        value: item.username,
      };
    });
  };

  const worksSearchConfig = computed<WorksSearchConfigItem[]>(() => [
    {
      key: "title",
      component: "el-input",
      props: {
        placeholder: "请输入作品名称",
        style: {
          width: "250px",
        },
      },
    },
    {
      key: "username",
      component: "el-select",
      props: {
        placeholder: "请输入作者名称",
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: async (value: string) => {
          await getUserList(value);
        },
        options: userOptions.value,
        style: {
          width: "250px",
        },
      },
    },
    {
      key: "count",
      component: "el-select",
      props: {
        placeholder: "请选择作品字数范围",
        style: {
          width: "250px",
        },
        options: countOptions,
      },
    },
    {
      key: "category_ids",
      component: "el-select",
      props: {
        placeholder: "请选择分类",
        style: {
          width: "250px",
        },
      },
    },
    {
      key: "status",
      component: "el-select",
      props: {
        placeholder: "请选择状态",
        style: {
          width: "250px",
        },
        options: statusOptions,
      },
    },
  ]);

  return {
    worksSearchConfig,
    worksSearchQuery,
  };
};
