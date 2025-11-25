import type { ButtonConfig } from "@/layout/content/type";
import { useUserStore } from "@/stores/modules/user/user";

export const useReadChapter = () => {
  const { logout } = useUserStore();
  const dropMenuConfigs: ButtonConfig<any>[] = [
    {
      label: "退出登录",
      props: {},
      click: () => {
        logout();
      },
    },
  ];

  return {
    dropMenuConfigs,
  };
};
