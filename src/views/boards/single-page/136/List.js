export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '소속명'}, {name: '부서명'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).stdInfo.department // 소속명
      case 2: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
      case 3: return func.getContent(value).stdInfo.writer_name // 작성자
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
    return { searchType: nav.value.searchType, searchKeyword: nav.value.searchKeyword }
  },
  getSearchKeyword: (nav) => {
    const returnData = []

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }

    return returnData
  },
}
