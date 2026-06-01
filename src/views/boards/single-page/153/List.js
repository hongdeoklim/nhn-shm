const filterSettings = [];

export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '협의일'}, {name: '노측 위원(명)'}, {name: '사측 위원(명)'}, {name: '소속명'}, {name: '부서명'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inputA_2 // 협의일
      case 2: return func.getContent(value).inputA_4 // 노측위원(명)
      case 3: return func.getContent(value).inputA_5 // 사측위원(명)
      case 4: return func.getContent(value).stdInfo.department // 소속명
      case 5: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
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

    if (nav.value.disasterType) returnData.push('content$body.inputB_3*%[:default_disaster]%')

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.fieldTitle*%[:default_skw]%'); break
    case '협의일': returnData.push('content$body.inputA_2*%[:default_skw]%'); break
    case '노측 위원(명)': returnData.push('content$body.inputA_4*%[:default_skw]%'); break
    case '사측 위원(명)': returnData.push('content$body.inputA_5*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
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
        label: '협의일',
        type: 'date-range',
        key: 'body.inputA_2',
        value: {sDate: '', eDate: ''},
      });
      filterSettings.push({
        label: '노측위원(명)',
        type: 'number',
        key: 'body.inputA_4',
        value: '',
      });
      filterSettings.push({
        label: '사측위원(명)',
        type: 'number',
        key: 'body.inputA_5',
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
