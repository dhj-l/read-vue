import { ElInput, ElSelect } from "element-plus";
import type { TableColumns } from "../users/type";

export const componentMap = new Map();
componentMap.set("el-input", ElInput);
componentMap.set("el-select", ElSelect);
export enum WorkStatus {
  /**
   * 全部
   */
  ALL = -1,
  /**
   * 未上架
   */
  UNPUBLISHED = 0,
  /**
   * 已上架
   */
  PUBLISHED = 1,
  /**
   * 已下架
   */
  UNLISTED = 2,
  /**
   * 连载中
   */
  SERIAL = 3,
  /**
   * 已完结
   */
  ENDED = 4,
  /**
   * 审核失败
   */
  REJECTED = 5,
  /**
   * 查询已上架，连载中，已完结的作品
   */
  PUBLISHED_SERIAL_ENDED = 6,
}
export const workStatusMap = new Map();
workStatusMap.set(WorkStatus.UNPUBLISHED, {
  label: "未上架",
  type: "info",
});
workStatusMap.set(WorkStatus.PUBLISHED, {
  label: "已上架",
  type: "success",
});
workStatusMap.set(WorkStatus.UNLISTED, {
  label: "已下架",
  type: "danger",
});
workStatusMap.set(WorkStatus.SERIAL, {
  label: "连载中",
  type: "warning",
});
workStatusMap.set(WorkStatus.ENDED, {
  label: "已完结",
  type: "primary",
});
workStatusMap.set(WorkStatus.REJECTED, {
  label: "审核失败",
  type: "danger",
});
export enum CountLevel {
  /**
   * 所有
   */
  ALL = -1,
  /**
   * 0-30万字
   */
  LEVEL_1 = 1,
  /**
   * 30-50万字
   */
  LEVEL_2 = 2,
  /**
   * 50-80万字
   */
  LEVEL_3 = 3,
  /**
   * 80-120万字
   */
  LEVEL_4 = 4,
  /**
   * 120万字以上
   */
  LEVEL_5 = 5,
}

export const statusOptions = [
  {
    label: "全部",
    value: WorkStatus.ALL,
  },
  {
    label: "未上架",
    value: WorkStatus.UNPUBLISHED,
  },
  {
    label: "已上架",
    value: WorkStatus.PUBLISHED,
  },
  {
    label: "已下架",
    value: WorkStatus.UNLISTED,
  },
  {
    label: "连载中",
    value: WorkStatus.SERIAL,
  },
  {
    label: "已完结",
    value: WorkStatus.ENDED,
  },
  {
    label: "审核失败",
    value: WorkStatus.REJECTED,
  },
];
export const countOptions = [
  {
    label: "所有",
    value: CountLevel.ALL,
  },
  {
    label: "0-30万字",
    value: CountLevel.LEVEL_1,
  },
  {
    label: "30-50万字",
    value: CountLevel.LEVEL_2,
  },
  {
    label: "50-80万字",
    value: CountLevel.LEVEL_3,
  },
  {
    label: "80-120万字",
    value: CountLevel.LEVEL_4,
  },
  {
    label: "120万字以上",
    value: CountLevel.LEVEL_5,
  },
];

export const workListColumns: TableColumns[] = [
  {
    label: "ID",
    prop: "id",
    width: "80px",
    align: "center",
  },
  {
    label: "作品封面",
    prop: "cover_url",
    width: "120px",
    align: "center",
  },
  {
    label: "作品名称",
    prop: "title",
    align: "center",
  },
  {
    label: "作品描述",
    prop: "description",
    align: "center",
  },
  {
    label: "作者",
    prop: "user",
    align: "center",
  },
  {
    label: "所属分类",
    prop: "categorys",
    align: "center",
  },
  {
    label: "作品状态",
    prop: "status",
    align: "center",
  },
  {
    label: "作品字数",
    prop: "count",
    align: "center",
  },
  {
    label: "阅读数量",
    prop: "readCount",
    align: "center",
  },
  {
    label: "创建时间",
    prop: "createTime",
    align: "center",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    align: "center",
  },
  {
    label: "操作",
    prop: "actions",
    align: "center",
  },
];
