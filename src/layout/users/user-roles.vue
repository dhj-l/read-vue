<
<template>
  <div class="h-full flex flex-col">
    <div class="mb-4">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center mb-4">
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
    <div class="flex-1 overflow-auto">
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
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { formateTime, rolesColumns } from "@/layout/users/config";
import { useRoles } from "@/layout/users/useRoles";
import { onMounted } from "vue";
import AddRoles from "./components/add-roles.vue";

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
} = useRoles();

onMounted(() => {
  getRoles();
});
</script>

<style scoped></style>
