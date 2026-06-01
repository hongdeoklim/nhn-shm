
export default {
  // login error
  ERROR_LOGIN_ID_NULL: 1000, // 아이디 입력안함
  ERROR_LOGIN_PASSWORD_NULL: 1001, // 비밀번호 입력안함
  ERROR_LOGIN_INVALID_CREDENTIALS: 1002, // 아이디 혹은 비밀번호가 잘못 됨
  ERROR_LOGIN_INVALID_RESET_CODE: 1003, // 비밀번호 찾기 코드가 잘못 됨


  // board id
  BOARD_ID_NOTICE: 1, // 공지사항
  BOARD_ID_APPROVAL: 2, // 결재문서


  // alert message
  ALERT_MSG_UNDEFINED: '유저정보를 찾을수 없습니다.',
  ALERT_MSG_NOT_CONPETENCE: '권한이 없습니다.',

  ALERT_MSG_UNAUTHORIZED: '일치하는 계정이 존재하지 않습니다.',
  ALERT_MSG_DEFAULT_ERROR: '오류가 발생하였습니다. 관리자에게 문의해주세요.',


  getErrorCode (err) {
    const data = err.response.data
    const status = err.response.status

    if (data.error) {
      if (data.error === 'invalid_credentials')         return this.ERROR_LOGIN_INVALID_CREDENTIALS
      if (data.error === 'invalid_reset_password_code') return this.ERROR_LOGIN_INVALID_RESET_CODE

    } else if (data.errors) {

      if (data.errors.login)                            return this.ERROR_LOGIN_ID_NULL
      if (data.errors.password)                         return this.ERROR_LOGIN_PASSWORD_NULL
      if (data.errors.reset_password_code)              return this.ERROR_LOGIN_INVALID_RESET_CODE

    }

    return -1
  }

}
