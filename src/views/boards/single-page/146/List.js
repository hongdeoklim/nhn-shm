const filterSettings = [];

export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '발주자'}, {name: '설계자'}, {name: '시공자'}, {name: '감리'}, {name: '부서명'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).inputA_2 // 발주자
      case 2: return func.getContent(value).inputB_2 // 설계자
      case 3: return func.getContent(value).inputC_2 // 시공자
      case 4: return func.getContent(value).inputD_2 // 감리
      case 5: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 작성부서
      case 6: return func.getContent(value).stdInfo.writer_name // 작성자
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
    case '현장명': returnData.push('content$body.businessInfo.field_name*%[:default_skw]%'); break
    case '발주자': returnData.push('content$body.inputA_2*%[:default_skw]%'); break
    case '설계자': returnData.push('content$body.inputB_2*%[:default_skw]%'); break
    case '시공자': returnData.push('content$body.inputC_2*%[:default_skw]%'); break
    case '감리': returnData.push('content$body.inputD_2*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
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
        label: '발주자',
        type: 'input',
        key: 'body.inputA_2',
        value: '',
      });
      filterSettings.push({
        label: '설계자',
        type: 'input',
        key: 'body.inputB_2',
        value: '',
      });
      filterSettings.push({
        label: '시공자',
        type: 'input',
        key: 'body.inputC_2',
        value: '',
      });
      filterSettings.push({
        label: '감리',
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
      filterSettings.push({
        label: '계획일',
        type: 'date-range',
        key: 'body.stdInfo.date',
        value: {sDate: '', eDate: ''},
      })
    }

    return [...filterSettings];
  },
}
