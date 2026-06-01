const filterSettings = [];

export default {
  getHead: () => {
    return [{name: '현장명'}, {name: '성명'}, {name: '성별'}, {name: '발생날짜'}, {name: '재해형태'}, {name: '작성자'}]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.onNameBlur(func.getContent(value).inputC_1) // 성명
      case 2: return func.getContent(value).inputC_3 // 성별
      case 3: return func.getContent(value).inputD_1 // 발생날짜
      case 4: return func.getContent(value).inputD_5// 재해형태
      case 5: return func.getContent(value).stdInfo.writer_name // 작성자
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
    if (nav.value.disasterType) returnData.push('content$body.inputD_5*%[:default_disaster]%')

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '성명': returnData.push('content$body.inputC_1*%[:default_skw]%'); break
    case '성별': returnData.push('content$body.inputC_3*%[:default_skw]%'); break
    case '발생날짜': returnData.push('content$body.inputD_1*%[:default_skw]%'); break
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
        label: '성명',
        type: 'input',
        key: 'body.inputC_1',
        value: '',
      });
      filterSettings.push({
        label: '성별',
        type: 'input',
        key: 'body.inputC_3',
        value: '',
      });
      filterSettings.push({
        label: '발생날짜',
        type: 'date-range',
        key: 'body.inputD_1',
        value: {sDate: '', eDate: ''},
      });
      filterSettings.push({
        label: '재해형태',
        type: 'input',
        key: 'body.inputD_5',
        value: '',
      });
      filterSettings.push({
        label: '작성자',
        type: 'input',
        key: 'body.stdInfo.writer_name',
        value: '',
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
