<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <!-- 404图标 -->
      <div class="mb-8">
        <el-icon class="text-9xl text-gray-300" :size="200">
          <Warning />
        </el-icon>
      </div>

      <!-- 错误信息 -->
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl text-gray-600 mb-4">页面不存在</h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        {{ errorMessage }}
      </p>

      <!-- 操作按钮 -->
      <div class="space-x-4">
        <el-button type="primary" @click="goBack" size="large">
          <el-icon class="mr-2">
            <ArrowLeft />
          </el-icon>
          返回上一页
        </el-button>
        <el-button type="info" @click="goHome" size="large">
          <el-icon class="mr-2">
            <House />
          </el-icon>
          回到首页
        </el-button>
      </div>

      <!-- 额外帮助信息 -->
      <div class="mt-8 text-sm text-gray-400">
        <p>如果问题持续存在，请联系系统管理员</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Warning, ArrowLeft, House } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

// 根据路由信息判断错误类型
const errorMessage = computed(() => {
  const path = route.path;
  const state = history.state;

  // 检查是否是因为权限不足被重定向到404
  if (state?.noPermission) {
    return "您没有访问该页面的权限。请联系管理员获取相应权限，或者返回其他页面。";
  }

  // 检查是否是权限路由
  if (path.startsWith("/layout/")) {
    return "您访问的页面不存在，或者您没有访问该页面的权限。请联系管理员获取相应权限。";
  }

  // 其他404情况
  return "您访问的页面可能已经移动、删除，或者输入的网址不正确。";
});

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};

// 回到首页
const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
/* 自定义样式 */
.text-9xl {
  font-size: 12rem;
}
</style>
