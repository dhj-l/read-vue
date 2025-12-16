import { ref, type ComponentInstance } from "vue";
import { ElMessageBox } from "element-plus";
import type { Banner } from "@/api/banner/type";
import {
  getBannerListAPI,
  updateBannerStatusAPI,
  deleteBannerAPI,
} from "@/api/banner/banner";
import emitter from "@/utils/eventEmitter";
import type BannerEditDialog from "./components/banner-edit-dialog.vue";

export const useBanner = () => {
  // 轮播图列表
  const bannerList = ref<Banner[]>([]);
  // 加载状态
  const loading = ref<boolean>(false);
  // 对话框可见性
  const dialogVisible = ref<boolean>(false);
  // 当前编辑的轮播图
  const currentBanner = ref<Banner | undefined>();
  // 编辑对话框引用
  const bannerEditDialogRef = ref<ComponentInstance<typeof BannerEditDialog>>();

  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);

  // 获取轮播图列表
  const getBannerList = async () => {
    try {
      loading.value = true;
      const res = await getBannerListAPI({
        status: 2,
        page: page.value,
        pageSize: pageSize.value,
      });
      bannerList.value = res.data.list || [];
      total.value = res.data.total || 0;
    } finally {
      loading.value = false;
    }
  };

  // 打开添加轮播图对话框
  const handleAddBanner = () => {
    currentBanner.value = undefined;
    dialogVisible.value = true;
  };

  // 打开编辑轮播图对话框
  const handleEditBanner = (banner: Banner) => {
    currentBanner.value = banner;
    dialogVisible.value = true;
  };

  // 切换轮播图状态（上下架）
  const handleToggleStatus = async (banner: Banner) => {
    const newStatus = banner.status === 1 ? 0 : 1;
    await updateBannerStatusAPI(banner.id, { status: newStatus });
    emitter.emit("message", {
      type: "success",
      content: newStatus === 1 ? "轮播图已上架" : "轮播图已下架",
    });
    getBannerList();
  };

  // 删除轮播图
  const handleDeleteBanner = async (banner: Banner) => {
    try {
      await ElMessageBox.confirm("确定要删除这个轮播图吗？", "确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      await deleteBannerAPI(banner.id);

      emitter.emit("message", { type: "success", content: "轮播图删除成功" });
      getBannerList();
    } catch (error: any) {
      if (error !== "cancel") {
        console.error("删除轮播图失败:", error);
        emitter.emit("message", { type: "error", content: "删除轮播图失败" });
      }
    }
  };

  return {
    bannerList,
    loading,
    dialogVisible,
    currentBanner,
    bannerEditDialogRef,
    total,
    page,
    pageSize,
    getBannerList,
    handleAddBanner,
    handleEditBanner,
    handleToggleStatus,
    handleDeleteBanner,
  };
};
