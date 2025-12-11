import type { PromptsProps } from "ant-design-x-vue";
import { h } from "vue";
import {
  BulbOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SmileOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
export const items: PromptsProps["items"] = [
  {
    key: "1",
    icon: h(BulbOutlined, { style: { color: "#FFD700" } }),
    label: "创作灵感",
    description: "有什么新的创作灵感吗？",
  },
  {
    key: "2",
    icon: h(InfoCircleOutlined, { style: { color: "#1890FF" } }),
    label: "创作背景",
    description: "帮助我理解这个主题的背景知识。",
  },
  {
    key: "3",
    icon: h(RocketOutlined, { style: { color: "#722ED1" } }),
    label: "效率提升写作效率",
    description: "如何更快、更有效率地完成任务？",
  },
  {
    key: "4",
    icon: h(SmileOutlined, { style: { color: "#52C41A" } }),
    label: "创作建议",
    description: "有什么创作建议吗？",
  },
  {
    key: "5",
    icon: h(WarningOutlined, { style: { color: "#FF4D4F" } }),
    label: "常见问题解决方案",
    description: "如何解决常见问题？分享一些经验！",
  },
];
