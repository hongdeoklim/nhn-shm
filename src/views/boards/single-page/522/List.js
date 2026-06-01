const filterSettings = [];

export default {
  components() {
    return [
      {
        'component': 'search-column-keyword',
        "label": '검색조건',
        "value": 'column',
        "query": {'ck_t': 'head', 'ck_k': 'keyword'},
        "options": {hiddenList: ['Head 3']}
      },
    ]
  },
  getConditions: (nav) => {
    const conditions = [];
    const search = nav.value;

    //  검색조건
    const types = {
      '현장명': 'body.stdInfo.field_name',
      '공종명': 'body.selectRiskType[%]',
      '평가일': 'body.inputB_4',
      '소속명': 'body.stdInfo.department',
      '부서명': 'body.stdInfo.com_name',
      '작성자': 'body.stdInfo.writer_name',
    }

    if (search.column && search.column.keyword) {
      conditions.push({key: types[search.column.head], operator: 'LIKE', value: `%${search.column.keyword}%`})
    }
    return conditions;
  },

  getHead: () => {
    return [{ name: "현장명" }, { name: "공종명" }, { name: "평가일" }, { name: "소속명" }, { name: "부서명" }, { name: "작성자" }];
  },
  getCol: (index, value, func) => {
    // func.getContentRiskList(func.getContent(value).riskAppraisalList)// 재해형태
    try {
      switch (index) {
      case 0:
        return func.getContent(value).stdInfo.field_name; // 현장명
      case 1:
        return func.getContent(value).selectRiskType.toString(); // 공종명
      case 2:
        return func.getContent(value).inputB_4; // 평가일
      case 3:
        return func.getContent(value).stdInfo.department; // 소속명
      case 4:
        return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name; // 부서명
      case 5:
        return func.getContent(value).stdInfo.writer_name; // 작성자
      }
    } catch (e) {
      /*ignore*/
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
        label: '공종명',
        type: 'input',
        key: 'body.selectRiskType',
        value: '',
      });
      filterSettings.push({
        label: '평가일',
        type: 'date-range',
        key: 'body.inputB_4',
        value: { sDate: '', eDate: '' },
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
};
