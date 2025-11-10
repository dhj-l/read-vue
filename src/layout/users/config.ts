import type { TableColumns } from "@/layout/users/type";
import dayjs from "dayjs";
import type { MessageProps } from "./type";
import { ElMessageBox } from "element-plus";

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
    prop: "status",
    label: "状态",
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

export const rolesColumns: TableColumns[] = [
  {
    prop: "id",
    label: "ID",
    align: "center",
    width: 80,
  },
  {
    prop: "name",
    label: "角色名称",
    align: "center",
  },
  {
    prop: "value",
    label: "角色值",
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

export const formateTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD");
};

export enum MessageTypeText {
  success = "成功",
  warning = "警告",
  danger = "危险",
  info = "信息",
  primary = "主要",
  error = "错误",
}

export const messageHandle = (props: MessageProps) => {
  ElMessageBox.confirm(props.message, MessageTypeText[props.type || "info"], {
    confirmButtonText: props.confirmText || "确定",
    cancelButtonText: props.cancelText || "取消",
    type: props.type || "info",
  }).then(async () => {
    await props.handle();
  });
};
