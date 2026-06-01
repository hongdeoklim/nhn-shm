import HttpRequest from '@/util/HttpRequest'
import { dedupeRequest } from '@/util/requestCache'

export default {

  // 결재 요청함 불러오기
  async LOAD_REQUEST_LIST ({commit}, params) {

    // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        board: params.boardSlug,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get('/api/v1/approval/request', option),
        '/api/v1/approval/request',
        option.params,
        'GET'
      )
        .then(response => {
          commit('LOAD_REQUEST_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 결재 대기함 불러오기
  async LOAD_AWAIT_LIST ({commit}, params) {

    // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        board: params.boardSlug,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get('/api/v1/approval/todo', option),
        '/api/v1/approval/todo',
        option.params,
        'GET'
      )
        .then(response => {
          commit('LOAD_AWAIT_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_COMPLETE_LIST ({commit}, params) {

    // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        board: params.boardSlug,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get('/api/v1/approval/complete', option),
        '/api/v1/approval/complete',
        option.params,
        'GET'
      )
        .then(response => {
          commit('LOAD_COMPLETE_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_PROCESS_LIST ({commit}, params) {

    // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        board: params.boardSlug,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/ongoing', option)
        .then(response => {
          commit('LOAD_PROCESS_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_REJECT_LIST ({commit}, params) {

    // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        board: params.boardSlug,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/reject', option)
        .then(response => {
          commit('LOAD_REJECT_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_REFERENCE_LIST ({commit}, params) {

    // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        board: params.boardSlug,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/reference', option)
        .then(response => {
          commit('LOAD_REFERENCE_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_POST_ALL ({commit}, params) {

    const option = {
      params: {
        board: params.boardSlug,
        page: params.page,
        perPage: params.perPage,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        keyword: params.keyword,
        preview: params.preview,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        periodTargetBegin: params.periodTargetBegin,
        periodTargetEnd: params.periodTargetEnd,
        periodDateBegin: params.periodDateBegin,
        periodDateEnd: params.periodDateEnd,
        companyIds: params.companyIds,
      }
    }

    if (params.conditions && params.conditions.length > 0) {
      let index = 0;
      for (let i = 0, condition; condition = params.conditions[i]; i++) {
        const key = condition.key && condition.key.trim();
        const operator = condition.operator && `${condition.operator}`.trim();
        const value = condition.value && `${condition.value}`.trim();
        if (key && operator && value) {
          option.params[`conditions[${index}][key]`] = key;
          option.params[`conditions[${index}][operator]`] = operator;
          option.params[`conditions[${index}][value]`] = value;
          index++;
        }
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/all', option)
        .then(response => {
          commit('LOAD_POST_ALL', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_POST_COMPLETE ({commit}, params) {
    const option = {
      params: {
        board: params.boardSlug,
        page: params.page,
        perPage: params.perPage,
        projectId: params.projectId,
        projectOrder: params.projectOrder,
        keyword: params.keyword,
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/complete', option)
        .then(response => {
          commit('LOAD_POST_COMPLETE', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async APPROVE_OK ({commit}, params) {
    const option = {
      content: params.content,
      uploads: params.uploads
    }
    const postId = params.postId
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/approval/${postId}/approve`, option)
        .then(response => {
          commit('APPROVE_OK', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async APPROVE_NO ({commit}, params) {
    const option = {
      comment: params.comment
    }
    const postId = params.postId
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/approval/${postId}/reject`, option)
        .then(response => {
          commit('APPROVE_NO', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_POST ({commit}, params) {
    const boardSlug = params.boardSlug
    const postId = params.postId

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/approval/document/${boardSlug}/${postId}`)
        .then(response => {
          commit('LOAD_POST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // eslint-disable-next-line no-unused-vars
  async CREATE_POST ({commit}, params) {
    const option = {
      title: params.title, // 게시글 제목
      content: params.content, // 게시글 내용
      approvalLine: params.approvalLine, // 결재선 정의
      security: params.security, // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비]
      priority: params.priority, // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음]
      uploads: params.uploads,
      isTemp: params.isTemp, // 0: 바로상신, 1: 임시저장
      projectId: params.projectId,
      projectOrderId: params.projectOrderId
    }

    const boardSlug = params.boardSlug
    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/approval/document/${boardSlug}`, option).then(response => {
        commit('CREATE_POST', response)
        resolve(response)
      }).catch(err => {
        commit('ERROR_CREATE_POST', err)
        reject(err)
        return err
      })
    })
  },

  async DELETE_POST ({commit}, params) {
    const boardSlug = params.boardSlug
    const postId = params.postId
    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/approval/${boardSlug}/${postId}`).then(response => {
        commit('DELETE_POST', response)
        resolve(response)
      }).catch(err => {
        commit('ERROR_DELETE_POST', err)
        reject(err)
        return err
      })
    })
  },

  // eslint-disable-next-line no-unused-vars
  async UNTEMP_POST ({commit}, params) {
    const boardSlug = params.boardSlug
    const postId = params.postId
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/approval/${boardSlug}/${postId}/untemp`).then(response => {
        commit('UNTEMP_POST', response)
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },


  // eslint-disable-next-line no-unused-vars
  async UPDATE_POST ({commit}, params) {

    const option = {
      title: params.title, // 게시글 제목
      content: params.content, // 게시글 내용
      approvalLine: params.approvalLine, // 결재선 정의
      uploads: params.uploads,
      unTemp: params.unTemp, // 임시저장 해제 여부
      projectId: params.projectId,
      projectOrderId: params.projectOrderId
    }

    const boardSlug = params.boardSlug
    const postId = params.postId
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/approval/${boardSlug}/${postId}/modify`, option).then(response => {
        commit('UPDATE_POST', response)
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async LOAD_LINE_TEMPLATE ({commit}, params) {

    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/line/template', option)
        .then(response => {
          commit('LOAD_LINE_TEMPLATE', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async CREATE_LINE_TEMPLATE ({commit}, params) {

    const option = {
      title: params.title, // 결재선라인 제목
      desc: params.desc, // 설명
      approvalLine: params.approvalLine, // 결재선 정의
      type: params.type // {personal(개인, default), shared(공유)}
    }

    return new Promise((resolve, reject) => {
      HttpRequest.put('/api/v1/approval/line/template', option).then(response => {
        commit('CREATE_LINE_TEMPLATE', response)
        resolve(response)
      }).catch(err => {
        commit('ERROR_CREATE_POST', err)
        reject(err)
        return err
      })
    })
  },

  async DELETE_LINE_TEMPLATE ({commit}, params) {

    const templateId = params.templateId
    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/approval/line/template/${templateId}`).then(response => {
        commit('DELETE_LINE_TEMPLATE', response)
        resolve(response)
      }).catch(err => {
        commit('ERROR_CREATE_POST', err)
        reject(err)
        return err
      })
    })
  },

  async ADD_AFTER_DATA ({commit}, params) {
    const option = {
      content: params.content,
    }
    const boardSlug = params.boardSlug
    const postId = params.postId
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/approval/${boardSlug}/${postId}/after`, option)
        .then(response => {
          commit('ADD_AFTER_DATA', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async UPDATE_AFTER_DATA ({commit}, params) {
    const option = {
      content: params.content,
    }
    const boardSlug = params.boardSlug
    const postId = params.postId
    const afterId = params.afterId
    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/approval/${boardSlug}/${postId}/after/${afterId}`, option)
        .then(response => {
          commit('UPDATE_AFTER_DATA', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async LOAD_APPROVAL_STATUS ({commit}, params) {
    const option = {
      params: {
        projectId: params.projectId
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/status', option)
        .then(response => {
          commit('LOAD_APPROVAL_STATUS', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },


  async LOAD_DISASTER_TYPE_LIST ({commit}, params) {

    const disasterType = {
      data : [
        {id:1, name:'감염'},
        {id:2, name:'감전'},
        {id:3, name:'교통사고'},
        {id:4, name:'깔림'},
        {id:5, name:'끼임'},
        {id:6, name:'낙하'},
        {id:7, name:'넘어짐'},
        {id:8, name:'뒤집힘'},
        {id:9, name:'떨어짐'},
        {id:10, name:'맞음'},
        {id:11, name:'무너짐'},
        {id:12, name:'근골격계질환'},
        {id:14, name:'베임'},
        {id:15, name:'붕괴'},
        {id:16, name:'빠짐'},
        {id:17, name:'(산소)결핍'},
        {id:18, name:'소음노출'},
        {id:19, name:'아차사고'},
        {id:20, name:'이상기압 노출, 접촉'},
        {id:21, name:'익사'},
        {id:22, name:'유해광선 노출'},
        {id:23, name:'절단'},
        {id:24, name:'중독'},
        {id:25, name:'질식'},
        {id:26, name:'질환'},
        {id:27, name:'찔림'},
        {id:28, name:'충돌'},
        {id:29, name:'탈락'},
        {id:30, name:'파열'},
        {id:31, name:'폭발'},
        {id:32, name:'화재'},
        {id:33, name:'화학물질 누출 접촉'},
        {id:34, name:'기타'},
      ]
    }

    commit('LOAD_DISASTER_TYPE_LIST', disasterType)
  },


  // 알림
  async LOAD_NOTIFICATION_UNREAD_LIST ({commit, state}, params) {
    const option = {
      params: {
        type: 'unread', // all, read, unread
        // read
        page_unread: params.page_unread,
        per_page_unread: params.per_page_unread,
        days_before_unread: params.days_before_unread, // 1, 7 , 30
      }
    }

    // state.mainAlertUnreadInfo.loaded_at 값이 없거나, 1분이 지났다면 API를 호출한다
    if (!state.mainAlertUnReadInfo || !state.mainAlertUnReadInfo.loaded_at || (new Date().getTime() - state.mainAlertUnReadInfo.loaded_at.getTime()) / 1000 / 60 > 1) {
      return new Promise((resolve, reject) => {
        HttpRequest.get('/api/v1/notification', option)
          .then(response => {
            if (response.unread) {
              // 데이터를 불러온 시각을 추가한다
              response.unread['loaded_at'] = new Date()
              commit('LOAD_NOTIFICATION_UNREAD_LIST', response)
            }

            resolve(response)
          }).catch(err => reject(err))
      })
    }
  },

  async LOAD_NOTIFICATION_LIST ({commit}, params) {
    const option = {
      params: {
        type: params.type, // all, read, unread

        // all
        page: params.page,
        per_page: params.per_page,
        days_before: params.days_before, // 1, 7 , 30

        // read
        page_read: params.page_read,
        per_page_read: params.per_page_read,
        days_before_read: params.days_before_read, // 1, 7 , 30

        // unread
        page_unread: params.page_unread,
        per_page_unread: params.per_page_unread,
        days_before_unread: params.days_before_unread, // 1, 7 , 30
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/notification', option)
        .then(response => {
          if (response.unread) {
            // 데이터를 불러온 시각을 추가한다
            response.unread['loaded_at'] = new Date()
            commit('LOAD_NOTIFICATION_LIST', response)
          }

          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async READ_NOTIFICATION ({commit}, params) {
    const option = {
      ids: params.ids,
    }
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/notification/read`, option)
        .then(response => {
          commit('READ_NOTIFICATION', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async DELETE_NOTIFICATION ({commit}, params) {
    const option = {
      ids: params.ids,
    }
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/notification/delete`, option)
        .then(response => {
          commit('DELETE_NOTIFICATION', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  }


}
