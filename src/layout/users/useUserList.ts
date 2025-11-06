import { UserStatus, type UserItem, type RoleItem } from "@/api/user/type";
import {
  assignRolesAPI,
  banUserAPI,
  getUserListAPI,
  unbanUserAPI,
} from "@/api/user/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";

export const useUserList = () => {
  // 搜索关键词
  const searchKeyword = ref("");
  // 分页数据
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const status = ref(UserStatus.Active);
  const loading = ref(false);
  // 用户列表
  const userList = ref<UserItem[]>([]);
  const drawer = ref(false);
  const roles = ref<RoleItem[]>([]);
  const roleIds = ref<number[]>([]);
  const currentUserId = ref<number>(0);
  /**
   * 获取用户列表
   */
  const getUserList = async () => {
    loading.value = true;
    try {
      const { data } = await getUserListAPI({
        page: page.value,
        pageSize: pageSize.value,
        username: searchKeyword.value,
        status: status.value,
      });
      // 检查数据是否存在，避免401处理后data为null的情况
      if (data) {
        total.value = data?.total;
        userList.value = data?.users;
      }
    } catch (error) {
      // 错误已经在HTTP拦截器中处理，这里可以添加额外的错误处理逻辑
      console.error("获取用户列表失败:", error);
    } finally {
      loading.value = false;
    }
  };
  /**
   * 重置
   */
  const reset = () => {
    searchKeyword.value = "";
    page.value = 1;
    pageSize.value = 10;
    status.value = UserStatus.Active;
    getUserList();
  };
  /**
   * 封禁用户
   */
  const banUser = async (id: number) => {
    await banUserAPI(id);
    ElMessage.success("封禁成功");
    getUserList();
  };
  /**
   * 解封用户
   */
  const unbanUser = async (id: number) => {
    await unbanUserAPI(id);
    ElMessage.success("解封成功");
    getUserList();
  };
  /**
   * 按钮操作配置
   */
  const btnConfig = [
    {
      label: "封禁",
      props: {
        link: true,
        type: "danger",
      },
      // 只有正常用户才能被封禁
      visible: (row: UserItem) => row.status === UserStatus.Active,
      click: (row: UserItem) => {
        ElMessageBox.confirm(`确定封禁用户 ${row.username} 吗？`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          banUser(row.id);
        });
      },
    },
    {
      label: "解封",
      props: {
        link: true,
        type: "success",
      },
      // 只有封禁用户才能被解封
      visible: (row: UserItem) => row.status === UserStatus.Disabled,
      click: (row: UserItem) => {
        ElMessageBox.confirm(`确定解封用户 ${row.username} 吗？`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          unbanUser(row.id);
        });
      },
    },
    {
      label: "分配角色",
      props: {
        link: true,
        type: "info",
      },
      // 只有正常用户才能被分配角色
      visible: (row: UserItem) => row.status === UserStatus.Active,
      click: (row: UserItem) => {
        roles.value = row.roles;
        currentUserId.value = row.id;
        drawer.value = true;
      },
    },
  ];
  /**
   * 保存分配角色
   */
  const handleSave = async () => {
    await assignRolesAPI(currentUserId.value, roleIds.value);
    ElMessage.success("分配角色成功");
    drawer.value = false;
    getUserList();
  };
  const handleChange = (roles: RoleItem[]) => {
    roleIds.value = roles.map((item) => item.id);
  };
  return {
    searchKeyword,
    page,
    pageSize,
    total,
    userList,
    btnConfig,
    loading,
    status,
    drawer,
    roles,
    getUserList,
    reset,
    handleSave,
    handleChange,
  };
};
