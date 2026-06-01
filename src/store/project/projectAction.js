import HttpRequest from "@/util/HttpRequest";
import { dedupeRequest } from "@/util/requestCache";

export default {
  /**
   * 프로젝트 목록
   * @params
   */
  async LOAD_PROJECT_LIST({commit}, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
        filterType: params.filterType,
        filterBegin: params.filterBegin,
        filterEnd: params.filterEnd,
        project_group_id: params.project_group_id,
        project_name: params.project_name,
        constructor: params.constructor_name,
        subcontractor: params.subcontractor,
        location: params.location,
        contract_code: params.contract_code,
        employee: params.employee,
        onlyMe: params.onlyMe,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/project/filter", option)
        .then((response) => {
          commit("LOAD_PROJECT_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_PROJECT_GROUP({commit}, params) {
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/project/group")
        .then((response) => {
          commit("LOAD_PROJECT_GROUP", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_PROJECT_WORKTYPE({commit}, params) {
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/project/worktype")
        .then((response) => {
          commit("LOAD_PROJECT_WORKTYPE", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_PROJECT_COMPANY_MEMBER_LIST({commit}, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        company_id: params.company_id,
      },
    };

    const projectId = params.projectId;
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/${projectId}/company/user`, option)
        .then((response) => {
          commit("LOAD_PROJECT_COMPANY_MEMBER_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async CREATE_PROJECT({commit}, params) {
    const option = {
      contract_code: params.contract_code, // 계약코드
      project_group: params.project_group, // 현장명
      field_name: params.field_name, // 현장이름
      field_chief: params.field_chief, // 안전보건부서장
      safety_chief: params.safety_chief, // 안전보건담당자
      field_location: params.field_location, // 지역
      client: params.client, // 관할부처
      work_type: params.work_type, // 사업구분
      work_general: params.work_general, // 안전담당부서
      work_money_amount: params.work_money_amount, // 사업금액
      date_work_start: params.date_work_start, // 시작일
      date_complete_expected: params.date_complete_expected, // 중간점검일
      date_complete: params.date_complete, // 종료일
      constructor: params.constructor_name,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.put("/api/v1/project/", option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async UPDATE_PROJECT({commit}, params) {
    const projectId = params.project_id;

    const option = {
      contract_code: params.contract_code, // 계약코드
      field_name: params.field_name, // 현장이름
      field_chief: params.field_chief, // 안전보건부서장
      safety_chief: params.safety_chief, // 안전보건담당자
      field_location: params.field_location, // 지역
      client: params.client, // 관할부처
      work_type: params.work_type, // 사업구분
      work_general: params.work_general, // 안전담당부서
      work_money_amount: params.work_money_amount, // 사업금액
      date_work_start: params.date_work_start, // 시작일
      date_complete_expected: params.date_complete_expected, // 중간점검일
      date_complete: params.date_complete, // 종료일
      field_view: params.field_view, // 현장조감도
      field_map: params.field_map, // 현장약도
      field_photo: params.field_photo, // 현장사진
      meta: params.meta,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/project/${projectId}`, option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_PROJECT({commit, state}, params) {
    const projectId = params.project_id;

    if (!state.projectInfo || `${state.projectInfo.id}` !== `${projectId}`) {
      return new Promise((resolve, reject) => {
        HttpRequest.get(`/api/v1/project/${projectId}`)
          .then((response) => {
            commit("LOAD_PROJECT", response);
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    }
  },

  async ADD_COMPANY({commit}, params) {
    const option = {
      company_ids: params.company_ids,
    };

    const projectId = Number(params.project_id);

    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/project/${projectId}/company`, option)
        .then((response) => {
          commit("ADD_COMPANY", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async DELETE_COMPANY({commit}, params) {
    const projectId = Number(params.projectId);
    const companyId = Number(params.companyId);

    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/company/${projectId}/${companyId}`)
        .then((response) => {
          commit("DELETE_COMPANY", response);
          resolve(response);
        })
        .catch((err) => {
          commit("DELETE_COMPANY_FAILED", err);
          reject(err);
        });
    });
  },

  async LOAD_PROJECT_ORDER({commit}, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        projectId: params.projectId,
        filterYmdBegin: params.filterYmdBegin,
        filterYmdEnd: params.filterYmdEnd,
        filterOrderBegin: params.filterOrderBegin,
        filterOrderEnd: params.filterOrderEnd,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/project/order", option)
        .then((response) => {
          commit("LOAD_PROJECT_ORDER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_PROJECT_USER({commit}, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
      },
    };
    const projectId = params.projectId;

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/${projectId}/user`, option)
        .then((response) => {
          commit("LOAD_PROJECT_USER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async ADD_PROJECT_USER({commit}, params) {
    const option = {
      project_id: params.projectId,
      user_ids: params.user_ids.toString(),
    };
    const projectId = params.projectId;
    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/project/${projectId}/user`, option)
        .then((response) => {
          commit("ADD_PROJECT_USER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async DELETE_PROJECT_USER({commit}, params) {
    const option = {
      params: {
        project_id: params.projectId,
        user_ids: params.user_ids.toString(),
      },
    };
    const projectId = params.projectId;
    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/project/${projectId}/user`, option)
        .then((response) => {
          commit("ADD_PROJECT_USER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async CREATE_PROJECT_ORDER({commit}, params) {
    const option = {
      project_id: Number(params.project_id),
      begin_ymd: params.begin_ymd,
      end_ymd: params.end_ymd,
      start_order_number: params.start_order_number,
      order_period_unit: params.order_period_unit,
      order_period_number: params.order_period_number,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.put("/api/v1/project/order", option)
        .then((response) => {
          commit("CREATE_PROJECT_ORDER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async GET_NOW_PROJECT_ORDER({commit}, params) {
    const option = {
      params: {
        ymd: new Date().format("yyyy-MM-dd"),
      },
    };

    const projectId = params.projectId;

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/order/${projectId}`, option)
        .then((response) => {
          commit("GET_NOW_PROJECT_ORDER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async REMOVE_PROJECT_ORDER({commit}, params) {
    const orderId = params.orderId;

    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/project/order/${orderId}`)
        .then((response) => {
          commit("REMOVE_PROJECT_ORDER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_STDW_SECTOR({commit}) {
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/info/stdw/sector")
        .then((response) => {
          commit("HSE_LOAD_STDW_SECTOR", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_STDW_MIDCLASS({commit}, params) {
    const option = {
      params: {
        sector_id: params.sector_id,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/info/stdw/midClass", option)
        .then((response) => {
          commit("HSE_LOAD_STDW_MIDCLASS", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_STDW_UNITCLASS({commit}, params) {
    const option = {
      params: {
        sector_id: params.sector_id,
        mid_class_id: params.mid_class_id,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/info/stdw/unitClass", option)
        .then((response) => {
          commit("HSE_LOAD_STDW_UNITCLASS", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_INFO_WORKPOSITION({commit}, params) {
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/info/workPosition")
        .then((response) => {
          commit("HSE_LOAD_INFO_WORKPOSITION", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_STD_WORK({commit}, params) {
    const option = {params: {}};

    if (params.sector_id) option.params.sector_id = params.sector_id;
    if (params.mid_class_id) option.params.mid_class_id = params.mid_class_id;
    if (params.unit_class_id) option.params.unit_class_id = params.unit_class_id;
    if (params.unit_task_id) option.params.unit_task_id = params.unit_task_id;
    if (params.keyword) option.params.keyword = params.keyword;
    if (params.page) option.params.page = params.page;
    if (params.perPage) option.params.perPage = params.perPage;

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/standard/work", option)
        .then((response) => {
          commit("HSE_LOAD_STD_WORK", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
   * 위험성평가표
   * @params {page, perPage}
   */
  async HSE_LOAD_RISK_REFERENCE({commit}, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        business_area: params.businessArea, // 사업분야
        process_name: params.processName, // 공정명
        task_name: params.taskName, // 평가 작업명
        keyword: params.keyword, // 검색어
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/standard/risk-reference", option)
        .then((response) => {
          // mutations 메소드 호출
          commit("HSE_LOAD_RISK_REFERENCE", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_INFO_RENTWORK({commit}, params) {
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/hse/info/rentwork")
        .then((response) => {
          commit("HSE_LOAD_INFO_RENTWORK", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_LOAD_INFO_RENTWORK_PROJECT({commit}, params) {
    const projectId = params.projectId;
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/${projectId}/rentwork`)
        .then((response) => {
          commit("HSE_LOAD_INFO_RENTWORK_PROJECT", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HSE_UPDATE_INFO_RENTWORK_PROJECT({commit}, params) {
    const projectId = params.projectId;
    const option = {
      enabled: params.enabled,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/project/${projectId}/rentwork`, option)
        .then((response) => {
          commit("HSE_UPDATE_INFO_RENTWORK_PROJECT", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async QR_HISTORY_ME({commit}, params) {
    const projectId = params.projectId;
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
      },
    };
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/qr/history/me/${projectId}`, option)
        .then((response) => {
          commit("QR_HISTORY_ME", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async QR_HISTORY_SCANNER({commit}, params) {
    const projectId = params.projectId;
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
      },
    };
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/qr/history/scanner/${projectId}`, option)
        .then((response) => {
          commit("QR_HISTORY_SCANNER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async CREATE_FIELD({commit}, params) {
    const option = {
      project_id: Number(params.project_id),
      facility_category_id: params.facility_category_id ? Number(params.facility_category_id) : undefined,
      field_name: params.field_name,
      address: params.address,
      director_name: params.director_name,
      safety_manager_name: params.safety_manager_name,
      phone: params.phone,
      start_work_at: params.start_work_at,
      be_completed_at: params.be_completed_at,
      field_view: typeof params.field_view === "object" ? JSON.stringify(params.field_view) : undefined,
      field_map: typeof params.field_map === "object" ? JSON.stringify(params.field_map) : undefined,
      field_photo: typeof params.field_photo === "object" ? JSON.stringify(params.field_photo) : undefined,
      company_ids: params.company_ids && params.company_ids.length > 0 ? params.company_ids : undefined,
      user_ids: params.user_ids && params.user_ids.length > 0 ? params.user_ids : undefined,
      meta: params.meta,
      field_type: params.field_type,
      safety_grade: params.safety_grade,
      format: params.format,
      scale1: params.scale1,
      scale2: params.scale2,
      scale3: params.scale3,
      deposit_amount: params.deposit_amount,
      work_begin_at: params.work_begin_at,
      work_end_at: params.work_end_at,
      contract_code: params.contract_code,
      amount_sumup: Number(params.amount_sumup),
      signatures: params.signatures ? params.signatures : [],
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post("/api/v1/field", option)
        .then((response) => {
          commit("CREATE_FIELD", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async UPDATE_FIELD({commit}, params) {
    const option = {
      project_id: Number(params.project_id),
      facility_category_id: params.facility_category_id ? Number(params.facility_category_id) : undefined,
      field_name: params.field_name,
      address: params.address,
      director_name: params.director_name,
      safety_manager_name: params.safety_manager_name,
      phone: params.phone,
      start_work_at: params.start_work_at,
      be_completed_at: params.be_completed_at,
      field_view: typeof params.field_view === "object" ? JSON.stringify(params.field_view) : undefined,
      field_map: typeof params.field_map === "object" ? JSON.stringify(params.field_map) : undefined,
      field_photo: typeof params.field_photo === "object" ? JSON.stringify(params.field_photo) : undefined,
      company_ids: params.company_ids && params.company_ids.length > 0 ? params.company_ids : undefined,
      user_ids: params.user_ids,
      meta: params.meta,
      field_type: params.field_type,
      safety_grade: params.safety_grade,
      format: params.format,
      scale1: params.scale1,
      scale2: params.scale2,
      scale3: params.scale3,
      deposit_amount: params.deposit_amount,
      work_begin_at: params.work_begin_at,
      work_end_at: params.work_end_at,
      contract_code: params.contract_code,
      amount_sumup: Number(params.amount_sumup),
      signatures: params.signatures ? params.signatures : [],
    };

    const fieldId = params.fieldId;
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/field/${fieldId}`, option)
        .then((response) => {
          commit("UPDATE_FIELD", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_FIELD_LIST({commit}, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
        projectId: params.projectId,
        type: params.type,
        showAll: params.showAll,

        order_by: params.order_by,
        order_direction: params.order_direction,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/field", option)
        .then((response) => {
          commit("LOAD_FIELD_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_FIELD({commit}, params) {
    const fieldId = params.postId || params.fieldId;

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/field/${fieldId}`)
        .then((response) => {
          commit("LOAD_FIELD", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_FIELD_USERS({commit}, params) {
    const fieldId = params.fieldId;

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/field/users/${fieldId}`)
        .then((response) => {
          commit("LOAD_FIELD_USERS", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_FIELD_LIST_JOIN_ME({commit}, params) {
    const projectId = params.projectId;
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/field/${projectId}/me`, option)
        .then((response) => {
          commit("LOAD_FIELD_LIST_JOIN_ME", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_FIELD_FACILITY_CATEGORY_OPTIONS({commit}, params) {
    const cat1 = params.cat1;
    const cat2 = params.cat2;
    const cat3 = params.cat3;

    let type = "cat1";
    if (cat3) type = "cat4";
    else if (cat2) type = "cat3";
    else if (cat1) type = "cat2";

    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
        cat1,
        cat2,
        cat3,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/field/facility-category/${type}`, option)
        .then((response) => {
          commit("LOAD_FIELD_FACILITY_CATEGORY_OPTIONS", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_JOB_CLASSIFICATION_LIST({ /*commit*/}, params) {
    const option = {
      params: {
        code: params.code,
        keyword: params.keyword,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/hse/info/job-classification`, option)
        .then((response) => {
          // commit("LOAD_JOB_CLASSIFICATION_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
   * Field 객체를 삭제한다
   * @param commit
   * @param params
   * @returns {Promise<unknown>}
   * @constructor
   */
  async DELETE_FIELD({commit}, params) {
    const fieldId = params.fieldId;

    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/field/${fieldId}`)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    })
  }
};
