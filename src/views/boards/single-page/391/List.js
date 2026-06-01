const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: "현장명" }, { name: "회차" }, { name: "점검일" }, { name: "재해형태" }, { name: "소속명" }, { name: "부서명" }, { name: "작성자" }];
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0:
        return func.getContent(value).stdInfo.field_name; // 현장명
      case 1:
        return func.getContent(value).inputB_7; // 회차
      case 2:
        return func.getContent(value).inputB_1; // 점검일
      case 3:
        return func.getContent(value).inputB_3.join(", "); // 재해형태
      case 4:
        return func.getContent(value).stdInfo.department; // 소속명
      case 5:
        return func.getContent(value).stdInfo.section ? func.getContent(value).stdInfo.section : func.getContent(value).stdInfo.com_name; // 부서명
      case 6:
        return func.getContent(value).stdInfo.writer_name; // 작성자
      }
    } catch (e) {
      /*ignore*/
    }
    return "";
  },
  getSearchKeyValue: (nav) => {
    if (nav.value.created_at) {
      nav.dateTarget = "content$body.inputB_1";
      nav.dateBegin = "nav.value.created_at.sDate";
      nav.dateEnd = "nav.value.created_at.eDate";
    }
    return {
      disasterType: nav.value.disasterType,
      searchType: nav.value.searchType,
      searchKeyword: nav.value.searchKeyword,
    };
  },
  getSearchKeyword: (nav) => {
    const returnData = [];

    if (nav.value.disasterType) returnData.push("content$body.inputB_3*%[:default_disaster]%");

    switch (nav.value.searchType) {
    case "현장명":
      returnData.push("content$body.stdInfo.field_name*%[:default_skw]%");
      break;
    case "회차":
      returnData.push("content$body.inputB_7*%[:default_skw]%");
      break;
    case "소속명":
      returnData.push("content$body.stdInfo.department*%[:default_skw]%");
      break;
    case "부서명":
      returnData.push("content$body.stdInfo.section*%[:default_skw]%");
      break;
    case "작성자":
      returnData.push("content$body.stdInfo.writer_name*%[:default_skw]%");
      break;
    }

    return returnData;
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
        label: '회차',
        type: 'number',
        key: 'body.inputB_7',
        value: { number: '', operator: '' },
      });
      filterSettings.push({
        label: '점검일',
        type: 'date-range',
        key: 'body.inputB_1',
        value: { sDate: '', eDate: '' },
      });
      filterSettings.push({
        label: '재해형태',
        type: 'input',
        key: 'body.inputB_3[%]',
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
};
