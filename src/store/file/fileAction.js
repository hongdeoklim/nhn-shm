import HttpRequest from '@/util/HttpRequest'
import { dedupeRequest } from '@/util/requestCache'

export default {
  async FILE_UPLOAD ({commit}, params) {

    const formData = new FormData()
    formData.append('file_data', params)

    return new Promise((resolve, reject) => {
      HttpRequest.post('/api/v1/file', formData)
        .then(response => {
          commit('FILE_UPLOAD', response)
          resolve(response)
        }).catch(err => reject(err))
    })
  },
}
