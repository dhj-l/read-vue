import type { RouteRecordRaw } from "vue-router";

export const layoutRoutes: RouteRecordRaw[] = [
  {
    path: "/layout",
    name: "Layout",
    component: () => import("@/layout/layout.vue"),
    redirect: "/layout/dashboard",
    children: [
      // 仪表盘
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/layout/dashboard/dashboard.vue"),
        meta: {
          title: "仪表盘",
          icon: "House",
          requireAuth: true,
        },
      },
      // 用户管理模块
      {
        path: "user-list",
        name: "UserList",
        component: () => import("@/layout/users/user-list.vue"),
        meta: {
          title: "用户列表",
          icon: "UserFilled",
          requireAuth: true,
        },
      },
      {
        path: "user-roles",
        name: "UserRoles",
        component: () => import("@/layout/users/user-roles.vue"),
        meta: {
          title: "角色管理",
          icon: "Avatar",
          requireAuth: true,
        },
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("@/layout/content/categories.vue"),
        meta: {
          title: "分类管理",
          icon: "Folder",
          requireAuth: true,
        },
      },
      {
        path: "works",
        name: "Works",
        component: () => import("@/layout/works/works.vue"),
        meta: {
          title: "作品管理",
          icon: "DocumentCopy",
          requireAuth: true,
        },
      },
      {
        path: "book-checks",
        name: "BookChecks",
        component: () => import("@/layout/checks/book-checks.vue"),
        meta: {
          title: "审核管理",
          icon: "Edit",
          requireAuth: true,
        },
      },
      {
        path: "chapters",
        name: "Chapters",
        component: () => import("@/layout/chapters/chapters.vue"),
        meta: {
          title: "章节管理",
          icon: "Book",
          requireAuth: true,
        },
      },
      {
        path: "chapter-checks",
        name: "ChapterChecks",
        component: () => import("@/layout/checks/chapter-checks.vue"),
        meta: {
          title: "章节审核管理",
          icon: "Edit",
          requireAuth: true,
        },
      },
    ],
  },
];
