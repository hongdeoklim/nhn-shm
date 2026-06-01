export default {
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '분야명', key: 'project.field_name'},
      {name: '사업장(시설물)명', key: 'field_name'},
      {name: '구분', key: 'facility_category.cat1'},
      {name: '시설물 위치(상세주소)', key: 'address'},
      {name: '규모 1', key: 'scale1'},
      {name: '준공일', key: 'be_completed_at'},
      {name: '사업금액(원)', key: 'deposit_amount'},
    ]
  } ,
  getCol: (index, row, func) => {
    try {
      switch (index) {
        // No.
        case 0: return func.no
        case 1: return row.project.field_name
        case 2: return row.field_name
        case 3: return !!row.facility_category ? row.facility_category.cat1 : "-"
        case 4: return !!row.address ? row.address : "-"
        case 5: return !!row.scale1 ? row.scale1 : "-"
        case 6: return !!row.be_completed_at ? func.date(row.be_completed_at) : "-"
        case 7: return !!row.deposit_amount ? func.comma(row.deposit_amount) : "-"
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
}
