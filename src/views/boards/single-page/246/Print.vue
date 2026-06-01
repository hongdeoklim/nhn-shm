<template>
  <div>
    <!--    <div class="header">안전작업 계획서(고위험 작업)</div>-->
    <div class="content">
      <!--      <div class="content-title">□ 기본정보</div>-->
      <div class="header-table">
        <table>
          <tbody>
            <tr>
              <td class="header-in-table">안전작업 계획서(고위험 작업)</td>
              <td rowspan="2" class="th-background" style="width: 40px">결<br /><br />재</td>
              <td class="th-background" style="width: 150px">관리감독자</td>
              <td class="th-background" style="width: 150px">안전관리자</td>
              <td class="th-background" style="width: 150px">관리책임자</td>
            </tr>
            <tr>
              <td class="content-title" valign="bottom">□ 기본정보</td>
              <td class="signCell" :style="{ backgroundImage: typeof form.inputE_2 !== 'undefined' ? `url(${form.inputE_2})` : '' }"></td>
              <td class="signCell" :style="{ backgroundImage: typeof form.inputE_2 !== 'undefined' ? `url(${form.inputE_4})` : '' }"></td>
              <td class="signCell" :style="{ backgroundImage: typeof form.inputE_2 !== 'undefined' ? `url(${form.inputE_6})` : '' }"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>현장명</th>
              <td colspan="3">{{ form.stdInfo.field_name }}</td>
              <th>소속명</th>
              <td>{{ form.stdInfo.department }}</td>
            </tr>
            <tr>
              <th>부서명</th>
              <td>{{ form.stdInfo.com_name }}</td>
              <th>직책</th>
              <td>{{ form.stdInfo.rank }}</td>
              <th>해당기간</th>
              <td>{{ form.stdInfo.period1 }}<br/>~ {{ form.stdInfo.period2 }}</td>
            </tr>
            <tr>
              <th>작업종류</th>
              <td colspan="5" class="check-container">
                <div v-for="item of form.inspectionList" :key="item.id">
                  <img v-if="item.check" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                  <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
                  {{ item.label }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--    장비정보-->
    <div class="content">
      <div class="content-title">□ 장비정보</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>업체명</th>
              <td>{{ form.inputB_1 }}</td>
              <th>장비운전원</th>
              <td>{{ form.inputB_2 }}</td>
              <th>장비종류</th>
              <td>{{ form.inputB_4 }}</td>
            </tr>
            <tr>
              <th style="white-space: nowrap">장비형식 및 규격</th>
              <td style="word-wrap: break-word;">{{ form.inputB_5 }}</td>
              <th>작업지휘자</th>
              <td>{{ form.inputB_7 }}</td>
              <th>작업유도자</th>
              <td>{{ form.inputB_8 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--    사전조사 및 작업계획서 내용-->
    <div class="content">
      <div class="content-title">□ 사전조사 및 작업계획서 내용</div>
      <div class="content-table">
        <table v-for="(table, index) of form.inspectionList" :key="index" v-if="table.check">
          <tbody>
            <template v-for="group of table.list">
              <tr>
                <th>구분</th>
                <td class="th-background">{{ group.headerTitle }}</td>
                <td class="th-background" style="width: 70px">작성</td>
                <td class="th-background" style="width: 70px">미작성</td>
                <td class="th-background" style="width: 70px">N/A</td>
                <td class="th-background" style="width: 380px">비고(조치결과)</td>
              </tr>
              <tr v-for="(row, index) of group.list" :key="index">
                <td>{{ row.type }}</td>
                <td class="text-left">{{ row.label }}</td>
                <td>
                  <img v-if="row.is_checked === 'Yes'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                  <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
                </td>
                <td>
                  <img v-if="row.is_checked === 'No'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                  <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
                </td>
                <td>
                  <img v-if="row.is_checked === 'N/A'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                  <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
                </td>
                <td>
                  <span>{{ row.note }}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Print246",
  props: {
    form: Object,
    board: Object,
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
}
.content {
  margin-top: 20px;

  .content-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    margin-bottom: 16px;
  }
  .header-table {
    table {
      width: 100%;
      border-collapse: collapse;
      tr:nth-child(1) {
        text-align: center;
        td {
          padding: 10px;
        }
        td:nth-child(n + 2) {
          font-size: 18px;
          font-weight: 500;
          border-left: 1px solid #757575;
          border-top: 1px solid #757575;
          border-right: 1px solid #757575;
        }
      }
      tr:nth-child(2) {
        height: 100px;
        td:nth-child(1) {
          padding-bottom: 15px;
        }
        td:nth-child(n + 2) {
          border-left: 1px solid #757575;
          border-top: 1px solid #757575;
          border-right: 1px solid #757575;
        }
      }
    }
    .header-in-table {
      font-size: 24px;
      font-weight: 700;
      line-height: 24px;
    }
    .signCell {
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  .content-table {
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 40px;
      break-inside: avoid;

      th,
      td {
        border: 1px solid #757575;
        text-align: center;
        min-height: 60px;
        height: 60px;
        font-size: 18px;
      }
      th {
        width: 140px;
        background-color: #ececec;
        font-weight: 500;
        padding: 0;
      }
      td {
        min-width: 50px;
        word-break: keep-all;
        img {
          display: inline-block;
        }
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

  .th-background {
    background-color: #ececec;
    white-space: nowrap;
  }
}
</style>
