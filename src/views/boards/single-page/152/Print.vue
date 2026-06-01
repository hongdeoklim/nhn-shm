<template>
  <div>
    <div class="header">산업안전보건위원회 회의록</div>
    <div class="content">
      <div class="content-title">□ 기본정보</div>
      <div class="content-table">
        <table>
          <colgroup>
            <col width="140" />
            <col />
            <col width="140" />
            <col />
            <col width="140" />
            <col />
          </colgroup>
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
          <colgroup>
            <col width="140" />
            <col />
            <col width="140" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>회의일</th>
              <td>{{ form.inputA_2 }}</td>
              <th>차수</th>
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
      <div class="content-title">□ 심의 의결사항 및 결정사항</div>
      <div class="content-table">
        <table>
          <colgroup>
            <col />
            <col width="70" />
            <col width="70" />
            <col width="70" />
            <col width="320" />
          </colgroup>
          <thead>
            <tr>
              <th>심의 의결사항</th>
              <th>양호</th>
              <th>불량</th>
              <th>N/A</th>
              <th>심의 결정사항</th>
            </tr>
          </thead>
          <tbody v-for="(row, row_i) of form.inspectList" :key="row_i">
            <tr v-if="!!row.title">
              <td colspan="4" class="sub-header">{{ row.title }}</td>
            </tr>
            <tr>
              <td class="item-label row-title" style="height: 85px">{{ row.label }}</td>
              <td>
                <PrintCheckbox :value="row.is_checked === 'Yes'" class="justify-center" />
              </td>
              <td>
                <PrintCheckbox :value="row.is_checked === 'No'" class="justify-center" />
              </td>
              <td>
                <PrintCheckbox :value="row.is_checked === 'N/A'" class="justify-center" />
              </td>
              <td>{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="content print-break-page">
      <div class="content-title">□ 회의내용</div>
      <div class="content-table">
        <table>
          <thead>
            <tr>
              <td>
                <div class="textareaCell" style="height: 1400px; text-align: start; padding: 5px;">{{ form.inputB_1 }}</div>
              </td>
            </tr>
          </thead>
        </table>
      </div>
    </div>

    <div class="print-break-page">
      <div class="content">
        <div class="content-title text-center">산업안전보건위원회 참석자 명단</div>
        <div class="flex justify-between items-center mt-4">
          <p>현장명 : {{ form.stdInfo.field_name }}</p>
<!--          <p>{{ form.stdInfo.date | moment("YYYY년 MM월 DD일") }}</p>-->
        </div>

        <div class="user-tables flex gap-3">
          <table>
            <thead>
              <tr>
                <th colspan="4" style="letter-spacing: 12px">사용자위원</th>
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
                <th colspan="4" style="letter-spacing: 12px">근로자위원</th>
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
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";
export default {
  name: "Print152",
  components: { PrintCheckbox },
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

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;

    th,
    td {
      border: 1px solid #757575;
      text-align: center;
      min-height: 60px;
      height: 60px;
      font-size: 18px;
      padding: 0;
    }

    th {
      background-color: #ececec;
      font-weight: 500;
      word-break: keep-all;
    }
  }
}

.print-break {
  break-inside: avoid;
}
.print-break-page {
  page-break-before: always;
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

    .signCell {
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>
