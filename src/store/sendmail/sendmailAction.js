import HttpRequest from '@/util/HttpRequest'
import { dedupeRequest } from '@/util/requestCache'

export default {

  /**
   * 게시판 목록
   * @params {page, perPage}
   */
  async SEND_MAIL ({commit}, params) {

    // 다른 action의 option들과 달리 sendmail은 params가 없다.
    const option = {
      to:params.to, // 받는 메일 주소
      cc:params.cc, // 참조 메일 주소
      bcc:params.bcc, // 숨은 참조 메일 주소
      subject:params.subject, // 메일 제목
      content:params.content // 메일 본문
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/v1/sendmail/', option)
        .then(response => {
          resolve(response)
        }).catch(err => reject(err))
    })
  }
}
