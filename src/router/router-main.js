export default [
  {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    meta:{
      authPosition: 2,
      authRequired: true,
      deviceRequired: false
    },
    children: [
      // =============================================================================
      // Theme Routes
      // =============================================================================
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          deviceRequired: true,
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
          pageTitle: '대시보드'
        }
      },
      // =============================================================================
      // Theme Routes
      // =============================================================================
      {
        path: '/graph-detail/:graphId',
        name: 'graph-detail',
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
      // 스마트 보고서
      {
        path: '/smart-report',
        name: 'smart-report',
        component: () => import('@/views/smart-report/Index'),
        meta: {
          deviceRequired: true,
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '스마트보고서',
              active: true
            }
          ],
          pageTitle: '스마트보고서'
        }
      },
      // content
      {
        path: '/notice',
        name: 'page-notice',
        component: () => import('@/views/content/notice/Noticeboard.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '게시판관리'},
            {
              title: '공지사항',
              url: {name: 'page-notice'},
              active: true
            }
          ],
          pageTitle: '공지사항'
        }
      },
      {
        path: '/notice-read',
        name: 'page-notice-read',
        component: () => import('@/views/content/notice/Noticeread.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '게시판관리'},
            {
              title: '공지사항',
              url: {name: 'page-notice'}
            },
            {
              title: '공지사항상세보기',
              url: {name: 'page-notice-read'},
              active: true
            }
          ],
          pageTitle: '공지사항',
          parent: 'page-notice'
        }
      },
      {
        path: '/notice-write',
        name: 'page-notice-write',
        component: () => import('@/views/content/notice/Noticewrite.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '게시판관리'},
            {
              title: '공지사항',
              url: {name: 'page-notice'}
            },
            {
              title: '공지사항작성하기',
              url: {name: 'page-notice-write'},
              active: true
            }
          ],
          pageTitle: '공지사항',
          parent: 'page-notice'
        }
      },

      // 결재
      {
        path: '/approval-write',
        name: 'page-approval-write',
        component: () => import('@/views/approval/ApprovalWrite.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '결재관리'},
            {
              title: '결재문서 작성',
              url: {name: 'page-approval-write'},
              active: true
            }
          ],
          pageTitle: '결재문서 작성'
        }
      },

      {
        path: '/approval-request',
        name: 'page-approval-request',
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
              url: {name: 'page-approval-request'},
              active: true
            }
          ],
          pageTitle: '결재요청함'
        }
      },
      {
        path: '/approval-await',
        name: 'page-approval-await',
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
              url: {name: 'page-approval-await'},
              active: true
            }
          ],
          pageTitle: '결재대기함'
        }
      },

      {
        path: '/approval-process',
        name: 'page-approval-process',
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
              url: {name: 'page-approval-process'},
              active: true
            }
          ],
          pageTitle: '결재진행함'
        }
      },

      {
        path: '/approval-complete',
        name: 'page-approval-complete',
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
              url: {name: 'page-approval-complete'},
              active: true
            }
          ],
          pageTitle: '완료문서함'
        }
      },

      {
        path: '/approval-reject',
        name: 'page-approval-reject',
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
              url: {name: 'page-approval-reject'},
              active: true
            }
          ],
          pageTitle: '반려문서함'
        }
      },

      {
        path: '/approval-reference',
        name: 'page-approval-reference',
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
              url: {name: 'page-approval-reference'},
              active: true
            }
          ],
          pageTitle: '참조/회람문서함'
        }
      },

      // read - sub router
      {
        path: '/approval-await-read',
        name: 'page-approval-await-read',
        component: () => import('@/views/approval/ApprovalRead.vue'),
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
              url: {name: 'page-approval-await'},
              active: true
            }
          ],
          pageTitle: '결재대기함',
          parent: 'page-approval-await'
        }
      },
      {
        path: '/approval-process-read',
        name: 'page-approval-process-read',
        component: () => import('@/views/approval/ApprovalRead.vue'),
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
              url: {name: 'page-approval-process'},
              active: true
            }
          ],
          pageTitle: '결재진행함',
          parent: 'page-approval-process'
        }
      },
      {
        path: '/approval-complete-read',
        name: 'page-approval-complete-read',
        component: () => import('@/views/approval/ApprovalRead.vue'),
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
              url: {name: 'page-approval-complete'},
              active: true
            }
          ],
          pageTitle: '완료문서함',
          parent: 'page-approval-complete'
        }
      },
      {
        path: '/approval-reject-read',
        name: 'page-approval-reject-read',
        component: () => import('@/views/approval/ApprovalRead.vue'),
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
              url: {name: 'page-approval-reject'},
              active: true
            }
          ],
          pageTitle: '반려문서함',
          parent: 'page-approval-reject'
        }
      },


      // FAQ
      {
        path: '/faq',
        name: 'page-faq',
        component: () => import('@/views/content/faq/FAQBoard.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '게시판관리'},
            {
              title: 'FAQ',
              url: {name: 'page-faq'},
              active: true
            }
          ],
          pageTitle: 'FAQ'
        }
      },


      // 프로젝트
      {
        path: '/content/project',
        name: 'content-project',
        component: () => import('@/views/project/ProjectList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '현장 바로가기',
              active: true
            }
          ],
          pageTitle: '현장 바로가기'
        }
      },
      {
        path: '/content/project/create',
        name: 'content-project-create',
        component: () => import('@/views/project/ProjectWrite.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '프로젝트',
              active: true
            }
          ],
          pageTitle: 'breadcrumb.content.project.create.title'
        }
      },

      // 안전·보건 예산
      {
        path: '/content/business-status/report',
        name: 'content-business-status-report',
        component: () => import('@/views/content/business-status/BusinessStatusReport.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '안전·보건 예산',
              active: true
            },
            {
              title: '안전·보건예산 현황',
              url: {name: 'content-business-status-monitoring'},
              active: true
            }
          ],
          pageTitle: '안전·보건예산 현황'
        }
      },
      {
        path: '/content/business-status/monitoring',
        name: 'content-business-status-monitoring',
        component: () => import('@/views/content/business-status/BusinessStatusMonitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '안전·보건 예산',
              active: true
            },
            {
              title: '현장모니터링',
              url: {name: 'content-business-status-monitoring'},
              active: true
            }
          ],
          pageTitle: '현장모니터링'
        }
      },

      // 현장 개요 - 프로잭트 개요
      {
        path: '/content/plan/project/info',
        name: 'content-plan-project-info',
        component: () => import('@/views/content/plan/PlanProjectInfo.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '현장 개요',
              active: true
            },
            {
              title: '현장 상세',
              active: true
            },
            {
              title: '현장 정보',
              active: true
            }
          ],
          pageTitle: '현장 정보',
          parent: 'content-plan-project'
        }
      },
      {
        path: '/content/plan/project/origin-chart',
        name: 'content-plan-project-origin-chart',
        component: () => import('@/views/content/plan/PlanProjectOriginChart.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '현장 개요',
              active: true
            },
            {
              title: '현장 상세',
              active: true
            },
            {
              title: '조직도',
              active: true
            }
          ],
          pageTitle: '조직도',
          parent: 'content-plan-project'
        }
      },

      // 현장 개요 - 파트너사 개요
      { // 계약 현황
        path: '/content/plan/partner/list',
        name: 'content-plan-partner-list',
        component: () => import('@/views/content/plan/PlanPartnerList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '현장 개요',
              active: true
            },
            {
              title: '파트너사 계약 현황',
              active: true
            },
            {
              title: '계약 현황',
              active: true
            }
          ],
          pageTitle: '계약 현황',
          parent: 'content-plan-project'
        }
      },

      { // 파트너사 등록 요청
        path: '/content/plan/partner/join-request',
        name: 'content-plan-partner-join-request',
        component: () => import('@/views/content/plan/PlanPartnerJoinRequest.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '현장 개요',
              active: true
            },
            {
              title: '파트너사 등록 요청',
              active: true
            }
          ],
          pageTitle: '파트너사 등록 요청',
          parent: 'content-plan-partner-join-request'
        }
      },

      { // 안전보건부서장(관리책임자) 지정
        path: '/content/plan/partner/agent',
        name: 'content-plan-partner-agent',
        component: () => import('@/views/content/plan/PlanPartnerAgent.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {
              title: '현장 개요',
              active: true
            },
            {
              title: '파트너사 개요',
              active: true
            },
            {
              title: '안전보건부서장(관리책임자) 지정',
              active: true
            }
          ],
          pageTitle: '안전보건부서장(관리책임자) 지정',
          parent: 'content-plan-project'
        }
      },

      // 위험성평가
      { // 위험성평가 / 위험성평가 / 최초 위험성평가
        path: '/content/risk/assessment/first',
        name: 'content-risk-assessment-first',
        component: () => import('@/views/content/risk/RiskAssessmentFirst.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '위험성평가'},
            {title: '최초 위험성평가', active: true}
          ],
          pageTitle: '최초 위험성평가',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 위험성평가 / 정기위험성평가
        path: '/content/risk/assessment/regular',
        name: 'content-risk-assessment-regular',
        component: () => import('@/views/content/risk/RiskAssessmentRegular.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '위험성평가'},
            {title: '정기 위험성평가', active: true}
          ],
          pageTitle: '정기 위험성평가',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 위험성평가 / 위험성평가기초자료
        path: '/content/risk/assessment/stddoc',
        name: 'content-risk-assessment-stddoc',
        component: () => import('@/views/content/risk/RiskAssessmentStddoc.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '위험성평가'},
            {title: '위험성평가기초자료', active: true}
          ],
          pageTitle: '위험성평가기초자료',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 위험성평가 / 수시위험성평가
        path: '/content/risk/assessment/always',
        name: 'content-risk-assessment-always',
        component: () => import('@/views/content/risk/RiskAssessmentAlways.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '위험성평가'},
            {title: '수시 위험성평가', active: true}
          ],
          pageTitle: '수시 위험성평가',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 협의체회의 / 위험성평가협의회
        path: '/content/risk/conference/warning',
        name: 'content-risk-conference-warning',
        component: () => import('@/views/content/risk/RiskConferenceWarning.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '협의체회의'},
            {title: '정기 위험성평가협의회', active: true}
          ],
          pageTitle: '정기 위험성평가협의회',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 협의체회의 / 위험성평가협의회
        path: '/content/risk/conference/warning_always',
        name: 'content-risk-conference-warning-always',
        component: () => import('@/views/content/risk/RiskConferenceWarningAlways.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '협의체회의'},
            {title: '수시 위험성평가협의회', active: true}
          ],
          pageTitle: '수시 위험성평가협의회',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 협의체회의 / 산업안전보건위원회
        path: '/content/risk/conference/safety',
        name: 'content-risk-conference-safety',
        component: () => import('@/views/content/risk/RiskConferenceSafety.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '협의체회의'},
            {title: '산업안전보건위원회', active: true}
          ],
          pageTitle: '산업안전보건위원회',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 작업허가서 / 작업허가서
        path: '/content/risk/permit/work',
        name: 'content-risk-permit-work',
        component: () => import('@/views/content/risk/RiskPermitWork.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '작업허가서'},
            {title: '작업허가서(내부용)', active: true}
          ],
          pageTitle: '작업허가서(내부용)',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 작업허가서 / 작업허가서(외부용)
        path: '/content/risk/permit/work_export',
        name: 'content-risk-permit-work-export',
        component: () => import('@/views/content/risk/RiskPermitSpecial.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '작업허가서'},
            {title: '작업허가서(외부용)', active: true}
          ],
          pageTitle: '작업허가서(외부용)',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 안전점검 및 개선 / 일일안전점검표
        path: '/content/risk/check/checklist',
        name: 'content-risk-check-checklist',
        component: () => import('@/views/content/risk/RiskCheckCheckList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '위험성평가'},
            {title: '안전점검 및 개선'},
            {title: '일일안전점검표', active: true}
          ],
          pageTitle: '일일안전점검표',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 안전점검 및 개선 / 안전점검일지
        path: '/content/risk/check/checklog',
        name: 'content-risk-check-checklog',
        component: () => import('@/views/content/risk/RiskCheckCheckLog.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전점검'},
            {title: '안전점검'},
            {title: '4_4_4 점검', active: true}
          ],
          pageTitle: '4_4_4 점검',
          parent: 'content-plan-project'
        }
      },
      { // 위험성평가 / 안전점검 및 개선 / 합동점검일지
        path: '/content/risk/check/checklogall',
        name: 'content-risk-check-checklistall',
        component: () => import('@/views/content/risk/RiskCheckCheckLogAll.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전점검 및 개선'},
            {title: '합동점검일지', active: true}
          ],
          pageTitle: '합동점검일지',
          parent: 'content-plan-project'
        }
      },

      // 안전실적
      { // 안전실적 / 안전보건책임자선임
        path: '/content/safety/director',
        name: 'content-safety-director',
        component: () => import('@/views/content/safety/SafetyDirector.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '안전보건책임자선임'},
            {title: '목록', active: true}
          ],
          pageTitle: '안전보건책임자선임',
          parent: 'content-plan-project'
        }
      },
      { //
        path: '/content/safety/equipment/plan',
        name: 'content-safety-equipment-plan',
        component: () => import('@/views/content/safety/SafetyEquipment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '장비점검 현황'},
            {title: '장비점검 계획', active: true}
          ],
          pageTitle: '장비점검 계획',
          parent: 'content-plan-project'
        }
      },
      { //
        path: '/content/safety/equipment/result',
        name: 'content-safety-equipment-result',
        component: () => import('@/views/content/safety/SafetyEquipment2.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '장비점검 현황'},
            {title: '장비점검 결과', active: true}
          ],
          pageTitle: '장비점검 결과',
          parent: 'content-plan-project'
        }
      },

      { // 파트너 444
        path: '/content/risk/check/checklog-partner',
        name: 'content-risk-check-checklog-partner',
        component: () => import('@/views/content/risk/RiskCheckCheckLogPartner.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '일일안전점검일지'},
            {title: '일일안전점검일지', active: true}
          ],
          pageTitle: '일일안전점검일지',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 인원투입 현황 / 인원투입 입력
        path: '/content/safety/staff/create',
        name: 'content-safety-staff-create',
        component: () => import('@/views/content/safety/SafetyStaffCreate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '인원투입 현황'},
            {title: '인원투입 입력'},
            {title: '목록', active: true}
          ],
          pageTitle: '인원투입 입력',
          parent: 'safety-staff'
        }
      },
      { // 안전실적 / 인원투입 현황 / 인원투입 현황
        path: '/content/safety/staff/managerment',
        name: 'content-safety-staff-managerment',
        component: () => import('@/views/content/safety/SafetyStaffManagerment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '인원투입 현황'},
            {title: '인원투입 관리', active: true}
          ],
          pageTitle: '인원투입 관리',
          parent: 'safety-staff'
        }
      },
      { // 안전실적 / 인원투입 현황 / 출역인원조회
        path: '/content/safety/staff/list',
        name: 'content-safety-staff-list',
        component: () => import('@/views/content/safety/SafetyStaffList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '인원투입 현황'},
            {title: '인원투입 조회', active: true}
          ],
          pageTitle: '인원투입 조회',
          parent: 'safety-staff'
        }
      },
      { // 안전실적 / 인원투입 현황 / 인원투입 입력
        path: '/content/safety/equipment/create',
        name: 'content-safety-equipment-create',
        component: () => import('@/views/content/safety/SafetyEquipmentCreate.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '장비투입 현황'},
            {title: '장비투입 입력'},
            {title: '목록', active: true}
          ],
          pageTitle: '장비투입 입력',
          parent: 'safety-staff'
        }
      },
      { // 안전실적 / 인원투입 현황 / 인원투입 현황
        path: '/content/safety/equipment/managerment',
        name: 'content-safety-equipment-managerment',
        component: () => import('@/views/content/safety/SafetyEquipmentManagerment.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '장비투입 현황'},
            {title: '장비투입 현황', active: true}
          ],
          pageTitle: '장비투입 현황',
          parent: 'safety-staff'
        }
      },
      { // 안전실적 / 인원투입 현황 / 출역인원조회
        path: '/content/safety/equipment/list',
        name: 'content-safety-equipment-list',
        component: () => import('@/views/content/safety/SafetyEquipmentList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '장비투입 현황'},
            {title: '장비투입 조회', active: true}
          ],
          pageTitle: '장비투입 조회',
          parent: 'safety-staff'
        }
      },
      { // 안전실적 / 산업재해무재해 / 사고보고
        path: '/content/safety/accident/report',
        name: 'content-safety-accident-report',
        component: () => import('@/views/content/safety/SafetyAccidentReport.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '산업재해발생'},
            {title: '안전사고'},
            {title: '사고보고', active: true}
          ],
          pageTitle: '사고보고',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 산업재해무재해 / 산재검토
        path: '/content/safety/accident/review',
        name: 'content-safety-accident-review',
        component: () => import('@/views/content/safety/SafetyAccidentReview.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '산업재해발생'},
            {title: '안전사고'},
            {title: '산업재해검토', active: true}
          ],
          pageTitle: '산업재해검토',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 산업재해무재해 / 산재발생현황
        path: '/content/safety/accident/list',
        name: 'content-safety-accident-list',
        component: () => import('@/views/content/safety/SafetyAccidentList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '산업재해발생'},
            {title: '안전사고'},
            {title: '산업재해발생 현황', active: true}
          ],
          pageTitle: '산업재해발생 현황',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 산업재해무재해 / 사고분석
        path: '/content/safety/accident/analysis',
        name: 'content-safety-accident-analysis',
        component: () => import('@/views/content/safety/SafetyAccidentAnalysis.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전실적'},
            {title: '산업재해무재해'},
            {title: '사고분석', active: true}
          ],
          pageTitle: '사고분석',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 산업재해무재해 / 인원투입 현황
        path: '/content/safety/accident/numberofstaff',
        name: 'content-safety-accident-numberofstaff',
        component: () => import('@/views/content/safety/SafetyAccidentNumberOfStaff.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전실적'},
            {title: '인원투입 현황'},
            {title: '일별', active: true}
          ],
          pageTitle: '인원투입 현황',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 산업재해무재해 / 안전전관리율 기초자료
        path: '/content/safety/accident/basicdata',
        name: 'content-safety-accident-basicdata',
        component: () => import('@/views/content/safety/SafetyAccidentBasicData.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '산업재해무재해'},
            {title: '안전관리율 기초자료', active: true}
          ],
          pageTitle: '안전관리율 기초자료',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 안전용품 / 안전용품 구매신청
        path: '/content/safety/supplies/apply',
        name: 'content-safety-supplies-apply',
        component: () => import('@/views/content/safety/SafetySuppliesApply.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '안전용품 현황'},
            {title: '안전용품 구매신청'},
            {title: '목록', active: true}
          ],
          pageTitle: '안전용품 구매신청',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 건설장비관리 / 장비점검 계획
        path: '/content/safety/equipment/monthly',
        name: 'content-safety-equipment-monthly',
        component: () => import('@/views/content/safety/SafetyEquipmentMonthly.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '건설장비관리'},
            {title: '장비점검 계획', active: true}
          ],
          pageTitle: '장비점검 계획',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 건설장비관리 / 장비점검 결과
        path: '/content/safety/equipment/check',
        name: 'content-safety-equipment-check',
        component: () => import('@/views/content/safety/SafetyEquipmentCheck.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '파트너사 일일보고'},
            {title: '건설장비관리'},
            {title: '장비점검 결과'},
            {title: '목록', active: true}
          ],
          pageTitle: '장비점검 결과',
          parent: 'content-plan-project'
        }
      },


      { // 안전실적 / 시정 및 예방요청 / 시정 및 예방요청
        path: '/content/safety/prevention/request',
        name: 'content-safety-prevention-request',
        component: () => import('@/views/content/safety/SafetyPreventionRequest.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '시정 및 예방요청'},
            {title: '시정 및 예방조치'},
            {title: '안전', active: true}
          ],
          pageTitle: '안전',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 시정 및 예방요청 / 요청서 집계
        path: '/content/safety/prevention/total',
        name: 'content-safety-prevention-total',
        component: () => import('@/views/content/safety/SafetyPreventionTotal.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '시정 및 예방요청'},
            {title: '시정 및 예방조치'},
            {title: '형태별 분류', active: true}
          ],
          pageTitle: '형태별 분류',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 안전교육 / 교육 현황
        path: '/content/safety/hse/list',
        name: 'content-safety-hse-list',
        component: () => import('@/views/content/safety/SafetyHseList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전교육'},
            {title: '교육 현황', active: true}
          ],
          pageTitle: '교육 현황',
          parent: 'content-plan-project'
        }
      },
      { // 안전실적 / 안전교육 / 교육 모니터링
        path: '/content/safety/hse/monitoring',
        name: 'content-safety-hse-monitoring',
        component: () => import('@/views/content/safety/SafetyHseMonitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '안전교육'},
            {title: '교육 모니터링', active: true}
          ],
          pageTitle: '교육 모니터링',
          parent: 'content-plan-project'
        }
      },


      // 환경실적
      { // 환경실적 / 환경책임자선임 / 환경책임자선임
        path: '/content/state/director/list',
        name: 'content-state-director-list',
        component: () => import('@/views/content/state/StateDirectorList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경책임자선임'},
            {title: '환경책임자선임', active: true}
          ],
          pageTitle: '환경책임자선임',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 대관업무 / 대관인허가체크
        path: '/content/state/government/check',
        name: 'content-state-government-check',
        component: () => import('@/views/content/state/StateGovernmentCheck.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '대관업무'},
            {title: '대관인허가체크', active: true}
          ],
          pageTitle: '대관인허가체크',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 대관업무 / 대관인허가신고
        path: '/content/state/government/declar',
        name: 'content-state-government-declar',
        component: () => import('@/views/content/state/StateGovernmentDeclar.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '대관업무'},
            {title: '대관인허가신고', active: true}
          ],
          pageTitle: '대관인허가신고',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 대관업무 / 대관인허가모니터링
        path: '/content/state/government/monitoring',
        name: 'content-state-government-monitoring',
        component: () => import('@/views/content/state/StateGovernmentMonitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '대관업무'},
            {title: '대관인허가모니터링', active: true}
          ],
          pageTitle: '대관인허가모니터링',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경교육 / 환경교육
        path: '/content/state/hse/list',
        name: 'content-state-hse-list',
        component: () => import('@/views/content/state/StateHSEList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경교육'},
            {title: '환경교육', active: true}
          ],
          pageTitle: '환경교육',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경교육 / 환경교육 모니터링
        path: '/content/state/hse/monitoring',
        name: 'content-state-hse-monitoring',
        component: () => import('@/views/content/state/StateHSEMonitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경교육'},
            {title: '교육 모니터링', active: true}
          ],
          pageTitle: '교육 모니터링',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경점검 / 일일점검
        path: '/content/state/check/daily',
        name: 'content-state-check-daily',
        component: () => import('@/views/content/state/StateCheckDaily.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경점검'},
            {title: '일일점검', active: true}
          ],
          pageTitle: '일일점검',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경점검 / 월간점검
        path: '/content/state/check/monthly',
        name: 'content-state-check-monthly',
        component: () => import('@/views/content/state/StateCheckMonthly.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경점검'},
            {title: '월간점검', active: true}
          ],
          pageTitle: '월간점검',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경점검 / 환경점검모니터링
        path: '/content/state/check/monitoring',
        name: 'content-state-check-monitoring',
        component: () => import('@/views/content/state/StateCheckMonitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경점검'},
            {title: '환경점검모니터링', active: true}
          ],
          pageTitle: '환경점검모니터링',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경지원 / 환경지원보고
        path: '/content/state/support/report',
        name: 'content-state-support-report',
        component: () => import('@/views/content/state/StateSupportReport.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경지원'},
            {title: '환경지원보고', active: true}
          ],
          pageTitle: '환경지원보고',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경평가 / 환경영향평가
        path: '/content/state/evaluation/list',
        name: 'content-state-evaluation-list',
        component: () => import('@/views/content/state/StateEvaluationList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경평가'},
            {title: '환경영향평가', active: true}
          ],
          pageTitle: '환경영향평가',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 시정 및 예방요청 / 시정 및 예방요청서
        path: '/content/state/prevention/request',
        name: 'content-state-prevention-request',
        component: () => import('@/views/content/state/StatePreventionRequest.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '시정 및 예방요청서'},
            {title: '시정 및 예방요청서', active: true}
          ],
          pageTitle: '시정 및 예방요청서',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 시정 및 예방요청 / 형태별 분류
        path: '/content/state/prevention/total',
        name: 'content-state-prevention-total',
        component: () => import('@/views/content/state/StatePreventionTotal.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '시정 및 예방요청서'},
            {title: '요청서 집계', active: true}
          ],
          pageTitle: '요청서 집계',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경사고 및 이슈 / 환경사고보고
        path: '/content/state/report/problem',
        name: 'content-state-report-problem',
        component: () => import('@/views/content/state/StateReportProblem.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경사고/이슈보고'},
            {title: '환경사고보고', active: true}
          ],
          pageTitle: '환경사고보고',
          parent: 'content-plan-project'
        }
      },
      { // 환경실적 / 환경사고 및 이슈 / 환경이슈보고
        path: '/content/state/report/issue',
        name: 'content-state-report-issue',
        component: () => import('@/views/content/state/StateReportIssue.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '환경실적'},
            {title: '환경사고/이슈보고'},
            {title: '환경이슈보고', active: true}
          ],
          pageTitle: '환경이슈보고',
          parent: 'content-plan-project'
        }
      },
      { // 보건실적 / 시정 및 예방요청
        path: '/content/health/request',
        name: 'content-health-request',
        component: () => import('@/views/content/health/HealthRequest.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '시정 및 예방요청'},
            {title: '시정 및 예방조치'},
            {title: '보건', active: true}
          ],
          pageTitle: '보건',
          parent: 'content-plan-project'
        }
      },
      { // 보건실적 / 보건교육 / 교육 현황
        path: '/content/health/education/list',
        name: 'content-health-education-list',
        component: () => import('@/views/content/health/HealthEducationList.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '보건교육'},
            {title: '교육 현황', active: true}
          ],
          pageTitle: '교육 현황',
          parent: 'content-plan-project'
        }
      },
      { // 보건실적 / 보건교육 / 교육 모니터링
        path: '/content/health/education/monitoring',
        name: 'content-health-education-monitoring',
        component: () => import('@/views/content/health/HealthEducationMonitoring.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '보건교육'},
            {title: '교육 모니터링', active: true}
          ],
          pageTitle: '교육 모니터링',
          parent: 'content-plan-project'
        }
      },

      //커뮤니티
      { // 커뮤니티 / CEO 메세지
        path: '/community/businessnews',
        name: 'content-community-businessnews',
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
          parent: 'content_community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: '/community/businessnews/create',
        name: 'content-community-businessnews-create',
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
            {title: '목록', active: true}
          ],
          pageTitle: '공지사항',
          parent: 'content_community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: '/community/businessnews/:postId',
        name: 'content-community-businessnews-detail',
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
            {title: '목록', active: true}
          ],
          pageTitle: '공지사항',
          parent: 'content_community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: '/community/businessnews/:postId/update',
        name: 'content-community-businessnews-update',
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
            {title: '목록', active: true}
          ],
          pageTitle: '공지사항',
          parent: 'content_community_businessnews'
        }
      },
      { // 커뮤니티 / CEO 메세지
        path: '/community/businessnews/:postId/reply',
        name: 'content-community-businessnews-reply',
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
            {title: '목록', active: true}
          ],
          pageTitle: '공지사항',
          parent: 'content_community_businessnews'
        }
      },
      { // 커뮤니티 / Q&A
        path: '/community/qna',
        name: 'content-community-qna',
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
          parent: 'content_community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: '/community/qna/create',
        name: 'content-community-qna-create',
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
          parent: 'content_community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: '/community/qna/:postId',
        name: 'content-community-qna-detail',
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
          parent: 'content_community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: '/community/qna/:postId/update',
        name: 'content-community-qna-update',
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
          parent: 'content_community_qna'
        }
      },
      { // 커뮤니티 / Q&A
        path: '/community/qna/:postId/reply',
        name: 'content-community-qna-reply',
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
            {title: '답변', active: true}
          ],
          pageTitle: 'Q&A',
          parent: 'content_community_qna'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: '/community/healthinfo',
        name: 'content-community-healthinfo',
        component: () => import('@/views/community/CommunityHealthInfo.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: '/community/healthinfo/create',
        name: 'content-community-healthinfo-create',
        component: () => import('@/views/community/CommunityHealthInfoCreate.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: '/community/healthinfo/:postId',
        name: 'content-community-healthinfo-detail',
        component: () => import('@/views/community/CommunityHealthInfoDetail.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: '/community/healthinfo/:postId/update',
        name: 'content-community-healthinfo-update',
        component: () => import('@/views/community/CommunityHealthInfoUpdate.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_healthinfo'
        }
      },
      { // 커뮤니티 / 안전보건 주요일정
        path: '/community/healthinfo/:postId/reply',
        name: 'content-community-healthinfo-reply',
        component: () => import('@/views/community/CommunityHealthInfoReply.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_healthinfo'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: '/community/unitbusinessnews',
        name: 'content-community-unitbusinessnews',
        component: () => import('@/views/community/CommunityUnitBusinessNews.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: '/community/unitbusinessnews/create',
        name: 'content-community-unitbusinessnews-create',
        component: () => import('@/views/community/CommunityUnitBusinessNewsCreate.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: '/community/unitbusinessnews/:postId',
        name: 'content-community-unitbusinessnews-detail',
        component: () => import('@/views/community/CommunityUnitBusinessNewsDetail.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: '/community/unitbusinessnews/:postId/update',
        name: 'content-community-unitbusinessnews-update',
        component: () => import('@/views/community/CommunityUnitBusinessNewsUpdate.vue'),
        meta: {
          authPosition: 4,
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
          parent: 'content_community_unitbusinessnews'
        }
      },
      { // 커뮤니티 / 구성원 요청사항
        path: '/community/unitbusinessnews/:postId/reply',
        name: 'content-community-unitbusinessnews-reply',
        component: () => import('@/views/community/CommunityUnitBusinessNewsReply.vue'),
        meta: {
          authPosition: 4,
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
          pageTitle: '안전보건 주요일정',
          parent: 'content_community_unitbusinessnews'
        }
      },

      // 마이페이지
      { // 마이페이지 / 업무현황
        path: '/mypage/workstatus',
        name: 'content-mypage-workstatus',
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
          parent: 'content_mypage_workstatus'
        }
      },
      { // 마이페이지 / 알림
        path: '/mypage/alert',
        name: 'content-mypage-alert',
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
          parent: 'content_mypage_alert'
        }
      },
      { // 마이페이지 / 설정
        path: '/mypage/workmanager',
        name: 'content-mypage-workmanager',
        component: () => import('@/views/mypage/MyPageWorkManager.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              url: '/home'
            },
            {title: '마이페이지'},
            {title: '설정', active: true}
          ],
          pageTitle: '설정',
          parent: 'content_mypage_workmanager'
        }
      },
      { // 마이페이지 / 설정 / 개인정보변경
        path: '/mypage/info-update',
        name: 'content-mypage-info-update',
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
          parent: 'content_mypage_info-update'
        }
      },

    ]
  },

  // =============================================================================
  // FULL PAGE LAYOUTS
  // =============================================================================
  {
    path: '/pages/:custom',
    component: () => import('@/views/Pages.vue'),
    children: []
  }
]
