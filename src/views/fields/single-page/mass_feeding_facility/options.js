export default {
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '사업장명', key: 'field_name'},
      {name: '담당 주무관', key: 'manager_name'},
      {name: '사업기간'},,
      {name: '사업금액', key: 'deposit_amount'},
      {name: '시설물 주소', key: 'address'},
    ]
  },
  getCol: (index, row, func) => {
    try {
      switch (index) {
      // No.
      case 0: return func.no
      case 1: return row.field_name || "-"
      case 2: return row.manager_name || "-"
      case 3: return row.work_begin_at || row.work_end_at ? (row.work_begin_at ? func.date(row.work_begin_at) : '') + ' ~ ' + (row.work_end_at ? func.date(row.work_end_at): '') : '-'
      case 4: return row.deposit_amount ? func.comma(row.deposit_amount) : "-"
      case 5: return row.address || "-"
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
}
