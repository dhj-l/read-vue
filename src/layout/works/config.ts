import { ElInput, ElSelect } from "element-plus";
import type { WorksSearchConfigItem } from "./type";

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
}
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
