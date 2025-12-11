<template>
  <div
    class="w-full h-full rounded-xl px-10 py-5 bg-white flex flex-col items-center"
  >
    <div class="w-full py-5">
      <div class="w-full h-[60px] flex items-center justify-between mb-5">
        <h1 class="text-2xl font-bold text-gray-900">我的作品</h1>
        <el-button type="primary" @click="openCreateDialog = true">
          新建作品
        </el-button>
      </div>

      <WorkDialog
        v-model:open="openCreateDialog"
        mode="create"
        @submit="handleWorkSubmit"
      />
      <WorkDialog
        v-model:open="openEditDialog"
        mode="edit"
        :work="currentWork"
        @submit="handleWorkSubmit"
      />

      <div class="w-full min-h-[500px]" v-loading="loading">
        <template v-if="workList.length > 0">
          <el-collapse v-model="activePanels" class="work-collapse">
            <el-collapse-item
              v-for="item in workList"
              :key="item.id"
              :name="item.id"
            >
              <template #title>
                <div class="relative">
                  <BookCardDetail :work="item" :border="false" shadow />
                  <div class="absolute right-6 top-4 flex space-x-2">
                    <el-button
                      type="primary"
                      size="small"
                      @click.stop="handleEditClick(item)"
                    >
                      作品修改
                    </el-button>
                    <el-button
                      type="info"
                      size="small"
                      @click.stop="handleChapterManage(item)"
                    >
                      章节管理
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      @click.stop="handleReviewClick(item)"
                      v-if="item.status === WorkStatus.REJECTED"
                    >
                      再次审核
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="status-panel">
                <div class="flex items-center mb-4">
                  <h3 class="text-lg font-semibold text-gray-700">状态进度</h3>
                  <el-tag
                    class="ml-4"
                    :type="workStatusMap.get(item.status)?.type || 'info'"
                    effect="plain"
                    size="small"
                  >
                    {{ workStatusMap.get(item.status)?.label || "未知状态" }}
                  </el-tag>
                </div>
                <el-steps
                  class="status-steps"
                  :active="getActiveStep(item.status)"
                  finish-status="success"
                  align-center
                >
                  <el-step
                    v-for="step in statusSteps"
                    :key="step.value"
                    :title="step.label"
                    :status="getStepStatus(step.value, item.status)"
                  />
                </el-steps>
              </div>
            </el-collapse-item>
          </el-collapse>
        </template>
        <el-empty v-else description="暂无作品">
          <el-button type="warning" @click="openCreateDialog = true">
            去写作
          </el-button>
        </el-empty>
      </div>

      <div class="w-full flex justify-center mt-10" v-if="workList.length > 0">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          layout="prev, pager, next"
          :hide-on-single-page="hidePagination"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import BookCardDetail from "@/components/book-card-detail/book-card-detail.vue";
import WorkDialog from "./components/work-dialog.vue";
import type { Work } from "@/api/works/type";
import {
  getWorksByUserAPI,
  setWorkCategoryAPI,
  updateWorkAPI,
} from "@/api/works/works";
import { WorkStatus, workStatusMap } from "@/layout/works/config";
import emitter from "@/utils/eventEmitter";
import { useRouter } from "vue-router";
import { messageHandle } from "../../../layout/users/config";
import { rejectBookCheckAPI } from "@/api/book-check/book-check";
const router = useRouter();
const loading = ref(false);
const workList = ref<Work[]>([]);
const activePanels = ref<(number | string)[]>([]);
const page = ref(1);
const pageSize = ref(5);
const total = ref(0);

// 对话框控制
const openCreateDialog = ref(false);
const openEditDialog = ref(false);
const currentWork = ref<Work | null>(null);

const statusSteps = computed(() =>
  [
    WorkStatus.UNPUBLISHED,
    WorkStatus.PUBLISHED,
    WorkStatus.SERIAL,
    WorkStatus.ENDED,
    WorkStatus.UNLISTED,
    WorkStatus.REJECTED,
  ]
    .map((status) => ({
      value: status,
      label: workStatusMap.get(status)?.label ?? "",
    }))
    .filter((step) => step.label)
);

const hidePagination = computed(() => total.value <= pageSize.value);

const getActiveStep = (status: number) => {
  return statusSteps.value.findIndex((step) => step.value === status);
};

const getStepStatus = (stepValue: number, workStatus: number) => {
  const stepIndex = statusSteps.value.findIndex(
    (step) => step.value === stepValue
  );
  const activeIndex = getActiveStep(workStatus);
  if (stepIndex === -1 || activeIndex === -1) {
    return "wait";
  }
  if (workStatus === WorkStatus.REJECTED && stepValue === WorkStatus.REJECTED) {
    return "error";
  }
  if (stepIndex < activeIndex) {
    return "success";
  }
  if (stepIndex === activeIndex) {
    return workStatus === WorkStatus.REJECTED ? "error" : "process";
  }
  return "wait";
};

const getWorkList = async () => {
  try {
    loading.value = true;
    const res = await getWorksByUserAPI({
      page: page.value,
      pageSize: pageSize.value,
    });
    workList.value = res.data.works;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (current: number) => {
  page.value = current;
  getWorkList();
};

const handleEditClick = (work: Work) => {
  currentWork.value = work;
  openEditDialog.value = true;
};

const handleChapterManage = (work: Work) => {
  router.push({
    name: "writer-chapter",
    query: {
      workId: work.id,
    },
  });
};

const handleWorkSubmit = async (payload: {
  mode: "create" | "edit";
  data: any;
}) => {
  if (payload.mode === "edit" && currentWork.value) {
    const { title, description, cover_url, category_ids } = payload.data;
    // 1. 更新基本信息
    await updateWorkAPI(currentWork.value.id, {
      title,
      description,
      cover_url,
    });
    // 2. 更新分类
    if (Array.isArray(category_ids)) {
      await setWorkCategoryAPI(currentWork.value.id, {
        categoryIds: category_ids,
      });
    }
  }

  emitter.emit("message", {
    type: "success",
    content: payload.mode === "create" ? "创建作品成功" : "更新作品成功",
  });
  // 创建或更新成功后刷新列表
  getWorkList();
};
const handleReviewClick = async (work: Work) => {
  messageHandle({
    type: "warning",
    message: "是否再次审核该作品？",
    handle: async () => {
      await rejectBookCheckAPI(work.id);
      emitter.emit("message", {
        type: "success",
        content: "再次审核成功",
      });
      getWorkList();
    },
  });
};

onMounted(() => {
  getWorkList();
});
</script>

<style scoped>
.work-collapse {
  width: 100%;
  padding-top: 20px;
}

.work-collapse :deep(.el-collapse-item) {
  margin-bottom: 24px;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.work-collapse :deep(.el-collapse-item:last-of-type) {
  margin-bottom: 0;
}

.work-collapse :deep(.el-collapse-item__header) {
  padding: 0;
  border-bottom: none;
  background: transparent;
}

.work-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.work-collapse :deep(.el-collapse-item__content) {
  padding: 0;
}

.status-panel {
  background: #f8fafc;
  padding: 20px 28px;
  border-top: 1px solid #e2e8f0;
}

.status-steps {
  max-width: 900px;
  margin: 0 auto;
}

.status-steps :deep(.el-step__icon) {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.status-steps :deep(.el-step__title) {
  font-size: 12px;
  color: #475569;
}

.status-steps :deep(.el-step__line) {
  height: 2px;
}
</style>
