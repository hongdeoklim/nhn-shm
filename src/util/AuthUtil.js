import {keccak256} from 'js-sha3'


class AuthUtil {
  /**
   * 입력된 비밀번호를 sha3 함수를 이용해 해시 값으로 변환한다.
   * @param {string} original 변환하려는 입력 값
   * @returns {string} 변환된 hex 형식의 해시 값
   */
  static scramble (original) {
    console.time('hash')
    const repeat = 112168
    let result = keccak256(original)

    for (let i = 0; i < repeat; i++) {
      result = keccak256(result)
    }
    console.timeEnd('hash')
    return result
  }

  static getEmailRule () {
    return  [
      (v) => !!v || '이메일을 입력해주세요.',
      (v) => v && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || '이메일 형식이 올바르지 않습니다.'
    ]
  }

  static getPasswordRule () {
    return [
      (v) => !!v || '비밀번호를 입력해주세요.',
      (v) => v && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v) || '숫자와 특수기호 포함 8자 이상 입력해주세요.'
    ]
  }
}

export default AuthUtil
