import { ref, computed, type ComponentInstance } from "vue";
import type { ElForm } from "element-plus";
import emitter from "@/utils/eventEmitter";
import { messageHandle } from "@/layout/users/config";
import type { ButtonConfig } from "@/layout/content/type";
import {
  getChapterListAPI,
  getChapterDetailAPI,
  updateChapterAPI,
  deleteChapterAPI,
} from "@/api/chapter/chapter";
import type { ChapterItem, CreateChapterRequest } from "@/api/chapter/type";
import { getWorksListAPI, getWorkDetailAPI } from "@/api/works/works";
import { watch } from "vue";

interface ButtonConfigWithVisible<T = ChapterItem> extends ButtonConfig<T> {
  visible?: (row?: T) => boolean;
}

export const useChapters = () => {
  const loading = ref(false);
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const list = ref<ChapterItem[]>([]);

  const name = ref("");
  const status = ref<number | undefined>();
  const workId = ref<number | undefined>();

  const drawer = ref(false);
  const detailDrawer = ref(false);
  const detail = ref<ChapterItem | null>(null);
  const formRef = ref<ComponentInstance<typeof ElForm>>();
  const formData = ref<CreateChapterRequest>({
    name: "",
    content: "",
    contentHtml: "",
  });
  const currentChapterId = ref<number | null>(null);
  // 编辑不允许修改所属作品，不再记录 currentWorkId

  const userWorksOptions = ref<{ label: string; value: number }[]>([]);
  const worksLoading = ref(false);

  const rules = ref({
    name: [
      { required: true, message: "请输入章节名称", trigger: "blur" },
      { min: 1, max: 30, message: "章节名称长度 1-30", trigger: "blur" },
    ],
    content: [
      { required: true, message: "请输入章节内容", trigger: "blur" },
      { min: 1, message: "章节内容不能为空", trigger: "blur" },
    ],
  });

  const drawerTitle = computed(() =>
    currentChapterId.value ? "编辑章节" : "新增章节"
  );
  const detailTitle = computed(() =>
    detail.value?.name ? `章节详情 - ${detail.value.name}` : "章节详情"
  );

  const statusText = (s?: number) => {
    if (s === -1) return "未发布";
    if (s === 0) return "待审核";
    if (s === 1) return "已上架";
    if (s === 2) return "已下架";
    return "未知";
  };

  const statusTagType = (s?: number) => {
    if (s === -1) return "danger";
    if (s === 0) return "info";
    if (s === 1) return "success";
    if (s === 2) return "warning";
    return "default";
  };

  const getChapters = async () => {
    loading.value = true;
    try {
      const res = await getChapterListAPI({
        page: page.value,
        pageSize: pageSize.value,
        name: name.value,
        status: status.value,
        workId: workId.value,
      });
      const payload = (res as any)?.data;
      list.value = payload?.chapters ?? [];
      total.value = payload?.total ?? 0;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    name.value = "";
    status.value = undefined;
    workId.value = undefined;
    page.value = 1;
    getChapters();
  };

  // 不提供新增章节能力

  const handleEdit = (row: ChapterItem) => {
    currentChapterId.value = row.id;
    formData.value = {
      name: row.name,
      content: row.content,
      contentHtml: row.contentHtml,
    };
    drawer.value = true;
  };

  const handleClose = () => {
    drawer.value = false;
    formRef.value?.resetFields();
    currentChapterId.value = null;
    formData.value = { name: "", content: "", contentHtml: "" };
  };

  const handleSubmit = async () => {
    await formRef.value?.validate();
    if (!currentChapterId.value) {
      emitter.emit("message", {
        type: "warning",
        content: "请选择要编辑的章节",
      });
      return;
    }
    await updateChapterAPI(currentChapterId.value, formData.value);
    emitter.emit("message", { type: "success", content: "编辑章节成功" });
    handleClose();
    getChapters();
  };

  const handleDetail = async (row: ChapterItem) => {
    const res = await getChapterDetailAPI(row.id);
    const payload = (res as any)?.data as ChapterItem;
    detail.value = payload;
    detailDrawer.value = true;
  };

  const handleDelete = async (row: ChapterItem) => {
    await deleteChapterAPI(row.id);
    emitter.emit("message", { type: "success", content: "删除章节成功" });
    getChapters();
  };

  const btnConfig = ref<ButtonConfigWithVisible<ChapterItem>[]>([
    {
      label: "编辑",
      props: { type: "primary", link: true },
      click: (row: ChapterItem) => handleEdit(row),
    },
    {
      label: "详情",
      props: { type: "info", link: true },
      click: (row: ChapterItem) => handleDetail(row),
    },
    {
      label: "删除",
      props: { type: "danger", link: true },
      click: (row: ChapterItem) =>
        messageHandle({
          type: "warning",
          message: "确定删除该章节吗？",
          handle: () => handleDelete(row),
        }),
    },
  ]);

  const remoteWorks = async (keyword: string) => {
    worksLoading.value = true;
    try {
      const res = await getWorksListAPI({
        page: 1,
        pageSize: 10,
        title: keyword ?? "",
        username: "",
        category_ids: [],
      });
      userWorksOptions.value =
        (res as any)?.data?.works?.map((w: any) => ({
          label: w.title,
          value: w.id,
        })) ?? [];
    } finally {
      worksLoading.value = false;
    }
  };

  const ensureWorkOption = async (id?: number) => {
    if (!id) return;
    const exists = userWorksOptions.value.some((o) => o.value === id);
    if (exists) return;
    try {
      const res = await getWorkDetailAPI(id);
      const work = res.data;
      if (work?.id && work?.title) {
        userWorksOptions.value = [
          { label: work.title, value: work.id },
          ...userWorksOptions.value,
        ];
      }
    } catch {}
  };

  watch(workId, (id) => {
    ensureWorkOption(id);
  });

  // 不允许编辑所属作品，移除 currentWorkId 监听

  return {
    loading,
    page,
    pageSize,
    total,
    list,
    name,
    status,
    workId,
    getChapters,
    reset,
    drawer,
    detailDrawer,
    formData,
    formRef,
    rules,
    drawerTitle,
    detail,
    detailTitle,
    handleEdit,
    handleSubmit,
    handleClose,
    btnConfig,
    remoteWorks,
    userWorksOptions,
    worksLoading,
    statusText,
    statusTagType,
  };
};
