import type { WorkReads } from "@/api/works/type";
import * as echarts from "echarts";

// 动态生成颜色列表，支持任意数量的数据
export const colorList = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#84cc16",
  "#14b8a6",
];
// 初始化图表
export const initChart = (chartRef: HTMLElement, data: WorkReads[]) => {
  if (!chartRef) return;

  const chart = echarts.init(chartRef);

  // 转换数据格式 - 使用真实API数据，显示所有数据
  const formattedData = data.map((item, index) => ({
    name: item.title,
    value: item.readCount,
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: 0,
      right: "5%",
      top: "5%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: "value",
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: true,
            margin: 30,
          },
        },
        data: formattedData.map((item) => item.name),
        axisLabel: {
          margin: 50,
          fontSize: 14,
          align: "left",
          color: "#333",
          rich: (() => {
            const rich = {} as any;
            formattedData.forEach((item, index: number) => {
              rich[`a${index + 1}`] = {
                color: "#fff",
                backgroundColor: colorList[index % colorList.length],
                width: 30,
                height: 30,
                align: "center",
                borderRadius: 2,
              };
            });
            return rich;
          })(),
          formatter: function (params: string) {
            const index = formattedData
              .map((item) => item.name)
              .indexOf(params);
            return [`{a${index + 1}|${index + 1}}`].join("\n");
          },
        },
      },
      {
        type: "category",
        inverse: true,
        axisTick: "none",
        axisLine: "none",
        show: true,
        data: formattedData.map((item) => item.value),
        axisLabel: {
          show: true,
          fontSize: 14,
          color: "#333",
          formatter: "{value}",
        },
      },
    ],
    series: [
      {
        z: 2,
        name: "阅读量",
        type: "bar",
        barCategoryGap: "40%",
        barGap: "20%",
        barWidth: 16,
        data: formattedData.map((item, i) => {
          return {
            value: item.value,
            itemStyle: {
              color: colorList[i],
              barBorderRadius: [10, 10, 10, 10],
            },
          };
        }),
        label: {
          normal: {
            color: "#666",
            show: true,
            position: [0, "-18px"],
            textStyle: {
              fontSize: 14,
            },
            formatter: function (a: any) {
              return a.name;
            },
          },
        },
      },
    ],
  };

  chart.setOption(option);

  // 监听窗口大小变化
  window.addEventListener("resize", () => {
    chart.resize();
  });
};
