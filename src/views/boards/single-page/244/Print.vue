<template>
  <div>
    <div class="header" style="text-decoration: underline; text-underline-offset: 5px">중대재해 발생 보고(건설)</div>
    <div class="content">
      <div class="content-title">1. 사업장 개요</div>
      <div style="display: grid; grid-template-rows: repeat(10, 22px); grid-template-columns: 32px 40px 1fr 1fr 140px 1.2fr 140px 1.2fr; width: calc(100% - 2px); border-collapse: collapse; gap: 1px; margin: 0 1px; border: 1px solid #757575;">
        <div style="grid-row: 1/7; grid-column: 1/2" class="likeTh">사<br />업<br />장<br />명</div>

        <div style="grid-row: 1/4; grid-column: 2/3" class="likeTh">원<br />청</div>
        <div style="grid-row: 1/4; grid-column: 3/4" class="likeTd">{{ form.fromCompanyName }}</div>
        <div style="grid-row: 1/4; grid-column: 4/5" class="likeTd">(대표: {{ form.inputA_2 }})</div>

        <div style="grid-row: 4/7; grid-column: 2/3" class="likeTh">하<br />청</div>
        <div style="grid-row: 4/7; grid-column: 3/4" class="likeTd">{{ form.toCompanyName }}</div>
        <div style="grid-row: 4/7; grid-column: 4/5" class="likeTd">(대표: {{ form.inputA_4 }})</div>

        <div style="grid-row: 7/11; grid-column: 1/2" class="likeTh">현<br />장<br />명</div>
        <div style="grid-row: 7/11; grid-column: 2/5" class="likeTd"><br />{{ form.fieldInfo.field_name }}<br /><br />(소재지 : {{ form.fieldInfo.field_address }})</div>

        <div style="grid-row: 1/3; grid-column: 5/6" class="likeTh">공사금액</div>
        <div style="grid-row: 3/5; grid-column: 5/6" class="likeTh">공사기간</div>
        <div style="grid-row: 5/7; grid-column: 5/6" class="likeTh">근로자수</div>
        <div style="grid-row: 7/9; grid-column: 5/6" class="likeTh">공정율</div>
        <div style="grid-row: 9/11; grid-column: 5/6" class="likeTh">발주처</div>

        <div style="grid-row: 1/3; grid-column: 6/7" class="likeTd">{{ new Intl.NumberFormat().format(Math.floor(parseInt(form.fieldInfo.deposit_amount.replace(/,/g, '')) / 1000000)) }} 백만원</div>
        <div style="grid-row: 3/5; grid-column: 6/7" class="likeTd">{{ form.fieldInfo.start_work_at }} ~ {{ form.fieldInfo.be_completed_at }}</div>
        <div style="grid-row: 5/7; grid-column: 6/7" class="likeTd">{{ form.inputA_10 }} 명</div>
        <div style="grid-row: 7/9; grid-column: 6/7" class="likeTd">{{ form.inputA_11 }} %</div>
        <div style="grid-row: 9/11; grid-column: 6/7" class="likeTd">{{ form.inputA_12 }}</div>

        <div style="grid-row: 1/4; grid-column: 7/8" class="likeTh">기술지도관계</div>
        <div style="grid-row: 4/7; grid-column: 7/8" class="likeTh">유해·위험방지<br />계획서 여부</div>
        <div style="grid-row: 7/11; grid-column: 7/8" class="likeTh">공정별<br />공사종류</div>

        <div style="grid-row: 1/4; grid-column: 8/9; position: relative; padding-top: 10px" class="likeTd"><span style="position: absolute; left: 5px; top: 5px">지도기관명 :</span>{{ form.inputA_13 }}</div>
        <div style="grid-row: 4/7; grid-column: 8/9" class="likeTd">
          <img v-if="form.inputA_14 === '대상'" src="@/assets/images/print/print_radio_checked.svg" alt="checked" />
          <img v-else src="@/assets/images/print/print_radio_unchecked.svg" alt="unchecked" />
          <span class="ml-1 mr-5">대상</span>

          <img v-if="form.inputA_14 === '비대상'" src="@/assets/images/print/print_radio_checked.svg" alt="checked" />
          <img v-else src="@/assets/images/print/print_radio_unchecked.svg" alt="unchecked" />
          <span class="ml-1">비대상</span>
        </div>
        <div style="grid-row: 7/9; grid-column: 8/9" class="likeTd">{{ form.inputA_15 }}</div>
        <div style="grid-row: 9/11; grid-column: 8/9" class="likeTd">{{ form.inputA_16 }}</div>
      </div>
    </div>

    <!--2. 재해자 인적사항-->
    <div class="content mt-10">
      <div class="content-title">2. 재해자 인적사항</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>성 명</th>
              <th>주민등록번호</th>
              <th>소 속</th>
              <th>직 종</th>
              <th>입사일자</th>
              <th>동종경력</th>
              <th>재해정도</th>
            </tr>
            <tr>
              <td>{{ form.inputB_1 }}</td>
              <td>{{ form.inputB_2 }}-{{ `${form.inputB_3}`.substring(0, 1) + "******" }}</td>
              <td>{{ form.inputB_4 }}</td>
              <td>{{ form.inputB_5 }}</td>
              <td>{{ form.inputB_6 }}</td>
              <td>{{ form.inputB_7 }}년 {{ form.inputB_8 }}월</td>
              <td>{{ form.inputB_9 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. 재해발생 내용 및 조치현황-->
    <div class="content mt-10">
      <div class="content-title">3. 재해발생 내용 및 조치현황</div>
      <table class="status-table" cellpadding="0" border="0" cellspacing="0">
        <tbody>
        <tr>
          <th>일시</th>
          <td>{{ form.inputD_1 }}</td>
          <th>장소</th>
          <td>{{ form.inputD_2}}</td>
          <th>발생<br/>형태</th>
          <td>{{ form.inputD_3 }}</td>
          <th>기인물</th>
          <td>{{ form.inputD_4 }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 4. 재해발생개요(6하원칙) :-->
    <div class="content mt-10">
      <div class="content-title">4. 재해발생개요(6하원칙) :</div>
      <p>{{ form.inputD_6 }}</p>
    </div>

    <!-- 5. 사고후 조치사항 :-->
    <div class="content mt-10">
      <div class="content-title">5. 사고후 조치사항 :</div>
      <p>{{ form.inputD_7 }}</p>
    </div>

    <!-- 6. 기타 중요한 사항-->
    <div class="content mt-10">
      <div class="content-title">6. 기타 중요한 사항</div>
      <div>
        - 산재보험 성립번호 : <span>{{ form.inputD_8 }}</span>
      </div>
      <div>
        - 경찰서 조사관계 : <span>{{ form.inputD_9 }}</span>
      </div>
      <div>
        - 사망사인 : <span>{{ form.inputD_10 }}</span>
      </div>
    </div>

    <div class="mt-4" style="text-align: center; font-size: 22px">
      <div>위와 같이 중대재해가 발생하였음을 보고합니다.</div>
      <div class="mt-4">
        <span class="year pr-4">{{ new Date(form.stdInfo.date).format("yyyy") }}. </span>
        <span class="month pr-4">{{ new Date(form.stdInfo.date).format("MM") }}. </span>
        <span class="day">{{ new Date(form.stdInfo.date).format("dd") }}.</span>
      </div>
    </div>

    <div class="mt-3" style="font-size: 22px">
      <div style="display: grid; grid-template-rows: 46px 46px; grid-template-columns: 1fr fit-content(100px) 320px fit-content(50px)">
        <div style="grid-row: 1/2; grid-column: 2/3">보 고 자 :</div>
        <div style="grid-row: 1/2; grid-column: 3/4; text-align: center">{{ form.inputE_1 }}</div>
        <div style="grid-row: 1/2; grid-column: 4/5">(인)</div>

        <div style="grid-row: 2/3; grid-column: 2/3">연 락 처 :</div>
        <div style="grid-row: 2/3; grid-column: 3/4; text-align: center">{{ form.inputE_2 ? form.inputE_2 : form.inputE_3 }}</div>
      </div>
    </div>

    <div class="mt-6" style="font-size: 22px">{{ form.inputE_4 }} 귀하</div>
  </div>
</template>

<script>
export default {
  name: "Print244",
  props: {
    form: Object,
    board: Object,
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
  margin-top: 20px;
  border-collapse: collapse;

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
        height: 48px;
        font-size: 16px;
      }
      th {
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
    min-height: 190px;
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
.print-break {
  break-inside: avoid;
}
.print-break-page {
  page-break-before: always;
}
.likeTh,
.likeTd {
  display: inline-flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  outline: 1px solid #757575;
}
.likeTh {
  background-color: #ececec;
}
.likeTd {
}
.status-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th, td {
    text-align: center;
    font-size: 18px;
    border: 1px solid #757575;
    font-weight: normal;
  }

  th {
    background-color: #ececec;
    width: 80px;
  }
  td {
    width: calc((100% - 320px)/4)
  }
}
</style>
