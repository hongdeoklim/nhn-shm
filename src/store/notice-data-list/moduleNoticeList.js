

import state from './moduleNoticeListState.js'
import mutations from './moduleNoticeListMutations.js'
import actions from './moduleNoticeListActions.js'
import getters from './moduleNoticeListGetters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

