export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '업체명'}, {name: '사업자등록번호'}, {name: '소속명'}, {name: '부서명'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).field.field_name // 현장명
      case 1: return func.getContent(value).company.com_name // 업체명
      case 2: return func.comNumber(func.getContent(value).company.com_number) // 사업자등록번호
      case 3: return func.getContent(value).stdInfo.department // 소속명
      case 4: return func.getContent(value).stdInfo.section // 부서명
      case 5: return func.getContent(value).stdInfo.writer_name // 작성자
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
    case '현장명': returnData.push('content$body.field.field_name*%[:default_skw]%'); break
    case '업체명': returnData.push('content$body.company.com_name*%[:default_skw]%'); break
    case '사업자등록번호': returnData.push('content$body.company.com_number*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.section*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }

    return returnData
  },
}
