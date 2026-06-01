import HttpRequest from "@/util/HttpRequest";
import { dedupeRequest } from "@/util/requestCache";
import constant from "@/constant/constant";

export default {
  async CREATE_COMPANY({ commit }, params) {
    const option = {
      // 필수
      com_name: params.com_name,
      project_ids: params.project_ids,

      // 선택
      com_number: params.com_number,
      com_ceo: params.com_ceo,
      com_address: params.com_address,
      com_business_class: params.com_business_class,
      com_business_type: params.com_business_type,
      director: params.director,
      phone: params.phone,
      uploads: params.uploads,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post("/api/v1/company", option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async UPDATE_COMPANY({ commit }, params) {
    const companyId = params.id;
    const option = {
      // 필수
      com_name: params.com_name,
      project_ids: params.project_ids,

      // 선택
      com_number: params.com_number,
      com_ceo: params.com_ceo,
      com_address: params.com_address,
      com_business_class: params.com_business_class,
      com_business_type: params.com_business_type,
      director: params.director,
      phone: params.phone,
      uploads: params.uploads,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/company/${companyId}`, option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * 회사 목록
   * @params {page, perPage}
   */
  async LOAD_COMPANY_LIST({ commit }, params) {
    if (!params.projectId) return;

    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
        comType: params.comType,
        projectId: params.projectId,
        fieldId: params.fieldId,
        onlyRelated: params.onlyRelated ? 1 : undefined,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/company", option)
        .then((response) => {
          // mutations 메소드 호출
          commit("LOAD_COMPANY_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
   * 회사 목록
   * @params {page, perPage}
   */
  async LOAD_COMPANY_TREE({ commit }, params) {
    if (!params.projectId) return;

    const option = {
      params: {
        projectId: params.projectId,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/company/tree", option)
        .then((response) => {
          // mutations 메소드 호출
          commit("LOAD_COMPANY_TREE", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_COMPANY({ commit, state }, params) {
    const companyId = params.companyId;

    if (!state.companyInfo || `${state.companyInfo.id}` !== `${companyId}`) {
      return new Promise((resolve, reject) => {
        HttpRequest.get(`/api/v1/company/${companyId}`)
          .then((response) => {
            // mutations 메소드 호출
            commit("LOAD_COMPANY", response);
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    }
  },

  async LOAD_COMPANY_FIELD({ commit }, params) {
    const companyId = params.companyId;

    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        fieldName: params.fieldName,
        projectId: params.projectId,
        fieldType: params.fieldType,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/company/field/${companyId}`, option)
        .then((response) => {
          // mutations 메소드 호출
          commit("LOAD_COMPANY_FIELD", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_MEMBER_LIST({ commit }, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        company_id: params.company_id,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/company/member", option)
        .then((response) => {
          // mutations 메소드 호출
          commit("LOAD_MEMBER_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async CHECK_EXIST({ commit }, params) {
    const option = {
      params: {
        com_name: params.com_name,
        com_number: params.com_number,
      },
    };
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/company/check-exist", option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async HEAD_QUARTERS({ commit }, params) {
    const option = {
      params: {},
    };
    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/company/headquarters", option)
        .then((response) => {
          commit("HEAD_QUARTERS", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },
};
