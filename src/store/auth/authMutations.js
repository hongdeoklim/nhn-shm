import axios from 'axios'
import VueCookie from 'vue-cookie'

export default {

  IP_INFO (state, ipInfo) {
    state.ipInfo = ipInfo
  },

  LOGIN (state, loginData) {

    state.userInfo = ''
    state.userToken = ''

    VueCookie.delete('token') // 현재 토큰 제거
    VueCookie.delete('current_id') // 현재 보고있는 게시물 넘버

    state.userToken = loginData.token
    state.userInfo = loginData.user

    VueCookie.set('token', loginData.token, 7)
    axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`
  },

  REFRESH_TOKEN (state, data) {
    state.userToken = data.token

    VueCookie.set('token', data.token, 7)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  },

  REGISTER_MEMBER (state, payload) {
  },

  USER_INFO (state, infoData) {
    state.userInfo = infoData.user
  },

  COMPANY_INFO (state, companyInfo) {
    state.companyInfo = companyInfo
  },

  SET_MY_INFO (state, myInfoData) {
    state.myInfo = myInfoData
  },

  USER_LOGOUT (state) {
    state.userInfo = ''
    state.userToken = ''

    VueCookie.delete('token') // 현재 토큰 제거
    VueCookie.delete('current_id') // 현재 보고있는 게시물 넘버
  },

  USER_FORGOT_PASSWORD (state, data) {
  },

  USER_RESET_PASSWORD (state, data) {
  },

  LOAD_CHECK_QR (state, data) {
    if (data) {
      state.qrCodeContent = data.data
    }
  },

  IS_QR_SCAN_MANAGER (state, data) {
    if (data && data.data) {
      state.isScanner = data.data.isScanner
    }
  },
}

