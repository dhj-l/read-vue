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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from "vue";
import { Document, List, View, Warning } from "@element-plus/icons-vue";
import { getUserWorksDataAPI } from "@/api/works/works";
import type { UserWorkInfo } from "@/api/works/type";

// 定义卡片配置接口
interface CardConfig {
  backgroundClass: string;
  icon: typeof Document | typeof List | typeof View | typeof Warning;
  iconColorClass: string;
  title: string;
  valueKey: keyof UserWorkInfo;
  unit: string;
}

// 卡片配置数组 - 抽取背景颜色和样式信息
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

const userWorkInfo = ref<UserWorkInfo>({
  totalWorks: 5,
  totalChapters: 574,
  totalReads: 186720,
  pendingChecks: 1,
});

const getUserWorkInfo = async () => {
  const res = await getUserWorksDataAPI();
  userWorkInfo.value = res.data;
  console.log(userWorkInfo.value);
};

onMounted(() => {
  getUserWorkInfo();
});
</script>
