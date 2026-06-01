export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '점검대상'}, {name: '점검일'}, {name: '재해형태'}, {name: '소속명'}, {name: '부서명'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inspectionTitle // 점검대상
      case 2: return func.getContent(value).stdInfo.점검일 // 점검일
      case 3: return func.getContent(value).stdInfo.재해형태 // 재해형태
      case 4: return func.getContent(value).stdInfo.department // 소속명
      case 5: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
  getSearchKeyValue: (nav) => {
    if (nav.value.created_at) {
      nav.dateTarget = 'created_at'
      nav.dateBegin = 'nav.value.created_at.sDate'
      nav.dateEnd = 'nav.value.created_at.eDate'
    }
    return { disasterType: nav.value.disasterType, searchType: nav.value.searchType,  searchKeyword: nav.value.searchKeyword }
  },
  getSearchKeyword: (nav) => {
    const returnData = []

    if (nav.value.disasterType) returnData.push('content$body.stdInfo."재해형태"*%[:default_disaster]%')

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '점검대상': returnData.push('content$body.inspectionTitle*%[:default_skw]%'); break
    case '점검일': returnData.push('content$body.stdInfo."점검일"*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    }

    return returnData
  },
}
