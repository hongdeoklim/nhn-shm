import HttpRequest from '@/util/HttpRequest'
import { dedupeRequest } from '@/util/requestCache'

export default {

  /**
   * 게시판 목록
   * @params {page, perPage}
   */
  async SEND_KAKAO ({commit}, params) {

    // 다른 action의 option들과 달리 sendmail은 params가 없다.
    const option = {
      sendDate:params.sendDate, // 문서이름
      gj:params.gj // 공종 목록
    }

    const phone = params.phone
    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/approval/kakao/${phone}`, option)
        .then(response => {
          commit('SEND_KAKAO', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  }
}

//
