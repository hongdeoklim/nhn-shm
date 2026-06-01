<template>
  <div>
    <div class="header">안전 및 보건에 관한 협의체 회의록</div>
    <div class="content">
      <div class="content-title">□ 기본정보</div>
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
              <th>{{ this.projectId===7? '사무소명' : '부서명' }}</th>
              <td>{{ form.stdInfo.com_name }}</td>
              <th>직책</th>
              <td>{{ form.stdInfo.rank }}</td>
              <th>작성자</th>
              <td>{{ form.stdInfo.writer_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--협의체 정보-->
    <div class="content">
      <div class="content-title">□ 협의체 정보</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>{{ this.projectId===7? '회의일' : '협의일' }}</th>
              <td>{{ form.inputA_2 }}</td>
              <th>회의장소</th>
              <td>{{ form.inputA_3 }}</td>
            </tr>
            <tr>
              <th>도급인</th>
              <td>{{ form.inputA_4 }}명</td>
              <th>수급인</th>
              <td>{{ form.inputA_5 }}명</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--협의내용-->
    <div class="content">
      <div class="content-title">□ 협의내용</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>작업 시작 시간</th>
              <td>
                <div class="print-textarea no-block" style="padding: 12px !important">{{ form.inputB_4 }}</div>
              </td>
            </tr>
            <tr>
              <th>작업장 간의 연락 방법</th>
              <td>
                <div class="print-textarea no-block" style="padding: 12px !important">{{ form.inputB_5 }}</div>
              </td>
            </tr>
            <tr>
              <th>재해발생 위험이 있는 경우 대피 방법</th>
              <td>
                <div class="print-textarea no-block" style="padding: 12px !important">{{ form.inputB_6 }}</div>
              </td>
            </tr>
            <tr>
              <th>작업장에서의 법 제36조에 따른 위험성평가의 실시에 관한 사항</th>
              <td>
                <div class="print-textarea no-block" style="padding: 12px !important">{{ form.inputB_7 }}</div>
              </td>
            </tr>
            <tr>
              <th>사업주와 수급인 또는 수급인 상호 간의 연락 방법 및 작업공정의 조정</th>
              <td>
                <div class="print-textarea no-block" style="padding: 12px !important">{{ form.inputB_9 }}</div>
              </td>
            </tr>
            <tr>
              <th>기타</th>
              <td>
                <div class="print-textarea no-block" style="padding: 12px !important">{{ form.inputB_10 }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 참석자 명단 -->
    <div class="print-break-page">
      <div class="content">
        <div class="header text-center">안전 및 보건에 관한 협의체 참석자 명단</div>
        <div class="justify-between items-center" style="padding-top: 20px;">
          <p>현장명 : {{ form.stdInfo.field_name }}</p>
          <p>일　시 : {{ form.inputA_2 | moment("YYYY년 MM월 DD일") }}</p>
          <p>장　소 : {{ form.inputA_3 }}</p>
        </div>

        <div class="user-tables flex gap-3">
          <table>
            <thead>
              <tr>
                <th colspan="4" style="letter-spacing: 12px">도급인</th>
              </tr>
              <tr>
                <th>소속명</th>
                <th>직급</th>
                <th>이름</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(num, index) in 10" :key="index">
                <td>{{ typeof form.user[index] !== "undefined" ? form.user[index].input1 : "" }}</td>
                <td>{{ signatureList(form.user, index, 'input2') }}</td>
                <td>{{ typeof form.user[index] !== "undefined" ? form.user[index].input3 : "" }}</td>
                <td class="signCell" :style="{ backgroundImage: `url(${typeof form.user[index] !== 'undefined' ? form.user[index].input4 : ''})` }"></td>
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
                <th>직급</th>
                <th>이름</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(num, index) in 10" :key="index">
                <td>{{ typeof form.worker[index] !== "undefined" ? form.worker[index].input1 : "" }}</td>
                <td>{{ signatureList(form.worker, index, 'input2') }}</td>
                <td>{{ typeof form.worker[index] !== "undefined" ? form.worker[index].input3 : "" }}</td>
                <td class="signCell" :style="{ backgroundImage: `url(${typeof form.worker[index] !== 'undefined' ? form.worker[index].input4 : ''})` }"></td>
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
  name: "Print259",
  props: {
    form: Object,
    board: Object,
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
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
.header {
  font-size: 40px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding: 20px 0;
}
.content {
  font-size: 18px;
  margin-top: 10px;

  .content-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    margin-bottom: 16px;
  }
  .content-table {
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 20px;

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
        word-break: keep-all;
      }
      td {
        min-width: 50px;
        word-break: keep-all;
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
  .print-textarea no-block {
    min-height: 175px;
    display: inline-flex;
    align-items: center;
  }
  .signCell {
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
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

.print-break {
  break-inside: avoid;
}
.print-break-page {
  page-break-before: always;
}
</style>
