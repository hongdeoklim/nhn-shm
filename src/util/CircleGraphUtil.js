import GraphUtil from '@/util/GraphUtil'

class CircleGraphUtil {

  static normalizeSummaryResponse = (value) => {
    if (!value || typeof value !== 'object') {
      return { eachProject: {}, eachCompany: {} }
    }
    
    // value가 배열이거나 특정 boardId의 응답일 경우 대응
    let target = value;
    if (Array.isArray(value)) {
      return { eachProject: {}, eachCompany: {} }
    }
    
    return {
      eachProject: target.eachProject && typeof target.eachProject === 'object' && !Array.isArray(target.eachProject)
        ? target.eachProject
        : {},
      eachCompany: target.eachCompany && typeof target.eachCompany === 'object' && !Array.isArray(target.eachCompany)
        ? target.eachCompany
        : {},
    }
  }

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

  static getCompanyFromEachCompany = (value, summaryKey) => {
    value = CircleGraphUtil.normalizeSummaryResponse(value)
    const year = new Date().getFullYear()
    const data = {}
    const keys = Object.keys(value.eachCompany)
    for (const key of keys) {
      if (!data[key]) {
        data[key] = 0;
      }
      try {
        const compData = value.eachCompany[key];
        if (!compData || !compData[summaryKey[0]]) continue;
        
        const yearData = compData[summaryKey[0]][year];
        if (!yearData || !yearData[summaryKey[1]]) continue;
        
        const colData = yearData[summaryKey[1]];
        const colNames = Object.keys(colData);
        for (const col of colNames) {
          data[key] += Number(`${colData[col]}`)
        }
      } catch (err) {}
    }
    return data
  }

  static getCompanyFromEachCompanyAllYear = (value, summaryKey) => {
    value = CircleGraphUtil.normalizeSummaryResponse(value)
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
          const compData = value.eachCompany[key];
          if (!compData || !compData[summaryKey[0]]) continue;
          
          const yearData = compData[summaryKey[0]][year];
          if (!yearData || !yearData[summaryKey[1]]) continue;
          
          const colData = yearData[summaryKey[1]];
          const colNames = Object.keys(colData);
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
    const keyList1 = Object.keys(data1 || {})
    const keyList2 = Object.keys(data2 || {})
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
    value = CircleGraphUtil.normalizeSummaryResponse(value)
    const year = new Date().getFullYear()
    const data = {}
    const comNames = Object.keys(value.eachCompany)

    if (comNames.length > 0) {
      for (const comName of comNames) {

        try {
          const compData = value.eachCompany[comName];
          if (!compData || !compData[summaryKey[0]]) continue;
          
          const yearData = compData[summaryKey[0]][year];
          if (!yearData || !yearData[summaryKey[1]]) continue;
          
          const colData = yearData[summaryKey[1]];
          const colNames = Object.keys(colData);
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
    value = CircleGraphUtil.normalizeSummaryResponse(value)
    const fromYear = 2020;
    const toYear = new Date().getFullYear()
    const data = {}
    const comNames = Object.keys(value.eachCompany)

    if (comNames.length > 0) {
      for (const comName of comNames) {

        for (let year = fromYear; year <= toYear; year++) {
          try {
            const compData = value.eachCompany[comName];
            if (!compData || !compData[summaryKey[0]]) continue;
            
            const yearData = compData[summaryKey[0]][year];
            if (!yearData || !yearData[summaryKey[1]]) continue;
            
            const colData = yearData[summaryKey[1]];
            const colNames = Object.keys(colData);
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
    value = CircleGraphUtil.normalizeSummaryResponse(value)
    const year = new Date().getFullYear()
    const data = {}
    const projects = Object.keys(value.eachProject)
    for (const proj of projects) {
      if (!data[proj]) {
        data[proj] = 0;
      }
      try {
        const projData = value.eachProject[proj];
        if (!projData || !projData[summaryKey[0]]) continue;
        
        const yearData = projData[summaryKey[0]][year];
        if (!yearData || !yearData[summaryKey[1]]) continue;
        
        const colData = yearData[summaryKey[1]];
        const colNames = Object.keys(colData)
        for (const col of colNames) {
          data[proj] += Number(`${colData[col]}`)
        }
      } catch (err) {}
    }
    return data
  }

  static getProjectFromEachProjectAllYear = (value, summaryKey) => {
    value = CircleGraphUtil.normalizeSummaryResponse(value)
    const fromYear = 2020;
    const toYear = new Date().getFullYear()
    const data = {}
    if (!value || !value.eachProject) return data
    const projects = Object.keys(value.eachProject)
    for (const proj of projects) {
      if (!data[proj]) {
        data[proj] = 0;
      }

      for (let year = fromYear; year <= toYear; year++) {
        try {
          const projData = value.eachProject[proj];
          if (!projData || !projData[summaryKey[0]]) continue;
          
          const yearData = projData[summaryKey[0]][year];
          if (!yearData || !yearData[summaryKey[1]]) continue;
          
          const colData = yearData[summaryKey[1]];
          const colNames = Object.keys(colData);
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
      const boardIdList = Array.isArray(boardIds) ? boardIds : []
      for (const boardId of boardIdList) {
        const boardSummary = CircleGraphUtil.normalizeSummaryResponse(value && value[boardId])
        if (dataType === 'project') {
          dataList.push(CircleGraphUtil.getProjectFromEachProject(boardSummary, summaryKey))
        } else if (dataType === 'company') {
          dataList.push(CircleGraphUtil.getCompanyFromEachCompany(boardSummary, summaryKey))
        } else {
          dataList.push(CircleGraphUtil.getColumnFromEachCompany(boardSummary, summaryKey))
        }
      }

      return dataList;
    })
    return value
  }
}

export default CircleGraphUtil
