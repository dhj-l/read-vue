<
<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 shadow-sm p-4 rounded-lg border border-gray-200">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <el-input
            placeholder="搜索角色名称"
            style="width: 250px"
            clearable
            v-model="searchKeyword"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" icon="search" @click="getRoles">
            搜索
          </el-button>
          <el-button icon="refresh" @click="resetHandler"> 重置 </el-button>
        </div>
        <div>
          <el-button type="primary" icon="plus" @click="open = true">
            新增角色
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div
      class="flex-1 overflow-auto shadow-sm p-4 rounded-lg border border-gray-200"
    >
      <el-table border stripe class="h-full" :data="roles" v-loading="loading">
        <template v-for="column in rolesColumns" :key="column.prop">
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
            <template #="{ row }" v-else-if="column.prop === 'permissions'">
              <template v-if="row[column.prop].length > 0">
                <el-tag
                  class="mr-2 mb-2"
                  v-for="item in row[column.prop]"
                  :key="item.name"
                  type="primary"
                  size="small"
                  >{{ item.name }}</el-tag
                >
              </template>
              <el-tag v-else type="danger">暂无权限</el-tag>
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
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getRoles"
        @size-change="getRoles"
      />
    </div>
    <AddRoles
      v-model="open"
      :type="type"
      @submit="addRoleHandler"
      @close="closeHandler"
      :role-data="roleData"
      :role-id="roleData?.id"
    />

    <!-- 分配权限弹窗 -->
    <AssignPermission
      v-model:visible="permissionDialogVisible"
      :role-id="currentRoleId"
      :role-name="currentRoleName"
      :initial-permissions="initialPermissions"
      @submit="submitAssignPermission"
      @cancel="closePermissionDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { rolesColumns } from "@/layout/users/config";
import { useRoles } from "@/layout/users/useRoles";
import { onMounted } from "vue";
import AddRoles from "./components/add-roles.vue";
import AssignPermission from "./components/assign-permission.vue";
import { formateTime } from "@/utils/formdate";

const {
  roles,
  loading,
  total,
  page,
  pageSize,
  searchKeyword,
  btnConfig,
  open,
  type,
  roleData,
  getRoles,
  resetHandler,
  addRoleHandler,
  closeHandler,
  // 分配权限相关
  permissionDialogVisible,
  currentRoleId,
  currentRoleName,
  initialPermissions,
  submitAssignPermission,
  closePermissionDialog,
} = useRoles();

onMounted(() => {
  getRoles();
});
</script>

<style scoped></style>
