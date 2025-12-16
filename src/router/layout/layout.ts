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
          permission: "dashboard",
        },
      },
    ],
  },
];

// 权限路由（作为 /layout 的子路由）
export const permissionRoutes: RouteRecordRaw[] = [
  // 用户管理模块
  {
    path: "user-list",
    name: "UserList",
    component: () => import("@/layout/users/user-list.vue"),
    meta: {
      title: "用户列表",
      icon: "UserFilled",
      requireAuth: true,
      permission: "user-list",
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
      permission: "user-roles",
    },
  },
  {
    path: "permissions",
    name: "Permissions",
    component: () => import("@/layout/permissions/permissions.vue"),
    meta: {
      title: "权限管理",
      icon: "Key",
      requireAuth: true,
      permission: "permissions",
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
      permission: "categories",
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
      permission: "works",
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
      permission: "book-checks",
    },
  },
  {
    path: "chapters",
    name: "Chapters",
    component: () => import("@/layout/chapters/chapters.vue"),
    meta: {
      title: "章节管理",
      icon: "Edit",
      requireAuth: true,
      permission: "chapters",
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
      permission: "chapter-checks",
    },
  },
  {
    path: "banner",
    name: "Banner",
    component: () => import("@/layout/banner/banner.vue"),
    meta: {
      title: "轮播图管理",
      icon: "Edit",
      requireAuth: true,
      permission: "banner",
    },
  },
];

//404页面（放在最后作为兜底路由）
export const notFoundRoute: RouteRecordRaw[] = [
  {
    path: "404",
    name: "NotFound",
    component: () => import("@/layout/404/404.vue"),
    meta: {
      title: "页面不存在",
      requireAuth: false, // 404页面不需要权限
    },
  },
  // 通配符路由，匹配所有不存在的路径
  {
    path: ":pathMatch(.*)*",
    redirect: "/layout/404",
    meta: {
      requireAuth: false,
    },
  },
];
