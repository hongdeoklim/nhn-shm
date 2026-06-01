export default {
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '사업장명', key: 'field_name'},
      {name: '담당주무관', key: 'manager_name'},
      {name: '사업기간'},
      {name: '사업금액(원)', key: 'deposit_amount'},
      {name: '사업장주소', key: 'address'},
    ]
  } ,
  getCol: (index, row, func) => {
    try {
      switch (index) {
        case 0: return func.no

        // 사업장명
        case 1: return row.field_name

        // 담당주무관
        case 2: return row.manager_name

        // 사업기간
        case 3: {
          const work_begin_at = row.work_begin_at
          const work_end_at = row.work_end_at
          let date = ''
          if (work_begin_at) date += func.date(work_begin_at)

          if (!!work_begin_at || !!work_end_at) date += "~"
          else date += "-"

          if (work_end_at) date += func.date(work_end_at)
          return date
        }

        // 사업금액(원)
        case 4: return {
          style: {textAlign: 'center'}, // textAlign 은 디폴트가 center 이므로 생략 가능
          value: !!row.deposit_amount ? func.comma(row.deposit_amount) : "-"
        }

        // 사업장주소
        case 5: return row.address
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
  loadFieldList (searchData) {
    const params = {}
    // 연도 검색
    if (searchData.targetYear) {
      params.work_begin_before = `${searchData.targetYear}-01-31`;
      params.work_end_after = `${searchData.targetYear}-12-01`;
    }

    // 키워드
    params.keyword = searchData.keyword
    return params
  },
}
