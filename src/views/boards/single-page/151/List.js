export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '구분'}, {name: '협의일'}, {name: '차수'}, {name: '대상기간'}, {name: '재해형태'}, {name: '소속명'}, {name: '부서명'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inputA_1 // 구분
      case 2: return func.getContent(value).inputA_2 // 협의일
      case 3: return func.getContent(value).inputA_3 // 차수
      case 4: return `${func.getContent(value).inputA_4}~${func.getContent(value).inputA_5}` // 대상기간
      case 5: return func.getContent(value).inputB_1 // 재해형태
      case 6: return func.getContent(value).stdInfo.department // 소속명
      case 7: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
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

    if (nav.value.disasterType) returnData.push('content$body.inputB_1*%[:default_disaster]%')

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '구분': returnData.push('content$body.inputA_1*%[:default_skw]%'); break
    case '협의일': returnData.push('content$body.inputA_2*%[:default_skw]%'); break
    case '차수': returnData.push('content$body.inputA_3*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    }

    return returnData
  },
}
