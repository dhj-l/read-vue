import type { CategoryBookCount } from "@/api/category/type";
import * as echarts from "echarts";

// 初始化玫瑰饼图
export const initRosePieChart = (
  chartRef: HTMLElement,
  data: CategoryBookCount[]
) => {
  if (!chartRef) return;

  const chart = echarts.init(chartRef);

  // 转换数据格式
  const formattedData = data.map((item, index) => ({
    name: item.categoryName,
    value: item.workCount,
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: {
        fontSize: 14,
        color: "#333",
      },
    },
    series: [
      {
        name: "小说分类分布",
        type: "pie",
        radius: ["30%", "70%"], // 玫瑰饼图半径范围
        center: ["60%", "50%"], // 饼图中心位置
        avoidLabelOverlap: false,
        roseType: "area", // 玫瑰饼图关键配置
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          fontSize: 14,
          formatter: "{b}\n{c}本",
          color: "#333",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: "#999",
          },
        },
        data: formattedData.map((item, index) => ({
          value: item.value,
          name: item.name,
        })),
      },
    ],
  };

  chart.setOption(option);

  // 监听窗口大小变化
  window.addEventListener("resize", () => {
    chart.resize();
  });

  // 返回图表实例以便后续清理
  return chart;
};
