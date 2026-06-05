import HttpRequest from '@/util/HttpRequest'

const KEY_HOME_NOTIFICATION = 'home_notification'
const KEY_PEOPLE_OPTION = 'people_option'
const KEY_EQUIPMENT_OPTION = 'equipment_option'

function safeJsonParse (value, fallback = {}) {
  if (!value) return fallback
  if (typeof value === 'object') return value
  try { return JSON.parse(value) } catch (e) { return fallback }
}

export default {
  namespaced: true,
  state: {
    homeNotification: {},
    peopleOption: {},
    equipmentOption: {}
  },
  mutations: {
    LOAD_HOME_NOTIFICATION (state, data) {
      state.homeNotification = data ? safeJsonParse(data.config) : {}
    },
    LOAD_PEOPLE_OPTION (state, data) {
      state.peopleOption = data ? safeJsonParse(data.config) : {}
    },
    LOAD_EQUIPMENT_OPTION (state, data) {
      state.equipmentOption = data ? safeJsonParse(data.config) : {}
    }
  },
  actions: {
    // 결재 요청함 추가/수정
    async SAVE_HOME_NOTIFICATION ({commit}, params) {
      // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
      const option = {
        key: KEY_HOME_NOTIFICATION,
        config: JSON.stringify(params.config)
      }
      return new Promise((resolve, reject) => {
        HttpRequest.post('/api/v1/config', option)
          .then(response => {
            commit('LOAD_HOME_NOTIFICATION', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // 결재 요청함 불러오기
    async LOAD_HOME_NOTIFICATION ({commit}) {
      // boardSlug = '' 인 경우 모든 게시판에 대해서 가져온다.
      const option = {
        params: {
          key: KEY_HOME_NOTIFICATION
        }
      }
      return new Promise((resolve, reject) => {
        HttpRequest.get('/api/v1/config', option)
          .then(response => {
            commit('LOAD_HOME_NOTIFICATION', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },


    // 인원옵션 등록
    async SAVE_PEOPLE_OPTION ({commit}, params) {
      console.log('SAVE_PEOPLE_OPTION params=', params)
      const option = {
        key: KEY_PEOPLE_OPTION,
        config: JSON.stringify(params.config)
      }
      return new Promise((resolve, reject) => {
        HttpRequest.post('/api/v1/config', option)
          .then(response => {
            commit('LOAD_PEOPLE_OPTION', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // 인원옵션 불러오기
    async LOAD_PEOPLE_OPTION ({commit}) {
      const option = {
        params: {
          key: KEY_PEOPLE_OPTION
        }
      }
      return new Promise((resolve, reject) => {
        HttpRequest.get('/api/v1/config', option)
          .then(response => {
            commit('LOAD_PEOPLE_OPTION', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // 장비옵션 등록
    async SAVE_EQUIPMENT_OPTION ({commit}, params) {
      const option = {
        key: KEY_EQUIPMENT_OPTION,
        config: JSON.stringify(params.config)
      }
      return new Promise((resolve, reject) => {
        HttpRequest.post('/api/v1/config', option)
          .then(response => {
            commit('LOAD_EQUIPMENT_OPTION', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // 장비옵션 불러오기
    async LOAD_EQUIPMENT_OPTION ({commit}) {
      const option = {
        params: {
          key: KEY_EQUIPMENT_OPTION
        }
      }
      return new Promise((resolve, reject) => {
        HttpRequest.get('/api/v1/config', option)
          .then(response => {
            commit('LOAD_EQUIPMENT_OPTION', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },
  },
  getters: {}
}
