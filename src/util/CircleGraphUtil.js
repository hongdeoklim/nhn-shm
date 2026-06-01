import GraphUtil from '@/util/GraphUtil'

class CircleGraphUtil {

  static circleModuleWithData = (value) => {
    const circleModule = []
    for (const comName of Object.keys(value)) {
      circleModule.push({
        label: comName,
        value: value[comName]
      })
    }
    // graph 에서 사용하는 형식으로 데이터 변경후 반환해야 함
    // list = [{label: '', value: 0},{label: '', value: 0}]
    return circleModule
  }

  // summary api 에서 반환되는 데이터를 그래프를 그리기 위해 필요한 JSON 형태로 변경하여 반환한다. (파트너사 명)
  static getCompanyFromEachCompany = (value, summaryKey) => {
    const year = new Date().getFullYear()
    const data = {}
    const keys = Object.keys(value.eachCompany)
    for (const key of keys) {
      if (!data[key]) {
        data[key] = 0;
      }
      try {
        const colData = value.eachCompany[key][summaryKey[0]][year][summaryKey[1]]
        const colNames = Object.keys(value.eachCompany[key][summaryKey[0]][year][summaryKey[1]])
        for (const col of colNames) {
          data[key] += Number(`${colData[col]}`)
        }
      } catch (err) {}
    }
    return data
  }

  static getCompanyFromEachCompanyAllYear = (value, summaryKey) => {
    const fromYear = 2020;
    const toYear = new Date().getFullYear()
    const data = {}
    const keys = Object.keys(value.eachCompany)
    for (const key of keys) {
      if (!data[key]) {
        data[key] = 0;
      }

      for (let year = fromYear; year <= toYear; year++) {
        try {
          const colData = value.eachCompany[key][summaryKey[0]][year][summaryKey[1]]
          const colNames = Object.keys(value.eachCompany[key][summaryKey[0]][year][summaryKey[1]])
          for (const col of colNames) {
            data[key] += Number(`${colData[col]}`)
          }
        } catch (err) {}
      }
    }
    return data
  }

  static combineCircleGraphData = (data1, data2) => {
    const data = {}
    const keyList1 = Object.keys(data1)
    const keyList2 = Object.keys(data2)
    if (keyList1 && keyList1.length > 0) {
      for (const key of keyList1) {
        data[key] = data1[key]
      }
    }
    if (keyList2 && keyList2.length > 0) {
      for (const key of keyList2) {
        if (data[key] && data2[key] > 0) {
          data[key] += data2[key]
        } else {
          data[key] = data2[key]
        }
      }
    }
    return data
  }

  // summary api 에서 반환되는 데이터를 그래프를 그리기 위해 필요한 JSON 형태로 변경하여 반환한다.
  static getColumnFromEachCompany = (value, summaryKey) => {
    const year = new Date().getFullYear()
    const data = {}
    const comNames = Object.keys(value.eachCompany)

    if (comNames.length > 0) {
      for (const comName of comNames) {

        try {
          const colData = value.eachCompany[comName][summaryKey[0]][year][summaryKey[1]]
          const colNames = Object.keys(value.eachCompany[comName][summaryKey[0]][year][summaryKey[1]])
          for (const col of colNames) {
            if (!data[col]) data[col] = 0
            data[col] += Number(`${colData[col]}`)
          }
        } catch (err) {}
      }
    }

    return data;
  }

  static getColumnFromEachCompanyAllYear = (value, summaryKey) => {
    const fromYear = 2020;
    const toYear = new Date().getFullYear()
    const data = {}
    const comNames = Object.keys(value.eachCompany)

    if (comNames.length > 0) {
      for (const comName of comNames) {

        for (let year = fromYear; year <= toYear; year++) {
          try {
            const colData = value.eachCompany[comName][summaryKey[0]][year][summaryKey[1]]
            const colNames = Object.keys(value.eachCompany[comName][summaryKey[0]][year][summaryKey[1]])
            for (const col of colNames) {
              if (!data[col]) data[col] = 0
              data[col] += Number(`${colData[col]}`)
            }
          } catch (err) {}
        }
      }
    }

    return data;
  }

  // summary api 에서 반환되는 데이터를 그래프를 그리기 위해 필요한 JSON 형태로 변경하여 반환한다. (파트너사 명)
  static getProjectFromEachProject = (value, summaryKey) => {
    const year = new Date().getFullYear()
    const data = {}
    const projects = Object.keys(value.eachProject)
    for (const proj of projects) {
      if (!data[proj]) {
        data[proj] = 0;
      }
      try {
        const colData = value.eachProject[proj][summaryKey[0]][year][summaryKey[1]]
        const colNames = Object.keys(colData)
        for (const col of colNames) {
          data[proj] += Number(`${colData[col]}`)
        }
      } catch (err) {}
    }
    return data
  }

  static getProjectFromEachProjectAllYear = (value, summaryKey) => {
    const fromYear = 2020;
    const toYear = new Date().getFullYear()
    const data = {}
    const projects = Object.keys(value.eachProject)
    for (const proj of projects) {
      if (!data[proj]) {
        data[proj] = 0;
      }

      for (let year = fromYear; year <= toYear; year++) {
        try {
          const colData = value.eachProject[proj][summaryKey[0]][year][summaryKey[1]]
          const colNames = Object.keys(colData)
          for (const col of colNames) {
            data[proj] += Number(`${colData[col]}`)
          }
        } catch (err) {}
      }
    }
    return data
  }

  static loadGraphPieces = async ($store, projectIds, boardIds, summaryKey, dataType, excludeCompanyIds) => {
    const value = await $store.dispatch('summary/FIRA_LOAD_SUMMARY', {
      boardIds,
      projectIds, //: this.projectId ? [this.projectId] : []
      excludeCompanyIds,
    }).then(value => {
      const dataList = []
      for (const boardId of boardIds) {
        if (dataType === 'project') {
          dataList.push(CircleGraphUtil.getProjectFromEachProject(value[boardId], summaryKey))
        } else if (dataType === 'company') {
          dataList.push(CircleGraphUtil.getCompanyFromEachCompany(value[boardId], summaryKey))
        } else {
          dataList.push(CircleGraphUtil.getColumnFromEachCompany(value[boardId], summaryKey))
        }
      }

      return dataList;
    })
    return value
  }
}

export default CircleGraphUtil
