export default [
  {
    path: "/project/:proj_id",
    component: () => import("@/layouts/ProjectLayout.vue"),
    meta: {
      authRequired: true,
    },
    children: [
      // ========== 자료실 ============
      {
        path: "filelibrary/320",
        name: "filelibrary-320",
        meta: {
          activeCode: "filelibrary-320",
          boardId: 320,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/321",
        name: "filelibrary-321",
        meta: {
          activeCode: "filelibrary-321",
          boardId: 321,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/322",
        name: "filelibrary-322",
        meta: {
          activeCode: "filelibrary-322",
          boardId: 322,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/323",
        name: "filelibrary-323",
        meta: {
          activeCode: "filelibrary-323",
          boardId: 323,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/324",
        name: "filelibrary-324",
        meta: {
          activeCode: "filelibrary-324",
          boardId: 324,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/325",
        name: "filelibrary-325",
        meta: {
          activeCode: "filelibrary-325",
          boardId: 325,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/340",
        name: "filelibrary-340",
        meta: {
          activeCode: "filelibrary-340",
          boardId: 340,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/341",
        name: "filelibrary-341",
        meta: {
          activeCode: "filelibrary-341",
          boardId: 341,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/342",
        name: "filelibrary-342",
        meta: {
          activeCode: "filelibrary-342",
          boardId: 342,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/343",
        name: "filelibrary-343",
        meta: {
          activeCode: "filelibrary-343",
          boardId: 343,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/347",
        name: "filelibrary-347",
        meta: {
          activeCode: "filelibrary-347",
          boardId: 347,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },


      {
        path: "filelibrary/454",
        name: "filelibrary-454",
        meta: {
          activeCode: "filelibrary-454",
          boardId: 454,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/455",
        name: "filelibrary-455",
        meta: {
          activeCode: "filelibrary-455",
          boardId: 455,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },

      // 자료실 - 현업
      {
        path: "filelibrary/545",
        name: "filelibrary-545",
        meta: {
          activeCode: "filelibrary-545",
          boardId: 545,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/546",
        name: "filelibrary-546",
        meta: {
          activeCode: "filelibrary-546",
          boardId: 546,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/547",
        name: "filelibrary-547",
        meta: {
          activeCode: "filelibrary-547",
          boardId: 547,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/548",
        name: "filelibrary-548",
        meta: {
          activeCode: "filelibrary-548",
          boardId: 548,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/549",
        name: "filelibrary-549",
        meta: {
          activeCode: "filelibrary-549",
          boardId: 549,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/550",
        name: "filelibrary-550",
        meta: {
          activeCode: "filelibrary-550",
          boardId: 550,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
      {
        path: "filelibrary/551",
        name: "filelibrary-551",
        meta: {
          activeCode: "filelibrary-551",
          boardId: 551,
        },
        component: () => import("@/views/filelibrary/FileLibraryList.vue"),
      },
    ],
  },
];
