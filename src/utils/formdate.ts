import dayjs from "dayjs";

export const formateTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD");
};
