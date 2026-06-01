export default [
  {
    // =============================================================================
    // PROJECT LAYOUT ROUTES
    // =============================================================================
    path: '/project/:proj_id',
    component: () => import('@/layouts/ProjectLayout.vue'),
    meta:{
      authRequired: true
    },
    redirect: '/project/:proj_id/home',
    children: [
      // 프로젝트
      {
        path: 'back',
        name: 'project-back',
        redirect: '/home'
      },
      // 대시보드
      {
        path: 'home',
        name: 'project-home',
        component: () => import('@/views/project/Index.vue'),
        meta: {
          topBanner: true, // 상단 배너 노출 여부
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '대시보드',
              active: true
            }
          ],
          pageTitle: '대시보드',
          deviceRequired: true
        }
      },
      // 대시보드 상세보기
      {
        path: 'graph/:boardId',
        name: 'project-graph',
        component: () => import('@/views/graph/Index'),
        meta: {
          deviceRequired: true,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '대시보드',
              active: true
            }
          ],
          pageTitle: '대시보드'
        }
      },
      //fira
      {
        path: 'graph-detail/:graphId',
        name: 'project-graph-detail',
        component: () => import('@/views/graph-detail/Index'),
        meta: {
          deviceRequired: true,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '대시보드',
              active: true
            }
          ],
          pageTitle: '대시보드'
        }
      },

      // 안전·보건예산 현황
      {
        path: 'report',
        name: 'project-report',
        component: () => import('@/views/project/report/Report.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '안전·보건예산 현황',
              url: {name: 'project-report'},
              active: true
            }
          ],
          pageTitle: '안전·보건예산 현황'
        }
      },
      {
        path: 'report/create',
        name: 'project-report-create',
        component: () => import('@/views/project/report/ReportCreate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '안전·보건예산 현황',
              url: {name: 'project-report'}
            },
            {
              title: '작성/업데이트',
              url: {name: 'project-report-create'},
              active: true
            }
          ],
          pageTitle: '안전·보건예산 현황'
        }
      },
      {
        path: 'report/:postId',
        name: 'project-report-update',
        component: () => import('@/views/project/report/ReportUpdate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '안전·보건예산 현황',
              url: {name: 'project-report'}
            },
            {
              title: '작성/업데이트',
              url: {name: 'project-report-update'},
              active: true
            }
          ],
          pageTitle: '안전·보건예산 현황'
        }
      },

      // 현장 개요
      {
        path: 'plan/project',
        name: 'project-plan-project',
        component: () => import('@/views/project/plan/Project.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '현장 개요'},
            {
              title: '현장 정보',
              url: {name: 'project-plan-project'},
              active: true
            }
          ],
          pageTitle: '현장 정보'
        }
      },
      {
        path: 'plan/partners',
        name: 'project-plan-partners',
        redirect: 'plan/partners/list'
      },
      {
        path: 'plan/partners/join',
        name: 'project-plan-partners-join',
        component: () => import('@/views/project/plan/PartnersJoin.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '현장 개요'},
            {
              title: '파트너사 등록 요청',
              url: {name: 'project-plan-partners'},
              active: true
            }
          ],
          pageTitle: '파트너사 등록 요청'
        }
      },
      {
        path: 'plan/partners/join/write',
        name: 'project-plan-partners-join-create',
        component: () => import('@/views/project/plan/PartnersJoinWrite.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '현장 개요'},
            {
              title: '파트너사 등록 요청',
              url: {name: 'project-plan-partners'},
              active: true
            }
          ],
          pageTitle: '파트너사 등록 요청'
        }
      },
      {
        path: 'plan/partners/join/write/:postId',
        name: 'project-plan-partners-join-update',
        component: () => import('@/views/project/plan/PartnersJoinWrite.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '현장 개요'},
            {
              title: '파트너사 등록 요청',
              url: {name: 'project-plan-partners'},
              active: true
            }
          ],
          pageTitle: '파트너사 등록 요청'
        }
      },
      {
        path: 'plan/partners/:tab',
        name: 'project-plan-partners',
        component: () => import('@/views/project/plan/Partners.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },

            {title: '현장 개요'},
            {
              title: '파트너사 계약 현황',
              url: {name: 'project-plan-partners'},
              active: true
            }
          ],
          pageTitle: '파트너사 계약 현황'
        }
      },
      {
        path: 'plan/partners/:tab/:postId',
        name: 'project-plan-partners-update',
        component: () => import('@/views/project/plan/Partners.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '현장 개요'},
            {
              title: '파트너사 계약 현황',
              url: {name: 'project-plan-partners'},
              active: true
            }
          ],
          pageTitle: '파트너사 계약 현황'
        }
      },

      // 위험성평가
      {
        path: 'risk/assessment',
        name: 'project-risk-assessment',
        redirect: 'risk/assessment/first'
      },
      {
        path: 'risk/assessment/:tab',
        name: 'project-risk-assessment-tab',
        component: () => import('@/views/project/risk/Assessment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {
              title: '위험성평가',
              active: true
            }
          ],
          pageTitle: '위험성평가',
          parent: 'risk-assessment'
        }
      },
      {
        path: 'risk/assessment/:tab/:postId',
        name: 'project-risk-assessment-tab-postId',
        component: () => import('@/views/project/risk/Assessment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {
              title: '위험성평가',
              active: true
            }
          ],
          pageTitle: '위험성평가',
          parent: 'risk-assessment'
        }
      },

      // 협의체회의
      {
        path: 'risk/conference',
        name: 'project-risk-conference',
        redirect: 'risk/conference/warning'
      },
      {
        path: 'risk/conference/:tab',
        name: 'project-risk-conference-tab',
        component: () => import('@/views/project/risk/Conference.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {
              title: '협의체회의',
              url: {name: 'project-risk-conference'},
              active: true
            }
          ],
          pageTitle: '협의체회의',
          parent: 'risk-conference'
        }
      },
      {
        path: 'risk/conference/:tab/:postId',
        name: 'project-risk-conference-id',
        component: () => import('@/views/project/risk/Conference.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {
              title: '협의체회의',
              url: {name: 'project-risk-conference'},
              active: true
            }
          ],
          pageTitle: '협의체회의',
          parent: 'risk-conference'
        }
      },

      // 작업허가서
      {
        path: 'risk/permit',
        name: 'project-risk-permit',
        redirect: 'risk/permit/work'
      },
      {
        path: 'risk/permit/:tab',
        name: 'project-risk-permit-tab',
        component: () => import('@/views/project/risk/Permit.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '작업허가서'},
            {
              title: '작업허가서',
              url: {name: 'project-risk-permit'},
              active: true
            }
          ],
          pageTitle: '작업허가서',
          parent: 'risk-permit'
        }
      },
      {
        path: 'risk/permit/:tab/:postId',
        name: 'project-risk-permit-id',
        component: () => import('@/views/project/risk/Permit.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '작업허가서'},
            {
              title: '작업허가서',
              url: {name: 'project-risk-permit'},
              active: true
            }
          ],
          pageTitle: '작업허가서',
          parent: 'risk-permit'
        }
      },

      // 안전점검 및 개선
      {
        path: 'risk/check',
        name: 'project-risk-check',
        redirect: 'risk/check/checklog'
      },
      {
        path: 'risk/check/:tab',
        name: 'project-risk-check-tab',
        component: () => import('@/views/project/risk/Check.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전점검 및 개선'},
            {
              title: '안전점검 및 개선',
              url: {name: 'project-risk-check'},
              active: true
            }
          ],
          pageTitle: '안전점검 및 개선',
          parent: 'risk-check'
        }
      },
      {
        path: 'risk/check/:tab/:postId',
        name: 'project-risk-check-id',
        component: () => import('@/views/project/risk/Check.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {
              title: '안전점검 및 개선',
              url: {name: 'project-risk-check'},
              active: true
            }
          ],
          pageTitle: '안전점검 및 개선',
          parent: 'risk-check'
        }
      },

      // 파트너사 일일보고
      {
        path: 'safety/director',
        name: 'project-safety-director',
        component: () => import('@/views/project/safety/Director.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '안전보건책임자 선임',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '안전보건책임자 선임'
        }
      },
      {
        path: 'safety/staff',
        name: 'project-safety-staff',
        redirect: 'safety/staff/input'
      },
      {
        path: 'safety/staff/:tab',
        name: 'project-safety-staff-tab',
        component: () => import('@/views/project/safety/Staff.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '인원투입 현황',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '인원투입 현황',
          parent: 'safety-staff'
        }
      },
      {
        path: 'safety/accident',
        name: 'project-safety-accident',
        redirect: 'safety/accident/report'
      },
      {
        path: 'safety/accident/:tab',
        name: 'project-safety-report',
        component: () => import('@/views/project/safety/Accident.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '산업재해/무재해',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '산업재해/무재해',
          parent: 'safety-accident'
        }
      },
      {
        path: 'safety/accident/:tab/:postId',
        name: 'project-safety-report-detail',
        component: () => import('@/views/project/safety/Accident.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '산업재해/무재해',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '산업재해/무재해',
          parent: 'safety-accident'
        }
      },
      {
        path: 'safety/supplies',
        name: 'project-safety-supplies',
        component: () => import('@/views/project/safety/Supplies.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '안전용품 현황',
              url: {name: 'project-safety-supplies'},
              active: true
            }
          ],
          pageTitle: '안전용품 현황',
          parent: 'safety-supplies'
        }
      },
      {
        path: 'safety/supplies/create',
        name: 'project-safety-supplies-create',
        component: () => import('@/views/project/safety/SuppliesCreate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '안전용품 현황',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '안전용품 현황',
          parent: 'safety-supplies'
        }
      },
      {
        path: 'safety/supplies/:postId',
        name: 'project-safety-supplies-update',
        component: () => import('@/views/project/safety/SuppliesUpdate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '안전용품 현황',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '안전용품 현황',
          parent: 'safety-supplies'
        }
      },
      {
        path: 'safety/equipment',
        name: 'project-safety-equipment',
        redirect: 'safety/equipment/plan'
      },
      {
        path: 'safety/equipment/:tab',
        name: 'project-safety-equipment-list',
        component: () => import('@/views/project/safety/Equipment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '장비점검 현황',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '장비점검 현황',
          parent: 'safety-equipment'
        }
      },
      {
        path: 'safety/equipment/:tab/:postId',
        name: 'project-safety-equipment-detail',
        component: () => import('@/views/project/safety/Equipment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {
              title: '장비점검 현황',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '장비점검 현황',
          parent: 'safety-equipment'
        }
      },

      // 환경실적
      {
        path: 'state/director',
        name: 'project-state-director',
        component: () => import('@/views/project/state/Director.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경책임자선임',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경책임자선임'
        }
      },
      {
        path: 'state/government',
        name: 'project-state-government',
        component: () => import('@/views/project/state/Government.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '대관업무',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '대관업무'
        }
      },
      // 환경점검
      {
        path: 'state/check',
        name: 'project-state-check',
        redirect: 'state/check/daily'
      },
      {
        path: 'state/check/:tab',
        name: 'project-state-check-tab',
        component: () => import('@/views/project/state/Check.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경점검',
              url: {name: 'project-state-check'},
              active: true
            }
          ],
          pageTitle: '환경점검',
          parent: 'state-check'
        }
      },
      {
        path: 'state/check/:tab/:postId',
        name: 'project-state-check-id',
        component: () => import('@/views/project/state/Check.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경점검',
              url: {name: 'project-state-check'},
              active: true
            }
          ],
          pageTitle: '환경점검',
          parent: 'state-check'
        }
      },
      {
        path: 'state/support',
        name: 'project-state-support',
        component: () => import('@/views/project/state/Support.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경지원',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경지원',
          parent: 'state-support'
        }
      },
      {
        path: 'state/support/create',
        name: 'project-state-support-create',
        component: () => import('@/views/project/state/support/SupportCreate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경지원',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경지원',
          parent: 'state-support'
        }
      },
      {
        path: 'state/support/:postId',
        name: 'project-state-support-update',
        component: () => import('@/views/project/state/support/SupportUpdate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경지원',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경지원',
          parent: 'state-support'
        }
      },
      {
        path: 'state/evaluation',
        name: 'project-state-evaluation',
        component: () => import('@/views/project/state/Evaluation.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경평가',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경평가',
          parent: 'state-evaluation'
        }
      },
      {
        path: 'state/evaluation/create',
        name: 'project-state-evaluation-create',
        component: () => import('@/views/project/state/evaluation/EvaluationCreate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경평가',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경평가',
          parent: 'state-evaluation'
        }
      },
      {
        path: 'state/evaluation/:postId',
        name: 'project-state-evaluation-update',
        component: () => import('@/views/project/state/evaluation/EvaluationUpdate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경평가',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경평가',
          parent: 'state-evaluation'
        }
      },
      {
        path: 'state/report',
        name: 'project-state-report',
        redirect: 'state/report/accident'
      },
      {
        path: 'state/report/:tab',
        name: 'project-state-report-tab',
        component: () => import('@/views/project/state/Report.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경사고/이슈보고',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경사고/이슈보고',
          parent: 'state-report'
        }
      },
      {
        path: 'state/report/:tab/:postId',
        name: 'project-state-report-detail',
        component: () => import('@/views/project/state/Report.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {
              title: '환경사고/이슈보고',
              url: {name: 'project-safety-director'},
              active: true
            }
          ],
          pageTitle: '환경사고/이슈보고',
          parent: 'state-report'
        }
      },

      // 시정 및 예방요청
      {
        path: 'prevention/request',
        name: 'project-prevention-request',
        redirect: 'prevention/request/safety'
      },
      {
        path: 'prevention/request/:tab',
        name: 'project-prevention-request-tab',
        component: () => import('@/views/project/prevention/Request.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '시정 및 예방요청서'},
            {
              title: '안전/보건',
              url: {name: 'project-prevention-request'},
              active: true
            }
          ],
          pageTitle: '시정 및 예방요청서',
          parent: 'prevention-request'
        }
      },
      {
        path: 'prevention/request/:tab/:postId',
        name: 'project-prevention-request-tab-postId',
        component: () => import('@/views/project/prevention/Request.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '시정 및 예방요청서'},
            {
              title: '안전/보건',
              url: {name: 'project-prevention-request'},
              active: true
            }
          ],
          pageTitle: '시정 및 예방요청서',
          parent: 'prevention-request'
        }
      },

      // 안전보건관리
      {
        path: 'hse/list',
        name: 'project-hse-list',
        redirect: 'hse/list/safety'
      },
      {
        path: 'hse/list/:tab',
        name: 'project-hse-list-tab',
        component: () => import('@/views/project/hse/List.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전·보건 교육'},
            {
              title: '교육 현황',
              url: {name: 'project-hse-list'},
              active: true
            }
          ],
          pageTitle: '교육 현황',
          parent: 'hse-list'
        }
      },
      {
        path: 'hse/list/:tab/:postId',
        name: 'project-hse-list-tab-postId',
        component: () => import('@/views/project/hse/List.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전·보건 교육'},
            {
              title: '교육 현황',
              url: {name: 'project-hse-list'},
              active: true
            }
          ],
          pageTitle: '교육 현황',
          parent: 'hse-list'
        }
      },
      {
        path: 'hse/monitoring',
        name: 'project-hse-monitoring',
        component: () => import('@/views/project/hse/Monitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전·보건 교육'},
            {
              title: '교육 모니터링',
              url: {name: 'project-hse-monitoring'},
              active: true
            }
          ],
          pageTitle: '교육 모니터링'
        }
      },


      // 커뮤니티
      {
        path: 'community/businessnews',
        name: 'project-community-businessnews',
        component: () => import('@/views/community/CommunityBusinessnews.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '공지사항'},
            {title: '목록', active: true}
          ],
          pageTitle: '공지사항',
          activeCode: 'community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: 'community/businessnews/create',
        name: 'project-community-businessnews-create',
        component: () => import('@/views/community/CommunityBusinessnewsCreate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '공지사항'},
            {title: '작성', active: true}
          ],
          pageTitle: '공지사항',
          activeCode: 'community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: 'community/businessnews/:postId',
        name: 'project-community-businessnews-detail',
        component: () => import('@/views/community/CommunityBusinessnewsDetail.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '공지사항'},
            {title: '상세', active: true}
          ],
          pageTitle: '공지사항',
          activeCode: 'community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: 'community/businessnews/:postId/update',
        name: 'project-community-businessnews-update',
        component: () => import('@/views/community/CommunityBusinessnewsUpdate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '공지사항'},
            {title: '수정', active: true}
          ],
          pageTitle: '공지사항',
          activeCode: 'community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: 'community/businessnews/:postId/reply',
        name: 'project-community-businessnews-reply',
        component: () => import('@/views/community/CommunityBusinessnewsReply.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '공지사항'},
            {title: '답글 작성', active: true}
          ],
          pageTitle: '공지사항',
          activeCode: 'community_businessnews'
        }
      },
      {
        path: 'community/qna',
        name: 'project-community-qna',
        component: () => import('@/views/community/CommunityQna.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: 'Q&A'},
            {title: '목록', active: true}
          ],
          pageTitle: 'Q&A',
          activeCode: 'community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: 'community/qna/create',
        name: 'project-community-qna-create',
        component: () => import('@/views/community/CommunityQnaCreate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: 'Q&A'},
            {title: '작성', active: true}
          ],
          pageTitle: 'Q&A',
          activeCode: 'community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: 'community/qna/:postId',
        name: 'project-community-qna-detail',
        component: () => import('@/views/community/CommunityQnaDetail.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: 'Q&A'},
            {title: '상세', active: true}
          ],
          pageTitle: 'Q&A',
          activeCode: 'community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: 'community/qna/:postId/update',
        name: 'project-community-qna-update',
        component: () => import('@/views/community/CommunityQnaUpdate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: 'Q&A'},
            {title: '수정', active: true}
          ],
          pageTitle: 'Q&A',
          activeCode: 'community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: 'community/qna/:postId/reply',
        name: 'project-community-qna-reply',
        component: () => import('@/views/community/CommunityQnaReply.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: 'Q&A'},
            {title: '답글', active: true}
          ],
          pageTitle: 'Q&A',
          activeCode: 'community_qna'
        }
      },
      {
        path: 'community/healthinfo',
        name: 'project-community-healthinfo',
        component: () => import('@/views/community/CommunityHealthInfo.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '안전보건 주요일정'},
            {title: '목록', active: true}
          ],
          pageTitle: '안전보건 주요일정',
          activeCode: 'community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: 'community/healthinfo/create',
        name: 'project-community-healthinfo-create',
        component: () => import('@/views/community/CommunityHealthInfoCreate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '안전보건 주요일정'},
            {title: '작성', active: true}
          ],
          pageTitle: '안전보건 주요일정',
          activeCode: 'community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: 'community/healthinfo/:postId',
        name: 'project-community-healthinfo-detail',
        component: () => import('@/views/community/CommunityHealthInfoDetail.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '안전보건 주요일정'},
            {title: '상세', active: true}
          ],
          pageTitle: '안전보건 주요일정',
          activeCode: 'community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: 'community/healthinfo/:postId/update',
        name: 'project-community-healthinfo-update',
        component: () => import('@/views/community/CommunityHealthInfoUpdate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '안전보건 주요일정'},
            {title: '수정', active: true}
          ],
          pageTitle: '안전보건 주요일정',
          activeCode: 'community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: 'community/healthinfo/:postId/reply',
        name: 'project-community-healthinfo-reply',
        component: () => import('@/views/community/CommunityHealthInfoReply.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '안전보건 주요일정'},
            {title: '답글', active: true}
          ],
          pageTitle: '안전보건 주요일정',
          activeCode: 'community_healthinfo'
        }
      },


      {
        path: 'community/unitbusinessnews',
        name: 'project-community/unitbusinessnews',
        component: () => import('@/views/community/CommunityUnitBusinessNews.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '구성원 요청사항'},
            {title: '목록', active: true}
          ],
          pageTitle: '구성원 요청사항',
          activeCode: 'community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: 'community/unitbusinessnews/create',
        name: 'project-community-unitbusinessnews-create',
        component: () => import('@/views/community/CommunityUnitBusinessNewsCreate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '구성원 요청사항'},
            {title: '작성', active: true}
          ],
          pageTitle: '구성원 요청사항',
          activeCode: 'community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: 'community/unitbusinessnews/:postId',
        name: 'project-community-unitbusinessnews-detail',
        component: () => import('@/views/community/CommunityUnitBusinessNewsDetail.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '구성원 요청사항'},
            {title: '상세', active: true}
          ],
          pageTitle: '구성원 요청사항',
          activeCode: 'community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: 'community/unitbusinessnews/:postId/update',
        name: 'project-community-unitbusinessnews-update',
        component: () => import('@/views/community/CommunityUnitBusinessNewsUpdate.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '구성원 요청사항'},
            {title: '수정', active: true}
          ],
          pageTitle: '구성원 요청사항',
          activeCode: 'community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: 'community/unitbusinessnews/:postId/reply',
        name: 'project-community-unitbusinessnews-reply',
        component: () => import('@/views/community/CommunityUnitBusinessNewsReply.vue'),
        meta: {
          deviceRequired: false,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '커뮤니티'},
            {title: '구성원 요청사항'},
            {title: '답글', active: true}
          ],
          pageTitle: '안전보건 주요일정',
          activeCode: 'community_unitbusinessnews'
        }
      },
      { // 마이페이지 / 설정 / 개인정보변경
        path: 'mypage/info-update',
        name: 'project-mypage-info-update',
        component: () => import('@/views/mypage/MyPageInfoUpdate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '설정'},
            {title: '개인정보변경', active: true}
          ],
          pageTitle: '개인정보변경',
          activeCode: 'project-mypage-info-update'
        }
      },
      { // 마이페이지 / 업무현황
        path: 'mypage/workstatus',
        name: 'project-mypage-workstatus',
        component: () => import('@/views/mypage/MyPageWorkStatus.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '업무현황', active: true}
          ],
          pageTitle: '업무현황',
          activeCode: 'project-mypage-workstatus'
        }
      },
      { // 마이페이지 / 알림
        path: 'mypage/alert',
        name: 'project-mypage-alert',
        component: () => import('@/views/mypage/MyPageAlert.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '알림', active: true}
          ],
          pageTitle: '알림',
          activeCode: 'project-mypage-alert'
        }
      },
      {
        path: 'approval-request',
        name: 'project-approval-request',
        component: () => import('@/views/approval/ApprovalRequest.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '결재요청함',
              url: {name: 'project-approval-request'},
              active: true
            }
          ],
          pageTitle: '결재요청함'
        }
      },
      {
        path: 'approval-await',
        name: 'project-approval-await',
        component: () => import('@/views/approval/ApprovalAwait.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '결재대기함',
              url: {name: 'project-approval-await'},
              active: true
            }
          ],
          pageTitle: '결재대기함'
        }
      },
      {
        path: 'approval-process',
        name: 'project-approval-process',
        component: () => import('@/views/approval/ApprovalProcess.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '결재진행함',
              url: {name: 'project-approval-process'},
              active: true
            }
          ],
          pageTitle: '결재진행함'
        }
      },

      {
        path: 'approval-complete',
        name: 'project-approval-complete',
        component: () => import('@/views/approval/ApprovalComplete.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '완료문서함',
              url: {name: 'project-approval-complete'},
              active: true
            }
          ],
          pageTitle: '완료문서함'
        }
      },

      {
        path: 'approval-reject',
        name: 'project-approval-reject',
        component: () => import('@/views/approval/ApprovalReject.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '반려문서함',
              url: {name: 'project-approval-reject'},
              active: true
            }
          ],
          pageTitle: '반려문서함'
        }
      },

      {
        path: 'approval-reference',
        name: 'project-approval-reference',
        component: () => import('@/views/approval/ApprovalReference.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '참조/회람문서함',
              url: {name: 'project-approval-reference'},
              active: true
            }
          ],
          pageTitle: '참조/회람문서함'
        }
      },
    ]
  },
]
