import HttpRequest from '@/util/HttpRequest'
import constant from '../../constant/constant'

export default {

  // 공지사항 게시글 불러오기
  async LOAD_NOTICE_LIST ({commit}, params) {

    const option = {
      params: {
        page:params.page,
        perPage:params.perPage,
        keyword:params.keyword
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/board/post/1', option)
        .then(response => {
          commit('LOAD_NOTICE_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  // 공지사항 게시글 상세보기
  async LOAD_NOTICE_DETAIL ({commit}, postId) {
    const boardId = constant.BOARD_ID_NOTICE
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/board/post/${  boardId  }/${  postId}`)
        .then(response => {
          commit('LOAD_NOTICE_DETAIL', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  }

}
