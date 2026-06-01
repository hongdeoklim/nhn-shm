import HttpRequest from '@/util/HttpRequest'
import { dedupeRequest } from '@/util/requestCache'

export default {
  /**
   * 메뉴 목록
   * @params {page, perPage}
   */
  async LOAD_MENU_LIST ({commit}) {

    return new Promise((resolve, reject) => {
      HttpRequest.get('/api/v1/menu')
        .then(response => {

          // mutations 메소드 호출
          commit('LOAD_MENU_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },

  async UPDATE_MENU_LIST ({commit}, jsonData) {
    const option = {
      params:{
        menuJson:jsonData
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/v1/menu/setting', option.params)
        .then(response => {
          // mutations 메소드 호출
          commit('UPDATE_MENU_LIST', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },
}
