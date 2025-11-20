<template>
  <div class="h-full flex flex-col">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <el-select
            v-model="status"
            placeholder="审核状态"
            style="width: 140px"
            clearable
          >
            <el-option :value="0" label="待审核" />
            <el-option :value="1" label="审核通过" />
            <el-option :value="2" label="审核拒绝" />
          </el-select>
          <el-select
            v-model="userId"
            filterable
            remote
            clearable
            :remote-method="remoteUsers"
            :loading="remoteUsersLoading"
            placeholder="选择用户"
            style="width: 200px"
          >
            <el-option
              v-for="opt in userOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-select
            v-model="workId"
            filterable
            remote
            clearable
            :remote-method="remoteWorks"
            :loading="remoteWorksLoading"
            placeholder="选择作品"
            style="width: 240px"
          >
            <el-option
              v-for="opt in workOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-button type="primary" icon="search" @click="getBookChecks"
            >搜索</el-button
          >
          <el-button icon="refresh" @click="reset">重置</el-button>
        </div>
      </div>
    </div>

    <div
      class="flex-1 overflow-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4"
    >
      <el-table border stripe class="h-full" :data="list" v-loading="loading">
        <template v-for="column in tableColumns" :key="column.prop">
          <el-table-column v-bind="column">
            <template
              #="{ row }"
              v-if="
                column.prop === 'createTime' || column.prop === 'updateTime'
              "
            >
              {{ formateTime(row[column.prop]) }}
            </template>
            <template #="{ row }" v-else-if="column.prop === 'user'">
              <div class="flex flex-col items-center">
                <div>{{ row.user?.username }}</div>
                <div class="text-gray-400 text-xs">{{ row.user?.email }}</div>
              </div>
            </template>
            <template #="{ row }" v-else-if="column.prop === 'work'">
              <div class="flex items-center space-x-2">
                <el-image
                  :src="API_BASE_URL + (row.work?.cover_url || '')"
                  fit="cover"
                  style="width: 40px; height: 40px; border-radius: 4px"
                />
                <div class="flex flex-col">
                  <span>{{ row.work?.title }}</span>
                  <span class="text-gray-400 text-xs">{{
                    workStatusText(row.work?.status)
                  }}</span>
                </div>
              </div>
            </template>
            <template #="{ row }" v-else-if="column.prop === 'status'">
              <el-tag :type="statusTagType(row.status)">{{
                statusText(row.status)
              }}</el-tag>
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
        @current-change="getBookChecks"
        @size-change="getBookChecks"
      />
    </div>

    <CheckDetailDrawer
      v-model="drawer"
      :title="detailTitle"
      :size="600"
      :image-url="API_BASE_URL + (detail?.work?.cover_url || '')"
      :heading="detail?.work?.title || ''"
      :subheading="detail?.work?.description || ''"
      :extra="`字数：${detail?.work?.count ?? 0}`"
      :items="[
        { label: '审核状态', value: statusText(detail?.status ?? 0) },
        { label: '作品状态', value: workStatusText(detail?.work?.status ?? 0) },
        { label: '提交时间', value: formateTime(detail?.createTime ?? '') },
        { label: '更新时间', value: formateTime(detail?.updateTime ?? '') },
        { label: '作者', value: detail?.user?.username ?? '' },
        { label: '邮箱', value: detail?.user?.email ?? '' },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { API_BASE_URL } from "@/config/config";
import { formateTime } from "@/utils/formdate";
import type { TableColumns } from "@/layout/users/type";
import { useBookChecks } from "./useBookChecks";
import CheckDetailDrawer from "./components/CheckDetailDrawer.vue";

const {
  loading,
  page,
  pageSize,
  total,
  list,
  status,
  userId,
  workId,
  userOptions,
  workOptions,
  remoteUsersLoading,
  remoteWorksLoading,
  getBookChecks,
  reset,
  btnConfig,
  drawer,
  detail,
  detailTitle,
  remoteUsers,
  remoteWorks,
  statusText,
  statusTagType,
  workStatusText,
} = useBookChecks();

const tableColumns: TableColumns[] = [
  { prop: "id", label: "ID", align: "center", width: 80 },
  { prop: "user", label: "用户", align: "center", minWidth: 160 },
  { prop: "work", label: "作品", align: "center", minWidth: 220 },
  { prop: "status", label: "审核状态", align: "center", width: 120 },
  { prop: "createTime", label: "提交时间", align: "center", width: 140 },
  { prop: "updateTime", label: "更新时间", align: "center", width: 140 },
  {
    prop: "actions",
    label: "操作",
    align: "center",
    fixed: "right",
    minWidth: 200,
  },
];

onMounted(() => {
  getBookChecks();
});
</script>

<style scoped></style>
