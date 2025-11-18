import { computed, ref } from "vue";
import emitter from "@/utils/eventEmitter";
import { messageHandle } from "../users/config";
import {
  getBookChecksAPI,
  getBookCheckDetailAPI,
  updateBookCheckAPI,
} from "@/api/book-check/book-check";
import type {
  BookCheckItem,
  BookCheckListParams,
} from "@/api/book-check/type";
import { getUserListAPI } from "@/api/user/user";
import { getWorksListAPI } from "@/api/works/works";
import type { ButtonConfig } from "@/layout/content/type";

interface ButtonConfigWithVisible<T = BookCheckItem> extends ButtonConfig<T> {
  visible?: (row: T) => boolean;
}

export const useBookChecks = () => {
  const loading = ref(false);
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const list = ref<BookCheckItem[]>([]);

  const status = ref<number | undefined>();
  const userId = ref<number | undefined>();
  const workId = ref<number | undefined>();

  const userOptions = ref<{ label: string; value: number }[]>([]);
  const workOptions = ref<{ label: string; value: number }[]>([]);
  const remoteUsersLoading = ref(false);
  const remoteWorksLoading = ref(false);

  const statusText = (s: number) => {
    if (s === 0) return "待审核";
    if (s === 1) return "审核通过";
    if (s === 2) return "审核拒绝";
    return "未知";
  };

  const statusTagType = (s: number) => {
    if (s === 0) return "info";
    if (s === 1) return "success";
    if (s === 2) return "danger";
    return "default";
  };

  const workStatusText = (s?: number) => {
    if (s === 1) return "已发布";
    if (s === 5) return "审核失败";
    return "未上架";
  };

  const getBookChecks = async () => {
    loading.value = true;
    try {
      const params: Partial<BookCheckListParams> = {
        page: page.value,
        pageSize: pageSize.value,
        status: status.value,
        userId: userId.value,
        workId: workId.value,
      };
      const res = await getBookChecksAPI(params);
      list.value = (res as any)?.data?.data ?? [];
      total.value = (res as any)?.data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    status.value = undefined;
    userId.value = undefined;
    workId.value = undefined;
    page.value = 1;
    pageSize.value = 10;
    getBookChecks();
  };

  const approve = async (id: number) => {
    await updateBookCheckAPI(id, { status: 1 });
    emitter.emit("message", { type: "success", content: "审核通过" });
    getBookChecks();
  };

  const reject = async (id: number) => {
    await updateBookCheckAPI(id, { status: 2 });
    emitter.emit("message", { type: "success", content: "已拒绝" });
    getBookChecks();
  };

  const btnApprove: ButtonConfigWithVisible<BookCheckItem> = {
    label: "通过",
    props: { link: true, type: "success" },
    visible: (row: BookCheckItem) => row.status === 0,
    click: (row: BookCheckItem) =>
      messageHandle({
        type: "warning",
        message: `确定通过对《${row.work?.title}》的审核吗？`,
        handle: () => approve(row.id),
      }),
  };

  const btnReject: ButtonConfigWithVisible<BookCheckItem> = {
    label: "拒绝",
    props: { link: true, type: "danger" },
    visible: (row: BookCheckItem) => row.status === 0,
    click: (row: BookCheckItem) =>
      messageHandle({
        type: "warning",
        message: `确定拒绝对《${row.work?.title}》的审核吗？`,
        handle: () => reject(row.id),
      }),
  };

  const drawer = ref(false);
  const detail = ref<BookCheckItem | null>(null);
  const detailTitle = computed(() =>
    detail.value?.work?.title ? `审核详情 - ${detail.value.work.title}` : "审核详情"
  );

  const openDetail = async (row: BookCheckItem) => {
    const res = await getBookCheckDetailAPI(row.id);
    detail.value = (res as any)?.data as BookCheckItem;
    drawer.value = true;
  };

  const btnDetail: ButtonConfigWithVisible<BookCheckItem> = {
    label: "详情",
    props: { link: true, type: "info" },
    click: (row: BookCheckItem) => openDetail(row),
  };

  const btnConfig = ref<ButtonConfigWithVisible<BookCheckItem>[]>([
    btnApprove,
    btnReject,
    btnDetail,
  ]);

  const remoteUsers = async (keyword: string) => {
    remoteUsersLoading.value = true;
    try {
      if (!keyword) {
        userOptions.value = [];
        return;
      }
      const { data } = await getUserListAPI({ page: 1, pageSize: 10, username: keyword });
      if (data) {
        userOptions.value = (data.users ?? []).map((u) => ({ label: u.username, value: u.id }));
      }
    } finally {
      remoteUsersLoading.value = false;
    }
  };

  const remoteWorks = async (keyword: string) => {
    remoteWorksLoading.value = true;
    try {
      if (!keyword) {
        workOptions.value = [];
        return;
      }
      const res = await getWorksListAPI({ page: 1, pageSize: 10, title: keyword, status: 0, username: "", count: 0, category_ids: [] });
      workOptions.value = (res as any)?.data?.works?.map((w: any) => ({ label: w.title, value: w.id })) ?? [];
    } finally {
      remoteWorksLoading.value = false;
    }
  };

  return {
    loading,
    page,
    pageSize,
    total,
    list,
    status,
    userId,
    workId,
    userOptions,
    workOptions,
    remoteUsersLoading,
    remoteWorksLoading,
    getBookChecks,
    reset,
    btnApprove,
    btnReject,
    btnDetail,
    btnConfig,
    drawer,
    detail,
    detailTitle,
    remoteUsers,
    remoteWorks,
    statusText,
    statusTagType,
    workStatusText,
  };
};