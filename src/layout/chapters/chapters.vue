<template>
  <div class="h-full flex flex-col">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <el-input v-model="name" placeholder="搜索章节名称" style="width: 250px" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-select v-model="status" placeholder="状态" style="width: 140px" clearable>
            <el-option :value="0" label="待审核" />
            <el-option :value="1" label="已上架" />
            <el-option :value="2" label="已下架" />
          </el-select>

          <el-select
            v-model="workId"
            filterable
            remote
            clearable
            :remote-method="remoteWorks"
            :loading="worksLoading"
            placeholder="选择作品"
            style="width: 240px"
          >
            <el-option
              v-for="opt in userWorksOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <el-button type="primary" icon="search" @click="getChapters">搜索</el-button>
          <el-button icon="refresh" @click="reset">重置</el-button>
        </div>
        <div></div>
      </div>
    </div>

    <div class="flex-1 overflow-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <el-table border stripe class="h-full" :data="list" v-loading="loading">
        <template v-for="column in tableColumns" :key="column.prop">
          <el-table-column v-bind="column">
            <template #="{ row }" v-if="column.prop.includes('Time')">
              {{ formateTime(row[column.prop]) }}
            </template>
            <template #="{ row }" v-else-if="column.prop === 'work'">
              <div class="flex flex-col items-center">
                <div>{{ row.work?.title }}</div>
              </div>
            </template>
            <template #="{ row }" v-else-if="column.prop === 'status'">
              <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
            </template>
            <template #="{ row }" v-else-if="column.prop === 'actions'">
              <el-button-group v-for="btn in btnConfig" :key="btn.label">
                <el-button
                  v-bind="btn.props"
                  @click="btn.click(row)"
                  v-if="btn.visible ? btn.visible(row) : true"
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

    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getChapters"
        @size-change="getChapters"
      />
    </div>

  <el-drawer v-model="drawer" :title="drawerTitle" @close="handleClose">
      <div class="p-4">
        <el-form :model="formData" label-width="80px" :rules="rules" ref="formRef">
          <el-form-item label="章节名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入章节名称" />
          </el-form-item>
          <el-form-item label="章节内容" prop="content">
            <el-input v-model="formData.content" type="textarea" :rows="8" placeholder="请输入章节内容" show-word-limit />
          </el-form-item>
          
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="detailDrawer" :title="detailTitle" :size="600">
      <div class="p-4 space-y-4">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="章节名称">{{ detail?.name }}</el-descriptions-item>
          <el-descriptions-item label="所属作品">{{ detail?.work?.title }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ statusText(detail?.status) }}</el-descriptions-item>
          <el-descriptions-item label="字数">{{ detail?.count }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formateTime(detail?.createTime ?? '') }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formateTime(detail?.updateTime ?? '') }}</el-descriptions-item>
        </el-descriptions>
        <div>
          <div class="text-sm text-gray-500 mb-2">章节内容</div>
          <div class="p-3 border rounded whitespace-pre-line">{{ detail?.content }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { formateTime } from "@/utils/formdate";
import { tableColumns } from "./config";
import { useChapters } from "./useChapters";

const {
  loading,
  page,
  pageSize,
  total,
  list,
  name,
  status,
  workId,
  getChapters,
  reset,
  drawer,
  detailDrawer,
  formData,
  formRef,
  rules,
  drawerTitle,
  detail,
  detailTitle,
  handleEdit,
  handleSubmit,
  handleClose,
  btnConfig,
  remoteWorks,
  userWorksOptions,
  worksLoading,
  statusText,
  statusTagType,
} = useChapters();

onMounted(() => {
  getChapters();
});
</script>

<style scoped></style>