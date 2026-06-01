<template>
  <div>
    <div class="content">
      <div class="header-table">
        <table>
          <tbody>
            <tr>
              <td class="header-in-table">작업장 순회점검일지</td>
              <td rowspan="2" class="th-background" style="width: 40px">결<br /><br />재</td>
              <td class="th-background" style="width: 150px">관리책임자</td>
            </tr>
            <tr>
              <td class="content-title" valign="bottom">□ 기본정보</td>
              <td class="signCell" :style="{ backgroundImage: typeof form.confirmSign !== 'undefined' ? `url(${form.confirmSign})` : '' }"></td>
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
              <th>작성자</th>
              <td>{{ form.stdInfo.writer_name }}</td>
            </tr>
            <tr>
              <th>점검일</th>
              <td>{{ form.stdInfo.점검일 }}</td>
              <th>점검장소</th>
              <td>{{ form.stdInfo.점검장소 }}</td>
              <th>재해형태</th>
              <td>{{ typeof form.stdInfo.재해형태 === "object" ? form.stdInfo.재해형태.join(", ") : "" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 중점사항-->
    <div class="content">
      <div class="content-title">□ 중점사항</div>
      <div class="content-table">
        <table>
          <thead>
            <tr>
              <th>점검 항목</th>
              <th style="width: 70px">양호</th>
              <th style="width: 70px">불량</th>
              <th style="width: 70px">N/A</th>
              <th style="width: 380px">비고(조치결과)</th>
            </tr>
          </thead>
          <tbody v-for="(row, row_i) of form.inspectList" :key="row_i">
            <tr v-if="!!row.title && (row_i === 0 || row.title !== form.inspectList[row_i - 1].title)">
              <td colspan="5" class="sub-header">{{ row.title }}</td>
            </tr>
            <tr>
              <td class="item-label row-title">{{ row.content }}</td>
              <td style="width: 70px">
                <img v-if="row.isChecked === '양호'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td style="width: 70px">
                <img v-if="row.isChecked === '불량'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td style="width: 70px">
                <img v-if="row.isChecked === 'N/A'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td style="width: 380px">
                <span>{{row.note}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 일반사항-->
    <div class="content">
      <div class="content-title">□ 일반사항</div>
      <div class="content-table">
        <table>
          <thead>
            <tr>
              <th>점검 항목</th>
              <th style="width: 70px">양호</th>
              <th style="width: 70px">불량</th>
              <th style="width: 70px">N/A</th>
              <th style="width: 380px">비고(조치결과)</th>
            </tr>
          </thead>
          <tbody v-for="(row, row_i) of form.inspectListNormal" :key="row_i">
            <tr v-if="!!row.title && (row_i === 0 || row.title !== form.inspectListNormal[row_i - 1].title)">
              <td colspan="5" class="sub-header" :style="'page-break-after: avoid;'">{{ row.title }}</td>
            </tr>
            <tr>
              <td class="item-label row-title">{{ row.content }}</td>
              <td style="width: 70px">
                <img v-if="row.isChecked === '양호'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td style="width: 70px">
                <img v-if="row.isChecked === '불량'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td style="width: 70px">
                <img v-if="row.isChecked === 'N/A'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td style="width: 380px">
                <span>{{row.note}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 점검자 의견 -->
    <div class="content">
      <div class="content-table">
        <table class="mt-28px">
          <tbody>
            <tr>
              <td class="th-background" style="width: 140px">점검자 의견</td>
              <td style="padding: 14px">
                <div style="width: 100%; min-height: 300px; text-align: left; display: inline-flex; align-items: center; white-space: pre">{{ form.checkComment }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module v-model="form.photoList" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">
      <template #customTitle>
        <div style="font-size: 24px; font-weight: 700; line-height: 35px; padding-bottom: 16px">□ 사진대지</div>
      </template>
    </photo-upload-grid-module>
  </div>
</template>

<script>
export default {
  name: "Print163",
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
$border-color: #cdcdcd;
.header {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding: 20px 0;
}
.content {
  .content-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    margin-bottom: 14px;
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
      font-size: 40px;
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
    .sub-header,
    .item-label {
      padding: 8px;
      text-align: left;
      font-size: 18px;
    }
    .sub-header {
      font-weight: 700;
    }
    .row-title {
      font-weight: 500;
    }
    .row-title:before {
      content: "•";
      display: inline-block;
      width: 1em;
      margin-left: 1em;
    }
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 40px;

      th,
      td {
        border: 1px solid #757575;
        text-align: center;
        min-height: 40px;
        height: 40px;
        font-size: 18px;
      }
      th {
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

    /*서명 테이블*/
    .sign-table {
      th,
      td {
        font-size: 14px;
      }

      tr th:nth-child(1),
      tr td:nth-child(1),
      tr th:nth-child(8),
      tr td:nth-child(8) {
        width: 64px;
      }

      .signCell {
        white-space: nowrap;
        min-width: 90px;
        padding: 2px;
        height: 50px;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .signSpace {
        width: 10px;
        border-top: none;
        border-bottom: none;
      }
    }
  }

  .th-background {
    background-color: #ececec;
    white-space: nowrap;
  }
}
.attendeeTable {
  td {
    height: 60px;
    border: 1px solid $border-color;
    text-align: center;
  }
}

.print-break {
  break-inside: avoid;
}
.print-break-page {
  page-break-before: always;
}

.photoWrap {
  .photoContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    border-radius: 6px;
    border: dashed 1px $border-color;
    break-inside: avoid;
  }
}
.photoWrap:nth-child(2n) {
}
.titleFull {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  height: 110px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
