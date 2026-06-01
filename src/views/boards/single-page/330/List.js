const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: '현장명' }, { name: '업체명' }, { name: '위임받는 자' }, { name: '위임하는 자' }, { name: '작성자' }]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).companyName // 업체명
      case 2: return func.getContent(value).inputC_3  // 위임받는 자
      case 3: return func.getContent(value).inputD_3 // 위임하는 자
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
    case '업체명': returnData.push('content$body.companyName*%[:default_skw]%'); break
    case '위임받는 자': returnData.push('content$body.inputC_3*%[:default_skw]%'); break
    case '위임하는 자': returnData.push('content$body.inputD_3*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }
    return returnData
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
        label: '업체명',
        type: 'input',
        key: 'body.companyName',
        value: '',
      });
      filterSettings.push({
        label: '위임받는 자',
        type: 'input',
        key: 'body.inputC_3',
        value: '',
      });
      filterSettings.push({
        label: '위임하는 자',
        type: 'input',
        key: 'body.inputD_3',
        value: '',
      });
      filterSettings.push({
        label: '작성자',
        type: 'input',
        key: 'body.stdInfo.writer_name',
        value: '',
      });
    }

    return [...filterSettings];
  },
}
