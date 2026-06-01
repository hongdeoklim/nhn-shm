export default {
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '시설물번호', key: 'meta.facilityNumber'},
      {name: '시설물명', key: 'field_name'},
      {name: '관리주체', key: 'meta.management_entity'},
      {name: '준공일', key: 'be_completed_at'},
      {name: '총공사비', key: 'deposit_amount'},
      {name: '주소', key: 'address'},
    ]
  },
  getCol: (index, row, func) => {
    try {
      switch (index) {
      // No.
      case 0: return func.no
      case 1: return func.meta.facilityNumber
      case 2: return row.field_name
      case 3: return func.meta.management_entity ? func.meta.management_entity : "-"
      case 4: return row.be_completed_at ? func.date(row.be_completed_at) : "-"
      case 5: return row.deposit_amount ? `${row.deposit_amount  }백만원` : "-"
      case 6: return row.address ? row.address : "-"
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
}
