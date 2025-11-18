<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="shadow-sm p-4 rounded-lg border border-gray-200 flex justify-between"
    >
      <div class="space-x-2">
        <component
          class="my-1"
          v-for="item in worksSearchConfig"
          :key="item.key"
          v-model="worksSearchQuery[item.key]"
          :is="componentMap.get(item.component)"
          v-bind="item.props"
        />
      </div>

      <div class="flex items-center">
        <el-button type="primary" icon="search" @click="searchWorks">
          搜索
        </el-button>
        <el-button icon="refresh" @click="resetWorksSearchQuery">
          重置
        </el-button>
      </div>
    </div>

    <div class="mt-4 flex-1 border border-gray-200 rounded-lg shadow-sm p-4">
      <WorkList
        ref="workListRef"
        :works-search-query="worksSearchQuery"
        :btn-config="btnConfig"
      />
    </div>
    <WorkEditDialog
      ref="workEditDialogRef"
      v-model:open="open"
      :work="currentWork"
      @refresh="searchWorks"
    />
    <el-drawer v-model="drawer" title="设置分类">
      <CheckCategories
        :open="drawer"
        :categories="currentWork.categorys"
        @change="handleCheckedCategoriesChange"
      />
      <template #footer>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { componentMap } from "./config";
import { useWorks } from "./useWorks";
import WorkList from "./components/workList.vue";
import WorkEditDialog from "./components/work-edit-dialog.vue";
import CheckCategories from "./components/check-categories.vue";

const {
  worksSearchConfig,
  worksSearchQuery,
  workListRef,
  btnConfig,
  open,
  currentWork,
  drawer,
  handleSave,
  searchWorks,
  resetWorksSearchQuery,
  handleCheckedCategoriesChange,
} = useWorks();
</script>

<style scoped></style>
