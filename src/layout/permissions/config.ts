import type { TableColumns } from "./type";

// 权限表格列配置
export const permissionsColumns: TableColumns[] = [
  {
    prop: "id",
    label: "ID",
    align: "center",
    width: 80,
  },
  {
    prop: "name",
    label: "权限名称",
    align: "center",
  },
  {
    prop: "value",
    label: "权限值",
    align: "center",
  },
  {
    prop: "description",
    label: "权限描述",
    align: "center",
  },
  {
    prop: "createTime",
    label: "创建时间",
    align: "center",
  },
  {
    prop: "updateTime",
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
