export default [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    meta:{
      authPosition: 2,
      authRequired: true,
      deviceRequired: false
    },
    children: [
      {
        path: 'tab/:boardId',
        name: 'root|list|tab',
        meta: {},
        component: () => import('@/views/boards/tab/List.vue')
      },
      {
        path: 'tab/:boardId/write',
        name: 'root|write|tab',
        meta: {},
        component: () => import('@/views/boards/tab/Write.vue')
      },
      {
        path: 'tab/:boardId/write/:postId',
        name: 'root|write|update|tab',
        meta: {},
        component: () => import('@/views/boards/tab/Write.vue')
      }
    ]
  },
  {
    path: '/project/:proj_id',
    component: () => import('@/layouts/ProjectLayout.vue'),
    meta:{
      authRequired: true
    },
    children: [
      {
        path: 'tab/:boardId',
        name: 'list|tab',
        meta: {},
        component: () => import('@/views/boards/tab/List.vue')
      },
      {
        path: 'tab/:boardId/write',
        name: 'write|tab',
        meta: {},
        component: () => import('@/views/boards/tab/Write.vue')
      },
      {
        path: 'tab/:boardId/write/:postId',
        name: 'write|update|tab',
        meta: {},
        component: () => import('@/views/boards/tab/Write.vue')
      },
      {
        path: 'tab/:boardId/page',
        name: 'page|tab',
        meta: {},
        component: () => import('@/views/boards/tab/Page.vue')
      }
    ]
  }
]
