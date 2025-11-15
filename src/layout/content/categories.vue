<template>
  <div class="h-full flex flex-col">
    <!-- 搜索和操作区域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索分类名称"
            style="width: 250px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-button type="primary" icon="search" @click="getCategories">
            搜索
          </el-button>
          <el-button icon="refresh" @click="reset"> 重置 </el-button>
        </div>
        <div>
          <el-button type="primary" icon="plus" @click="handleAdd">
            新增分类
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div
      class="flex-1 overflow-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4"
    >
      <el-table
        border
        stripe
        class="h-full"
        :data="categories"
        v-loading="loading"
      >
        <template v-for="column in tableColumns" :key="column.prop">
          <el-table-column v-bind="column">
            <template #="{ row }" v-if="column.prop.includes('Time')">
              {{ formateTime(row[column.prop]) }}
            </template>
            <template #="{ row }" v-else-if="column.prop === 'actions'">
              <el-button-group>
                <el-button
                  v-for="btn in btnConfig"
                  :key="btn.label"
                  v-bind="btn.props"
                  @click="btn.click(row)"
                >
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </template>

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
        @current-change="getCategories"
        @size-change="getCategories"
      />
    </div>

    <!-- 新增/编辑分类抽屉 -->
    <el-drawer v-model="drawer" :title="drawerTitle" @close="handleClose">
      <div class="p-4">
        <el-form
          :model="formData"
          label-width="80px"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="分类描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="6"
              placeholder="请输入分类描述"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { onMounted } from "vue";
import { tableColumns } from "./config";
import { useCategorys } from "./useCategorys";
import { formateTime } from "@/utils/formdate";

const {
  loading,
  btnConfig,
  searchKeyword,
  page,
  pageSize,
  total,
  categories,
  drawer,
  formData,
  drawerTitle,
  rules,
  formRef,
  getCategories,
  reset,
  handleAdd,
  handleSubmit,
  handleClose,
} = useCategorys();

onMounted(() => {
  getCategories();
});
</script>

<style scoped></style>
