/**
 * ========== options ==========
 * field_name: 필드명 ( 사용하는 곳은 없으나, 개발자가 구분하기 위해 작성한다 )
 * field_code: 필드 코드 ( ** 매우 중요, field 등록시 사용되는 code 값  )
 * label: 탭 이름 ( 실제표기는 `${label} 등록`, `${label} 현황` 로 사용된다.)
 * useInfo: 두번째 현황 탭을 사용할지 여부 ( true: 사용, false: 사용안함 )
 *   - useInfo 를 사용하기 위해서는 field_code 와 동일한 이름의 폴더를 생성하고, 그 안에 Info.vue 를 생성해야 한다.
 * useExcelUpload: 엑셀 업로드 탭을 사용할지 여부 ( true: 사용, false: 사용안함 )
 *   - useExcelUpload 를 사용하기 위해서는 field_code 와 동일한 이름의 폴더를 생성하고, 그 안에 ExcelUpload.vue 를 생성해야 한다.
 * showOneTab: 탭을 하나만 사용할 때 탭을 노출할지 여부, useInfo 와 관련이 있다. ( true: 사용, false: 사용안함 )
 * =============================
 */
export default {
  '_test_field_code': {
    field_name: "직영사업장", field_code: '_test_field_code',
    label: '사업장', useInfo: true, showOneTab: false,
  },
  'workplace-insider': {
    field_name: "부서", field_code: 'workplace-insider',
    label: '부서', useInfo: true, showOneTab: false,
  },

  'workplace-subcontract': {
    field_name: "도급·용역·위탁 사업", field_code: 'workplace-subcontract',
    label: '사업', useInfo: true, showOneTab: false,
  },

  'workplace-ordering': {
    field_name: "현장 현황", field_code: 'workplace-ordering',
    label: '사업장', useInfo: false, showOneTab: false,
  },

  'facility': {
    field_name: "시설물", field_code: 'facility',
    label: '시설물', useInfo: true, showOneTab: false,
  },

  'warehouse': {
    field_name: "창고", field_code: 'warehouse',
    label: '창고', useInfo: true, showOneTab: false,
  },

  'bridge': {
    field_name: "교량", field_code: 'bridge',
    label: '교량', useInfo: false, useExcelUpload: true, showOneTab: false,
  },

  'retaining-wall': {
    field_name: "옹벽 및 절토사면", field_code: 'retaining-wall',
    label: '옹벽 및 절토사면', useInfo: false, useExcelUpload: true, showOneTab: false,
  },

  'dike': {
    field_name: "제방", field_code: 'dike',
    label: '제방', useInfo: false, showOneTab: false,
  },

  'government-building': {
    field_name: "청사", field_code: 'government-building',
    label: '청사', useInfo: false, showOneTab: false,
  },

  'complex-facility': {
    field_name: "복합시설", field_code: 'complex-facility',
    label: '복합시설', useInfo: false, showOneTab: false,
  },

  'library': {
    field_name: "도서관", field_code: 'library',
    label: '도서관', useInfo: false, showOneTab: false,
  },

  'museum': {
    field_name: "박물관 및 미술관", field_code: 'museum',
    label: '박물관 및 미술관', useInfo: false, showOneTab: false,
  },

  'medical': {
    field_name: "의료기관", field_code: 'medical',
    label: '의료기관', useInfo: false, showOneTab: false,
  },

  'daycare': {
    field_name: "어린이집", field_code: 'daycare',
    label: '어린이집', useInfo: false, showOneTab: false,
  },

  'office': {
    field_name: "업무시설", field_code: 'office',
    label: '업무시설', useInfo: false, showOneTab: false,
  },

  'indoor-auditorium': {
    field_name: "실내공연장", field_code: 'indoor-auditorium',
    label: '실내공연장', useInfo: false, showOneTab: false,
  },

  'mixed-use-building': {
    field_name: "둘이상용도건축물", field_code: 'mixed-use-building',
    label: '둘이상용도건축물', useInfo: false, showOneTab: false,
  },

  'building': {
    field_name: "건축물", field_code: 'building',
    label: '건축물', useInfo: false, showOneTab: false,
  },

  'port': {
    field_name: "항만", field_code: 'port',
    label: '항만', useInfo: false, useExcelUpload: true, showOneTab: false,
  },

  'tunnel': {
    field_name: "터널", field_code: 'tunnel',
    label: '터널', useInfo: false, useExcelUpload: true, showOneTab: false,
  },

  'mass_feeding_facility': {
    field_name: "집단급식소", field_code: 'mass_feeding_facility',
    label: '집단급식소', useInfo: true, showOneTab: false,
  }
}
