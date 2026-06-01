import HttpRequest from '@/util/HttpRequest'

export default {

  LOAD_MENU_LIST (state, data) {
    state.list = data
  },

  UPDATE_MENU_LIST (state, data) {
  },

  UPDATE_PAGE_LIST (state, data) {
    state.pagePath = data
    state.pageTitle = data[data.length -1].label
  },
}
