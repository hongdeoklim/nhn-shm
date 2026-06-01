import HttpRequest from '@/util/HttpRequest'
import constant from '../../constant/constant'

export default {

  // 결재 대기함 불러오기
  async LOAD_APPROVAL_REQUEST_LIST ({commit}, page) {

    let params = {}
    if (page) {
      params = {
        params: {
          page
        }
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/request', params)
        .then(response => {
          commit('LOAD_APPROVAL_REQUEST_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 결재 대기함 불러오기
  async LOAD_APPROVAL_AWAIT_LIST ({commit}, page) {

    let params = {}
    if (page) {
      params = {
        params: {
          page
        }
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/todo', params)
        .then(response => {
          commit('LOAD_APPROVAL_AWAIT_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 결재 진행함 불러오기
  async LOAD_APPROVAL_PROCESS_LIST ({commit}, page) {

    let params = {}
    if (page) {
      params = {
        params: {
          page
        }
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/ongoing', params)
        .then(response => {
          commit('LOAD_APPROVAL_PROCESS_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 완료 문서함 불러오기
  async LOAD_APPROVAL_COMPLETE_LIST ({commit}, page) {

    let params = {}
    if (page) {
      params = {
        params: {
          page
        }
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/complete', params)
        .then(response => {
          commit('LOAD_APPROVAL_COMPLETE_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 반려 문서함 불러오기
  async LOAD_APPROVAL_REJECT_LIST ({commit}, page) {

    let params = {}
    if (page) {
      params = {
        params: {
          page
        }
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/approval/reject', params)
        .then(response => {
          commit('LOAD_APPROVAL_REJECT_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 결재문서 상세내용조회
  async LOAD_APPROVAL_DETAIL ({commit}, postId) {
    const boardId = constant.BOARD_ID_APPROVAL
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/approval/document/${  boardId  }/${  postId}`)
        .then(response => {
          commit('LOAD_APPROVAL_DETAIL', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 결재문서 보안등급 리스트 조회
  async LOAD_APPROVAL_SECURITYLIST ({commit}) {
    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/info/approval/document/security')
        .then(response => {
          commit('LOAD_APPROVAL_SECURITYLIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 결재문서 중요도 리스트 조회
  async LOAD_APPROVAL_PRIORITYLIST ({commit}) {
    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/info/approval/document/priority')
        .then(response => {
          commit('LOAD_APPROVAL_PRIORITYLIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  }
}
