import GraphUtil from '@/util/GraphUtil'

class MonthlyComparisonUtil {
  static moduleWithData = (value) => {
    const module = []
    for (const comName of Object.keys(value)) {
      module.push({
        name: comName,
        value: value[comName].value,
        gap: value[comName].gap
      })
    }

    // graph 에서 사용하는 형식으로 데이터 변경후 반환해야 함
    // list = [{ no: 1, name: '사업장', value: 1000000, gap: -100 }]
    for (let i = 0; i < module.length; i++) {
      module[i].no = (i + 1)
    }
    return module
  }

  static getProjectFromEachProject = (value, year, month, summaryKey) => {
    const data = {}
    const projects = Object.keys(value.eachProject)
    for (const proj of projects) {
      if (!data[proj]) {
        data[proj] = {
          value: 0,
          gap: 0
        }
      }
      // 이번달 합계계
      try {
        const companyData = value.eachProject[proj][summaryKey[0]][`${year}-${month > 9 ? month : `0${month}`}`][summaryKey[1]]
        for (const col of Object.keys(companyData)) {
          data[proj].value += Number(`${companyData[col]}`)
          data[proj].gap += Number(`${companyData[col]}`)
        }
      } catch (err) {}

      try {
        const companyData = value.eachProject[proj][summaryKey[0]][`${year}-${(month - 1) > 9 ? (month - 1) : `0${(month - 1)}`}`][summaryKey[1]]
        for (const col of Object.keys(companyData)) {
          data[proj].gap -= Number(`${companyData[col]}`)
        }
      } catch (err) {}
    }
    return data;
  }

  static getCompanyFromEachCompany = (value, year, month, summaryKey) => {
    const data = {}
    const comNames = Object.keys(value.eachCompany)
    for (const comName of comNames) {
      if (!data[comName]) {
        data[comName] = {
          value: 0,
          gap: 0
        }
      }
      // 이번달 합계계
      try {
        const companyData = value.eachCompany[comName][summaryKey[0]][`${year}-${month > 9 ? month : `0${month}`}`][summaryKey[1]]
        for (const col of Object.keys(companyData)) {
          data[comName].value += Number(`${companyData[col]}`)
          data[comName].gap += Number(`${companyData[col]}`)
        }
      } catch (err) {}

      try {
        const companyData = value.eachCompany[comName][summaryKey[0]][`${year}-${(month - 1) > 9 ? (month - 1) : `0${(month - 1)}`}`][summaryKey[1]]
        for (const col of Object.keys(companyData)) {
          data[comName].gap -= Number(`${companyData[col]}`)
        }
      } catch (err) {}
    }
    return data;
  }

  static getColumnFromEachCompany = (value, year, month, summaryKey) => {
    const data = {}
    const comNames = Object.keys(value.eachCompany)
    if (comNames.length > 0) {
      for (const comName of comNames) {
        // 이번달 합계
        try {
          const colData = value.eachCompany[comName][summaryKey[0]][`${year}-${month > 9 ? month : `0${month}`}`][summaryKey[1]]
          const colKeys = Object.keys(colData)
          for (const col of colKeys) {
            if (!data[col]) {
              data[col] = {
                value: 0,
                gap: 0
              }
            }
            data[col].value += Number(`${colData[col]}`)
            data[col].gap += Number(`${colData[col]}`)
          }
        } catch (err) {}

        try {
          const colData = value.eachCompany[comName][summaryKey[0]][`${year}-${(month - 1) > 9 ? (month - 1) : `0${(month - 1)}`}`][summaryKey[1]]
          for (const col of Object.keys(colData)) {
            if (!data[col]) {
              data[col] = {
                value: 0,
                gap: 0
              }
            }
            data[col].gap -= Number(`${colData[col]}`)
          }
        } catch (err) {}
      }
    }
    return data
  }


  static sumValueFromEachCompany = (data1, data2) => {
    const data = {}
    for (const key of Object.keys(data1)) {
      if (!data[key]) {
        data[key] = {
          value: 0,
          gap: 0
        }
      }
      data[key].value += Number(`${data1[key].value}`)
      data[key].gap += Number(`${data1[key].gap}`)
    }
    for (const key of Object.keys(data2)) {
      if (!data[key]) {
        data[key] = {
          value: 0,
          gap: 0
        }
      }
      data[key].value += Number(`${data2[key].value}`)
      data[key].gap += Number(`${data2[key].gap}`)
    }
    return data;
  }

  static module35 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['교육구분', 'count']
    const value = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 35,
      projectIds: [meta$.projectId]
    }).then(value => {
      if (dataType === 'company') {
        return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      } else {
        return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      }
    })

    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }

  static module57 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['재해형태', 'count']
    const value = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 57,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') {
        return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      } else {
        return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      }
    })

    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }

  // 안전점검현황
  // 64 65 66 69 70 72 74 75
  static module안전점검현황 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['점검표', 'count']
    const value64 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 64,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value65 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 65,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value66 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 66,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value69 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 69,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value70 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 70,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value72 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 72,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value74 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 74,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })
    const value75 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 75,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })

    let value = MonthlyComparisonUtil.sumValueFromEachCompany(value64, value65)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value66)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value69)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value70)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value72)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value74)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value75)
    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }

  // 위험성평가 현황
  static module76 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = meta$.summaryKey1 ? meta$.summaryKey1 : ['최종처리 이행확인', 'count']

    // 정기 위험성평가
    const value1 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 76,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })

    // 수시 위험성평가
    const value2 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 77,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })

    const value = MonthlyComparisonUtil.sumValueFromEachCompany(value1, value2)
    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }

  static module78 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['그룹', 'count']

    const value78 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 78,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })

    const value79 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 79,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })

    const value87 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 87,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      else return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
    })

    let value = MonthlyComparisonUtil.sumValueFromEachCompany(value78, value79)
    value = MonthlyComparisonUtil.sumValueFromEachCompany(value, value87)
    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }


  // 위험성평가 현황
  static module82 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = meta$.summaryKey1 ? meta$.summaryKey1 : ['공종명', 'count']

    // 정기 위험성평가
    const value1 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 82,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') {
        return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      } else {
        return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      }
    })

    // 수시 위험성평가
    const value2 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 83,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') {
        return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      } else {
        return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      }
    })
    const value = MonthlyComparisonUtil.sumValueFromEachCompany(value1, value2)
    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }

  // 안전작업평가 현황
  static module84 = async (store$, comGroupList$, meta$) => {
    const dataType = meta$.dataType
    const summaryKey1 = ['작업구분', 'count']

    // 정기 위험성평가
    const value1 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 84,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') {
        return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      } else {
        return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      }
    })

    // 수시 위험성평가
    const value2 = await store$.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardId: 85,
      projectIds: [meta$.projectId],
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      if (dataType === 'company') {
        return MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      } else {
        return MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
      }
    })
    const value = MonthlyComparisonUtil.sumValueFromEachCompany(value1, value2)
    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
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
      beginAt: `${meta$.year}-01-01 00:00:00`,
      endAt: `${meta$.year}-12-31 23:59:59`
    }).then(value => {
      let data = []
      if (dataType === 'company') {
        const data1 = MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
        const data2 = MonthlyComparisonUtil.getCompanyFromEachCompany(value, meta$.year, meta$.month, summaryKey2)
        data = MonthlyComparisonUtil.sumValueFromEachCompany(data1, data2)
      } else {
        const data1 =  MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey1)
        const data2 =  MonthlyComparisonUtil.getColumnFromEachCompany(value, meta$.year, meta$.month, summaryKey2)
        data = MonthlyComparisonUtil.sumValueFromEachCompany(data1, data2)
      }

      // 단위변경 (원 -> 천원)
      // const keys = Object.keys(data)
      // for (const key of keys) {
      //   data[key].value = Math.floor(data[key].value / 1000)
      //   data[key].gap = Math.floor(data[key].gap / 1000)
      // }
      return data
    })

    return MonthlyComparisonUtil.moduleWithData(comGroupList$, value)
  }
}

export default MonthlyComparisonUtil
