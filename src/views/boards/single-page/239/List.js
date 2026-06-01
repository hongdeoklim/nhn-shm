export default {
  getHead: () => {
    return [{ name: '현장명' }, { name: '훈련명' }, { name: '종류' }, { name: '재해형태' }, { name: '참여 인원(명)' }, { name: '소속명' }, { name: '부서명' }, { name: '작성자' }]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inputA_1 // 훈련명
      case 2: return func.getContent(value).inputA_3 // 종류
      case 3: return func.getContent(value).inputA_7 // 재해형태
      case 4: return func.getContent(value).inputA_9 // 참여인원
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
    return { disasterType: nav.value.disasterType, searchType: nav.value.searchType,  searchKeyword: nav.value.searchKeyword }
  },
  getSearchKeyword: (nav) => {
    const returnData = []

    if (nav.value.disasterType) returnData.push('content$body.inputA_7*%[:default_disaster]%')

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '훈련명': returnData.push('content$body.inputA_1*%[:default_skw]%'); break
    case '종류': returnData.push('content$body.inputA_3*%[:default_skw]%'); break
    case '참여인원': returnData.push('content$body.inputA_9*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }

    return returnData
  },
}
