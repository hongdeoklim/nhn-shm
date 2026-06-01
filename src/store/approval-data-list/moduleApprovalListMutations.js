
export default {
  // 결재 요청함
  LOAD_APPROVAL_REQUEST_LIST (state, data) {
    state.approvalRequestList = data
  },
  // 결재 대기함
  LOAD_APPROVAL_AWAIT_LIST (state, data) {
    state.approvalAwaitList = data
  },

  // 결재 진행함
  LOAD_APPROVAL_PROCESS_LIST (state, data) {
    state.approvalProcessList = data
  },

  // 완료 문서함
  LOAD_APPROVAL_COMPLETE_LIST (state, data) {
    state.approvalCompleteList = data
  },

  // 반려 문서함
  LOAD_APPROVAL_REJECT_LIST (state, data) {
    state.approvalRejectList = data
  },

  // 상세 내용 조회
  LOAD_APPROVAL_DETAIL (state, content) {
    state.approvalContent = content
  },

  // 보안등급 리스트 조회
  LOAD_APPROVAL_SECURITYLIST (state, content) {
    state.securityList = content
  },

  // 중요도 리스트 조회
  LOAD_APPROVAL_PRIORITYLIST (state, content) {
    state.priorityList = content
  }
}
