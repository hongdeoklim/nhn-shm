const filterSettings = [];

export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '인원투입 현황'}, {name: '주요장비 반입현황'}, {name: '점검일'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.comma(func.getContent(value).budgetDay1Total) // 인원투입현황(원도급)
      case 2: return func.comma(func.getContent(value).budgetDay2Total) // 주요장비 반입현황(원도급)
      case 3: return new Date(func.getContent(value).headerDate).format('yyyy년 MM월 dd일') // 점검일
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
    case '인원투입 현황': returnData.push('content$body.budgetDay1Total*%[:default_skw]%'); break
    case '주요장비 반입현황': returnData.push('content$body.budgetDay2Total*%[:default_skw]%'); break
    case '점검일': returnData.push('content$body.headerDate*%[:default_skw]%'); break
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
        label: '인원투입 현황',
        type: 'number',
        key: 'body.budgetDay1Total',
        value: {number: '', operator: ''},
      });
      filterSettings.push({
        label: '주요장비 반입현황',
        type: 'number',
        key: 'body.budgetDay2Total',
        value: {number: '', operator: ''},
      });
      filterSettings.push({
        label: '점검일',
        type: 'date-range',
        key: 'body.headerDate',
        value: {sDate: '', eDate: ''},
      });

      /**
       * 예시
       * filterSettings.push({
       *         label: '작성자',
       *         type: 'input',
       *         key: 'body.stdInfo.writer_name',
       *         value: '',
       *       });
       * filterSettings.push({
       *         label: '노측 위원(명)',
       *         type: 'number',
       *         key: 'body.inputA_4',
       *         value: {number: '', operator: ''},
       *       });
       * filterSettings.push({
       *         label: '작업일자',
       *         type: 'date-range',
       *         key: 'body.inputB_1',
       *         value: { sDate: '', eDate: '' },
       *       });
       * filterSettings.push({
       *         label: '재해형태',
       *         type: 'select',
       *         key: 'body.disasters',
       *         options: disasters,
       *         value: '',
       *       });
       * filterSettings.push({
       *         label: '재해형태',
       *         type: 'input',
       *         key: 'body.stdInfo.재해형태[%]',
       *         value: '',
       *       });
       */
    }
    return [...filterSettings];
  },
}
