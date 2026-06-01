<template>
  <div>
    <p>■ 산업안전보건법 시행규칙 [별지 제30호서식]</p>
    <h1>산업재해조사표</h1>

    <!-- ========================================================================================================== -->
    <!-- ================================================= Ⅰ.현장 정보 ================================================ -->
    <!-- ========================================================================================================== -->
    <table class="print-container table-1">
      <colgroup>
        <col width="80" />
      </colgroup>
      <tr>
        <td rowspan="9" class="head">Ⅰ. 현장 정보</td>
        <td colspan="3" class="font-medium">①산재관리번호 (사업개시번호)</td>
        <td colspan="7" class="data">{{ form.inputB_2 }}</td>
        <td colspan="3" class="font-medium">사업자등록번호</td>
        <td colspan="11" class="data">{{ form.inputB_3 | comNumber }}</td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">②현장명</td>
        <td colspan="7" class="data">{{ form.inputB_1_1 }}</td>
        <td colspan="3" class="font-medium">③근로자 수</td>
        <td colspan="11" class="data">{{ form.inputB_4 | comma }}</td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">④업종</td>
        <td colspan="7" class="data">{{ form.inputB_5 }}</td>
        <td colspan="3" class="font-medium">소재지</td>
        <td colspan="11" class="data">{{ form.inputB_6 }}</td>
      </tr>
      <tr>
        <td rowspan="2" colspan="3" class="font-medium">⑤재해자가 사내 수급인 소속인 경우(건설업 제외)</td>
        <td colspan="3">원도급인 사업장명</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_1" ? form.list[0].value : "" }}</td>
        <td rowspan="2" colspan="3" class="font-medium">⑥재해자가 파견근로자인 경우</td>
        <td colspan="3">파견사업주 사업장명</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_2" ? form.list[0].value : "" }}</td>
      </tr>
      <tr>
        <td colspan="3">사업장 산재관리번호 (사업개시번호)</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_1" ? form.list[1].value : "" }}</td>
        <td colspan="3">사업장 산재관리번호 (사업개시번호)</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_2" ? form.list[1].value : "" }}</td>
      </tr>
      <tr>
        <td rowspan="4" colspan="2" class="font-medium">건설업만 작성</td>
        <td colspan="4">발주자</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_3" ? form.list[0].value : "" }}</td>
        <td colspan="12">
          <div class="flex items-center gap-5">
            <PrintCheckbox label="민간" :value="form.employmentType[0] === 'label_3' ? form.list[1].value === '민간' : false" color />
            <PrintCheckbox label="국가·지방자치단체" :value="form.employmentType[0] === 'label_3' ? form.list[1].value === '국가·지방자치단체' : false" color />
            <PrintCheckbox label="공공기관" :value="form.employmentType[0] === 'label_3' ? form.list[1].value === '공공기관' : false" color />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">⑦원수급 현장명</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_3" ? form.list[2].value : "" }}</td>
        <td rowspan="2" colspan="2">공사현장 명</td>
        <td rowspan="2" colspan="10" class="data">{{ form.employmentType[0] === "label_3" ? form.list[4].value : "" }}</td>
      </tr>
      <tr>
        <td colspan="4">⑧원수급 현장 산재관리번호(사업개시번호)</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_3" ? form.list[3].value : "" }}</td>
      </tr>
      <tr>
        <td colspan="4">⑨공사종류</td>
        <td colspan="6" class="data">{{ form.employmentType[0] === "label_3" ? form.list[5].value : "" }}</td>
        <td colspan="2">공정률</td>
        <td colspan="3" class="data">
          <div class="flex items-center justify-end gap-3">
            <p>{{ form.employmentType[0] === "label_3" ? form.list[6].value : "" }}</p>
            <p>%</p>
          </div>
        </td>
        <td colspan="3">공사금액</td>
        <td colspan="4" class="data">
          <div class="flex items-center justify-end gap-3">
            <p>{{ form.employmentType[0] === "label_3" ? form.list[7].value : "" | comma }}</p>
            <p>백만원</p>
          </div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= Ⅱ.재해정보 ================================================ -->
    <!-- ========================================================================================================== -->
    <p style="padding: 12px 8px 4px">※ 아래 항목은 재해자별로 각각 작성하되, 같은 재해로 재해자가 여러 명이 발생한 경우에는 별지에 추가로 적습니다.</p>
    <table class="print-container table-1">
      <colgroup>
        <col width="80" />
      </colgroup>
      <tr>
        <td rowspan="8" class="head">Ⅱ. 재해 정보</td>
        <td colspan="3" class="font-medium">성명</td>
        <td colspan="5" class="data">{{ form.inputC_1 }}</td>
        <td colspan="3" class="font-medium">주민등록번호 (외국인등록번호)</td>
        <td colspan="5" class="data">{{ form.inputC_2 }}</td>
        <td colspan="2" class="font-medium">성별</td>
        <td colspan="6" class="data">
          <div class="flex items-center gap-5">
            <PrintCheckbox label="남" :value="form.inputC_3 === '남'" color />
            <PrintCheckbox label="여" :value="form.inputC_3 === '여'" color />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">주소</td>
        <td colspan="13" class="data">{{ form.inputC_20 }}</td>
        <td colspan="2" class="font-medium">휴대전화</td>
        <td colspan="6" class="data">{{ form.inputC_5 }}</td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">국적</td>
        <td colspan="13" class="data">
          <div class="flex items-center gap-5">
            <PrintCheckbox label="내국인" :value="form.inputC_6 === '내국인'" color />
            <PrintCheckbox label="외국인" :value="form.inputC_6 === '외국인'" color />
            <p>
              [국적 : <span style="min-width: 40px" class="inline-block mr-3">{{ form.inputC_6 === "외국인" ? form.inputC_7 : "" }}</span> ⑩체류자격:
              <span style="min-width: 40px" class="inline-block">{{ form.inputC_6 === "외국인" ? form.inputC_8 : "" }}</span
              >]
            </p>
          </div>
        </td>
        <td colspan="2" class="font-medium">⑪직업</td>
        <td colspan="6" class="data">{{ form.jobClassification.no_5 }}</td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">입사일</td>
        <td colspan="9" class="data">
          <div class="flex justify-end items-center gap-3">
            <p>{{ form.inputC_9 | moment("YYYY 년") }}</p>
            <p>{{ form.inputC_9 | moment("MM 월") }}</p>
            <p>{{ form.inputC_9 | moment("DD 일") }}</p>
          </div>
        </td>
        <td colspan="4" class="font-medium">⑫같은 종류업무 근속기간</td>
        <td colspan="8" class="data">
          <div class="flex justify-end items-center gap-3">
            <p>{{ form.inputC_10 }} 년</p>
            <p>{{ form.inputC_11 }} 월</p>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">⑬고용형태</td>
        <td colspan="21" class="data">
          <div class="flex items-center gap-5">
            <PrintCheckbox v-for="item in ['상용', '임시', '일용', '무급가족종사자', '자영업자', '그 밖의 사항']" :key="`select-1-${item}`" :label="item" :value="form.inputC_12 === item" color />
            <p style="min-width: 70px" class="flex justify-between items-center">
              <span>[</span>
              <span v-if="form.inputC_12 === '그 밖의 사항'">{{ form.inputC_13 }}</span>
              <span>]</span>
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">⑭근무형태</td>
        <td colspan="21" class="data">
          <div class="flex items-center gap-5">
            <PrintCheckbox v-for="item in ['정상', '2교대', '3교대', '4교대', '시간제', '그 밖의 사항']" :key="`select-2-${item}`" :label="item" :value="form.inputC_14 === item" color />
            <p style="min-width: 70px" class="flex justify-between items-center">
              <span>[</span>
              <span v-if="form.inputC_14 === '그 밖의 사항'">{{ form.inputC_15 }}</span>
              <span>]</span>
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td rowspan="2" colspan="3" class="font-medium">⑮상해종류 (질병명)</td>
        <td rowspan="2" colspan="5" class="data">{{ form.inputC_16 }}</td>
        <td rowspan="2" colspan="3" class="font-medium">⑯상해부위 (질병부위)</td>
        <td rowspan="2" colspan="5" class="data">{{ form.inputC_17 }}</td>
        <td colspan="5" class="font-medium">⑰휴업예상일수</td>
        <td colspan="3" class="data">
          휴업 <span style="display: inline-block; text-align: right; min-width: 30px">{{ form.inputC_18 }}</span> 일
        </td>
      </tr>
      <tr>
        <td colspan="5" class="font-medium">사망 여부</td>
        <td colspan="3" class="data">
          <PrintCheckbox label="사망" :value="form.inputC_19" color />
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= Ⅲ. 재해 발생 개요 및 원인 ================================================ -->
    <!-- ========================================================================================================== -->
    <table style="margin-top: -2px" class="print-container table-1">
      <colgroup>
        <col width="80" />
      </colgroup>
      <tr>
        <td rowspan="8" class="head">Ⅲ. 재해 발생 개요 및 원인</td>
        <td rowspan="4" colspan="2" class="font-medium">⑱재해 발생 개요</td>
        <td colspan="4" class="font-medium">발생일시</td>
        <td colspan="18">
          <div class="flex items-center gap-6">
            <p>{{ form.inputD_1 | moment("YYYY 년") }}</p>
            <p>{{ form.inputD_1 | moment("MM 월") }}</p>
            <p>{{ form.inputD_1 | moment("DD 일") }}</p>
            <p>{{ koWeek(form.inputD_1) }} 요일</p>
            <p>{{ (form.inputD_1 + " " + form.inputD_2) | moment("HH 시") }}</p>
            <p>{{ (form.inputD_1 + " " + form.inputD_2) | moment("mm 분") }}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="font-medium">발생장소</td>
        <td colspan="18">{{ form.inputD_3 }}</td>
      </tr>
      <tr>
        <td colspan="4" class="font-medium">재해관련 작업유형</td>
        <td colspan="18">
          <div class="print-textarea" style="min-height: 50px">{{ form.inputD_4 }}</div>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="font-medium">재해발생 당시 상황</td>
        <td colspan="18">
          <div class="print-textarea" style="min-height: 100px">{{ form.inputD_6 }}</div>
        </td>
      </tr>
      <tr>
        <td colspan="6" class="font-medium">⑲재해 발생 원인</td>
        <td colspan="18">
          <div class="print-textarea" style="min-height: 80px">
            [{{ form.inputD_5 }}]
            {{ form.inputD_7 }}
          </div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= Ⅳ. ⑳재발 방지 계획 ================================================ -->
    <!-- ========================================================================================================== -->
    <table style="margin-top: -2px" class="print-container table-1">
      <colgroup>
        <col width="80" />
      </colgroup>
      <tr>
        <td class="head">Ⅳ. ⑳재발 방지 계획</td>
        <td colspan="24">
          <div class="print-textarea" style="min-height: 60px">
            {{ form.inputE_1 }}
          </div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 즉시 기술지원 서비스 요청 ================================================ -->
    <!-- ========================================================================================================== -->
    <table style="margin-top: -2px" class="print-container table-1">
      <colgroup>
        <col width="80" />
      </colgroup>
      <tr>
        <td colspan="14" class="border-l-0">※ 위 재발방지 계획 이행을 위한 안전보건교육 및 기술지도 등을 한국산업안전보건공단에서 무료로 제공하고 있으니 즉시 기술지원 서비스를 받고자 하는 경우 오른쪽에 √ 표시를 하시기 바랍니다.</td>
        <td colspan="10">
          <div class="flex items-center">즉시 기술지원 서비스 요청<PrintCheckbox label="" :value="false" color class="ml-2" /></div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 작성정보 ================================================ -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <table class="table-2 my-1">
        <colgroup>
          <col width="180" />
          <col />
          <col width="60" />
        </colgroup>
        <tr>
          <td class="text-right font-medium">작성자 성명</td>
          <td>{{ form.stdInfo.writer_name }}</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td class="text-right font-medium">작성자 전화번호</td>
          <td>{{ form.stdInfo["작성자 전화번호"] }}</td>
          <td class="text-right font-medium">작성일</td>
          <td class="flex items-center justify-end">
            <span style="width: 90px; text-align: right">{{ form.stdInfo.date | moment("YYYY") }}</span
            ><span style="margin-left: 10px">년</span> <span style="width: 90px; text-align: right">{{ form.stdInfo.date | moment("MM") }}</span
            ><span style="margin-left: 10px">월</span> <span style="width: 90px; text-align: right">{{ form.stdInfo.date | moment("DD") }}</span
            ><span style="margin-left: 10px">일</span>
          </td>
        </tr>
      </table>
      <div class="flex flex-col items-end gap-2">
        <div style="border-bottom: 1px solid #cdcdcd" class="flex items-center">
          <p style="padding: 5px 10px" class="font-medium">사업주</p>
          <div style="width: 263px; padding: 5px 10px" class="text-center">{{ form.inputE_3 }}</div>
          <p style="padding: 5px 10px">(서명 또는 인)</p>
        </div>
        <div style="border-bottom: 1px solid #cdcdcd" class="flex items-center">
          <p style="padding: 5px 10px" class="font-medium">근로자대표(재해자)</p>
          <div style="width: 263px; padding: 5px 10px" class="text-center">{{ form.inputE_4 }}</div>
          <p style="padding: 5px 10px">(서명 또는 인)</p>
        </div>
      </div>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 귀하 ================================================ -->
    <!-- ========================================================================================================== -->
    <table class="print-container table-3 mt-3">
      <tr>
        <td colspan="24" class="text-xl font-medium border-l-0">(　 　 　)지방고용노동청장(지청장)<span class="ml-1">귀하</span></td>
      </tr>
      <tr>
        <td rowspan="2" colspan="5" class="text-right font-medium border-l-0">재해 분류자 기입란</td>
        <td rowspan="2" colspan="7" style="color: #9ca0a4" class="data">(현장에서는 작성하지 않습니다)</td>
        <td colspan="3" class="font-medium">발생형태</td>
        <td colspan="3" class="data"></td>
        <td colspan="3" class="font-medium">기인물</td>
        <td colspan="3" class="data"></td>
      </tr>
      <tr>
        <td colspan="3" class="font-medium">작업지역ㆍ공정</td>
        <td colspan="3" class="data"></td>
        <td colspan="3" class="font-medium">작업내용</td>
        <td colspan="3" class="data"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";
import moment from "moment";

export default {
  name: "Print117",
  components: {
    PrintCheckbox,
  },
  props: {
    form: Object,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  methods: {
    koWeek(date) {
      const week = moment(date).format("dddd");
      switch (week) {
      case "Monday":
        return "월";
      case "Tuesday":
        return "화";
      case "Wednesday":
        return "수";
      case "Thursday":
        return "목";
      case "Friday":
        return "금";
      case "Saturday":
        return "토";
      case "Sunday":
        return "일";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  font-size: 13px;
}
h1 {
  font-weight: 700;
  font-size: 28px;
  line-height: 38px;
  text-align: center;
  padding: 20px 0px;
}

h4 {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 35px;
}

.before-label {
  display: list-item;
  list-style-type: "·";
  padding-left: 6px;
  margin-left: 6px;
}

table.table-1 {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-top: 2px solid #cdcdcd;
  border-bottom: 2px solid #cdcdcd;

  td {
    border: 1px solid #cdcdcd;
    border-right: 0;
    padding: 4px 8px;
    word-break: keep-all;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;

    &.gray {
      background: #f0f0f0;
    }
    &.head {
      text-align: center;
      font-weight: 500;
      background: #f0f0f0;
      border-left: 0 !important;
    }
    &.data {
      border-left: 0 !important;
    }
  }
}
table.table-2 {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td {
    padding: 4px 8px;
    word-break: keep-all;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;

    &.gray {
      background: #f0f0f0;
    }
    &.head {
      text-align: center;
      font-weight: 500;
      background: #f0f0f0;
      border-left: 0 !important;
    }
    &.data {
      border-left: 0 !important;
    }
  }
}

table.table-3 {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-top: 4px solid #cdcdcd;
  border-bottom: 2px solid #cdcdcd;

  td {
    border: 1px solid #cdcdcd;
    border-right: 0;
    padding: 4px 8px;
    word-break: keep-all;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;

    &.gray {
      background: #f0f0f0;
    }
    &.head {
      text-align: center;
      font-weight: 500;
      background: #f0f0f0;
      border-left: 0 !important;
    }
    &.data {
      border-left: 0 !important;
    }
  }
}
td > div.print-textarea {
  min-height: 0;
  text-align: left !important;
  border: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
