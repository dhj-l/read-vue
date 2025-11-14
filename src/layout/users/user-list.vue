<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 shadow-sm p-4 rounded-lg border border-gray-200">
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名"
            style="width: 250px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="status"
            placeholder="选择用户状态"
            style="width: 150px"
            @change="getUserList"
          >
            <el-option
              v-for="item in Object.values(UserStatus)"
              :key="item"
              :label="item === UserStatus.Active ? '正常' : '封禁'"
              :value="item"
            />
          </el-select>
          <el-button type="primary" icon="search" @click="getUserList">
            搜索
          </el-button>
          <el-button icon="refresh" @click="reset"> 重置 </el-button>
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
        :data="userList"
        v-loading="loading"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          v-bind="column"
        >
          <template #="{ row }" v-if="column.prop === 'email'">
            <template v-if="row.email">{{ row.email }}</template>
            <template v-else>
              <el-tag type="danger">未绑定邮箱</el-tag>
            </template>
          </template>
          <template #="{ row }" v-else-if="column.prop === 'role'">
            <template v-if="row.roles.length > 0">
              <el-tag class="mr-1 mb-1" v-for="role in row.roles" :key="role">{{
                role.name
              }}</el-tag>
            </template>
            <template v-else>
              <el-tag type="danger">未分配角色</el-tag>
            </template>
          </template>
          <template #="{ row }" v-else-if="column.prop.includes('Time')">
            {{ formateTime(row[column.prop]) }}
          </template>
          <template #="{ row }" v-else-if="column.prop === 'actions'">
            <el-button-group v-for="btn in btnConfig" :key="btn.label">
              <el-button
                v-bind="btn.props"
                @click="btn.click(row)"
                v-if="btn.visible(row)"
              >
                {{ btn.label }}
              </el-button>
            </el-button-group>
          </template>
          <template #="{ row }" v-else-if="column.prop === 'status'">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">{{
              row.status === "active" ? "正常" : "封禁"
            }}</el-tag>
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
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getUserList"
        @size-change="getUserList"
      />
    </div>

    <el-drawer v-model="drawer" title="分配角色">
      <CheckRoles :roles="roles" :open="drawer" @change="handleChange" />
      <template #footer>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import {  tableColumns } from "./config";
import { onMounted } from "vue";
import { useUserList } from "./useUserList";
import { UserStatus } from "@/api/user/type";
import CheckRoles from "./components/check-roles.vue";
import { formateTime } from "@/utils/formdate";
const {
  searchKeyword,
  page,
  pageSize,
  total,
  userList,
  btnConfig,
  drawer,
  loading,
  status,
  roles,
  getUserList,
  reset,
  handleSave,
  handleChange,
} = useUserList();
onMounted(() => {
  getUserList();
});
</script>

<style scoped></style>
