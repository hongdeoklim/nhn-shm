export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '종류'}, {name: '종별'}, {name: '안전 등급'}, {name: '점검 결과'}, {name: '소속명'}, {name: '부서명'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inputB_4 // 종류
      case 2: return func.getContent(value).inputB_6 // 종별
      case 3: return func.getContent(value).inputB_7 // 안전등급
      case 4: return func.getContent(value).inputC_1 // 점검결과
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
    return { searchType: nav.value.searchType,  searchKeyword: nav.value.searchKeyword }
  },
  getSearchKeyword: (nav) => {
    switch (nav.value.searchType) {
    case '현장명': return ['content$body.stdInfo.field_name*%[:default_skw]%']
    case '종류': return ['content$body.inputB_4*%[:default_skw]%']
    case '종별': return ['content$body.inputB_6*%[:default_skw]%']
    case '안전등급': return ['content$body.inputB_7*%[:default_skw]%']
    case '점검결과': return ['content$body.inputC_1*%[:default_skw]%']
    case '소속명': return ['content$body.stdInfo.department*%[:default_skw]%']
    case '부서명': return ['content$body.stdInfo.com_name*%[:default_skw]%']
    case '작성자': return ['content$body.stdInfo.writer_name*%[:default_skw]%']
    }
    return []
  },
}
