class GraphUtil {
  static moduleWithData = (value) => {
    const module = []
    for (const comName of Object.keys(value)) {
      module.push({
        label: comName,
        value: value[comName]
      })
    }

    return module
  }
  static getParentComName = (comGroupList$, comName) => {

    const hasRootHead = comGroupList$.hasRootHead;
    const headList = comGroupList$.headList;
    const treeList = comGroupList$.list;

    // 본사 체크
    if (hasRootHead) {
      for (const headComName of headList) {
        if (headComName === comName) {
          return '본사'
        }
      }
    }

    const treeKeys = Object.keys(treeList)
    if (treeKeys.length > 0) {
      let key = undefined // 검색하는 파트너사 이름이 존재하는 tree 의 Key
      let keyIndex = 0
      for (keyIndex = 1; keyIndex<treeKeys.length; keyIndex++) {
        const treeKey = treeKeys[keyIndex]
        const comNames = Object.values(treeList[treeKey])
        let i = 0
        for (; i<comNames.length; i++) {
          if (comNames[i] === comName) {
            key = treeKey
            break;
          }
        }

        if (key) {
          break;
        }
      }

      if (key) {
        const rootKey = treeKeys[0]
        const comId = Number(`${key.replace('com_', '')}`)
        const comName = treeList[rootKey][comId]
        return comName;
      }
    }

    return comName;
  }

  /**
   * 월별 총합 막대 그래프 데이터를 반환한다.
   */
  static getDataMonthlyBarGraph = (value, nowYear, summaryKey) => {
    const data = {
      data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    const comNames = Object.keys(value.eachCompany)
    for (const comName of comNames) {
      const dataKey = summaryKey[0];
      const companyData = value.eachCompany[comName][dataKey]

      if (!companyData) continue;

      const yearKeys = Object.keys(companyData)
      for (const year of yearKeys) {
        if (year.indexOf('-') >= 0) {
          const temp = year.split('-')
          const y = Number(`${temp[0]}`)
          const m = Number(`${temp[1]}`)

          const colData = value.eachCompany[comName][dataKey][year][summaryKey[1]]
          const colNames = Object.keys(value.eachCompany[comName][dataKey][year][summaryKey[1]])
          for (const col of colNames) {

            if (nowYear === y) {
              data.data1[m - 1] += Number(`${colData[col]}`)
            } else {
              data.data2[m - 1] += Number(`${colData[col]}`)
            }
          }
        }
      }
    }
    return data;
  }

  static getData월별업체합막대그래프 = (value, nowYear, nowMonth, summaryKey) => {
    const data = {
      labels: [],
      data1: [],
      data2: []
    }
    const comNames = Object.keys(value.eachCompany)

    const data1 = []
    const data2 = []
    for (const comName of comNames) {
      const targetDate = new Date(nowYear, nowMonth - 1, 1).format('yyyy-MM')
      const prevDate = new Date(nowYear, nowMonth - 2, 1).format('yyyy-MM')

      // 이번달 데이터
      const tColData = value.eachCompany[comName][summaryKey[0]][targetDate][summaryKey[1]]
      const tColNames = Object.keys(tColData)
      let tSum = 0
      for (const colName of tColNames) {
        tSum += tColData[colName] ? tColData[colName] : 0
      }
      data1.push(tSum)

      // 저번달 데이터
      const pColData = value.eachCompany[comName][summaryKey[0]][prevDate][summaryKey[1]]
      const pColNames = Object.keys(pColData)
      let pSum = 0
      for (const colName of pColNames) {
        pSum += pColData[colName] ? pColData[colName] : 0
      }
      data2.push(pSum)
    }


    data.labels = comNames
    data.data1 = data1
    data.data2 = data2


    return data;
  }

  static getData월별종류합막대그래프 = (value, nowYear, nowMonth, summaryKey) => {
    const data = {
      labels: [],
      data1: [],
      data2: []
    }
    const comNames = Object.keys(value.eachCompany)

    const totalColData = {}
    for (const comName of comNames) {
      const targetDate = new Date(nowYear, nowMonth - 1, 1).format('yyyy-MM')
      const prevDate = new Date(nowYear, nowMonth - 2, 1).format('yyyy-MM')

      // 이번달 데이터
      try {
        const tColData = value.eachCompany[comName][summaryKey[0]][targetDate][summaryKey[1]]
        const tColNames = Object.keys(tColData)
        for (const colName of tColNames) {
          if (totalColData[colName]) {
            totalColData[colName] += tColData[colName]
          } else {
            totalColData[colName] = tColData[colName]
          }
        }
      } catch (e) {}

      // 저번달 데이터
      try {
        const pColData = value.eachCompany[comName][summaryKey[0]][prevDate][summaryKey[1]]
        const pColNames = Object.keys(pColData)
        for (const colName of pColNames) {
          if (totalColData[colName]) {
            totalColData[colName] += pColData[colName]
          } else {
            totalColData[colName] = pColData[colName]
          }
        }
      } catch (e) {}
    }

    const totalColNames = Object.keys(totalColData)
    const data1 = []
    const data2 = []
    for (const comName of comNames) {
      const targetDate = new Date(nowYear, nowMonth - 1, 1).format('yyyy-MM')
      const prevDate = new Date(nowYear, nowMonth - 2, 1).format('yyyy-MM')

      // 이번달 데이터
      try {
        const tColData = value.eachCompany[comName][summaryKey[0]][targetDate][summaryKey[1]]
        for (const colName of totalColNames) {
          const data = tColData[colName] ? tColData[colName] : 0
          data1.push(data)
        }
      } catch (e) {}


      // 저번달 데이터
      try {
        const pColData = value.eachCompany[comName][summaryKey[0]][prevDate][summaryKey[1]]
        for (const colName of totalColNames) {
          const data = pColData[colName] ? pColData[colName] : 0
          data2.push(data)
        }
      } catch (e) {}
    }
    data.labels = totalColNames
    data.data1 = data1
    data.data2 = data2

    return data;
  }

  static combine월별총합막대그래프 (data1, data2) {
    const data = {
      data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    for (let i = 0; i < 12; i++) {
      data.data2[i] = data1.data2[i] + data2.data2[i]
      data.data1[i] = data1.data1[i] + data2.data1[i]
    }
    return data
  }
}

export default GraphUtil
