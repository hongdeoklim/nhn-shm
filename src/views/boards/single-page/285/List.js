const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: '현장명' }, { name: '안전보건관리(총괄)책임자' }, { name: '책임자 소속명' }, { name: '부서명' }, { name: '작성자' }]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inputD_1 // 안전보건관리(총괄)책임자
      case 2: return func.getContent(value).inputD_2 // 책임자 소속명
      case 3: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
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
    const returnData = []

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '안전보건관리(총괄)책임자': returnData.push('content$body.inputD_1*%[:default_skw]%'); break
    case '책임자 소속명': returnData.push('content$body.inputD_2*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }
    return returnData
  }, /**
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
        label: '안전보건관리(총괄)책임자',
        type: 'input',
        key: 'body.inputD_1',
        value: '',
      });
      filterSettings.push({
        label: '책임자 소속명',
        type: 'input',
        key: 'body.inputD_2',
        value: '',
      });
      filterSettings.push({
        label: '부서명',
        type: 'input',
        key: 'body.stdInfo.section',
        value: '',
      });
      filterSettings.push({
        label: '작성자',
        type: 'input',
        key: 'body.stdInfo.writer_name',
        value: '',
      });
      // filterSettings.push({
      //   label: '작성일',
      //   type: 'date-range',
      //   key: 'created_at',
      //   value: {sDate: '', eDate: ''},
      // })
    }

    return [...filterSettings];
  },
}
