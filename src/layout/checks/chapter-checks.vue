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
          <el-button type="primary" icon="search" @click="getChapterChecks"
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
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          v-bind="column"
        >
          <template #="{ row }">
            <template v-if="column.prop.includes('Time')">
              {{ formateTime(row[column.prop]) }}
            </template>
            <template v-else-if="column.prop === 'user'">
              <div class="flex flex-col items-center">
                <div>{{ row.user?.username }}</div>
              </div>
            </template>
            <template v-else-if="column.prop === 'chapter'">
              <div class="flex flex-col items-center">
                <div>{{ row.chapter?.name }}</div>
                <div class="text-gray-400 text-xs">
                  {{ row.chapter?.work?.title }}
                </div>
              </div>
            </template>
            <template v-else-if="column.prop === 'status'">
              <el-tag :type="statusTagType(row.status)">{{
                statusText(row.status)
              }}</el-tag>
            </template>
            <template v-else-if="column.prop === 'actions'">
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
          </template>
        </el-table-column>

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
        @current-change="getChapterChecks"
        @size-change="getChapterChecks"
      />
    </div>

    <CheckDetailDrawer
      v-model="drawer"
      :title="detailTitle"
      :size="600"
      :items="[
        { label: '章节名称', value: detail?.chapter?.name ?? '' },
        { label: '所属作品', value: detail?.chapter?.work?.title ?? '' },
        { label: '审核状态', value: statusText(detail?.status) },
        { label: '章节状态', value: statusText(detail?.chapter?.status) },
        { label: '提交时间', value: formateTime(detail?.createTime ?? '') },
        { label: '更新时间', value: formateTime(detail?.updateTime ?? '') },
        { label: '作者', value: detail?.user?.username ?? '' },
      ]"
      :content="detail?.chapter?.content || ''"
      content-label="章节内容"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { formateTime } from "@/utils/formdate";
import { useChapterChecks } from "./useChapterChecks";
import CheckDetailDrawer from "./components/CheckDetailDrawer.vue";

const {
  loading,
  page,
  pageSize,
  total,
  list,
  status,
  getChapterChecks,
  reset,
  btnConfig,
  tableColumns,
  drawer,
  detail,
  detailTitle,
  statusText,
  statusTagType,
} = useChapterChecks();

onMounted(() => {
  getChapterChecks();
});
</script>

<style scoped></style>
