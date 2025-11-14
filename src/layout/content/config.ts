import type { TableColumns } from "@/layout/users/type";

// 表格列配置
export const tableColumns: TableColumns[] = [
  {
    prop: "id",
    label: "ID",
    align: "center",
    width: 80,
  },
  {
    prop: "name",
    label: "分类名称",
    align: "center",
  },
  {
    prop: "description",
    label: "分类描述",
    align: "center",
  },
  {
    prop: "works",
    label: "作品数量",
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
