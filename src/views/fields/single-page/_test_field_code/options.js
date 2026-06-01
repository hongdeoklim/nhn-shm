export default {
  useDocumentCount: (field, tab) => {
    // default : false
    // "표시된 문서" 를 사용할지 여부를 반환한다.
    return false;
  },
  useNewButton: (field, tab) => {
    // default : true
    // 새로만들기 버튼을 사용할지 여부를 반환한다.
    return true;
  },
  useListExcelDownload: (field, tab) => {
    // default : true
    // 목록 엑셀 다운로드 버튼을 사용할지 여부를 반환한다.
    return true;
  },
  loadCompanyList() {
    // func.getCompanyName 을 사용하기 위해서는 true 를 반환해야 한다.
    // true 반환시 FieldsList.vue 의 loadCompanyList() 를 호출하게 된다.
    // false 반환시 현재 .js 파일에서 loadCompanyList() 작성하지 않아도 된다.
    return false
  },
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: 'Head1', key: 'sort.key1'},
      {name: 'Head2', key: ''},
      {name: 'Head3', key: ''},
      {name: 'Head4', key: ''},
      {name: 'Head5', key: ''},
    ]
  } ,
  getCol: (index, row, func) => {
    try {
      switch (index) {
        // No.
        case 0: return func.no
        case 1: return 'Column1'
        case 2: return 'Column2'
        case 3: return 'Column3'
        case 4: return 'Column4'
        case 5: return {
          style: {textAlign: 'center', color:'red' },
          value: "Column5"
        }
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
  // Search 를 커스텀하게 구현하고 싶을 때 사용한다.
  // Search.vue 의 this.$emit("search", searchData) 를 호출하면
  // 아래의 loadFieldList() 가 호출된다.
  // 그리고 return 값을 api 의 params 로 사용한다.
  loadFieldList (searchData) {
    const params = {}
    params.keyword = searchData.keyword
    return params
  },
}
