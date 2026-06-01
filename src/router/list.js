const listChildren = []

const report = [
  {
    path: 'report/:boardSlug',
    name: 'list|approval_list',
    component: () => import('@/views/list/report/Index'),
    meta: {
      permission_level: 3
    }
  }
]
const accident = [
  {
    path: 'accident/:boardSlug',
    name: 'list|approval_tab_list|accident',
    component: () => import('@/views/list/accident/Index'),
    meta: {
      parent: 'safety-accident',
      permission_level: 3
    }
  }
]
const safety_check = [
  {
    path: 'safety_check/:boardSlug',
    name: 'list|approval_tab_list|safety_check',
    component: () => import('@/views/list/safetycheck/Index'),
    meta: {
      permission_level: 3
    }
  }
]
const safety_check_partner = [
  {
    path: 'safety_check_partner/:boardSlug',
    name: 'list|approval_tab_list|safety_check_partner',
    component: () => import('@/views/list/safetycheckpartner/Index'),
    meta: {
      permission_level: 3
    }
  }
]
const partner_equipment = [
  {
    path: 'partner_equipment',
    name: 'list|board_tab_list|partner_equipment',
    redirect: 'partner_equipment/input'
  },
  {
    path: 'partner_equipment/:tab',
    name: 'list|board_tab_list|partner_equipment',
    component: () => import('@/views/list/partner/equipment/Index'),
    meta: {
      parent :'partner-equipment',
      permission_level: 3
    }
  }
]

listChildren.push(...report)
listChildren.push(...accident)
listChildren.push(...safety_check)
listChildren.push(...safety_check_partner)
listChildren.push(...partner_equipment)
for (const children of listChildren) {
  if (children.meta) {
    if (!children.meta.permission_level) children.meta.permission_level = -1
  } else children.meta = {permission_level: -1, breadcrumb:[]}
}
export default [
  {
    path: '/project/:proj_id/list',
    component: () => import('@/layouts/ProjectLayout'),
    children: listChildren
  }
]
