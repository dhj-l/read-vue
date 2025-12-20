<template>
  <div class="w-[1440px] min-h-[500px] flex mb-25 mt-5">
    <div class="w-full h-full flex" v-if="authorStatus">
      <div class="w-60 bg-white rounded-xl mr-4 p-4">
        <el-menu :default-active="active" router>
          <template v-for="item in menuRoutes" :key="item.name">
            <el-menu-item
              v-if="item.meta?.show"
              :index="item.path"
              class="flex items-center"
            >
              <div class="w-5 h-5 mr-2">
                <component :is="item.meta?.icon" />
              </div>
              <p>
                {{ item.meta?.title || item.name }}
              </p>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div class="w-[1200px] bg-white rounded-xl">
        <RouterView />
      </div>
    </div>
    <div
      v-else
      class="w-full min-h-[600px] bg-linear-to-br from-orange-50 via-white to-orange-50 rounded-xl flex justify-center items-center"
    >
      <div
        class="w-[520px] bg-white rounded-2xl shadow-2xl p-12 flex flex-col items-center relative overflow-hidden"
      >
        <!-- 装饰性背景 -->
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-400/20 to-orange-600/20 rounded-full -translate-y-16 translate-x-16"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-orange-400/10 to-orange-600/10 rounded-full translate-y-12 -translate-x-12"
        ></div>

        <!-- 图标 -->
        <div
          class="relative z-10 w-24 h-24 bg-linear-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <svg
            class="w-12 h-12 text-orange-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </div>

        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
          开启创作之旅
        </h2>
        <p class="text-gray-500 text-center mb-8 leading-relaxed">
          您还不是作者，成为作者后即可发布作品<br />
          分享您的精彩故事
        </p>

        <!-- 特性列表 -->
        <div class="w-full space-y-3 mb-8">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div
              class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>发布和管理您的作品</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div
              class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>获得读者反馈和互动</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div
              class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>享受创作收益分成</span>
          </div>
        </div>

        <!-- 按钮 -->
        <el-button
          type="primary"
          size="large"
          class="w-full become-writer-btn"
          @click="handleBecomeWriter"
        >
          <svg
            class="w-5 h-5 mr-2 inline-block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          立即成为作者
        </el-button>

        <p class="text-xs text-gray-400 mt-4 text-center">
          成为作者后，您将获得完整的创作权限
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { becomeAuthorAPI } from "@/api/user/user";
import { useUserStore } from "@/stores/modules/user/user";
import emitter from "@/utils/eventEmitter";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const { userInfo } = storeToRefs(useUserStore());
const { getUserInfo } = useUserStore();
const router = useRouter();
const menuRoutes = computed(() => {
  return (
    router.getRoutes().find((item) => item.name === "writer")?.children || []
  );
});

const active = ref("/home/writer/center");

const authorStatus = computed(() => {
  return userInfo.value?.roles.find((item) => item.value === "author");
});

const handleBecomeWriter = async () => {
  await becomeAuthorAPI();
  emitter.emit('message',{
    type:'success',
    content: '成为作者成功'
  })
  await getUserInfo();
};
</script>

<style scoped>
:deep(.el-menu) {
  border: none;
}

/* 按钮样式优化 */
:deep(.become-writer-btn) {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  transition: all 0.3s ease;
}

:deep(.become-writer-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
}

:deep(.become-writer-btn:active) {
  transform: translateY(0);
}
</style>
