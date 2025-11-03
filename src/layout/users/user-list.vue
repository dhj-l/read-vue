<template>
  <div class="h-full flex flex-col">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">用户管理</h1>
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名或邮箱"
            style="width: 250px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="flex-1 overflow-auto">
      <el-table border stripe class="h-full">
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          v-bind="column"
        />
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { tableColumns } from "./config";
import { useUserList } from "./useUserList";
import { onMounted } from "vue";
const { searchKeyword, page, pageSize, total, getUserList } = useUserList();
onMounted(() => {
  getUserList();
});
</script>

<style scoped></style>
