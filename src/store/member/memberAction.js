import HttpRequest from "@/util/HttpRequest";
import { dedupeRequest } from "@/util/requestCache";

export default {
  /**
   * 회원리스트 불러오기
   * @params {page, perPage}
   */
  async LOAD_MEMBERS({ commit }, params) {
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
        name: params.name,
        email: params.email,
        username: params.username,
        company: params.company,
        section: params.section,
        field: params.field,
        projectId: params.projectId,
      },
    };

    /* TODO : 로컬 저장
    const _key = `/api/v1/member?${JSON.stringify(option)}/${params.searchType}`
    const members = localStorage.getItem(_key)
    if (members) {
      const data = JSON.parse(members)
      commit('LOAD_MEMBERS', data)
      return data
    }
    */
    const searchType = params.searchType;

    if (searchType === "and") {
      return new Promise((resolve, reject) => {
        HttpRequest.get("/api/v1/member/filter", option)
          .then((response) => {
            // mutations 메소드 호출
            commit("LOAD_MEMBERS", response);
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    } else {
      return new Promise((resolve, reject) => {
        HttpRequest.get("/api/v1/member", option)
          .then((response) => {
            // mutations 메소드 호출
            commit("LOAD_MEMBERS", response);
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    }
  },

  /*회원리스트 모두 불러오기*/
  async LOAD_MEMBERS_ALL({ commit }, params) {
    const _key = "/api/v1/member/all";
    const memberAll = localStorage.getItem(_key);
    if (memberAll) {
      const data = JSON.parse(memberAll);
      commit("LOAD_MEMBERS_ALL", data);
      return data;
    }

    const option = {
      params: {
        page: 1,
        perPage: 10000,
        projectId: params.projectId,
      },
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/member", option)
        .then((response) => {
          localStorage.setItem(_key, JSON.stringify(response));

          // mutations 메소드 호출
          commit("LOAD_MEMBERS_ALL", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
   * 회원정보 불러오기
   * @params {userId}
   */
  async LOAD_MEMBER({ commit }, params) {
    const option = {
      params: {},
    };

    const userId = params.userId;

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/member/${userId}`, option)
        .then((response) => {
          const metas = response.metas
          response["meta"] = {};
          if (metas && Array.isArray(metas)) {
            metas.forEach(meta => {
              response["meta"][meta.meta_key] = meta.meta_value
            })
          }

          // mutations 메소드 호출
          commit("LOAD_MEMBER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_MEMBER_DETAIL({ commit }, params) {
    const option = {
      params: {},
    };

    return new Promise((resolve, reject) => {
      HttpRequest.get("/api/v1/member/detail", option)
        .then((response) => {
          // metas 배열을 meta 객체로 변환
          const metas = response.metas;
          response["meta"] = {};
          if (metas && Array.isArray(metas)) {
            metas.forEach(meta => {
              response["meta"][meta.meta_key] = meta.meta_value;
            });
          }

          // mutations 메소드 호출
          commit("LOAD_MEMBER_DETAIL", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
  * 회원 가입
  * @params {
      userId,
      name, surname, password, nickname,
      birthdate, mobile, phone,
      home_zip, home_address_1, home_address_2,
      company_zip, company_address_1, company_address_2,
      subscribe_email, subscribe_sms, mail_destination, is_activated
    }
  */
  async REGISTER_MEMBER({ commit }, params) {
    const option = {
      params: {},
    };

    if (params.username) option.params.username = params.username;
    if (params.email) option.params.email = params.email;

    if (params.name) option.params.name = params.name;
    if (params.surname) option.params.surname = params.surname;
    if (params.password) option.params.password = params.password;
    if (params.password_confirmation) option.params.password_confirmation = params.password_confirmation;
    if (params.nickname) option.params.nickname = params.nickname;
    if (params.birthdate) option.params.birthdate = params.birthdate;
    if (params.mobile) option.params.mobile = params.mobile;
    if (params.phone) option.params.phone = params.phone;
    if (params.home_zip) option.params.home_zip = params.home_zip;
    if (params.home_address_1) option.params.home_address_1 = params.home_address_1;
    if (params.home_address_2) option.params.home_address_2 = params.home_address_2;
    if (params.company_zip) option.params.company_zip = params.company_zip;
    if (params.company_address_1) option.params.company_address_1 = params.company_address_1;
    if (params.company_address_2) option.params.company_address_2 = params.company_address_2;
    if (params.subscribe_email) option.params.subscribe_email = params.subscribe_email;
    if (params.subscribe_sms) option.params.subscribe_sms = params.subscribe_sms;
    if (params.mail_destination) option.params.mail_destination = params.mail_destination;
    if (params.avatar) option.params.avatar = params.avatar;

    // is_activated ={0:계정 비활성화, 1:계정 활성화)
    // 기획 변경에 따라 수정될 수 있다.
    // 가입 이후 바로 로그인을 할수 있게 하려면, 1로 설정하고,
    // 가입 이후 별도 인증을 거쳐야 로그인할 수 있게 하려면, 0으로 설정한다.
    // if(params.is_activated) option.params.is_activated = params.is_activated;
    option.params.is_activated = 1;

    return new Promise((resolve, reject) => {
      HttpRequest.put("/api/v1/member/", option.params)
        .then((response) => {
          // mutations 메소드 호출
          commit("REGISTER_MEMBER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async NONE_TOKEN_REGISTER_MEMBER({ commit }, params) {
    const option = {
      params: {},
    };

    if (params.username) option.params.username = params.username;
    if (params.email) option.params.email = params.email;

    if (params.name) option.params.name = params.name;
    if (params.surname) option.params.surname = params.surname;
    if (params.password) option.params.password = params.password;
    if (params.password_confirmation) option.params.password_confirmation = params.password_confirmation;
    if (params.nickname) option.params.nickname = params.nickname;
    if (params.birthdate) option.params.birthdate = params.birthdate;
    if (params.mobile) option.params.mobile = params.mobile;
    if (params.phone) option.params.phone = params.phone;
    if (params.home_zip) option.params.home_zip = params.home_zip;
    if (params.home_address_1) option.params.home_address_1 = params.home_address_1;
    if (params.home_address_2) option.params.home_address_2 = params.home_address_2;
    if (params.company_zip) option.params.company_zip = params.company_zip;
    if (params.company_address_1) option.params.company_address_1 = params.company_address_1;
    if (params.company_address_2) option.params.company_address_2 = params.company_address_2;
    if (params.subscribe_email) option.params.subscribe_email = params.subscribe_email;
    if (params.subscribe_sms) option.params.subscribe_sms = params.subscribe_sms;
    if (params.mail_destination) option.params.mail_destination = params.mail_destination;
    if (params.avatar) option.params.avatar = params.avatar;

    // is_activated ={0:계정 비활성화, 1:계정 활성화)
    // 기획 변경에 따라 수정될 수 있다.
    // 가입 이후 바로 로그인을 할수 있게 하려면, 1로 설정하고,
    // 가입 이후 별도 인증을 거쳐야 로그인할 수 있게 하려면, 0으로 설정한다.
    // if(params.is_activated) option.params.is_activated = params.is_activated;
    option.params.is_activated = 1;

    return new Promise((resolve, reject) => {
      HttpRequest.none_token_put("/api/v1/member/", option.params)
        .then((response) => {
          // mutations 메소드 호출
          commit("REGISTER_MEMBER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
  * 회원정보 수정하기
  * @params {
      userId,
      name, surname, password, nickname,
      birthdate, mobile, phone,
      home_zip, home_address_1, home_address_2,
      company_zip, company_address_1, company_address_2,
      subscribe_email, subscribe_sms, mail_destination, is_activated
    }
  */
  async MODIFY_MEMBER({ commit }, params) {
    const option = {
      params: {},
    };

    const userId = params.userId;

    if (params.email) option.params.email = params.email;
    if (params.name) option.params.name = params.name;
    if (params.surname) option.params.surname = params.surname;
    if (params.password_old) option.params.password_old = params.password_old;
    if (params.password) option.params.password = params.password;
    if (params.password_confirmation) option.params.password_confirmation = params.password_confirmation;
    if (params.nickname) option.params.nickname = params.nickname;
    if (params.birthdate) option.params.birthdate = params.birthdate;
    if (params.mobile) option.params.mobile = params.mobile;
    if (params.phone) option.params.phone = params.phone;
    if (params.home_zip) option.params.home_zip = params.home_zip;
    if (params.home_address_1) option.params.home_address_1 = params.home_address_1;
    if (params.home_address_2) option.params.home_address_2 = params.home_address_2;
    if (params.company_zip) option.params.company_zip = params.company_zip;
    if (params.company_address_1) option.params.company_address_1 = params.company_address_1;
    if (params.company_address_2) option.params.company_address_2 = params.company_address_2;
    if (params.subscribe_email) option.params.subscribe_email = params.subscribe_email;
    if (params.subscribe_sms) option.params.subscribe_sms = params.subscribe_sms;
    if (params.mail_destination) option.params.mail_destination = params.mail_destination;
    if (params.is_activated) option.params.is_activated = params.is_activated;
    if (params.avatar) option.params.avatar = params.avatar;
    if (params.position) option.params.position = params.position;
    if (params.rank) option.params.rank = params.rank;
    if (params.department) option.params.department = params.department;
    if (params.section) option.params.section = params.section;
    if (params.metas) option.params.metas = params.metas

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/member/${userId}`, option.params)
        .then((response) => {
          // mutations 메소드 호출
          commit("MODIFY_MEMBER", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },
};
