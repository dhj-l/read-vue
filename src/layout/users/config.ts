import type { TableColumns } from "@/layout/users/type";

export const tableColumns: TableColumns[] = [
  {
    prop: "id",
    label: "ID",
    align: "center",
    width: 80,
  },
  {
    prop: "username",
    label: "用户名",
    align: "center",
  },
  {
    prop: "email",
    label: "邮箱",
    align: "center",
  },

  {
    prop: "role",
    label: "角色",
    align: "center",
  },
  {
    prop: "createdAt",
    label: "创建时间",
    align: "center",
  },
  {
    prop: "updatedAt",
    label: "更新时间",
    align: "center",
  },
  {
    prop: "actions",
    label: "操作",
    align: "center",
    fixed: "right",
  },
];
