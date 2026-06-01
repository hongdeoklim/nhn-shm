import moment from "moment";
const list =  {
  components() {
    return [
      {
        'component': 'search-year', label: '대상년도', value: 'year', query: {'y': 'year'},
        options: {
          default: '',
          useAll: true,
        }
      },
      {
        'component': 'search-month', label: '월', value: 'month', query: {'y_m': 'month'},
        options: {
          default: '',
          lastLabel: true,
          useAll: true,
        }
      },
      {
        'component': 'search-column-keyword',
        label: '검색조건',
        value: 'column',
        query: {'ck_t': 'head', 'ck_k': 'keyword'},
        options: {hiddenList: ['대상년도', '재해형태', '작성일']}
      },

      {'component': 'search-disaster-types', label: '재해형태', value: 'disaster', query: {'dty': 'disaster'}, options: {}},
    ]
  },
  getConditions: (nav) => {
    const conditions = [];
    const search = nav.value;

    // 검색연도
    if (search.year) {
      conditions.push({key: 'body.year', operator: '=', value: search.year})
    }

    //  재해형태
    if (search.disaster) {
      conditions.push({key: 'body.riskList[%].input4[%]', operator: 'LIKE', value: `%${search.disaster}%`})
    }

    //  검색조건
    const heads = list.getHead().map(e => {return {[e.name] : e.key}});
    // 배열의 객체들을 하나의 객체로 합치기
    const types = Object.assign({}, ...heads);
    if (search.column && search.column.keyword) {
      conditions.push({key: types[search.column.head], operator: 'LIKE', value: `%${search.column.keyword}%`})
    }
    return conditions;
  },
  getHead: () => {
    return [
      { name: "대상년도", key: "body.year" },
      { name: "현장명", key: "body.stdInfo.field_name" },
      { name: "업체명", key: "body.업체명" },
      { name: "재해형태", key: "body.riskDisaster" },
      { name: "소속명", key: "body.stdInfo.department" },
      { name: "부서명", key: "body.stdInfo.section" },
      { name: "작성자", key: "body.stdInfo.writer_name" },
      { name: "작성일", key: "created_at" }
    ]
  },
  getCol: (index, value, func) => {
    try {
      switch (index) {
        case 0:
          return func.getHeader(value).year // 대상년도
        case 1:
          return func.getContent(value).stdInfo.field_name; // 현장명
        case 2:
          return func.getContent(value).업체명; // 업체명
        case 3:
          return func.getContent(value).riskDisaster; // 재해형태
        case 4:
          return func.getContent(value).stdInfo.department; // 소속명
        case 5:
          return func.getContent(value).stdInfo.section; // 부서명
        case 6:
          return func.getContent(value).stdInfo.writer_name; // 작성자
        case 7:
          return func.getCreatedDate(value.created_at) // 작성일
      }
    } catch (e) {
      /*ignore*/
    }
    return "";
  },
  getSearchKeyValue: (nav) => {},
  getSearchKeyword: (nav) => {},
};
export default list;
