<template>
  <div class="w-full h-full px-30 py-5 bg-white flex flex-col items-center">
    <div class="h-full w-[1260px] py-5 flex flex-col">
      <!-- 页面标题 -->
      <div class="w-full h-[60px] flex items-center justify-between mb-5">
        <h1 class="text-2xl font-bold text-gray-900">我的书架</h1>
      </div>

      <!-- 书籍列表展示区域 -->
      <div class="w-full flex-1" v-loading="loading">
        <!-- 内容 -->
        <div class="w-full">
          <div class="flex flex-col" v-if="bookShelfList.length > 0">
            <template v-for="item in bookShelfList" :key="item.id">
              <div class="mt-5 relative">
                <BookCardDetail :work="item" border shadow />
                <el-button
                  type="danger"
                  size="small"
                  circle
                  class="absolute top-6 right-6 z-10"
                  @click="removeFromShelfHadnle(item.id)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </template>
          </div>
          <!-- 空状态 -->
          <el-empty v-else description="暂无书籍" />
        </div>
      </div>
      <!-- 分页 -->
      <div>
        <el-pagination
          class="flex justify-center my-5"
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          :hide-on-single-page="true"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="getShelfList"
          @size-change="getShelfList"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useShelf } from "./useShelf";
import { storeToRefs } from "pinia";
import { useBookShelfStore } from "@/stores/modules/book-shelf/book-shelf";
const { bookShelfList, total } = storeToRefs(useBookShelfStore());
const { loading, page, pageSize, removeFromShelfHadnle, getShelfList } =
  useShelf();

onMounted(() => {
  getShelfList();
});
</script>

<style scoped>
/* 移除按钮样式优化 */
:deep(.el-button--danger) {
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-button--danger:hover) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.5);
}

/* 书籍卡片悬停效果 */
.relative:hover :deep(.el-button--danger) {
  opacity: 1;
}

.relative :deep(.el-button--danger) {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
</style>
