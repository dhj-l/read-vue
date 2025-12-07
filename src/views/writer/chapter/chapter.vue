<template>
  <div class="w-full h-full flex flex-col">
    <!-- 头部 -->
    <div class="px-10 h-[100px]">
      <Back class="w-20 h-5 mt-5" />
      <header class="mt-5 flex justify-between items-center">
        <h1 class="text-base cursor-pointer">章节管理</h1>
        <div>
          <el-button type="success" :icon="Plus" @click="goEditor"
            >新建章节</el-button
          >
        </div>
      </header>
    </div>
    <!-- 内容 -->
    <div class="px-10 mt-5 flex-1 flex flex-col">
      <div class="flex-1">
        <el-table class="w-full h-full" :data="chapterList">
          <template v-for="column in tableColumns" :key="column.prop">
            <el-table-column v-bind="column">
              <template #="{ row }" v-if="column.prop.includes('Time')">
                {{ formateTime(row[column.prop]) }}
              </template>
              <template #="{ row }" v-else-if="column.prop === 'work'">
                <div class="flex flex-col items-center">
                  <div>{{ row.work?.title }}</div>
                </div>
              </template>
              <template #="{ row }" v-else-if="column.prop === 'status'">
                <el-tag :type="statusTagType(row.status)">{{
                  statusText(row.status)
                }}</el-tag>
              </template>
              <template #="{ row }" v-else-if="column.prop === 'actions'">
                <div class="flex justify-center items-center">
                  <el-button
                    v-for="item in btnConfig"
                    :key="item.label"
                    v-bind="item.props"
                    @click="item.click(row)"
                    >{{ item.label }}</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </template>
          <template #empty>
            <el-empty description="暂无数据" />
          </template>
        </el-table>
      </div>
      <el-pagination
        class="mt-5 h-[50px] flex justify-center items-end"
        v-model:current-page="page"
        :page-size="pageSize"
        layout="prev, pager, next"
        :hide-on-single-page="hidePagination"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { tableColumns } from "./config";
import { formateTime } from "@/utils/formdate";
import { useChapters } from "@/layout/chapters/useChapters";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getChapterListAPI } from "@/api/chapter/chapter";
import type { ChapterItem } from "@/api/chapter/type";
import type { ButtonConfig } from "@/layout/content/type";
import Back from "@/components/back/back.vue";
import emitter from "@/utils/eventEmitter";
const { statusTagType, statusText } = useChapters();
const route = useRoute();
const router = useRouter();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const workId = computed(() => Number(route.query.workId) || 0);

const chapterList = ref<ChapterItem[]>([]);
const loading = ref(false);
const hidePagination = computed(() => total.value <= pageSize.value);
const handlePageChange = (newPage: number) => {
  page.value = newPage;
};
const getChapterList = async () => {
  if (!workId.value) {
    emitter.emit("message", {
      type: "error",
      content: "请先选择作品",
    });
    return;
  }
  loading.value = true;
  try {
    const res = await getChapterListAPI({
      workId: workId.value,
      page: page.value,
      pageSize: pageSize.value,
    });
    const { chapters, total: totalCount } = res.data || {};
    chapterList.value = chapters || [];
    total.value = totalCount || 0;
  } finally {
    loading.value = false;
  }
};

const handleEdit = (chapterId: number) => {
  router.push({
    path: "/editor",
    query: {
      workId: workId.value,
      chapterId: chapterId,
    },
  });
};

const btnConfig: ButtonConfig<ChapterItem>[] = [
  {
    label: "编辑",
    props: {
      link: true,
      type: "primary",
    },
    click: (row) => {
      handleEdit(row.id);
    },
  },
];
const goEditor = () => {
  router.push({
    path: "/editor",
    query: {
      workId: workId.value,
    },
  });
};

onMounted(() => {
  getChapterList();
});
</script>

<style scoped></style>
