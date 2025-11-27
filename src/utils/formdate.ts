import dayjs from "dayjs";

export const formateTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD");
};

export const formateCount = (count: number) => {
  if (count < 10000) return count;
  return (count / 10000).toFixed(2) + "万";
};
