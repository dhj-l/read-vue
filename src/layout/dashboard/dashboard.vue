<template>
  <div class="admin-dashboard h-full p-6 overflow-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">小说后台管理系统</h1>
      <p class="text-gray-600">数据总览与系统管理</p>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- 卡片内容待填充 -->
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
      <!-- 小说分类分布饼图 -->
      <div
        class="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">小说分类分布</h3>
          <!-- 选择器待填充 -->
        </div>
        <div ref="pieChartRef" class="h-full w-full"></div>
      </div>

      <!-- 日历组件 -->
      <div
        class="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">系统日历</h3>
        <el-calendar v-model="calendarValue" class="custom-calendar" />
      </div>
    </div>

    <!-- 阅读量排行榜 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">阅读量前10书籍</h3>
        <div class="flex space-x-2">
          <!-- 控制按钮待填充 -->
        </div>
      </div>
      <div ref="barChartRef" class="h-96 w-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategoryBookCountAPI } from "@/api/category/category";
import type { CategoryBookCount } from "@/api/category/type";
import { onMounted, ref } from "vue";
import { initRosePieChart } from "./config";
import type { WorkReads } from "@/api/works/type";
import { getTop10WorksReadsAPI } from "@/api/works/works";
import { initChart } from "@/views/writer/center/config";

// 响应式数据
const calendarValue = ref(new Date());
const pieChartRef = ref<HTMLElement>();
const barChartRef = ref<HTMLElement>();

const categoryBookCount = ref<CategoryBookCount[]>([]);
const top10WorksReads = ref<WorkReads[]>([]);

const getCategoryBookCount = async () => {
  const res = await getCategoryBookCountAPI();
  categoryBookCount.value = res.data || [];
  initRosePieChart(pieChartRef.value!, categoryBookCount.value);
};

const getTop10WorksReads = async () => {
  const res = await getTop10WorksReadsAPI();
  top10WorksReads.value = res.data || [];
  initChart(barChartRef.value!, top10WorksReads.value);
};

// 组件挂载后初始化
onMounted(() => {
  getCategoryBookCount();
  getTop10WorksReads();
});
</script>

<style scoped></style>
