export default {
  getHead: () => {
    return [{ name: '현장명' }, ]
  } ,
  getCol: (index, value, func) => {
    try {
      switch (index) {
        case 0: return func.getContent(value).stdInfo.field_name // 현장명
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
    return []
  },
}
