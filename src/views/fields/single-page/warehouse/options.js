export default {
  getPerPage: (tab) => {
    return 15
  },
  getHead: () => {
    return [
      {name: 'No.', style:{minWidth:'100px', width:'100px'}},
      {name: '반', key: 'meta.ban'},
      {name: '창고명', key: 'field_name'},
      {name: '위치(주소)', key: 'address'},
      {name: '구분', key: 'meta.type'},
      {name: '비고', key: 'meta.note'},
      {name: '담당소장', key: 'director_name'},
      {name: 'MSDS 대상물질', key: 'meta.msds'},
      {name: '위험기계 기구 총 현황'}
    ]
  } ,
  getCol: (index, row, func) => {
    try {
      switch (index) {
        // No.
        case 0: return func.no
        case 1: return func.meta.ban
        case 2: return row.field_name
        case 3: return row.address
        case 4: return func.meta.type
        case 5: return func.meta.note
        case 6: return row.director_name
        case 7: return func.meta.msds
        case 8: return func.comma(func.totalNumDevices(func.meta.devices))
      }
    } catch (e) { /*ignore*/ }
    return ''
  },
}
