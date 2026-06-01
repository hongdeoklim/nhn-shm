export default {
  useNewButton: (field, tab) => {
    if (`${field.projectId}` === '1') {
      return false;
    }
    return true;
  },
  getPerPage: (tab) => {
    return 9
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '현장명', key: 'field_name', style:{width:'300px'}},
      {name: '주소', key: 'address', style:{width:'300px'}},
      {name: '사업기간', style:{width:'300px'}},
      {name: '사업금액', key: 'deposit_amount', style:{width:'300px'}},
    ]
  },
  getCol: (index, row, func) => {
    try {
      switch (index) {
      case 0: return func.no
      case 1: return row.field_name
      case 2: return row.address
      case 3: {
        const work_begin_at = row.start_work_at
        const work_end_at = row.be_completed_at
        let date = ''
        if (work_begin_at) date += func.date(work_begin_at)

        if (!!work_begin_at || !!work_end_at) date += "~"
        else date += "-"

        if (work_end_at) date += func.date(work_end_at)
        return date
      }

      // 사업금액(원)
      case 4: {
        return row.deposit_amount ? new Intl.NumberFormat().format(parseInt(row.deposit_amount.replace(/,/g, ""))) : "-"
      }
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
}
