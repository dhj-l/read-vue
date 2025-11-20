import { ref } from "vue";
import emitter from "@/utils/eventEmitter";
import { messageHandle } from "@/layout/users/config";
import type { TableColumns } from "@/layout/users/type";
import type { ButtonConfig } from "@/layout/content/type";
import {
  getChapterChecksAPI,
  updateChapterCheckAPI,
} from "@/api/chapter-check/chapter-check";
import type { ChapterCheckItem } from "@/api/chapter-check/type";
import { getChapterDetailAPI } from "@/api/chapter/chapter";

interface ButtonConfigWithVisible<T = ChapterCheckItem>
  extends ButtonConfig<T> {
  visible?: (row: T) => boolean;
}

export const useChapterChecks = () => {
  const loading = ref(false);
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const list = ref<ChapterCheckItem[]>([]);
  const status = ref<number | undefined>();

  const drawer = ref(false);
  const detail = ref<ChapterCheckItem | null>(null);
  const detailTitle = ref("章节审核详情");

  const tableColumns: TableColumns[] = [
    { prop: "id", label: "ID", align: "center", width: 80 },
    { prop: "user", label: "用户", align: "center", minWidth: 160 },
    { prop: "chapter", label: "章节", align: "center", minWidth: 220 },
    { prop: "status", label: "审核状态", align: "center", width: 120 },
    { prop: "createTime", label: "提交时间", align: "center", width: 140 },
    { prop: "updateTime", label: "更新时间", align: "center", width: 140 },
    {
      prop: "actions",
      label: "操作",
      align: "center",
      fixed: "right",
      minWidth: 220,
    },
  ];

  const statusText = (s?: number) => {
    if (s === 0) return "待审核";
    if (s === 1) return "审核通过";
    if (s === 2) return "审核拒绝";
    return "未知";
  };

  const statusTagType = (s?: number) => {
    if (s === 0) return "info";
    if (s === 1) return "success";
    if (s === 2) return "danger";
    return "default";
  };

  const getChapterChecks = async () => {
    loading.value = true;
    try {
      const res = await getChapterChecksAPI({
        page: page.value,
        pageSize: pageSize.value,
        status: status.value,
      });
      const raw = res as any;
      const payload = raw?.code === 200 ? raw.data : raw;
      list.value = payload?.data ?? [];
      total.value = payload?.total ?? 0;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    status.value = undefined;
    page.value = 1;
    getChapterChecks();
  };

  const handleDetail = async (row: ChapterCheckItem) => {
    const res = await getChapterDetailAPI(row.chapter.id);
    const chapter = (res as any)?.data;
    detail.value = { ...row, chapter };
    detailTitle.value = `章节详情 - ${chapter?.name ?? ""}`;
    drawer.value = true;
  };

  const handleApprove = async (row: ChapterCheckItem) => {
    await updateChapterCheckAPI(row.id, { status: 1 });
    emitter.emit("message", { type: "success", content: "审核通过" });
    getChapterChecks();
  };

  const handleReject = async (row: ChapterCheckItem) => {
    await updateChapterCheckAPI(row.id, { status: 2 });
    emitter.emit("message", { type: "success", content: "审核拒绝" });
    getChapterChecks();
  };

  const btnConfig = ref<ButtonConfigWithVisible<ChapterCheckItem>[]>([
    {
      label: "通过",
      props: { type: "success", link: true },
      visible: (row) => row.status === 0,
      click: (row) =>
        messageHandle({
          type: "warning",
          message: "确定通过该章节审核吗？",
          handle: () => handleApprove(row),
        }),
    },
    {
      label: "拒绝",
      props: { type: "danger", link: true },
      visible: (row) => row.status === 0,
      click: (row) =>
        messageHandle({
          type: "warning",
          message: "确定拒绝该章节审核吗？",
          handle: () => handleReject(row),
        }),
    },
    {
      label: "详情",
      props: { type: "info", link: true },
      click: (row) => handleDetail(row),
    },
  ]);

  return {
    loading,
    page,
    pageSize,
    total,
    list,
    status,
    getChapterChecks,
    reset,
    btnConfig,
    tableColumns,
    drawer,
    detail,
    detailTitle,
    statusText,
    statusTagType,
  };
};
