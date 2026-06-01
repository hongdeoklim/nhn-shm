const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: '현장명' }, { name: '당월 사용금액' }, { name: '누계' }, { name: '소속명' }, { name: '부서명' }, {name: '해당기간'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.comma(func.getContent(value).budgetTotal.now) // 당월사용금액
      case 2: return func.comma(func.getContent(value).budgetTotal.total) // 누계
      case 3: return func.getContent(value).stdInfo.department // 소속명
      case 4: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
      case 5: return new Date(func.getContent(value).headerDate).format('yyyy년 MM월') // 해당기간
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
  getSearchKeyValue: (nav) => {
    if (nav.value.created_at) {
      nav.dateTarget = 'content$body.headerDate'
      nav.dateBegin = 'nav.value.created_at.sDate'
      nav.dateEnd = 'nav.value.created_at.eDate'
    }
    return { searchType: nav.value.searchType, searchKeyword: nav.value.searchKeyword }
  },
  getSearchKeyword: (nav) => {
    switch (nav.value.searchType) {
    case '현장명': return ['content$body.stdInfo.field_name*%[:default_skw]%']
    case '당월 사용금액': return ['content$body.budgetTotal.now*%[:default_skw]%']
    case '누계': return ['content$body.budgetTotal.total*%[:default_skw]%']
    case '소속명': return ['content$body.stdInfo.department*%[:default_skw]%']
    case '부서명': return ['content$body.stdInfo.section*%[:default_skw]%'] ? ['content$body.stdInfo.section*%[:default_skw]%'] : ['content$body.stdInfo.com_name*%[:default_skw]%']
    case '해당기간': return ['content$body.headerDate*%[:default_skw]%']
    }

    return []
  },
  getDefaultSort: () => {
    return {target: 'content$body.stdInfo.date', order: 'desc'};
  },
  /**
   * 헤더의 "필터" 다이얼로그에 표시할 조건들을 등록한다
   * @returns {*[]}
   */
  getFilters: () => {
    if (filterSettings.length < 1) {
      filterSettings.push({
        label: '현장명',
        type: 'input',
        key: 'body.stdInfo.field_name',
        value: '',
      });
      filterSettings.push({
        label: '당월 사용금액',
        type: 'number',
        key: 'body.budgetTotal.now',
        value: '',
      });
      filterSettings.push({
        label: '누계',
        type: 'number',
        key: 'body.budgetTotal.total',
        value: '',
      });
      filterSettings.push({
        label: '소속명',
        type: 'input',
        key: 'body.stdInfo.department',
        value: '',
      });
      filterSettings.push({
        label: '부서명',
        type: 'input',
        key: 'body.stdInfo.section',
        value: '',
      });
      filterSettings.push({
        label: '해당기간',
        type: 'date-range',
        key: 'body.headerDate',
        value: {sDate: '', eDate: ''},
      })

      // filterSettings.push({
      //   label: '작성자',
      //   type: 'input',
      //   key: 'body.stdInfo.writer_name',
      //   value: '',
      // });
    }

    return [...filterSettings];
  },
}
