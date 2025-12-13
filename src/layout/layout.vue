<template>
  <div class="h-screen bg-gray-50">
    <el-container class="h-full">
      <!-- 侧边栏 -->
      <el-aside
        :width="isCollapse ? '64px' : '200px'"
        class="bg-white shadow-lg transition-all duration-300 border-r border-gray-200"
      >
        <div class="h-full flex flex-col">
          <!-- Logo区域 -->
          <div
            class="h-16 flex items-center justify-center border-b border-gray-200"
          >
            <div class="flex items-center space-x-2">
              <el-icon class="text-blue-600" size="24">
                <Platform />
              </el-icon>
              <span
                v-show="!isCollapse"
                class="text-lg font-semibold text-gray-800"
                >小说后台</span
              >
            </div>
          </div>

          <!-- 菜单区域 -->
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :collapse-transition="false"
            class="flex-1 border-none"
            background-color="#ffffff"
            text-color="#374151"
            active-text-color="#3b82f6"
            router
          >
            <!-- 动态渲染菜单 -->
            <template v-for="route in menuRoutes" :key="route.path">
              <!-- 单级菜单 -->
              <el-menu-item :index="getMenuPath(route)">
                <el-icon>
                  <component :is="toRaw(route.meta?.icon)" />
                </el-icon>
                <template #title>{{ route.meta?.title }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-aside>

      <!-- 主内容区域 -->
      <el-container class="flex-1">
        <!-- 顶部导航栏 -->
        <el-header class="bg-white shadow-sm border-b border-gray-200 px-4">
          <div class="h-full flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- 菜单折叠按钮 -->
              <el-button
                link
                @click="toggleCollapse"
                class="text-gray-600 hover:text-gray-800"
              >
                <el-icon size="20">
                  <Expand v-if="isCollapse" />
                  <Fold v-else />
                </el-icon>
              </el-button>

              <!-- 面包屑导航 -->
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"
                  >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item
                  v-for="item in breadcrumbs"
                  :key="item.path"
                  :to="{ path: item.path }"
                >
                  {{ item.title }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>

            <!-- 右侧用户信息 -->
            <div class="flex items-center space-x-4">
              <!-- 通知 -->
              <el-badge :value="3" class="item">
                <el-button link class="text-gray-600 hover:text-gray-800">
                  <el-icon size="18"><Bell /></el-icon>
                </el-button>
              </el-badge>

              <!-- 用户头像和下拉菜单 -->
              <el-dropdown trigger="click">
                <div
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <el-avatar
                    size="small"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  />
                  <span class="text-sm font-medium text-gray-700">管理员</span>
                  <el-icon class="text-gray-400"><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-icon><User /></el-icon>
                      个人中心
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-icon><Setting /></el-icon>
                      个人设置
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                      <el-icon><SwitchButton /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>

        <!-- 主内容区域 -->
        <el-main class="p-6 bg-gray-50 flex-1">
          <div class="bg-white rounded-lg shadow-sm p-6 h-full">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Expand,
  Fold,
  Bell,
  ArrowDown,
  Platform,
  SwitchButton,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const isCollapse = ref(false);

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title);
  return matched.map((item) => ({
    title: item.meta.title,
    path: item.path,
  }));
});

// 获取菜单路由
const menuRoutes = computed(() => {
  const layoutRoute = router
    .getRoutes()
    .find((route) => route.path === "/layout");
  return layoutRoute?.children || [];
});

// 获取菜单路径
const getMenuPath = (route: any) => {
  const fullPath = `/layout/${route.path}`;
  return fullPath.replace("//", "/");
};

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped>
/* 自定义Element-Plus样式 */
:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #374151;
}
</style>
