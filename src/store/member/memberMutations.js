export default {

  LOAD_MEMBERS (state, data) {
    state.list = data.data
    state.listInfo = data
  },

  LOAD_MEMBERS_ALL (state, data) {
    state.listAll = data.data
  },

  LOAD_MEMBER (state, data) {
    state.memberInfo = data
  },

  LOAD_MEMBER_DETAIL (state, data) {
    state.memberInfo = data
  },

  REGISTER_MEMBER (state, data) {
    state.memberInfo = data
  },

  MODIFY_MEMBER (state, data) {
    state.memberInfo = data
  }
}
