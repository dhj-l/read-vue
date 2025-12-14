<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 shadow-sm p-4 rounded-lg border border-gray-200">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <el-input
            placeholder="搜索权限名称"
            style="width: 250px"
            clearable
            v-model="searchKeyword"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" icon="search" @click="getPermissions">
            搜索
          </el-button>
          <el-button icon="refresh" @click="resetHandler"> 重置 </el-button>
        </div>
        <div>
          <el-button type="primary" icon="plus" @click="open = true">
            新增权限
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div
      class="flex-1 overflow-auto shadow-sm p-4 rounded-lg border border-gray-200"
    >
      <el-table
        border
        stripe
        class="h-full"
        :data="permissions"
        v-loading="loading"
      >
        <el-table-column
          v-for="column in permissionsColumns"
          :key="column.prop"
          v-bind="column"
        >
          <template #="{ row }">
            <template v-if="column.prop.includes('Time')">
              {{ formateTime(row[column.prop]) }}
            </template>
            <template v-else-if="column.prop === 'value'">
              <el-tag>
                {{ row.value }}
              </el-tag>
            </template>
            <template v-else-if="column.prop === 'actions'">
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
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="mt-4 flex justify-end">
      <el-pagination
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getPermissions"
        @size-change="getPermissions"
      />
    </div>
    <AddPermission
      v-model="open"
      :type="type"
      @submit="addPermissionHandler"
      @close="closeHandler"
      :permission-data="permissionData"
      :permission-id="permissionData?.id"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { permissionsColumns } from "./config";
import { usePermissions } from "./usePermissions";
import { onMounted } from "vue";
import AddPermission from "./components/add-permission.vue";
import { formateTime } from "@/utils/formdate";

const {
  permissions,
  loading,
  total,
  page,
  pageSize,
  searchKeyword,
  btnConfig,
  open,
  type,
  permissionData,
  getPermissions,
  resetHandler,
  addPermissionHandler,
  closeHandler,
} = usePermissions();

onMounted(() => {
  getPermissions();
});
</script>

<style scoped></style>
