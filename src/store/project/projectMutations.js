export default {

  LOAD_PROJECT_WORKTYPE (state, data) {
    state.projectWorkType = data
  },

  LOAD_PROJECT_COMPANY_MEMBER_LIST (state, data) {
    state.projectCompanyUserInfo = data
    state.projectCompanyUserList = data.data
  },

  LOAD_PROJECT_GROUP (state, data) {
    state.projectGroup = data
  },

  LOAD_PROJECT_LIST (state, data) {
    state.projectList = data.data
    state.projectListInfo = data

  },

  LOAD_PROJECT (state, data) {
    state.projectInfo = data
  },

  ADD_COMPANY (state, data) {
  },

  DELETE_COMPANY (state, data) {
  },

  DELETE_COMPANY_FAILED (state, error) {
    state.error_code = error.response.status
  },

  LOAD_PROJECT_ORDER (state, data) {
    state.orderList = data.data
    state.orderListInfo = data
  },

  LOAD_PROJECT_USER (state, data) {
    state.projectUserList = data.data
    state.projectUserInfo = data
  },

  ADD_PROJECT_USER (state, data) {
  },

  DELETE_PROJECT_USER (state, data) {
  },

  CREATE_PROJECT_ORDER (state) {
    state.error_code = -1
  },

  GET_NOW_PROJECT_ORDER (state, data) {
    state.nowOrder = data
  },

  REMOVE_PROJECT_ORDER (state) {
    state.error_code = -1
  },

  HSE_LOAD_STDW_SECTOR (state, data) {
    state.hseStdwSectorList = data
  },

  HSE_LOAD_STDW_MIDCLASS (state, data) {
    state.hseStdwMidClassList = data
  },

  HSE_LOAD_STDW_UNITCLASS (state, data) {
    state.hseStdwUnitClassList = data
  },

  HSE_LOAD_INFO_WORKPOSITION (state, data) {
    state.hseInfoWorkPositionList = data
  },

  HSE_LOAD_STD_WORK (state, data) {
    state.hseStdWorkList = data
  },

  HSE_LOAD_RISK_REFERENCE (state, data) {
    state.hasRiskReferenceList = data
  },

  HSE_LOAD_INFO_RENTWORK (state, data) {
    state.hseRentWorkList = data
  },

  HSE_LOAD_INFO_RENTWORK_PROJECT (state, data) {
    state.hseProjectRentWorkList = data
  },

  HSE_UPDATE_INFO_RENTWORK_PROJECT (state, data) {

  },

  QR_HISTORY_ME (state, data) {
    state.qrHistoryList = data
  },

  QR_HISTORY_SCANNER (state, data) {
    state.qrHistoryScannerList = data
  },

  CREATE_FIELD (state) {
    state.error_code = -1
  },

  LOAD_FIELD_LIST (state, data) {
    state.fieldListInfo = data
  },

  LOAD_FIELD (state, data) {
    state.fieldInfo = data
  },

  LOAD_FIELD_USERS (state, data) {
    state.fieldUsers = data
  },

  LOAD_FIELD_LIST_JOIN_ME (state, data) {
    state.fieldListInfo = data
  },

  LOAD_FIELD_FACILITY_CATEGORY_OPTIONS (state, data) {
    state.fieldFacilityCategoryOptionsInfo = data
    state.fieldFacilityCategoryOptions = data.data
  }
}
