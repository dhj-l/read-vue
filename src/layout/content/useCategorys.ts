import { computed, ref, type ComponentInstance } from "vue";
import type { ButtonConfig, CategoryForm } from "./type";
import {
  addCategoryAPI,
  deleteCategoryAPI,
  getCategoryListAPI,
  updateCategoryAPI,
} from "@/api/category/category";
import type { Category } from "@/api/category/type";
import type { ElForm } from "element-plus";
import emitter from "@/utils/eventEmitter";
import { messageHandle } from "../users/config";

export const useCategorys = () => {
  // 响应式数据
  const loading = ref(false);
  const formRef = ref<ComponentInstance<typeof ElForm>>();
  const currentId = ref<number | null>(null);
  // 操作按钮配置
  const btnConfig = ref<ButtonConfig[]>([
    {
      label: "编辑",
      props: { type: "primary", link: true },
      click: (row: Category) => handleEdit(row),
    },
    {
      label: "详情",
      props: { type: "info", link: true },
      click: (row: Category) => handleDetail(row),
    },
    {
      label: "删除",
      props: { type: "danger", link: true },
      click: (row: Category) => {
        messageHandle({
          type: "warning",
          message: "确定删除分类吗？",
          handle: () => handleDelete(row),
        });
      },
    },
  ]);
  const searchKeyword = ref("");
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const categories = ref<Category[]>([]);
  const drawer = ref(false);
  const open = ref(false);
  const formData = ref<CategoryForm>({
    name: "",
    description: "",
  });
  const currentCategoryId = ref<number | null>(null);

  // 计算属性
  const drawerTitle = computed(() => {
    return currentCategoryId.value ? "编辑分类" : "新增分类";
  });

  const rules = ref({
    name: [
      { required: true, message: "请输入分类名称", trigger: "blur" },
      {
        min: 2,
        max: 10,
        message: "分类名称长度必须在 2 到 10 个字符之间",
        trigger: "blur",
      },
    ],
    description: [
      { required: true, message: "请输入分类描述", trigger: "blur" },
      {
        min: 2,
        max: 200,
        message: "分类描述长度必须在 2 到 200 个字符之间",
        trigger: "blur",
      },
    ],
  });

  const getCategories = async () => {
    loading.value = true;
    try {
      const res = await getCategoryListAPI({
        page: page.value,
        pageSize: pageSize.value,
        name: searchKeyword.value,
      });
      const { categories: categoryList, total: totalCount } = res.data;
      categories.value = categoryList;
      total.value = totalCount;
    } finally {
      loading.value = false;
    }
  };

  // 重置搜索条件
  const reset = () => {
    searchKeyword.value = "";
    page.value = 1;
    getCategories();
  };

  // 打开新增分类抽屉
  const handleAdd = () => {
    drawer.value = true;
  };

  const handleClose = () => {
    drawer.value = false;
    formRef.value?.resetFields();
    currentCategoryId.value = null;
    formData.value = {
      name: "",
      description: "",
    };
  };
  const handleDetail = (row: Category) => {
    currentId.value = row.id;
    open.value = true;
  };
  // 编辑分类
  const handleEdit = (row: Category) => {
    drawer.value = true;
    currentCategoryId.value = row.id;
    formData.value = {
      name: row.name,
      description: row.description,
    };
  };

  // 删除分类
  const handleDelete = async (row: Category) => {
    await deleteCategoryAPI(row.id);
    emitter.emit("message", {
      type: "success",
      content: "删除分类成功",
    });
    getCategories();
  };

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate();
    if (!currentCategoryId.value) {
      // 新增分类
      await addCategoryAPI(formData.value);
      emitter.emit("message", {
        type: "success",
        content: "新增分类成功",
      });
    } else {
      // 编辑分类
      await updateCategoryAPI(currentCategoryId.value, formData.value);
      emitter.emit("message", {
        type: "success",
        content: "编辑分类成功",
      });
    }
    handleClose();
    getCategories();
  };

  return {
    loading,
    btnConfig,
    searchKeyword,
    page,
    pageSize,
    total,
    categories,
    drawer,
    formData,
    drawerTitle,
    rules,
    formRef,
    open,
    currentId,
    getCategories,
    reset,
    handleAdd,
    handleSubmit,
    handleClose,
  };
};
