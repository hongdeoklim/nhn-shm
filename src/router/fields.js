/**
 * fieldCode: 필드코드
 * pageType: 페이지 타입 (list, write, page)
 * fieldId: 필드 아이디 (수정시 필요)
 */
export default [
  {
    path: '/project/:proj_id',
    component: () => import('@/layouts/ProjectLayout.vue'),
    meta:{
      authRequired: true
    },
    children: [
      {
        path: 'field/:fieldCode',
        name: 'list|fields',
        meta: {},
        component: () => import('@/views/fields/Index.vue')
      },
      {
        path: 'field/:fieldCode/:pageType',
        name: 'write|fields',
        meta: {},
        component: () => import('@/views/fields/Index.vue')
      },
      {
        path: 'field/:fieldCode/:pageType/:fieldId',
        name: 'update|fields',
        meta: {},
        component: () => import('@/views/fields/Index.vue')
      },
      {
        path: 'field/:fieldCode/:pageType',
        name: 'info|fields',
        meta: {},
        component: () => import('@/views/fields/Index.vue')
      },
      {
        path: 'field/:fieldCode/:pageType',
        name: 'excel-upload|fields',
        meta: {},
        component: () => import('@/views/fields/Index.vue')
      }
    ]
  }
]
