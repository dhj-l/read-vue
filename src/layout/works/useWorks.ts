import { ref, computed, type ComponentInstance } from "vue";
import { countOptions, statusOptions } from "./config";
import { SortOrder, type WorksSearchConfigItem, type WorksSearchQuery } from "./type";
import { getUserListAPI } from "@/api/user/user";
import { getCategoryListAPI } from "@/api/category/category";
import type { ButtonConfig } from "../content/type";
import type { Work } from "@/api/works/type";
import type WorkList from "./components/workList.vue";
import { setWorkCategoryAPI } from "@/api/works/works";
import type { Category } from "@/api/category/type";
import emitter from "@/utils/eventEmitter";

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
  const categoryIds = ref<number[]>([]);
  const workListRef = ref<ComponentInstance<typeof WorkList>>();
  const open = ref<boolean>(false);
  const userOptions = ref<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const categoryOptions = ref<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const currentWork = ref<Work>({} as Work);
  const drawer = ref<boolean>(false);
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

  const getCategoryList = async (value: string) => {
    const res = await getCategoryListAPI({
      name: value,
    });
    categoryOptions.value = res.data.categories.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  };

  const searchWorks = () => {
    workListRef.value?.getWorkList(worksSearchQuery.value);
  };
  const resetWorksSearchQuery = () => {
    worksSearchQuery.value = {
      title: "",
      category_ids: [],
      status: -1,
      username: "",
      count: -1,
      page: 1,
      pageSize: 10,
    };
    workListRef.value?.getWorkList(worksSearchQuery.value);
  };
  const handleSave = async () => {
    drawer.value = false;

    await handleSetCategories(currentWork.value.id, categoryIds.value);
    workListRef.value?.getWorkList(worksSearchQuery.value);
  };
  const worksSearchConfig = computed<WorksSearchConfigItem[]>(() => [
    {
      key: "title",
      component: "el-input",
      props: {
        placeholder: "请输入作品名称",
        clearable: true,
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
        multiple: true,
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: async (value: string) => {
          await getCategoryList(value);
        },
        options: categoryOptions.value,
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
  const handleCheckedCategoriesChange = (categories: Category[]) => {
    categoryIds.value = categories.map((item) => item.id);
  };
  const handleSetCategories = async (id: number, categories: number[]) => {
    await setWorkCategoryAPI(id, {
      categoryIds: categories,
    });
    emitter.emit("message", {
      type: "success",
      content: "设置成功",
    });
  };
  const btnConfig = ref<ButtonConfig<Work>[]>([
    {
      label: "编辑",
      props: { type: "primary", link: true },
      click: (row: Work) => {
        open.value = true;
        currentWork.value = row;
      },
    },
    {
      label: "设置分类",
      props: { type: "info", link: true },
      click: (row: Work) => {
        drawer.value = true;
        currentWork.value = row;
      },
    },
  ]);

  return {
    worksSearchConfig,
    worksSearchQuery,
    btnConfig,
    workListRef,
    open,
    searchWorks,
    currentWork,
    drawer,
    resetWorksSearchQuery,
    categoryOptions,
    getCategoryList,
    handleSave,
    handleCheckedCategoriesChange,
  };
};
