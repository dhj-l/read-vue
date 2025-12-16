<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="shadow-sm p-4 rounded-lg border border-gray-200 flex justify-between"
    >
      <div class="flex items-center">
        <el-button type="primary" @click="handleAddBanner">
          <el-icon><Plus /></el-icon> 添加轮播图
        </el-button>
      </div>
    </div>

    <div
      class="mt-4 flex flex-col flex-1 border border-gray-200 rounded-lg shadow-sm p-4"
    >
      <el-table
        border
        stripe
        class="flex-1"
        :data="bannerList"
        v-loading="loading"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          v-bind="column"
        >
          <template #default="{ row }">
            <template v-if="column.prop === 'imgUrl'">
              <el-image
                :src="API_BASE_URL + row.imgUrl"
                fit="cover"
                class="w-40 h-20 z-50"
                :preview-src-list="[API_BASE_URL + row.imgUrl]"
                :z-index="1000"
                preview-teleported
              />
            </template>
            <template v-else-if="column.prop === 'status'">
              <el-tag :type="row.status === 1 ? 'success' : 'warning'">
                {{ row.status === 1 ? "已上架" : "已下架" }}
              </el-tag>
            </template>
            <template v-else-if="column.prop === 'createTime'">
              {{ formateTime(row.createTime) }}
            </template>
            <template v-else-if="column.prop === 'updateTime'">
              {{ formateTime(row.updateTime) }}
            </template>
            <template v-else-if="column.prop === 'actions'">
              <el-button-group>
                <el-button type="primary" link @click="handleEditBanner(row)">
                  编辑
                </el-button>
                <el-button
                  :type="row.status === 1 ? 'warning' : 'success'"
                  link
                  @click="handleToggleStatus(row)"
                >
                  {{ row.status === 1 ? "下架" : "上架" }}
                </el-button>
                <el-button type="danger" link @click="handleDeleteBanner(row)">
                  删除
                </el-button>
              </el-button-group>
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无轮播图数据" />
        </template>
      </el-table>

      <el-pagination
        class="flex justify-end mt-2"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="getBannerList"
        @size-change="getBannerList"
      />
    </div>

    <BannerEditDialog
      ref="bannerEditDialogRef"
      v-model:open="dialogVisible"
      :banner="currentBanner"
      @refresh="getBannerList"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { useBanner } from "./useBanner";
import BannerEditDialog from "./components/banner-edit-dialog.vue";
import { tableColumns } from "./config";
import { API_BASE_URL } from "@/config/config";
import { formateTime } from "@/utils/formdate";

const {
  bannerList,
  loading,
  currentBanner,
  dialogVisible,
  bannerEditDialogRef,
  getBannerList,
  handleAddBanner,
  handleEditBanner,
  handleToggleStatus,
  handleDeleteBanner,
} = useBanner();

const { total, page, pageSize } = useBanner();

onMounted(() => {
  getBannerList();
});
</script>
