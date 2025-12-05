import type { TableColumns } from "@/layout/users/type";

export const tableColumns: TableColumns[] = [
  { prop: "id", label: "ID", align: "center", width: 80 },
  { prop: "name", label: "章节名称", align: "center", minWidth: 160 },
  { prop: "work", label: "所属作品", align: "center", minWidth: 160 },
  { prop: "count", label: "字数", align: "center", width: 100 },
  { prop: "status", label: "状态", align: "center", width: 120 },
  { prop: "createTime", label: "创建时间", align: "center", width: 140 },
  { prop: "updateTime", label: "更新时间", align: "center", width: 140 },
  {
    prop: "actions",
    label: "操作",
    align: "center",
    fixed: "right",
    minWidth: 220,
  },
];
