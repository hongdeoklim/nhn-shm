<template>
  <div>
    <div class="header">차량계 하역운반/건설기계 작업계획서</div>
    <div class="content">
      <div class="content-title">□ 작업개요</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th colspan="2">업체명</th>
              <td colspan="3">{{ form.inputA_0 }}</td>
              <th colspan="2">장비명</th>
              <td colspan="3">{{ equipment }}</td>
            </tr>
            <tr>
              <th colspan="2">공종</th>
              <td colspan="3">{{ form.inputA_1 }}</td>
              <th colspan="2">작업위치</th>
              <td colspan="3">{{ form.inputA_2 }}</td>
            </tr>
            <tr>
              <th rowspan="2" colspan="1">작업기간</th>
              <th colspan="1">시작</th>
              <td colspan="3">{{ new Date(form.inputA_3).format("yyyy.MM.dd") }}</td>
              <th rowspan="2" colspan="1">조종원</th>
              <th colspan="1">성명</th>
              <td colspan="3">{{ form.inputA_5 }}</td>
            </tr>
            <tr>
              <th colspan="1">종료</th>
              <td colspan="3">{{ new Date(form.inputA_4).format("yyyy.MM.dd") }}</td>
              <th colspan="1">면허</th>
              <td colspan="3">{{ form.inputA_6 }}</td>
            </tr>
            <tr>
              <th colspan="2">작업지휘자</th>
              <td colspan="3">{{ form.inputA_7 }}</td>
              <th colspan="2">신호수/유도자</th>
              <td colspan="3">{{ form.inputA_8 }}</td>
            </tr>
            <tr>
              <th colspan="2">작업목적</th>
              <td colspan="8" style="text-align: start">{{ form.inputA_9 }}</td>
            </tr>
            <tr>
              <th colspan="2">작업순서</th>
              <td colspan="8" style="text-align: start"><span v-html="form.printA_10"></span></td>
            </tr>
          </tbody>
        </table>
        <span>※ 첨부 : 사업자등록증, 건설기계등록증, 보험가입증명서, 조종사면허증, 교육이수증, 장비제원표</span>
      </div>
    </div>

    <div class="content mt-8">
      <div class="content-title">□ 작업전 점검사항</div>
      <div class="content-table mt-4">
        <table>
          <thead>
            <tr>
              <th style="width: 70px">선택</th>
              <th style="width: 240px">위험요인</th>
              <th style="width: 100%">안전대책</th>
              <th style="width: 300px">비고</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(data, index) in form.tableList" :key="index">
              <td v-if="data.rowspan" style="width: 70px; text-align: -webkit-center" :rowspan="data.rowspan">
                <div v-if="data.check" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
                  <vs-icon icon="check" size="x-small"></vs-icon>
                </div>
                <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
                  <vs-icon icon="check" size="x-small"></vs-icon>
                </div>
              </td>
              <td v-if="data.rowspan" style="width: 240px" :rowspan="data.rowspan">
                <span>{{ data.title }}</span>
              </td>
              <td style="width: 100%; text-align: start">
                <span>{{ data.content }}</span>
              </td>
              <td style="width: 300px">
                <span>{{ data.note }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Print257",
  props: {
    form: Object,
    board: Object,
  },
  computed: {
    equipment() {
      const checkData = this.form.equipmentList.find((item) => item.check);
      if (checkData.id === 4) return checkData.value;
      return checkData.label;
    },
  },
  methods: {
    getCheckBoxUrl(checked) {
      if (checked) {
        return `@/assets/images/print/print_check_checked.svg`;
      } else {
        return `@/assets/images/print/print_check_unchecked.svg`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding: 20px 0;
  text-decoration: underline;
}
.content {
  margin-top: 20px;

  .content-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    margin-bottom: 16px;
  }
  .content-table {
    .print-break {
      break-inside: avoid;
    }
    .print-break-page {
      page-break-before: always;
    }
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 16px;

      th,
      td {
        border: 1px solid #757575;
        text-align: center;
        min-height: 55px;
        height: 55px;
        font-size: 18px;
      }
      th {
        width: 210px;
        background-color: #ececec;
        font-weight: 500;
        padding: 0;
      }
      td {
        min-width: 50px;
        word-break: keep-all;
        padding-left: 14px;
        padding-right: 14px;
        img {
          display: inline-block;
        }
      }
      .th-background {
        background-color: #ececec;
        white-space: nowrap;
      }
      .check-container {
        padding: 10px 14px 0 14px;
        text-align: left;

        div {
          margin-bottom: 8px;
        }
        img {
          display: inline-block;
          margin-right: 8px;
        }
      }
      .text-left {
        text-align: left;
        padding: 10px 14px;
      }
    }
  }
}
</style>
