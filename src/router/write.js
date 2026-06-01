const listChildren = []

const report = [
  {
    path: 'report/:boardSlug',
    name: 'write|approval_create',
    component: () => import('@/views/write/report/Index'),
    meta: {
      permission_level: 3
    }
  },
  {
    path: 'report/:boardSlug/:postId',
    name: 'write|approval_update',
    component: () => import('@/views/write/report/Index'),
    meta: {
      permission_level: 3
    }
  }
]
const accident = [
  {
    path: 'accident/:boardSlug',
    name: 'write|approval_tab_create|accident',
    component: () => import('@/views/write/accident/Index'),
    meta: {
      parent: 'safety-accident',
      permission_level: 3
    }
  },
  {
    path: 'accident/:boardSlug/:postId',
    name: 'write|approval_tab_update|accident',
    component: () => import('@/views/write/accident/Index'),
    meta: {
      parent: 'safety-accident',
      permission_level: 3
    }
  }
]
const safety_check = [
  {
    path: 'safety_check/:boardSlug',
    name: 'write|approval_tab_create|safety_check',
    component: () => import('@/views/write/safetycheck/Index'),
    meta: {
      parent: 'risk-check',
      permission_level: 3
    }
  },
  {
    path: 'safety_check/:boardSlug/:postId',
    name: 'write|approval_tab_update|safety_check',
    component: () => import('@/views/write/safetycheck/Index'),
    meta: {
      parent: 'risk-check',
      permission_level: 3
    }
  }
]
const safety_check_partner = [
  {
    path: 'safety_check_partner/:boardSlug',
    name: 'write|approval_tab_create|safety_check_partner',
    component: () => import('@/views/write/safetycheck/Index'),
    meta: {
      parent: 'safety-check',
      permission_level: 3
    }
  },
  {
    path: 'safety_check_partner/:boardSlug/:postId',
    name: 'write|approval_tab_update|safety_check_partner',
    component: () => import('@/views/write/safetycheck/Index'),
    meta: {
      parent: 'safety-check',
      permission_level: 3
    }
  }
]


listChildren.push(...report)
listChildren.push(...accident)
listChildren.push(...safety_check)
listChildren.push(...safety_check_partner)
for (const children of listChildren) {
  if (children.meta) {
    if (!children.meta.permission_level) children.meta.permission_level = -1
  } else children.meta = {permission_level: -1, breadcrumb:[]}
}
export default [
  {
    path: '/project/:proj_id/write',
    component: () => import('@/layouts/ProjectLayout'),
    children: listChildren
  }
]
