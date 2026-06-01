const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: "현장명" }, { name: "작업구분" }, { name: "작업일자" }, { name: "소속명" }, { name: "작성자" }];
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0:
        return func.getContent(value).stdInfo.field_name; // 현장명
      case 1:
        return func.getContent(value).inspectChecked; // 작업구분
      case 2:
        return typeof func.getContent(value).inputB_1 === "string"
          ? ""
          : `${func.getContent(value).inputB_1.sDate} ${!!func.getContent(value).inputB_1.sDate || !!func.getContent(value).inputB_1.eDate ? "~" : ""} ${func.getContent(value).inputB_1.eDate}`; // 작업일자
      case 3:
        return func.getContent(value).stdInfo.department; // 소속명
      case 4:
        return func.getContent(value).stdInfo.writer_name; // 작성자
      }
    } catch (e) {
      /*ignore*/
    }
    return "";
  },
  getSearchKeyValue: (nav) => {
    if (nav.value.created_at) {
      nav.dateTarget = "created_at";
      nav.dateBegin = "nav.value.created_at.sDate";
      nav.dateEnd = "nav.value.created_at.eDate";
    }
    return { searchType: nav.value.searchType, searchKeyword: nav.value.searchKeyword };
  },
  getSearchKeyword: (nav) => {
    switch (nav.value.searchType) {
    case "현장명":
      return ["content$body.stdInfo.field_name*%[:default_skw]%"];
    case "작업구분":
      return ["content$body.typeTitleList*%[:default_skw]%"];
    case "작업일자":
      return ["content$body.inputB_1*%[:default_skw]%"];
    case "소속명":
      return ["content$body.stdInfo.department*%[:default_skw]%"];
    case "작성자":
      return ["content$body.stdInfo.writer_name*%[:default_skw]%"];
    }
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
        label: '작업구분',
        type: 'input',
        key: 'body.typeTitleList',
        value: '',
      });
      filterSettings.push({
        label: '작업시작일자',
        type: 'date-range',
        key: 'body.inputB_1.sDate',
        value: { sDate: '', eDate: '' },
      });
      filterSettings.push({
        label: '작업종료일자',
        type: 'date-range',
        key: 'body.inputB_1.eDate',
        value: { sDate: '', eDate: '' },
      });
      filterSettings.push({
        label: '소속명',
        type: 'input',
        key: 'body.stdInfo.department',
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
       *  filterSettings.push({
       *         label: '재해형태',
       *         type: 'select',
       *         key: 'body.disasters',
       *         options: disasters,
       *         value: '',
       *       });
       */
    }
    return [...filterSettings];
  },
};
