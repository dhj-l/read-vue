import { deleteRoleAPI, getRolesAPI } from "@/api/role/role";
import type { RoleItem } from "@/api/user/type";
import { ref } from "vue";
import type { AddRolesType } from "./components/type";
import type { AddRoleRequest } from "@/api/role/type";
import { ElMessage, ElMessageBox } from "element-plus";

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
      label: "删除",
      props: {
        type: "danger",
        link: true,
      },
      click: (row: RoleItem) => {
        ElMessageBox.confirm(`确定删除角色 ${row.name} 吗？`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          handleDelete(row.id);
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
  };
};
