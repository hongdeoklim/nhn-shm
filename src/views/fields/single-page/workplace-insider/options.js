export default {
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '현업부서명', key: 'field_name'},
      {name: '담당주무관', key: 'manager_name'},
      {name: '현업부서주소', key: 'address'},
    ]
  } ,

  getCol: (index, row, func) => {
    try {
      switch (index) {
        case 0: return func.no
        case 1: return row.field_name || "-"
        case 2: return row.manager_name || row.director_name || "-"
        case 3: return row.address
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
}
