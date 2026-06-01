export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '수급인 소속명'}, {name: '수급인 직책'}, {name: '수급인 성명'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 사업장명
      case 1: return func.getContent(value).소속명 // 수급인 소속명
      case 2: return func.getContent(value).직책 // 수급인 직책
      case 3: return func.getContent(value).성명 // 수급인 성명
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
    case '수급인 소속명': return ['content$body."소속명"*%[:default_skw]%']
    case '수급인 직책': return ['content$body."직책"*%[:default_skw]%']
    case '수급인 성명': return ['content$body."성명"*%[:default_skw]%']
    case '작성자': return ['content$body.stdInfo.writer_name*%[:default_skw]%']
    }
    return []
  },
}
