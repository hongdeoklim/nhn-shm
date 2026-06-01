export default {
  getHead: () => {
    return [{ name: '계약코드' }, { name: '현장명' }, { name: '안전담당부서' }, { name: '안전담당부서장' }, { name: '안전보건담당자' }, { name: '지역' }]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).inputA_1
      case 1: return func.getContent(value).inputA_2
      case 2: return func.getContent(value).inputA_4
      case 3: return {type: 'member', memberId: func.getContent(value).inputA_5}
      case 4: return {type: 'member', memberId: func.getContent(value).inputA_6}
      case 5: return func.getContent(value).inputA_3
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
    return { inputB_6: nav.value.created_at}
  },
  getSearchKeyword: (nav) => {
    return []
  },
}
