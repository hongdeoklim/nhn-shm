<template>
  <div>
    <div class="content">
      <div class="header-table">
        <table>
          <tbody>
            <tr>
              <td class="header-in-table">합동 안전점검 안전점검표</td>
              <td rowspan="2" class="th-background" style="width: 40px">결<br /><br />재</td>
              <td v-if="checkProject" class="th-background" style="width: 150px">관리감독자</td>
              <td v-if="checkProject" class="th-background" style="width: 150px">안전관리자</td>
              <td class="th-background" style="width: 150px">관리책임자</td>
            </tr>
            <tr>
              <td class="content-title" valign="bottom">□ 기본정보</td>
              <td v-if="checkProject" class="signCell" :style="{ backgroundImage: typeof form.inputE_2 !== 'undefined' ? `url(${form.inputE_2})` : '' }"></td>
              <td v-if="checkProject" class="signCell" :style="{ backgroundImage: typeof form.inputE_4 !== 'undefined' ? `url(${form.inputE_4})` : '' }"></td>
              <td class="signCell" :style="{ backgroundImage: typeof form.inputE_6 !== 'undefined' ? `url(${form.inputE_6})` : '' }"></td>
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
              <td>{{ typeof form.stdInfo.재해형태 === "object" ? form.stdInfo.재해형태.join(", ") : form.stdInfo.재해형태 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 합동 안전점검-->
    <div class="content">
      <div class="content-title">□ 합동 안전점검</div>
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
          <tbody v-for="(row, index) of form.inspectList" :key="`inspectList_${index}`" class="print-break">
            <tr v-if="index === 0 || (index > 0 && form.inspectList[index - 1].title !== row.title)">
              <td colspan="5" class="sub-header">{{ row.title }}</td>
            </tr>
            <tr>
              <td class="item-label">
                <span class="row-title" style="display: inline-flex; white-space: pre-line" v-text="row.content"></span>
              </td>
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
                <span>{{ row.note }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 점검 결과 -->
    <div class="content">
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <td class="th-background" style="width: 140px">점검 결과</td>
              <td style="padding: 14px">
                <div style="width: 100%; min-height: 300px; text-align: left; display: inline-flex; align-items: center; white-space: pre">{{ form.inputA_10 }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 참석자 명단 -->
    <div class="print-break-page">
      <div class="content">
        <div class="content-title text-center">합동 안전점검 참석자 명단</div>
        <div class="mt-4">
          <p>현장명 : {{ form.stdInfo.field_name }}</p>
          <p>일　시 : {{ form.stdInfo.점검일 | moment("YYYY년 MM월 DD일") }}</p>
          <p>장　소 : {{ form.stdInfo.점검장소 }}</p>
        </div>

        <div class="user-tables flex gap-3">
          <table>
            <thead>
              <tr>
                <th colspan="4" style="letter-spacing: 12px">도급인</th>
              </tr>
              <tr>
                <th>소속명</th>
                <th>직책</th>
                <th>성명</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(num, index) in 10" :key="index">
                <td>{{ typeof form.signatureList1[index] !== "undefined" ? form.signatureList1[index].target : "" }}</td>
                <td>{{ signatureList(form.signatureList1, index, 'type') }}</td>
                <td>{{ typeof form.signatureList1[index] !== "undefined" ? form.signatureList1[index].name : "" }}</td>
                <td class="signCell" :style="{ backgroundImage: `url(${typeof form.signatureList1[index] !== 'undefined' ? form.signatureList1[index].sign : ''})` }"></td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th colspan="4" style="letter-spacing: 12px">수급인</th>
              </tr>
              <tr>
                <th>소속명</th>
                <th>직책</th>
                <th>성명</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(num, index) in 10" :key="index">
                <td>{{ typeof form.signatureList2[index] !== "undefined" ? form.signatureList2[index].target : "" }}</td>
                <td>{{ signatureList(form.signatureList2, index, 'type') }}</td>
                <td>{{ typeof form.signatureList2[index] !== "undefined" ? form.signatureList2[index].name : "" }}</td>
                <td class="signCell" :style="{ backgroundImage: `url(${typeof form.signatureList2[index] !== 'undefined' ? form.signatureList2[index].sign : ''})` }"></td>
              </tr>
            </tbody>
          </table>
        </div>
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
  name: "Print100",
  props: {
    form: Object,
    board: Object,
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    checkProject () {
      if (`${this.projectId}` === '7') {
        return false;
      }
      return true;
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
    signatureList(list, index, key) {
      if (list.length === 0) return ''
      const data = list[index]
      if (data) {
        return data[`${key}_${data[key]}`] ? data[`${key}_${data[key]}`] : data[key];
      }
      return ''
    },
  },
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;

table {
  page-break-inside: auto;
}
tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

.header {
  font-size: 40px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding: 20px 0;
}
.content {
  font-size: 18px;
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
      padding: 14px;
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
        min-height: 55px;
        height: 55px;
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

.user-tables {
  margin-top: 16px;
  table {
    flex: 1;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    td,
    th {
      border: 1px solid #757575;
      text-align: center;
      min-height: 60px;
      height: 60px;
      font-size: 18px;
    }
  }
}

.signCell {
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
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
