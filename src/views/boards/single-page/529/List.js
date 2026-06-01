const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: '현장명' }, { name: '장비명' }, { name: '위험요인' }, { name: '소속명' }, { name: '부서명' }, { name: '작성자' }]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0: return func.getContent(value).stdInfo.field_name // 현장명
      case 1: return func.getContent(value).equipment // 장비명
      case 2: return func.getContentStringList(func.getContent(value).risk)// 위험요인
      case 3: return func.getContent(value).stdInfo.department // 소속명
      case 4: return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name // 부서명
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
    return { searchType: nav.value.searchType, searchKeyword: nav.value.searchKeyword }
  },
  getSearchKeyword: (nav) => {
    const returnData = []

    switch (nav.value.searchType) {
    case '현장명': returnData.push('content$body.stdInfo.field_name*%[:default_skw]%'); break
    case '장비명': returnData.push('content$body.equipment*%[:default_skw]%'); break
    case '위험요인': returnData.push('content$body.risk*%[:default_skw]%'); break
    case '소속명': returnData.push('content$body.stdInfo.department*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.com_name*%[:default_skw]%'); break
    case '작성자': return ['content$body.stdInfo.writer_name*%[:default_skw]%']
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
        label: '장비명',
        type: 'input',
        key: 'body.equipment',
        value: '',
      });
      filterSettings.push({
        label: '위험요인',
        type: 'input',
        key: 'body.risk',
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
