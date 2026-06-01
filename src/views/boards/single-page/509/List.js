export default {
  getHead: () => {
    return [{name: '사업장명'}, {name: '소속명'}, {name: '부서명'}, {name: '점검일'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 사업장명
      case 1: return func.getContent(value).stdInfo.department // 소속명
      case 2: return func.getContent(value).stdInfo.section // 부서명
      case 3: return func.getContent(value).inputB_1 // 점검일
      case 4: return func.getContent(value).stdInfo.writer_name // 작성자
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
    switch (nav.value.searchType) {
    case '사업장명': return ['content$body.stdInfo.field_name*%[:default_skw]%']
    case '소속명': return ['content$body.stdInfo.department*%[:default_skw]%']
    case '부서명': return ['content$body.stdInfo.section*%[:default_skw]%']
    case '점검일': return ['content$body.inputB_1*%[:default_skw]%']
    case '작성자': return ['content$body.stdInfo.writer_name*%[:default_skw]%']
    }
    return []
  },
}
