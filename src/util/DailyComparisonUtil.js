import GraphUtil from '@/util/GraphUtil'

class DailyComparisonUtil {
  static moduleWithData = (value) => {
    const module = []
    if (!value) return module;
    for (const comName of Object.keys(value)) {
      module.push({
        label: comName,
        value: value[comName]
      })
    }

    return module
  }

  static getProjectFromEachProject = (value, summaryKey) => {
    const data = {}
    if (!value || !value.eachProject) return data;
    const projects = Object.keys(value.eachProject)
    for (const proj of projects) {
      if (!data[proj]) {
        data[proj] = 0
      }

      try {
        const dates = Object.keys(value.eachProject[proj][summaryKey[0]])
        for (const date of dates) {
          if (Number(date)) {
            const companyData = value.eachProject[proj][summaryKey[0]][date][summaryKey[1]]
            for (const col of Object.keys(companyData)) {
              data[proj] += Number(`${companyData[col]}`)
            }
          }
        }
      } catch (err) {}
    }

    return data;
  }

  static getCompanyFromEachCompany = (value, summaryKey) => {
    const data = {}
    if (!value || !value.eachCompany) return data;
    const comNames = Object.keys(value.eachCompany)
    for (const comName of comNames) {
      if (!data[comName]) {
        data[comName] = 0
      }

      try {
        const dates = Object.keys(value.eachCompany[comName][summaryKey[0]])
        for (const date of dates) {
          if (Number(date)) {
            const companyData = value.eachCompany[comName][summaryKey[0]][date][summaryKey[1]]
            for (const col of Object.keys(companyData)) {
              data[comName] += Number(`${companyData[col]}`)
            }
          }
        }
      } catch (err) {}
    }

    return data;
  }

  static getColumnFromEachCompany = (value, summaryKey) => {
    const data = {}
    if (!value || !value.eachCompany) return data;
    const comNames = Object.keys(value.eachCompany)
    if (comNames.length > 0) {
      for (const comName of comNames) {
        // 시작년도
        try {
          const dates = Object.keys(value.eachCompany[comName][summaryKey[0]])
          for (const date of dates) {
            if (Number(date)) {
              const colData = value.eachCompany[comName][summaryKey[0]][date][summaryKey[1]]
              const colKeys = Object.keys(colData)
              for (const col of colKeys) {
                if (!data[col]) {
                  data[col] = 0
                }
                data[col] += Number(`${colData[col]}`)
              }
            }
          }

        } catch (err) {}
      }
    }
    return data;
  }


  static sumValueFromEachCompany = (data1, data2) => {
    const data = {}
    for (const key of Object.keys(data1 || {})) {
      if (!data[key]) {
        data[key] = 0
      }
      data[key] += Number(`${data1[key]}`)
    }
    for (const key of Object.keys(data2 || {})) {
      if (!data[key]) {
        data[key] = 0
      }
      data[key] += Number(`${data2[key]}`)
    }
    return data;
  }

  static module35 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['교육구분', 'count']
    const value = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 35,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') {
        return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      } else {
        return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
      }
    })
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }

  static module57 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['재해형태', 'count']
    const value = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 57,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') {
        return DailyComparisonUtil.getCompanyFromEachCompany(value, meta$.beginYear, meta$.endYear, summaryKey1)
      } else {
        return DailyComparisonUtil.getColumnFromEachCompany(value, meta$.beginYear, meta$.endYear, summaryKey1)
      }
    })
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }

  // 안전점검현황
  // 64 65 66 69 70 72 74 75
  static module안전점검현황 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['점검표', 'count']
    const value64 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 64,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value65 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 65,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value66 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 66,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value69 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 69,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value70 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 70,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value72 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 72,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value74 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 74,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })
    const value75 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 75,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })

    let value = DailyComparisonUtil.sumValueFromEachCompany(value64, value65)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value66)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value69)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value70)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value72)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value74)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value75)
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }

  // 위험성평가 현황
  static module76 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = meta$.summaryKey1 ? meta$.summaryKey1 : ['최종처리 이행확인', 'count']

    // 정기 위험성평가
    const value1 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 76,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })

    // 수시 위험성평가
    const value2 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 77,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })

    const value = DailyComparisonUtil.sumValueFromEachCompany(value1, value2)
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }

  static module78 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['그룹', 'count']

    const value78 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 78,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })

    const value79 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 79,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })

    const value87 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 87,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      else return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
    })

    let value = DailyComparisonUtil.sumValueFromEachCompany(value78, value79)
    value = DailyComparisonUtil.sumValueFromEachCompany(value, value87)
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }


  // 위험성평가 현황
  static module82 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = meta$.summaryKey1 ? meta$.summaryKey1 : ['공종명', 'count']

    // 정기 위험성평가
    const value1 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 82,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') {
        return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      } else {
        return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
      }
    })

    // 수시 위험성평가
    const value2 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 83,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') {
        return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      } else {
        return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
      }
    })
    const value = DailyComparisonUtil.sumValueFromEachCompany(value1, value2)
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }

  // 안전작업평가 현황
  static module84 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['작업구분', 'count']

    // 정기 위험성평가
    const value1 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 84,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') {
        return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      } else {
        return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
      }
    })

    // 수시 위험성평가
    const value2 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 85,
      projectIds: [meta$.projectId],
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      if (dataType === 'company') {
        return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
      } else {
        return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
      }
    })
    const value = DailyComparisonUtil.sumValueFromEachCompany(value1, value2)
    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }

  // 안전·보건 예산 현황
  static module86 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['안전보건관리비', 'sum']
    const summaryKey2 = ['안전관리비', 'sum']
    const value = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 86,
      projectIds: [meta$.projectId],
      dateField: 'content$header.full',
      beginAt: new Date(meta$.beginYear, meta$.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00'),
      endAt: new Date(meta$.endYear, meta$.endMonth, 0).format('yyyy-MM-dd 23:59:59')
    }).then(value => {
      let data = []
      if (dataType === 'company') {
        const data1 = DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1)
        const data2 = DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey2)
        data = DailyComparisonUtil.sumValueFromEachCompany(data1, data2)
      } else {
        const data1 =  DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1)
        const data2 =  DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey2)
        data = DailyComparisonUtil.sumValueFromEachCompany(data1, data2)
      }

      // 단위변경 (원 -> 천원)
      // const keys = Object.keys(data)
      // for (const key of keys) {
      //   data[key].value = Math.floor(data[key].value / 1000)
      //   data[key].gap = Math.floor(data[key].gap / 1000)
      // }
      return data
    })

    return DailyComparisonUtil.moduleWithData(comGroupList$, meta$, value)
  }
}

export default DailyComparisonUtil
