import { deleteRoleAPI, getRolesAPI, assignPermissionAPI } from "@/api/role/role";
import type { RoleItem } from "@/api/user/type";
import { ref } from "vue";
import type { AddRolesType } from "./components/type";
import type { AddRoleRequest } from "@/api/role/type";
import { ElMessage } from "element-plus";
import { messageHandle } from "./config";

export const useRoles = () => {
  const roles = ref<RoleItem[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const type = ref<AddRolesType>("add");
  const searchKeyword = ref("");
  const open = ref(false);
  const roleData = ref<AddRoleRequest>();
  
  // 分配权限相关
  const permissionDialogVisible = ref(false);
  const currentRoleId = ref(0);
  const currentRoleName = ref("");
  const initialPermissions = ref<number[]>([]);
  
  const getRoles = async () => {
    loading.value = true;
    try {
      const { data } = await getRolesAPI({
        page: page.value,
        pageSize: pageSize.value,
        name: searchKeyword.value,
      });
      roles.value = data.roles;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  };

  const resetHandler = () => {
    searchKeyword.value = "";
    page.value = 1;
    pageSize.value = 10;
    getRoles();
  };

  /**
   * 添加角色回调
   */
  const addRoleHandler = () => {
    getRoles();
  };
  
  const closeHandler = () => {
    type.value = "add";
    roleData.value = undefined;
  };
  
  const handleEdit = (row: RoleItem) => {
    type.value = "edit";
    roleData.value = row;
    open.value = true;
  };
  
  const handleDelete = async (id: number) => {
    await deleteRoleAPI(id);
    ElMessage.success("删除角色成功");
    getRoles();
  };
  
  /**
   * 打开分配权限弹窗
   */
  const handleAssignPermission = (row: RoleItem) => {
    currentRoleId.value = row.id;
    currentRoleName.value = row.name;
    // 提取现有权限ID
    initialPermissions.value = row.permissions?.map(p => p.id) || [];
    permissionDialogVisible.value = true;
  };
  
  /**
   * 提交权限分配
   */
  const submitAssignPermission = async (permissionIds: number[]) => {
    try {
      await assignPermissionAPI({
        roleId: currentRoleId.value,
        permissionIds,
      });
      ElMessage.success("权限分配成功");
      permissionDialogVisible.value = false;
      getRoles(); // 刷新角色列表
    } catch (error) {
      ElMessage.error("权限分配失败");
    }
  };
  
  /**
   * 关闭权限分配弹窗
   */
  const closePermissionDialog = () => {
    permissionDialogVisible.value = false;
  };
  
  const btnConfig = [
    {
      label: "修改",
      props: {
        type: "primary",
        link: true,
      },
      click: (row: RoleItem) => {
        handleEdit(row);
      },
    },
    {
      label: "分配权限",
      props: {
        type: "success",
        link: true,
      },
      click: (row: RoleItem) => {
        handleAssignPermission(row);
      },
    },
    {
      label: "删除",
      props: {
        type: "danger",
        link: true,
      },
      click: (row: RoleItem) => {
        messageHandle({
          message: `确定删除角色 ${row.name} 吗？`,
          type: "warning",
          confirmText: "确定",
          cancelText: "取消",
          handle: () => handleDelete(row.id),
        });
      },
    },
  ];
  
  return {
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
  };
};
