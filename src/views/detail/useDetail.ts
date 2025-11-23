import type { Work } from "@/api/works/type";
import { getWorkDetailAPI } from "@/api/works/works";
import { ref } from "vue";

export const useDetail = () => {
  const workInfo = ref<Work>();
  const getWorkInfo = async (id: number) => {
    const res = await getWorkDetailAPI(id);

    workInfo.value = res.data;
  };

  return {
    workInfo,
    getWorkInfo,
  };
};
