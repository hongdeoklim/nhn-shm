
export default {
  // 공지사항
  LOAD_NOTICE_LIST (state, notice) {
    state.noticeList = notice
  },

  LOAD_NOTICE_DETAIL (state, content) {
    state.noticeContent = content
  },


  ADD_ITEM (state, item) {
    state.notices.unshift(item)
  },
  SET_NOTICES (state, notices) {
    state.notices = notices
  },
  UPDATE_NOTICE (state, notice) {
    const noticeIndex = state.notices.findIndex((p) => p.id === notice.id)
    Object.assign(state.notices[noticeIndex], notice)
  },
  REMOVE_ITEM (state, itemId) {
    const ItemIndex = state.notices.findIndex((p) => p.id === itemId)
    state.notices.splice(ItemIndex, 1)
  }


}
