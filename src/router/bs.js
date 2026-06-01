export default [
  {
    path: "/project/:proj_id",
    component: () => import("@/layouts/ProjectLayout.vue"),
    meta: {
      authRequired: true,
    },
    children: [
      // ========== 현장(직접수행)
      {
        path: "field/workplace",
        name: "field-workplace-list",
        meta: {
          activeCode: "field-workplace",
        },
        component: () => import("@/views/_BS/FieldWorkplaceList.vue"),
      },
      {
        path: "field/workplace/write",
        name: "field-workplace-create",
        meta: {
          activeCode: "field-workplace",
        },
        component: () => import("@/views/_BS/FieldWorkplaceWrite.vue"),
      },
      {
        path: "field/workplace/write/:postId",
        name: "field-workplace-update",
        meta: {
          activeCode: "field-workplace",
        },
        component: () => import("@/views/_BS/FieldWorkplaceWrite.vue"),
      },
      {
        path: "field/workplace/info",
        name: "field-workplace-info",
        meta: {
          activeCode: "field-workplace",
        },
        component: () => import("@/views/_BS/FieldWorkplaceInfo.vue"),
      },

      // ========== 현장(용역위탁)
      {
        path: "field/workplace2",
        name: "field-workplace2-list",
        meta: {
          activeCode: "field-workplace2",
        },
        component: () => import("@/views/_BS/FieldWorkplace2List.vue"),
      },
      {
        path: "field/workplace2/write",
        name: "field-workplace2-create",
        meta: {
          activeCode: "field-workplace2",
        },
        component: () => import("@/views/_BS/FieldWorkplace2Write.vue"),
      },
      {
        path: "field/workplace2/write/:postId",
        name: "field-workplace2-update",
        meta: {
          activeCode: "field-workplace2",
        },
        component: () => import("@/views/_BS/FieldWorkplace2Write.vue"),
      },
      {
        path: "field/workplace2/info",
        name: "field-workplace2-info",
        meta: {
          activeCode: "field-workplace2",
        },
        component: () => import("@/views/_BS/FieldWorkplace2Info.vue"),
      },

      // ========== facility
      {
        path: "field/facility",
        name: "field-facility-list",
        meta: {
          activeCode: "field-facility",
        },
        component: () => import("@/views/_BS/FieldFacilityList.vue"),
      },
      {
        path: "field/facility/write",
        name: "field-facility-create",
        meta: {
          activeCode: "field-facility",
        },
        component: () => import("@/views/_BS/FieldFacilityWrite.vue"),
      },
      {
        path: "field/facility/write/:postId",
        name: "field-facility-update",
        meta: {
          activeCode: "field-facility",
        },
        component: () => import("@/views/_BS/FieldFacilityWrite.vue"),
      },
      {
        path: "field/facility/info",
        name: "field-facility-info",
        meta: {
          activeCode: "field-facility",
        },
        component: () => import("@/views/_BS/FieldFacilityInfo.vue"),
      },

      // ========== field
      {
        path: "field/field/info",
        name: "field-field-info",
        meta: {
          activeCode: "field-field",
        },
        component: () => import("@/views/_BS/FieldFieldInfo.vue"),
      },

      // ========== 위험성평가 엑셀 업로드 ==========
      {
        path: "riskassessment450",
        name: "riskassessment450",
        meta: {
          activeCode: "riskassessment450",
        },
        component: () => import("@/views/_BS/RiskAssessment.vue"),
      },
      {
        path: "riskassessment460",
        name: "riskassessment460",
        meta: {
          activeCode: "riskassessment460",
        },
        component: () => import("@/views/_BS/RiskAssessment.vue"),
      },

      // ==========
      {
        path: "company/info",
        name: "company-info",
        meta: {
          activeCode: "company-info",
        },
        component: () => import("@/views/_BS/CompanyInfo2.vue"),
      },
    ],
  },
];
