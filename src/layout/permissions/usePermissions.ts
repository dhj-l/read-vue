import {
  deletePermissionAPI,
  getPermissionsAPI,
} from "@/api/permission/permission";
import type {
  PermissionItem,
  CreatePermissionRequest,
} from "@/api/permission/type";
import { ref } from "vue";
import type { AddPermissionType } from "./type";
import { ElMessage } from "element-plus";
import { messageHandle } from "../users/config";

export const usePermissions = () => {
  const permissions = ref<PermissionItem[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const type = ref<AddPermissionType>("add");
  const searchKeyword = ref("");
  const open = ref(false);
  const permissionData = ref<CreatePermissionRequest & { id?: number }>();

  // 获取权限列表
  const getPermissions = async () => {
    loading.value = true;
    try {
      const { data } = await getPermissionsAPI({
        page: page.value,
        pageSize: pageSize.value,
        name: searchKeyword.value,
      });
      permissions.value = data.permissions;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  };

  // 重置搜索
  const resetHandler = () => {
    searchKeyword.value = "";
    page.value = 1;
    pageSize.value = 10;
    getPermissions();
  };

  // 添加权限回调
  const addPermissionHandler = () => {
    getPermissions();
  };

  // 关闭回调
  const closeHandler = () => {
    type.value = "add";
    permissionData.value = undefined;
  };

  // 编辑权限
  const handleEdit = (row: PermissionItem) => {
    type.value = "edit";
    permissionData.value = row;
    open.value = true;
  };

  // 删除权限
  const handleDelete = async (id: number) => {
    await deletePermissionAPI(id);
    ElMessage.success("删除权限成功");
    getPermissions();
  };

  // 按钮配置
  const btnConfig = [
    {
      label: "修改",
      props: {
        type: "primary",
        link: true,
      },
      click: (row: any) => {
        handleEdit(row);
      },
    },
    {
      label: "删除",
      props: {
        type: "danger",
        link: true,
      },
      click: (row: PermissionItem) => {
        messageHandle({
          message: `确定删除权限 ${row.name} 吗？`,
          type: "warning",
          confirmText: "确定",
          cancelText: "取消",
          handle: () => handleDelete(row.id),
        });
      },
    },
  ];

  return {
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
  };
};
