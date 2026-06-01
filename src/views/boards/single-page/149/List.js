export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '업체명'}, {name: '평가자'}, {name: '평가일'}, {name: '평가점수'}, {name: '소속명'}, {name: '부서명'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).companyName // 업체명
      case 2: return func.getContent(value).stdInfo.평가자 // 평가자
      case 3: return func.getContent(value).stdInfo.평가일 // 평가일
      case 4: return func.getContent(value).userScore // 평가점수
      case 5: return func.getContent(value).stdInfo.department // 소속명
      case 6: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
      case 7: return func.getContent(value).stdInfo.writer_name // 작성자
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
    case '업체명': returnData.push('content$body.companyName*%[:default_skw]%'); break
    case '평가자': returnData.push('content$body.stdInfo."평가자"*%[:default_skw]%'); break
    case '평가일': returnData.push('content$body.stdInfo."평가일"*%[:default_skw]%'); break
    case '평가점수': returnData.push('content$body.userScore*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }

    return returnData
  },
}
