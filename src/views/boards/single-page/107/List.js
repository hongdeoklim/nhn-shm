
import { disasters } from "@/util/DisasterDataUtil.js";
import diffData from "@/views/boards/single-page/107/DiffData";

const filterSettings = [];

export default {
  getHead: () => {
    return [{ name: "현장명" }, { name: "구분" }, { name: "교육일" }, { name: "재해형태" }, { name: "교육 실시 인원" }];
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
      case 0:
        return func.getContent(value).stdInfo.field_name; // 현장명
      case 1:
        return func.getContent(value).inputA_1.value; // 교육구분
      case 2:
        return func.getContent(value).inputA_4; // 교육일
      case 3:
        return func.getContent(value).inputA_8.join(", "); // 재해형태
      case 4:
        return func.comma(func.getContent(value).교육인원[1].sum); // 교육실시인원
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
    return { disasterType: nav.value.disasterType, searchType: nav.value.searchType, searchKeyword: nav.value.searchKeyword };
  },
  getSearchKeyword: (nav) => {
    const returnData = [];

    if (nav.value.disasterType) returnData.push("content$body.disasters*%[:default_disaster]%");

    switch (nav.value.searchType) {
    case "현장명":
      returnData.push("content$body.stdInfo.field_name*%[:default_skw]%");
      break;
    case "구분":
      returnData.push("content$body.inputA_1.value*%[:default_skw]%");
      break;
    case "교육일":
      returnData.push("content$body.inputA_4*%[:default_skw]%");
      break;
    case "교육 실시 인원":
      returnData.push("content$body.inputA_13*%[:default_skw]%");
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
        label: '재해형태',
        type: 'select',
        key: 'body.disasters',
        options: disasters,
        value: '',
      });
      filterSettings.push({
        label: '현장명',
        type: 'input',
        key: 'body.stdInfo.field_name',
        value: '',
      });
      filterSettings.push({
        label: '구분',
        type: 'select',
        key: 'body.inputA_1.value',
        options: diffData.map(data => data.value),
        value: '',
      });
      filterSettings.push({
        label: '교육일',
        type: 'date-range',
        key: 'body.inputA_4',
        value: {sDate: '', eDate: ''},
      });
      filterSettings.push({
        label: '교육 실시 인원',
        type: 'input',
        key: 'body.inputA_13',
        value: '',
      });
      filterSettings.push({
        label: '작성일',
        type: 'date-range',
        key: 'created_at',
        value: {sDate: '', eDate: ''},
      })
    }

    return [...filterSettings];
  },
};
