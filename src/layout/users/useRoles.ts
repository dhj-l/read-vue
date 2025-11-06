import { getRolesAPI } from "@/api/role/role";
import type { RoleItem } from "@/api/user/type";
import { ref } from "vue";

export const useRoles = () => {
  const roles = ref<RoleItem[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const searchKeyword = ref("");
  const open = ref(false);
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

  const btnConfig = [
    {
      label: "修改",
      props: {
        type: "primary",
        link: true,
      },
      click: (row: RoleItem) => {
        console.log(row);
      },
    },
    {
      label: "删除",
      props: {
        type: "danger",
        link: true,
      },
      click: (row: RoleItem) => {
        console.log(row);
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
    getRoles,
    resetHandler,
  };
};
