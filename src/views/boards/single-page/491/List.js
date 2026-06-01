const filterSettings = [];
export default {
  getHead: () => {
    return [{ name: '현장명' }, { name: '안전관리자' }, { name: '보건관리자' }, { name: '산업보건의' }, { name: '부서명' }, { name: '작성자' }]
  },
  getCol: (index, value, func) => {
    try {
      const getManagerNames = (value, type) => {
        const list = func.getContent(value).targetList || [];
        const 안전관리자항목 = list.filter(item => item.label === type);
        const 안전관리자들 = 안전관리자항목.flatMap(item => (item.data || []).map(항목 => 항목.name));
        return 안전관리자들.join(', ') || '-'; // 안전관리자
      };

      switch (index) {
      case 0:
        return func.getContent(value).stdInfo.field_name; // 사업장명
      case 1:  // 안전관리자
        return getManagerNames(value, '안전관리자') // 안전관리자
      case 2: return getManagerNames(value, '보건관리자') // 보건관리자
      case 3: return getManagerNames(value, '산업보건의') // 산업보건의
      case 4: return func.getContent(value).stdInfo.section || '-' // 부서명
      case 5: return func.getContent(value).stdInfo.writer_name || '-' // 작성자
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
    case "안전관리자": returnData.push('content$body.admin1*%[:default_skw]%'); break
    case "보건관리자": returnData.push('content$body.admin2*%[:default_skw]%'); break
    case "산업보건의": returnData.push('content$body.admin3*%[:default_skw]%'); break
    case '부서명': returnData.push('content$body.stdInfo.section*%[:default_skw]%'); break
    case '작성자': returnData.push('content$body.stdInfo.writer_name*%[:default_skw]%'); break
    }

    return returnData
  }, /**
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
        label: '안전관리자',
        type: 'input',
        key: 'body.admin1',
        value: '',
      });
      filterSettings.push({
        label: '보건관리자',
        type: 'input',
        key: 'body.admin2',
        value: '',
      });
      filterSettings.push({
        label: '산업보건의',
        type: 'input',
        key: 'body.admin3',
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
      // filterSettings.push({
      //   label: '작성일',
      //   type: 'date-range',
      //   key: 'created_at',
      //   value: {sDate: '', eDate: ''},
      // })
    }

    return [...filterSettings];
  },
}
