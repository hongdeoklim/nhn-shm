import HttpRequest from '@/util/HttpRequest'
import CacheDB from '@/util/CacheDB'

// API 캐싱 설정
const CACHE_TTL = 180 * 1000 // 3분 (밀리초)
const pendingRequests = new Map() // 진행 중인 요청만 메모리에 저장

// 앱 시작 시 만료된 캐시 정리
CacheDB.cleanExpired(CACHE_TTL).then(deletedCount => {
  if (deletedCount > 0) {
    console.log(`[CacheDB] 만료된 캐시 ${deletedCount}개 정리 완료`)
  }
})

/**
 * 요청 파라미터를 정렬하여 캐시 키 생성
 * @param {string} url - API 엔드포인트
 * @param {object} params - 요청 파라미터
 * @returns {string} 캐시 키
 */
function createCacheKey(url, params) {
  if (!params) return url

  // 파라미터를 키 기준으로 정렬하여 일관된 키 생성
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key]
      return acc
    }, {})

  return `${url}::${JSON.stringify(sortedParams)}`
}

/**
 * 캐싱과 중복 요청 방지를 적용한 HTTP GET 요청
 * IndexedDB에 캐시를 저장하여 페이지 새로고침 후에도 유지
 * @param {string} url - API 엔드포인트
 * @param {object} option - axios 옵션 (params 포함)
 * @returns {Promise} API 응답 Promise
 */
async function fetchWithCache(url, option = {}) {
  const cacheKey = createCacheKey(url, option.params)
  const now = Date.now()

  // 1. 진행 중인 요청이 있으면 해당 Promise 반환 (중복 요청 방지)
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }

  // 2. IndexedDB에서 캐시된 데이터 확인
  const cached = await CacheDB.get(cacheKey)
  if (cached && cached.data) {
    // 캐시가 유효한지 확인
    if ((now - cached.timestamp) < CACHE_TTL) {
      // 유효한 캐시 반환
      return Promise.resolve(cached.data)
    } else {
      // 만료된 캐시 삭제
      await CacheDB.delete(cacheKey)
    }
  }

  // 3. 새로운 요청 생성
  const promise = HttpRequest.get(url, option)
    .then(async response => {
      // 성공 시 IndexedDB에 캐싱
      await CacheDB.set(cacheKey, response, Date.now())
      // 진행 중인 요청 목록에서 제거
      pendingRequests.delete(cacheKey)
      return response
    })
    .catch(async error => {
      // 실패 시 캐시 삭제 및 진행 중인 요청 목록에서 제거
      await CacheDB.delete(cacheKey)
      pendingRequests.delete(cacheKey)
      throw error
    })

  // 진행 중인 요청으로 등록
  pendingRequests.set(cacheKey, promise)

  return promise
}

function createSummaryMonthly (response, groupName) {
  const monthly = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const projList = Object.keys(response)
  const countMonthly = []
  const countProjects = {}
  let countTotal = 0

  const sumMonthly = []
  const sumProjects = {}
  let sumTotal = 0

  for (const projName of projList) {
    if (!countProjects[projName]) countProjects[projName] = {
      total: 0,
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      child: {}
    }
    if (!sumProjects[projName]) sumProjects[projName] = {
      total: 0,
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      child: {}
    }

    const data = response[projName]
    if (data) {
      const companys = Object.keys(data)
      for (const company of companys) {
        if (!countProjects[projName].child[company]) countProjects[projName].child[company] = {
          total: 0,
          monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          child: {}
        }
        if (!sumProjects[projName].child[company]) sumProjects[projName].child[company] = {
          total: 0,
          monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          child: {}
        }

        for (const month of monthly) {
          if (!countMonthly[month - 1]) countMonthly[month - 1] = 0
          if (!countProjects[projName].monthly[month - 1]) countProjects[projName].monthly[month - 1] = 0
          if (!countProjects[projName].child[company].monthly[month - 1]) countProjects[projName].child[company].monthly[month - 1] = 0
          if (data[company].count[month] && data[company].count[month][groupName]) {
            const keys = Object.keys(data[company].count[month][groupName])
            for (const key of keys) {
              if (!countProjects[projName].child[company].child[key]) countProjects[projName].child[company].child[key] = {
                total: 0,
                monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
              if (!countProjects[projName].child[company].child[key].monthly[month - 1]) countProjects[projName].child[company].child[key].monthly[month - 1] = 0
              if (data[company].count[month][groupName][key]) {
                const _count = parseInt(`${data[company].count[month][groupName][key]}`)
                countMonthly[month - 1] += _count
                countTotal += _count
                countProjects[projName].monthly[month - 1] += _count
                countProjects[projName].total += _count
                countProjects[projName].child[company].monthly[month - 1] += _count
                countProjects[projName].child[company].total += _count
                countProjects[projName].child[company].child[key].monthly[month - 1] += _count
                countProjects[projName].child[company].child[key].total += _count
              }
            }
          }

          if (!sumMonthly[month - 1]) sumMonthly[month - 1] = 0
          if (!sumProjects[projName].monthly[month - 1]) sumProjects[projName].monthly[month - 1] = 0
          if (!sumProjects[projName].child[company].monthly[month - 1]) sumProjects[projName].child[company].monthly[month - 1] = 0
          if (data[company].sum[month] && data[company].sum[month][groupName]) {
            const keys = Object.keys(data[company].sum[month][groupName])
            for (const key of keys) {
              if (!sumProjects[projName].child[company].child[key]) sumProjects[projName].child[company].child[key] = {
                total: 0,
                monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
              if (!sumProjects[projName].child[company].child[key].monthly[month - 1]) sumProjects[projName].child[company].child[key].monthly[month - 1] = 0
              if (data[company].sum[month][groupName][key]) {
                const _sum = parseInt(`${data[company].sum[month][groupName][key]}`)
                sumMonthly[month - 1] += _sum
                sumTotal += _sum
                sumProjects[projName].monthly[month - 1] += _sum
                sumProjects[projName].total += _sum
                sumProjects[projName].child[company].monthly[month - 1] += _sum
                sumProjects[projName].child[company].total += _sum
                sumProjects[projName].child[company].child[key].monthly[month - 1] += _sum
                sumProjects[projName].child[company].child[key].total += _sum
              }
            }
          }
        } // monthly
      } // company
    }
  }

  return {
    sum: {
      total: sumTotal,
      monthly: sumMonthly,
      child: sumProjects
    },
    count: {
      total: countTotal,
      monthly: countMonthly,
      child: countProjects
    }
  }
}

function createSummaryItems (response, groupName) {
  const monthly = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const projList = Object.keys(response)
  const countItems = {}
  const countProjects = {}
  const countMonthly = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  let countTotal = 0

  const sumItems = {}
  const sumProjects = {}
  const sumMonthly = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  let sumTotal = 0

  for (const projName of projList) {
    if (!countProjects[projName]) countProjects[projName] = {
      total: 0,
      items: {},
      monthly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      child: {}
    }
    if (!sumProjects[projName]) sumProjects[projName] = {
      total: 0,
      items: {},
      monthly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      child: {}
    }

    const data = response[projName]
    if (data) {
      const companys = Object.keys(data)
      for (const company of companys) {
        if (!countProjects[projName].child[company]) countProjects[projName].child[company] = {
          total: 0,
          items: {},
          monthly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          child: {}
        }
        if (!sumProjects[projName].child[company]) sumProjects[projName].child[company] = {
          total: 0,
          items: {},
          monthly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          child: {}
        }

        for (const month of monthly) {
          if (!countProjects[projName].child[company].child[month]) countProjects[projName].child[company].child[month] = {
            total: 0,
            items: {},
            monthly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
          }
          if (!sumProjects[projName].child[company].child[month]) sumProjects[projName].child[company].child[month] = {
            total: 0,
            items: {},
            monthly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
          }

          if (data[company].count[month][groupName]) {
            const itemObj = data[company].count[month][groupName]
            const items = Object.keys(itemObj)

            for (const item of items) {
              if (!countItems[item]) countItems[item] = 0
              if (!countProjects[projName].items[item]) countProjects[projName].items[item] = 0
              if (!countProjects[projName].child[company].items[item]) countProjects[projName].child[company].items[item] = 0
              if (!countProjects[projName].child[company].child[month].items[item]) countProjects[projName].child[company].child[month].items[item] = 0
              if (!countMonthly[month - 1][item]) countMonthly[month - 1][item] = 0
              if (!countProjects[projName].monthly[month - 1][item]) countProjects[projName].monthly[month - 1][item] = 0
              if (!countProjects[projName].child[company].monthly[month - 1][item]) countProjects[projName].child[company].monthly[month - 1][item] = 0

              countTotal += itemObj[item]
              countItems[item] += itemObj[item]
              countProjects[projName].total += itemObj[item]
              countProjects[projName].items[item] += itemObj[item]
              countProjects[projName].child[company].total += itemObj[item]
              countProjects[projName].child[company].items[item] += itemObj[item]
              countProjects[projName].child[company].child[month].total += itemObj[item]
              countProjects[projName].child[company].child[month].items[item] += itemObj[item]

              countMonthly[month - 1][item] += itemObj[item]
              countProjects[projName].monthly[month - 1][item] += itemObj[item]
              countProjects[projName].child[company].monthly[month - 1][item] += itemObj[item]
            }
          }

          if (data[company].sum[month][groupName]) {
            const itemObj = data[company].sum[month][groupName]
            const items = Object.keys(itemObj)

            for (const item of items) {
              if (!sumItems[item]) sumItems[item] = 0
              if (!sumProjects[projName].items[item]) sumProjects[projName].items[item] = 0
              if (!sumProjects[projName].child[company].items[item]) sumProjects[projName].child[company].items[item] = 0
              if (!sumProjects[projName].child[company].child[month].items[item]) sumProjects[projName].child[company].child[month].items[item] = 0
              if (!sumMonthly[month - 1][item]) sumMonthly[month - 1][item] = 0
              if (!sumProjects[projName].monthly[month - 1][item]) sumProjects[projName].monthly[month - 1][item] = 0
              if (!sumProjects[projName].child[company].monthly[month - 1][item]) sumProjects[projName].child[company].monthly[month - 1][item] = 0

              sumTotal += itemObj[item]
              sumItems[item] += itemObj[item]
              sumProjects[projName].total += itemObj[item]
              sumProjects[projName].items[item] += itemObj[item]
              sumProjects[projName].child[company].total += itemObj[item]
              sumProjects[projName].child[company].items[item] += itemObj[item]
              sumProjects[projName].child[company].child[month].total += itemObj[item]
              sumProjects[projName].child[company].child[month].items[item] += itemObj[item]

              sumMonthly[month - 1][item] += itemObj[item]
              sumProjects[projName].monthly[month - 1][item] += itemObj[item]
              sumProjects[projName].child[company].monthly[month - 1][item] += itemObj[item]
            }
          }
        }
      } // company
    }
  }

  return {
    sum: {
      total: sumTotal,
      items: sumItems,
      monthly: sumMonthly,
      child: sumProjects
    },
    count: {
      total: countTotal,
      items: countItems,
      monthly: countMonthly,
      child: countProjects
    }
  }
}

export default {
  namespaced: true,
  state: {
    list: [],
    summaryMonthly: {},
    summaryItems: {}
  },
  mutations: {
    LOAD_SUMMARY_FIELD (state, data) {
      state.list = data
    },
    LOAD_SUMMARY_FIELD_BY_PROJECT (state, data) {
      state.list = data
    },
    LOAD_SUMMARY_FIELD_COMPANY (state, data) {
      state.list = data
    },
    LOAD_SUMMARY_COMPANY_FIELD (state, data) {
      state.list = data
    },
    SET_LV1_CONTENT (state, data) {
      state.list = data
    },
    SET_LV1_CONTENT_MONTHLY (state, data) {
      state.list = data
    },
    SET_LV2_CONTENT_MONTHLY (state, data) {
      state.list = data
    },
    SET_LV2_CONTENT (state, data) {
      state.list = data
    },
    SET_LV2_GROUP (state, data) {
      state.list = data
    },
    SET_SUMMARY (state, data) {
      state.list = data
    },
    SET_POST_EACH_FIELDS (state, data) {
      state.list = data;
    },
    SET_SUMMARY_MONTHLY (state, data) {
      state.summaryMonthly = data
    },
    SET_SUMMARY_ITEMS (state, data) {
      state.summaryItems = data
    },
  },
  actions: {
    async LOAD_SUMMARY_FIELD ({commit}, params) {
      const option = {
        params: {
          beginAt: params.beginAt,
          endAt: params.endAt,
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/field-type', option).then(response => {
          commit('LOAD_SUMMARY_FIELD', response)
          resolve(response)
        }).catch(err => reject(err))
      })
    },
    async LOAD_SUMMARY_FIELD_BY_PROJECT ({commit}, params) {
      const option = {
        params: {
          beginAt: params.beginAt,
          endAt: params.endAt,
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/field', option).then(response => {
          commit('LOAD_SUMMARY_FIELD_BY_PROJECT', response)
          resolve(response)
        }).catch(err => reject(err))
      })
    },
    async LOAD_SUMMARY_COMPANY_FIELD ({commit}, params) {
      const option = {
        params: {
          projectId: params.projectId,
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/company/field', option).then(response => {
          commit('LOAD_SUMMARY_COMPANY_FIELD', response)
          resolve(response)
        }).catch(err => reject(err))
      })
    },

    async LOAD_SUMMARY_FIELD_COMPANY ({commit}, params) {
      const option = {
        params: {
          projectId: params.projectId,
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/field/company', option).then(response => {
          commit('LOAD_SUMMARY_FIELD_COMPANY', response)
          resolve(response)
        }).catch(err => reject(err))
      })
    },

    async FIRA_LOAD_SUMMARY ({commit}, params) {
      const option = {
        params: {
          boardId: params.boardId,
          boardIds: params.boardIds,
          dateField: params.dateField,
          beginAt: params.beginAt,
          endAt: params.endAt,
          projectIds: params.projectIds,
          companyIds: params.companyIds,
          excludeCompanyIds: params.excludeCompanyIds
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary', option).then(response => {
          commit('SET_SUMMARY', response)
          resolve(response)
        }).catch(err => reject(err))
      })
    },

    async FIRA_LOAD_SUMMARY_MONTHLY ({commit}, params) {
      const option = {
        params: {
          boardId: params.boardId,
          beginYear: params.beginYear,
          endYear: params.endYear,
          projectId: params.projectId,
          companyIds: params.companyIds
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/monthly', option)
          .then(response => {
            commit('SET_SUMMARY', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    async FIRA_LOAD_SUMMARY_DETAIL ({commit}, params) {
      const option = {
        params: {
          boardId: params.boardId,
          beginAt: params.beginAt,
          endAt: params.endAt,
          projectId: params.projectId,
          dateField: params.dateField,
          groupByProject: false,
          groupByMonthly: true,
          groupByCompany: 1,
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/detail', option)
          .then(response => {
            commit('SET_SUMMARY', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // lv1 권한 데이터 가져오기
    async LOAD_LV1_CONTENT ({commit}, params) {

      const option = {
        params: {
          boardId: params.boardId,
          beginAt: params.beginAt,
          endAt: params.endAt,
          keyword: params.keyword,
          dateField: params.dateField,
          order: params.order
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv1/content', option)
          .then(response => {
            commit('SET_LV1_CONTENT', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // lv1 권한 데이터 연도별 / 월별 게시글 합계
    async LOAD_LV1_CONTENT_MONTHLY ({commit}, params) {

      const option = {
        params: {
          boardId: params.boardId,
          beginYear: params.beginYear,
          endYear: params.endYear,
          keyword: params.keyword,
          dateField: params.dateField,
          order: params.order
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv1/content/monthly', option)
          .then(response => {
            commit('SET_LV1_CONTENT_MONTHLY', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },


    // lv2 권한 데이터 연도별 / 월별 게시글 합계
    async LOAD_LV2_CONTENT_MONTHLY ({commit}, params) {

      const option = {
        params: {
          projectId: params.projectId,
          boardId: params.boardId,
          beginYear: params.beginYear,
          endYear: params.endYear,
          keyword: params.keyword,
          dateField: params.dateField,
          order: params.order
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv2/content/monthly', option)
          .then(response => {
            commit('SET_LV2_CONTENT_MONTHLY', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },


    // lv2 권한 데이터 가져오기
    async LOAD_LV2_CONTENT ({commit}, params) {

      const option = {
        params: {
          projectId: params.projectId,
          boardId: params.boardId,
          beginAt: params.beginAt,
          endAt: params.endAt,
          keyword: params.keyword,
          dateField: params.dateField,
          order: params.order
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv2/content', option)
          .then(response => {
            commit('SET_LV2_CONTENT', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // lv2 권한 데이터 가져오기
    async LOAD_LV2_GROUP ({commit}, params) {

      const option = {
        params: {
          projectId: params.projectId,
          boardId: params.boardId,
          beginAt: params.beginAt,
          endAt: params.endAt,
          keyword: params.keyword,
          dateField: params.dateField,
          order: params.order
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv2/group', option)
          .then(response => {
            commit('SET_LV2_GROUP', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    async LOAD_SUMMARY ({commit}, params) {
      const option = {
        params: {
          boardId: params.boardId,
          beginAt: params.beginAt,

          endAt: params.endAt,
          projectId: params.projectId,

          groupByProject: params.groupByProject,
          groupByMonthly: params.groupByMonthly,
          dateField: params.dateField
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv1/summary', option)
          .then(response => {
            commit('SET_SUMMARY', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    async LOAD_SUMMARY_MONTHLY ({commit}, params) {
      const option = {
        params: {
          projectId: params.projectId,
          boardId: params.boardId,
          beginYear: params.beginYear,
          endYear: params.endYear
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv1/summary/monthly', option)
          .then(response => {
            commit('SET_SUMMARY', response)
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    async LOAD_SUMMARY_GROUP_MONTHLY ({commit}, params) {
      //const group = ['all', 'project', 'company']
      const groupNameList = {
        '3': 'reportHealthAndSafetyManagementCost',
        '45': 'disasterClass',
        '35': 'hse_type',
        '50': 'agreementInfo',
        '7': 'disaster',
        '41': 'disaster',
        '10': 'workTypeB',
        '11': 'workTypeB',
        '48': 'checker',
        '36': 'disaster',
        '40': 'disaster'
      }
      const groupName = groupNameList[params.boardId]
      let beginAt = params.beginAt
      let endAt = params.endAt

      if (params.year) {
        beginAt = `${params.year}-01-01 00:00:00`
        endAt = `${params.year}-12-31 23:59:59`
      }

      const option = {
        params: {
          boardId: params.boardId,
          projectId: params.projectId,
          onlyMyCompany: params.onlyMyCompany,

          beginAt,
          endAt,

          groupByProject: 1,
          groupByMonthly: 1,
          groupByCompany: 1,
          dateField: 'content$date'
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv1/summary/detail', option)
          .then(response => {
            const summaryMonthly = createSummaryMonthly(response, groupName)
            if (params.projectId) {
              const projectName = Object.keys(summaryMonthly.sum.child)[0]
              commit('SET_SUMMARY_MONTHLY', {
                sum: {
                  total: summaryMonthly.sum.child[projectName].total,
                  monthly: summaryMonthly.sum.child[projectName].monthly,
                  child: summaryMonthly.sum.child[projectName].child
                },
                count: {
                  total: summaryMonthly.count.child[projectName].total,
                  monthly: summaryMonthly.count.child[projectName].monthly,
                  child: summaryMonthly.count.child[projectName].child
                }
              })
            } else {
              commit('SET_SUMMARY_MONTHLY', summaryMonthly)
            }
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    async LOAD_SUMMARY_GROUP_ITEMS ({commit}, params) {
      //const group = ['all', 'project', 'company']
      const groupNameList = {
        '3': 'reportHealthAndSafetyManagementCost',
        '45': 'disasterClass',
        '35': 'hse_type',
        '50': 'agreementInfo',
        '7': 'disaster',
        '41': 'disaster',
        '10': 'workTypeB',
        '11': 'workTypeB',
        '48': 'checker',
        '36': 'disaster',
        '40': 'disaster'
      }

      const groupName = groupNameList[params.boardId]
      let beginAt = params.beginAt
      let endAt = params.endAt

      if (params.year) {
        beginAt = `${params.year}-01-01 00:00:00`
        endAt = `${params.year}-12-31 23:59:59`
      }

      const option = {
        params: {
          boardId: params.boardId,
          projectId: params.projectId,
          onlyMyCompany: params.onlyMyCompany,

          beginAt,
          endAt,

          groupByProject: 1,
          groupByMonthly: 1,
          groupByCompany: 1,
          dateField: 'content$date'
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache('/api/v1/summary/lv1/summary/detail', option)
          .then(response => {
            const summaryItems = createSummaryItems(response, groupName)
            if (params.projectId) {
              const projectName = Object.keys(summaryItems.sum.child)[0]
              commit('SET_SUMMARY_ITEMS', {
                sum: {
                  total: summaryItems.sum.child[projectName].total,
                  items: summaryItems.sum.child[projectName].items,
                  monthly: summaryItems.sum.child[projectName].monthly,
                  child: summaryItems.sum.child[projectName].child
                },
                count: {
                  total: summaryItems.count.child[projectName].total,
                  items: summaryItems.count.child[projectName].items,
                  monthly: summaryItems.count.child[projectName].monthly,
                  child: summaryItems.count.child[projectName].child
                }
              })
            } else {
              commit('SET_SUMMARY_ITEMS', summaryItems)
            }
            resolve(response)
          }).catch(err => reject(err))
      })

    },

    /**
     * 107, 154, 155 전용 API
     * 사업장별로 예산 문서를 불러온다
     *
     * @param commit
     * @param params
     * @returns {Promise<unknown>}
     * @constructor
     */
    async LOAD_POST_EACH_FIELDS ({commit}, params) {
      const option = {
        params: {
          projectId: params.projectId,
          fieldCode: params.fieldCode,
          year: params.year
        }
      }

      return new Promise((resolve, reject) => {
        fetchWithCache(`/api/v1/board/post/${params.boardId}/each-field`, option).then(response => {
          commit('SET_POST_EACH_FIELDS', response)
          resolve(response)
        }).catch(err => reject(err))
      })
    },

    /**
     * 도넛차트02 에서 사용하는 종사자 정보 조회 API
     * @param params
     * @returns {Promise<unknown>}
     * @constructor
     */
    async LOAD_DONUT_EMPLOYEE({ /*commit*/ }, params) {
      const option = {
        params: {
          project_id: params.projectId,
          type: params.type,
          col: params.col,
        },
      };

      return new Promise((resolve, reject) => {
        fetchWithCache(`/api/v1/summary/employee`, option)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    },

    /**
     * 도넛차트02 자세히보기에서 사용하는 종사자 정보 조회 API
     * @param params
     * @returns {Promise<unknown>}
     * @constructor
     */
    async LOAD_DONUT_EMPLOYEE_DETAIL({ /*commit*/ }, params) {
      const option = {
        params: {
          project_id: params.projectId,
          current_year: params.currentYear,
          fieldIds: params.fieldIds,
        },
      };

      return new Promise((resolve, reject) => {
        fetchWithCache(`/api/v1/summary/employee/detail`, option)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    },

    /**
     * 분기별 종사자 현황
     * @param params
     * @returns {Promise<unknown>}
     * @constructor
     */
    async LOAD_SUMMARY_EMPLOYEE_QUARTER({ /*commit*/ }, params) {
      const option = {
        params: {
          project_id: params.projectId,
          target_year: params.targetYear,
        },
      };

      return new Promise((resolve, reject) => {
        fetchWithCache(`/api/v1/summary/employee/quarter`, option)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    },
  },
  getters: {}
}
