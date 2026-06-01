const filterSettings = [];

const list = {
  // =================================================================================================================
  components() {
    return [
      {
        'component': 'search-start-end',
        "label": 'TBM 실시일',
        "value": 'date',
        "query": {'ss': 'startDate', 'ee': 'endDate'},
        "options": {
          default: {sd: '', ed: ''},
        }
      },
      {
        'component': 'search-column-keyword',
        "label": '검색조건',
        "value": 'column',
        "query": {'ck_t': 'head', 'ck_k': 'keyword'},
        "options": {hiddenList: ['TBM 실시일']}
      },
    ]
  },
  getConditions: (nav) => {
    const conditions = [];
    const search = nav.value;

    //  검색일
    if (search.date) {
      conditions.push({key: 'body.inputB_1', operator: '>=', value: search.date.startDate})
      conditions.push({key: 'body.inputB_1', operator: '<', value: search.date.endDate ? new Date(search.date.endDate).addDays(1).format("yyyy-MM-dd") : ''})
    }

    //  검색조건
    const heads = list.getHead().map(e => { return {[e.name] : e.key} });
    // 배열의 객체들을 하나의 객체로 합치기
    const types = Object.assign({}, ...heads);
    if (search.column && search.column.keyword) {
      conditions.push({key: types[search.column.head], operator: 'LIKE', value: `%${search.column.keyword}%`})
    }
    return conditions;
  },


  // =================================================================================================================
  getHead: () => {
    return [
      {
        "name": "현장명",
        "key": "body.stdInfo.field_name"
      },
      {
        "name": "소속명",
        "key": "body.stdInfo.department"
      },
      {
        "name": "부서명",
        "key": "body.stdInfo.section"
      },
      {
        "name": "TBM 실시일",
        "key": "body.inputB_1"
      },
      {
        "name": "작성자",
        "key": "body.stdInfo.writer_name"
      }
    ]
  },
  getCol: (index, value, func) => {
    switch (index) {
    case 0:
      return func.getContent(value).stdInfo.field_name; // 사업장명
    case 1:
      return func.getContent(value).stdInfo.department; // 소속명
    case 2:
      return func.getContent(value).stdInfo.section; // 부서명
    case 3:
      return func.getContent(value).inputB_1; // TBM 실시일
    case 4:
      return func.getContent(value).stdInfo.writer_name; // 작성자
    }
    return "";
  },
  getSearchKeyValue: (nav) => {},
  getSearchKeyword: (nav) => {},
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
        label: 'TBM 실시일',
        type: 'date-range',
        key: 'body.inputB_1',
        value: { sDate: '', eDate: '' },
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
};
export default list;
