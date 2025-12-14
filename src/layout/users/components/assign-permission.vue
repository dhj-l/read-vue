<template>
  <el-drawer
    v-model="open"
    title="分配权限"
    size="600px"
    :direction="'rtl'"
    :close-on-click-modal="false"
  >
    <div class="drawer-content">
      <div class="mb-4">
        <h4 class="text-lg font-semibold mb-2">角色名称：{{ roleName }}</h4>
        <el-divider class="my-2" />
        <h4 class="text-lg font-semibold mb-2">可分配权限列表</h4>
        <div class="permission-tree max-h-96 overflow-y-auto">
          <div class="mb-4">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              class="mb-4"
            >
              全选
            </el-checkbox>
          </div>
          <el-checkbox-group
            v-model="checkedPermissions"
            @change="handleCheckedPermissionsChange"
          >
            <el-checkbox
              v-for="permission in permissions"
              :key="permission.id"
              :value="permission.id"
              class="block mb-2"
            >
              <span class="font-medium">{{ permission.name }}</span>
              <span class="text-gray-500 text-sm ml-2"
                >({{ permission.value }})</span
              >
              <span class="text-gray-400 text-xs ml-2">{{
                permission.description
              }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="drawer-footer flex justify-end gap-2 mt-4">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">
          确定
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { PermissionItem } from "@/api/permission/type";
import { getPermissionsAPI } from "@/api/permission/permission";
import { ElMessage } from "element-plus";
import type { CheckboxValueType } from "element-plus";

const props = defineProps<{
  visible: boolean;
  roleId: number;
  roleName: string;
  initialPermissions?: number[];
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", permissions: number[]): void;
  (e: "cancel"): void;
}>();

const open = ref(false);
const permissions = ref<PermissionItem[]>([]);
const checkedPermissions = ref<number[]>([]);
const loading = ref(false);
const roleName = ref(props.roleName);

// 全选相关状态
const checkAll = ref(false);
const isIndeterminate = ref(false);

watch(
  () => props.visible,
  (newVal) => {
    open.value = newVal;
    if (newVal) {
      roleName.value = props.roleName;
      checkedPermissions.value = [...(props.initialPermissions || [])];
      fetchPermissions();
    }
  },
  { immediate: true }
);

watch(
  () => open.value,
  (newVal) => {
    if (!newVal) {
      emit("update:visible", false);
    }
  }
);

watch(
  () => permissions.value,
  () => {
    // 当权限列表加载完成后，更新全选状态
    updateCheckAllStatus();
  }
);

const fetchPermissions = async () => {
  loading.value = true;
  try {
    const { data } = await getPermissionsAPI({ page: 1, pageSize: 100 });
    permissions.value = data.permissions;
  } catch (error) {
    ElMessage.error("获取权限列表失败");
  } finally {
    loading.value = false;
  }
};

// 更新全选状态
const updateCheckAllStatus = () => {
  const checkedCount = checkedPermissions.value.length;
  checkAll.value = checkedCount === permissions.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < permissions.value.length;
};

// 全选/取消全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedPermissions.value = val
    ? permissions.value.map((permission) => permission.id)
    : [];
  isIndeterminate.value = false;
};

// 单个权限选择变化
const handleCheckedPermissionsChange = () => {
  updateCheckAllStatus();
};

const submit = () => {
  emit("submit", checkedPermissions.value);
};

const cancel = () => {
  open.value = false;
  emit("cancel");
};
</script>

<style scoped>
.drawer-content {
  padding: 10px;
}

.permission-tree {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.drawer-footer {
  padding: 10px 0;
}
</style>
