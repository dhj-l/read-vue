<template>
  <div class="writer-center p-6 rounded-lg min-h-screen bg-white">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">作家中心</h1>
      <p class="text-gray-600">管理您的作品和查看数据统计</p>
    </div>

    <!-- 数据概览卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- 使用v-for动态渲染卡片 -->
      <div
        v-for="(config, index) in cardConfigs"
        :key="index"
        class="rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        :class="config.backgroundClass"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium" :class="config.iconColorClass">
              {{ config.title }}
            </p>
            <p class="text-3xl font-bold text-gray-900 mt-2 flex items-center">
              {{ userWorkInfo[config.valueKey] }}
              <span class="text-xs font-normal text-gray-500 ml-2 mt-1">{{
                config.unit
              }}</span>
            </p>
          </div>
          <div class="p-2 rounded-full">
            <el-icon :class="config.iconColorClass" size="20">
              <component :is="config.icon" />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：阅读量统计图表 -->
      <div
        class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">书籍阅读量统计</h3>
        </div>
        <div ref="chartRef" class="h-full w-full"></div>
      </div>

      <!-- 右侧：日历和其他组件 -->
      <div class="space-y-6">
        <!-- 日历组件 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">创作日历</h3>
          <el-calendar v-model="calendarValue" class="custom-calendar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from "vue";
import { Document, List, View, Warning } from "@element-plus/icons-vue";
import {
  getUserAllWorksReadsAPI,
  getUserWorksDataAPI,
} from "@/api/works/works";
import type { UserWorkInfo, WorkReads } from "@/api/works/type";
import { initChart } from "./config";

// 定义卡片配置接口
interface CardConfig {
  backgroundClass: string;
  icon: typeof Document | typeof List | typeof View | typeof Warning;
  iconColorClass: string;
  title: string;
  valueKey: keyof UserWorkInfo;
  unit: string;
}

// 卡片配置数组
const cardConfigs: CardConfig[] = [
  {
    backgroundClass: "bg-gradient-to-br from-blue-50 to-white",
    icon: toRaw(Document),
    iconColorClass: "text-blue-600",
    title: "总作品数",
    valueKey: "totalWorks",
    unit: "本作品",
  },
  {
    backgroundClass: "bg-gradient-to-br from-green-50 to-white",
    icon: toRaw(List),
    iconColorClass: "text-green-600",
    title: "总章节数",
    valueKey: "totalChapters",
    unit: "章节",
  },
  {
    backgroundClass: "bg-gradient-to-br from-orange-50 to-white",
    icon: toRaw(View),
    iconColorClass: "text-orange-600",
    title: "总阅读量",
    valueKey: "totalReads",
    unit: "次阅读",
  },
  {
    backgroundClass: "bg-gradient-to-br from-red-50 to-white",
    icon: toRaw(Warning),
    iconColorClass: "text-red-600",
    title: "待审核",
    valueKey: "pendingChecks",
    unit: "项",
  },
];

// 响应式数据
const userWorkInfo = ref<UserWorkInfo>({
  totalWorks: 0,
  totalChapters: 0,
  totalReads: 0,
  pendingChecks: 0,
});

const userAllWorksReads = ref<WorkReads[]>([]);

const chartRef = ref<HTMLElement>();
const calendarValue = ref(new Date());

// 获取用户作品信息
const getUserWorkInfo = async () => {
  const res = await getUserWorksDataAPI();
  userWorkInfo.value = res.data;
};

const getUserAllWorksReads = async () => {
  const res = await getUserAllWorksReadsAPI();
  userAllWorksReads.value = res.data;
  initChart(chartRef.value!, userAllWorksReads.value);
};

onMounted(() => {
  getUserWorkInfo();
  getUserAllWorksReads();
});
</script>

<style scoped>
.custom-calendar {
  --el-calendar-border: none;
}

.custom-calendar :deep(.el-calendar__header) {
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 20px;
}

.custom-calendar :deep(.el-calendar__body) {
  padding: 12px;
}

.custom-calendar :deep(.el-calendar-table) {
  border: none;
}

.custom-calendar :deep(.el-calendar-day) {
  border: none;
  padding: 8px;
}

.calendar-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
}

.writing-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
}

.custom-calendar :deep(.is-selected) {
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
}

.custom-calendar :deep(.is-today) {
  background-color: #dbeafe;
  border-radius: 6px;
}
</style>
