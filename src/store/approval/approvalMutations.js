export default {

  LOAD_POST (state, data) {
    if (!data.post) {
      state.postInfo = null
      return
    }

    const status = data.document_status
    const user = data.user
    state.postInfo = data.post
    state.postAfters = data.approved_afters

    state.document = {
      id:data.id //상신문서 번호
    }

    // 문서상태 등록됨/진행중
    if (status) {
      state.document.status = {
        id: status.id,
        code: status.code,
        name: status.name
      }
    }

    // 문서작성자 정보, postInfo.actor와 동일한 정보
    if (user) {
      const company = user.company
      state.document.writer = {
        id: user.id,
        name: user.name,
        company_id: user.company_id
      }
      if (company) {
        state.document.writer.company_name = company.com_name
      }
    }

    // 결재라인
    const lines = data.line_elements
    const list = []
    let turnApprovalId = 0
    for (const line of lines) {
      const user = line.element_user
      const status = line.element_status
      const type = line.element_type
      const member = {
        user_id: user.id,
        user_name: user.name,
        status_id: status.id,
        status_code: status.code,
        status_name: status.name,
        type_id: type.id,
        type_code: type.code,
        type_name: type.name,
        comments: line.comments,
        updated_at: line.updated_at,
      }
      if (line.element_user.company) {
        member.company_id = line.element_user.company.id
        member.company_name = line.element_user.company.com_name
      } else {
        member.company_id = 0
        member.company_name = ''
      }

      // 결재자 ID 저장 (첫번째 wait)
      if (member.type_code === 'approval' && member.status_code === 'wait' && turnApprovalId === 0) {
        turnApprovalId = member.user_id
      }

      list.push(member)
    }
    state.document.turn_approval_id = turnApprovalId
    state.document['line'] = list
  },

  LOAD_REQUEST_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_AWAIT_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_COMPLETE_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_PROCESS_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_REJECT_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_REFERENCE_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_POST_ALL (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_POST_COMPLETE (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  CREATE_POST (state) {
    state.error_code = -1
  },

  DELETE_POST (state) {
    state.error_code = -1
  },

  UNTEMP_POST (state) {
    state.error_code = -1
  },

  UPDATE_POST (state) {
    state.error_code = -1
  },

  APPROVE_OK (state) {
    state.error_code = -1
  },

  APPROVE_NO (state) {
    state.error_code = -1
  },

  LOAD_LINE_TEMPLATE (state, data) {
    state.lineInfo = data
    state.lineList = data.data
  },

  CREATE_LINE_TEMPLATE (state, data) {

  },
  DELETE_LINE_TEMPLATE(state, data) {

  },

  ERROR_CREATE_POST (state, error) {
    state.error_code = -1
    if (error.response) {
      // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
      state.error_data = error.response.data
      state.error_code = error.response.status
    } else if (error.request) {
      // 요청이 이루어 졌으나 응답을 받지 못했습니다.
      // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
      // Node.js의 http.ClientRequest 인스턴스입니다.
    } else {
      // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
    }
  },

  ADD_AFTER_DATA  (state, data) {
  },

  UPDATE_AFTER_DATA (state, data) {
  },

  LOAD_APPROVAL_STATUS (state, data) {
    state.status = data
  },

  LOAD_DISASTER_TYPE_LIST (state, data) {
    state.disasterTypeList = data.data
  },

  LOAD_NOTIFICATION_LIST (state, data) {
    state.alertReadInfo = data.read
    state.alertReadList = data.read.data
    state.alertUnReadInfo = data.unread
    state.alertUnReadList = data.unread.data
  },

  LOAD_NOTIFICATION_UNREAD_LIST (state, data) {
    state.mainAlertUnReadInfo = data.unread
    state.mainAlertUnReadList = data.unread.data
  },
  READ_NOTIFICATION (state, data) {
  },
  DELETE_NOTIFICATION (state, data) {
  }
}
