export default {
  getHead: () => {
    return [{name: '현장명'}, {name: 'ID코드'}, {name: '성명'}, {name: '성별'}, {name: '직종'}, {name: '소속명(담당자)'}, {name: '부서명(담당자)'}, {name: '작성자'}, {name: '등록일'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).현장명 // 현장명
      case 1: return func.getContent(value).inputA_5 // ID 코드
      case 2: return func.onNameBlur(func.getContent(value).inputA_6) // 성명
      case 3: return func.getContent(value).inputA_7 // 성별
      case 4: return func.getContent(value).직종 // 직종
      case 5: return func.getContent(value).inputA_2 // 소속명
      case 6: return func.getContent(value).inputA_3 // 부서명
      case 7: return func.getContent(value).stdInfo.writer_name // 작성자
      case 8: return func.getCreatedDate(value.created_at) // 등록일
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
    case '현장명': returnData.push('content$body."현장명"*%[:default_skw]%'); break
    case 'ID코드': returnData.push('content$body.inputA_5*%[:default_skw]%'); break
    case '성명': returnData.push('content$body.inputA_6*%[:default_skw]%'); break
    case '성별': returnData.push('content$body.inputA_7*%[:default_skw]%'); break
    case '직종': returnData.push('content$body."직종"*%[:default_skw]%'); break
    case '소속명(담당자)': returnData.push('content$body.inputA_2*%[:default_skw]%'); break
    case '부서명(담당자)': returnData.push('content$body.inputA_3*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }

    return returnData
  }
}
