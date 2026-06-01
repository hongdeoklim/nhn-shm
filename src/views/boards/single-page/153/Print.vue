<template>
  <div>
    <div class="header">노사협의체 회의록</div>
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
              <th>부서명</th>
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
              <th>구분</th>
              <td colspan="3">{{ form.inputA_1 }}</td>
            </tr>
            <tr>
              <th>협의일</th>
              <td>{{ form.inputA_2 }}</td>
              <th>회의장소</th>
              <td>{{ form.inputA_3 }}</td>
            </tr>
            <tr>
              <th>노측 위원</th>
              <td>{{ form.inputA_4 }}명</td>
              <th>사측 위원</th>
              <td>{{ form.inputA_5 }}명</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--협의내용-->
    <div class="content">
      <div class="content-title">□ 노·사협의체(심의·의결사항, 안전계획 등) 협의내용</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>산업재해 예방방법 및 산업재해가 발생한 경우의 대피방법</th>
              <td style="text-align: start; padding: 5px;">
                <div class="textareaCell">{{ form.inputB_4 }}</div>
              </td>
            </tr>
            <tr>
              <th>작업의 시작시간, 작업 및 작업장 간의 연락방법</th>
              <td style="text-align: start; padding: 5px;">
                <div class="textareaCell">{{ form.inputB_5 }}</div>
              </td>
            </tr>
            <tr>
              <th>그 밖의 산업재해 예방과 관련된 사항</th>
              <td style="text-align: start; padding: 5px;">
                <div class="textareaCell">{{ form.inputB_6 }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 참석자 명단 -->
    <div class="print-break-page">
      <div class="content">
        <div class="content-title text-center">노사협의체 참석자 명단</div>
        <div class="flex justify-between items-center mt-4">
          <p>현장명 : {{ form.stdInfo.field_name }}</p>
<!--          <p>{{ form.stdInfo.date | moment("YYYY년 MM월 DD일") }}</p>-->
        </div>

        <div class="user-tables flex gap-3">
          <table>
            <thead>
              <tr>
                <th colspan="4" style="letter-spacing: 12px">사측위원</th>
              </tr>
              <tr>
                <th>소속명</th>
                <th>직책</th>
                <th>이름</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(num, index) in 10" :key="index">
                <td>{{ typeof form.userTableList[index] !== "undefined" ? form.userTableList[index].cell1 : "" }}</td>
                <td>{{ typeof form.userTableList[index] !== "undefined" ? form.userTableList[index].cell2 : "" }}</td>
                <td>{{ typeof form.userTableList[index] !== "undefined" ? form.userTableList[index].cell3 : "" }}</td>
                <td class="signCell" :style="{ backgroundImage: `url(${typeof form.userTableList[index] !== 'undefined' ? form.userTableList[index].cell4 : ''})` }"></td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th colspan="4" style="letter-spacing: 12px">노측위원</th>
              </tr>
              <tr>
                <th>소속명</th>
                <th>직책</th>
                <th>이름</th>
                <th>서명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(num, index) in 10" :key="index">
                <td>{{ typeof form.workerTableList[index] !== "undefined" ? form.workerTableList[index].cell1 : "" }}</td>
                <td>{{ typeof form.workerTableList[index] !== "undefined" ? form.workerTableList[index].cell2 : "" }}</td>
                <td>{{ typeof form.workerTableList[index] !== "undefined" ? form.workerTableList[index].cell3 : "" }}</td>
                <td class="signCell" :style="{ backgroundImage: `url(${typeof form.workerTableList[index] !== 'undefined' ? form.workerTableList[index].cell4 : ''})` }"></td>
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
  name: "Print153",
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
  font-size: 18px;
  margin-top: 20px;

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
      margin-bottom: 40px;

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
  .textareaCell {
    min-height: 250px;
    display: inline-flex;
    align-items: start;
    white-space: pre;
    text-align: start;
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
