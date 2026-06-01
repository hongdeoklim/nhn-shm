export default {

  LOAD_COMPANY_LIST (state, data) {
    state.companyListInfo = data
    state.companyList = data.data
  },

  LOAD_COMPANY_TREE (state, data) {
    state.companyTree = data
  },

  LOAD_COMPANY (state, data) {
    state.companyInfo = data
  },

  LOAD_MEMBER_LIST (state, data) {
    state.memberList = data.data
  },

  LOAD_COMPANY_FIELD (state, data) {
    console.log(data)
  },

  HEAD_QUARTERS (state, data) {
    state.headquarters = data.data
  },

}
