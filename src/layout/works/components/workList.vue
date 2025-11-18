<template>
  <div class="h-full flex flex-col">
    <div class="flex-1">
      <el-table border :data="worksList">
        <template v-for="item in workListColumns" :key="item.prop">
          <el-table-column v-bind="item">
            <template #="{ row }" v-if="item.prop === 'cover_url'">
              <el-image
                :src="API_BASE_URL + row.cover_url"
                fit="cover"
                class="w-full h-full z-50"
                :preview-src-list="[API_BASE_URL + row.cover_url]"
                :z-index="1000"
                preview-teleported
              >
                <template #error>
                  <div class="w-full h-full flex items-center justify-center">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
            <template #="{ row }" v-else-if="item.prop === 'user'">
              {{ row.user?.username }}
            </template>
            <template #="{ row }" v-else-if="item.prop === 'categorys'">
              <template v-if="row.categorys.length > 0">
                <el-tag
                  v-for="cate in row.categorys"
                  :key="cate.id"
                  class="mr-2 mb-2"
                  >{{ cate.name }}</el-tag
                >
              </template>
              <template v-else>
                <el-tag type="info">暂无分类</el-tag>
              </template>
            </template>
            <template #="{ row }" v-else-if="item.prop === 'status'">
              <el-tag :type="workStatusMap.get(row.status)?.type || 'info'">{{
                workStatusMap.get(row.status)?.label || "未知"
              }}</el-tag>
            </template>
            <template #="{ row }" v-else-if="item.prop.includes('Time')">
              {{ formateTime(row[item.prop]) }}
            </template>
            <template #="{ row }" v-else-if="item.prop === 'actions'">
              <el-button-group>
                <el-button
                  v-for="btn in btnConfig"
                  :key="btn.label"
                  :type="btn.props.type"
                  :link="btn.props.link"
                  @click="btn.click(row)"
                  >{{ btn.label }}</el-button
                >
              </el-button-group>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <el-pagination
      class="flex justify-end"
      v-model:current-page="worksSearchQuery.page"
      v-model:page-size="worksSearchQuery.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="(page: number)=>getWorkList({...worksSearchQuery, page})"
      @size-change="(pageSize: number)=>getWorkList({...worksSearchQuery, pageSize})"
    />
  </div>
</template>

<script setup lang="ts">
import { workListColumns, workStatusMap } from "../config";
import { getWorksListAPI } from "@/api/works/works";

import { Picture as IconPicture } from "@element-plus/icons-vue";
import type { WorksSearchQuery } from "../type";
import { onMounted, ref } from "vue";
import type { Work } from "@/api/works/type";
import { API_BASE_URL } from "@/config/config";
import { formateTime } from "@/utils/formdate";
import type { ButtonConfig } from "@/layout/content/type";
const props = withDefaults(
  defineProps<{
    worksSearchQuery: WorksSearchQuery;
    btnConfig: ButtonConfig<Work>[];
  }>(),
  {}
);
const worksList = ref<Work[]>([]);
const total = ref<number>(0);
const getWorkList = async (params: Partial<WorksSearchQuery>) => {
  const res = await getWorksListAPI({
    ...params,
  });
  const { works = [], total: totalCount = 0 } = res.data || {};
  worksList.value = works;
  total.value = totalCount;
};

onMounted(() => {
  getWorkList(props.worksSearchQuery);
});

defineExpose({
  getWorkList,
});
</script>

<style scoped></style>
