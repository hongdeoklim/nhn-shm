
import HttpRequest from '@/util/HttpRequest'
import { dedupeRequest } from '@/util/requestCache'
import constant from '../../constant/constant'
import VueCookie from 'vue-cookie'

export default {
  async LOGIN ({commit}, {email, pw}) {

    const login = {
      'login':email,
      'password':pw
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/auth/login', login)
        .then(response => {
          commit('LOGIN', response)
          resolve(response)
        }).catch(err => { reject(err) })

    })
  },

  async REFRESH_TOKEN ({commit}) {
    const option = {
      token: VueCookie.get('token')
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/auth/refresh-token', option)
        .then(response => {
          commit('REFRESH_TOKEN', response)
          resolve(response)
        }).catch(err => { reject(err) })
    })
  },

  REGISTER_MEMBER ({commit}, {id, email, password, confirm}) {

    const register = {
      username:id,
      email,
      password,
      password_confirmation:confirm,
      // 신규 항목
      nickname:'',
      birthdate:'',
      mobile:'',
      phone:'',
      home_zip:'',
      home_address_1:'',
      home_address_2:'',
      company_zip:'',
      company_address_1:'',
      company_address_2:'',
      subscribe_email:1,
      subscribe_sms:1,
      mail_destination:''
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/auth/register', register)
        .then(response => {
          commit('REGISTER_MEMBER', response)
          resolve(response)
        }).catch(err => {

          switch (err.response.status) {
          default:
            alert(constant.ALERT_MSG_DEFAULT_ERROR)
            break
          }

          reject(err)

        })

    })
  },

  async USER_INFO ({commit, state}) {
    const _key = '/api/auth/me'
    const me = localStorage.getItem(_key)
    if (me) {
      if (me.includes('$$$')) {
        localStorage.removeItem(_key)
      } else {
        const data = JSON.parse(me)
        const companyId = data.user.company_id

        // 만약 state.companyInfo.id 값이 없거나 data.user.company_id 값과 다르다면 API를 호출한다
        if (!state.companyInfo.id || `${state.companyInfo.id}` !== `${data.user.company_id}`) {
          await HttpRequest.get(`/api/v1/company/${companyId}`).then(response => {
            // mutations 메소드 호출
            commit('COMPANY_INFO', response)
          }).catch(() => {});
        }

        commit('USER_INFO', data)
        return data
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/auth/me')
        .then(response => {
          localStorage.setItem(_key, JSON.stringify(response))
          commit('USER_INFO', response)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
    })

  },

  SET_MY_INFO ({commit}) {
    const myInfo = JSON.parse(localStorage.getItem('myInfo'))
    commit('SET_MY_INFO', myInfo)
  },

  // 로그아웃
  async USER_LOGOUT ({commit}) {

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/auth/logout')
        .then(response => {
          commit('USER_LOGOUT')
          resolve(response)
        }).catch(err => reject(err))
    })

  },

  async USER_FORGOT_PASSWORD ({commit}, params) {
    const option = {
      params: {
        email:params.email
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/auth/forgot-password', option.params)
        .then(response => {
          commit('USER_FORGOT_PASSWORD', response)
          resolve(response)
        }).catch(err => { reject(err) })
    })
  },

  async USER_RESET_PASSWORD ({commit}, params) {
    const option = {
      params: {
        reset_password_code: params.code,
        password: params.password,
        password_confirmation: params.repassword
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/auth/reset-password', option.params)
        .then(response => {
          commit('USER_RESET_PASSWORD', response)
          resolve(response)
        }).catch(err => { reject(err) })
    })
  },

  async LOAD_CHECK_QR ({commit}, params) {
    const project_id = params.projectId
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/qr/${project_id}/code`)
        .then(response => {
          commit('LOAD_CHECK_QR', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async IS_QR_SCAN_MANAGER ({commit}, params) {
    const project_id = params.projectId
    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/project/qr/${project_id}`)
        .then(response => {
          commit('IS_QR_SCAN_MANAGER', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async CHECK_EXIST ({commit}, params) {
    const option = {
      params: {
        username: params.username,
        email: params.email,
      }
    }
    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/member/check-exist', option)
        .then(response => {
          resolve(response)
        }).catch(err => reject(err))
    })
  }



}
