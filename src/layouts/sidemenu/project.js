export default [
  {
    url: '/back',
    name: '분야 바로가기',
    slug: 'home',
    icon: 'ArrowLeftIcon'
  },
  {
    url: '/home',
    name: '대시보드',
    slug: 'home',
    icon: '',
  },
  {
    url: '/plan',
    name: '현장 개요',
    slug: 'plan',
    icon: '',
    submenu: [
      {
        url: '/tab/89',
        name: '현장 정보',
        slug: 'plan-project',
        groupName: ['89'],
        icon: ''
      },
      {
        url: '/plan/partners/list',
        name: '파트너사 계약 현황',
        slug: 'plan-partners',
        icon: ''
      },
      {
        url: '/plan/partners/join',
        name: '파트너사 등록 요청',
        slug: '',
        icon: ''
      }
    ]
  },
  {
    url: '/',
    name: '산업재해발생',
    slug: 'report',
    icon: '',
    submenu: [
      {
        url: '/normal/57',
        name: '산업재해조사표',
        groupName: ['57'],
        icon: ''
      },
      {
        url: '/tab/53',
        name: '사고보고',
        icon: '',
        groupName: ['53', '54', '55'],
      },
      {
        url: '/approval/56',
        name: '실험실 안전사고 보고',
        groupName: ['56'],
        icon: ''
      },
    ]
  },
  {
    url: '/approval/86',
    name: '안전·보건예산 현황',
    slug: 'report',
    icon: '',
    groupName: ['86']
  },
  {
    url: '/risk',
    name: '위험성평가',
    slug: 'risk',
    icon: '',
    submenu: [
      {
        url: '/tab/82',
        name: '위험성평가',
        icon: '',
        groupName: ['82', '83']
      },
      {
        url: '/risk/conference',
        name: '협의체회의',
        slug: 'risk-conference',
        icon: ''
      }
    ]
  },
  {
    url: '/',
    name: '위원회 및 협의체',
    icon: '',
    submenu: [
      {
        url: '/tab/58',
        name: '본사',
        icon: '',
        groupName: ['58', '59', '60'],
      },
      {
        url: '/normal/61',
        groupName: ['61'],
        name: '본부',
        icon: ''
      }
    ]
  },
  {
    url: '/',
    name: '아차사고',
    icon: '',
    submenu: [
      {
        url: '/tab/62',
        name: '아차사고관리',
        icon: '',
        groupName: ['62', '63'],
      }
    ]
  },
  {
    url: '/',
    name: '안전작업허가',
    icon: '',
    submenu: [
      {
        url: '/tab/84',
        name: '안전작업허가',
        icon: '',
        groupName: ['84', '85']
      }
    ]
  },
  {
    url: '/hse',
    name: '안전·보건 교육',
    slug: 'hse',
    icon: '',
    submenu: [
      {
        url: '/hse/list',
        name: '교육 현황',
        slug: 'hse-list',
        icon: ''
      },
      {
        url: '/hse/monitoring',
        name: '교육 모니터링',
        slug: 'hse-monitoring',
        icon: ''
      }
    ]
  },
  {
    url: '/',
    name: '안전점검',
    icon: '',
    submenu: [
      {
        url: '/tab/64',
        name: '본사',
        icon: '',
        groupName: ['64', '65', '66', '67', '68', '69'],
      },
      {
        url: '/tab/70',
        name: '남해본부',
        icon: '',
        groupName: ['70']
      },
      {
        url: '/tab/74',
        name: '공통',
        icon: '',
        groupName: ['71', '72', '73', '74', '75']
      }
    ]
  },
  {
    url: '/',
    name: '부적합 및 시정조치',
    icon: '',
    submenu: [
      {
        url: '/tab/76',
        name: '부적합 및 시정조치',
        icon: '',
        groupName: ['76', '77']
      }
    ]
  },
  {
    url: '/',
    name: '작업중지제',
    icon: '',
    submenu: [
      {
        url: '/tab/78',
        name: '작업중지 보고서',
        icon: '',
        groupName: ['78', '79', '87']
      },
      {
        url: '/tab/80',
        name: '작업중지 조치결과서',
        icon: '',
        groupName: ['80', '81', '88']
      }
    ]
  },
  {
    url: '/safety',
    name: '파트너사 일일보고',
    slug: 'safety',
    icon: '',
    submenu: [
      {
        url: '/safety/director',
        name: '안전보건책임자 선임',
        slug: 'safety-director',
        icon: ''
      },
      {
        url: '/list/safety_check_partner/safety_check_partner_444',
        name: '안전점검',
        slug: 'safety-check',
        icon: ''
      },
      {
        url: '/safety/equipment',
        name: '장비점검 현황',
        slug: 'safety-equipment',
        icon: ''
      }
    ]
  },
  {
    url: '/community',
    name: '커뮤니티',
    slug: 'community',
    icon: '',
    submenu: [
      {
        url: '/community/businessnews',
        name: '공지사항',
        slug: 'community_businessnews',
        icon: ''
      },
      {
        url: '/community/healthinfo',
        name: '안전보건 주요일정',
        slug: 'community_healthinfo',
        icon: ''
      },
      {
        url: '/community/unitbusinessnews',
        name: '구성원 요청사항',
        slug: 'community_unitbusinessnews',
        icon: ''
      },
      {
        url: '/community/qna',
        name: 'Q&A',
        slug: 'community_qna',
        icon: ''
      }
    ]
  },
  {
    url: '/mypage',
    name: '마이페이지',
    slug: 'safety',
    icon: '',
    submenu: [
      {
        url: '/mypage/workstatus',
        name: '업무현황',
        slug: '',
        icon: ''
      },
      {
        url: '/mypage/alert',
        name: '알림',
        slug: '',
        icon: ''
      },
      {
        url: '/',
        name: '결재관리',
        slug: '',
        icon: '',
        submenu: [
          {
            url: '/approval-request',
            name: '결재요청함',
            slug: '',
            icon: ''
          },
          {
            url: '/approval-await',
            name: '결재대기함',
            slug: '',
            icon: ''
          },
          {
            url: '/approval-process',
            name: '결재진행함',
            slug: '',
            icon: ''
          },
          {
            url: '/approval-complete',
            name: '완료문서함',
            slug: '',
            icon: ''
          },
          {
            url: '/approval-reject',
            name: '반려문서함',
            slug: '',
            icon: ''
          },
          {
            url: '/approval-reference',
            name: '참조/회람문서함',
            slug: '',
            icon: ''
          },
        ]
      },
      {
        url: '/',
        name: '설정',
        slug: '',
        icon: '',
        submenu: [
          {
            url: '/mypage/info-update',
            name: '개인정보변경',
            slug: '',
            icon: ''
          },
        ]
      }
    ]
  }
]
