<template>
  <div class="print">
    <div class="contents">
      <div class="title">
        <span class="w-full h-full" style="font-size: 32px; font-weight: 700; display: grid; justify-content: center; align-items: center">일일 안전보고 일지</span>
        <div class="sign">
          <span class="head" style="height: 138px; border-left: 1px solid #757575">결<br /><br />재</span>
          <div>
            <span class="w-full head">안전관리자</span>
            <span class="w-full h-full body signCell" :style="{ backgroundImage: typeof form.inputC_2 !== 'undefined' ? `url(${form.inputC_2})` : '' }"></span>
          </div>
          <div>
            <span class="w-full head">관리책임자</span>
            <span class="w-full h-full body signCell" :style="{ backgroundImage: typeof form.inputC_4 !== 'undefined' ? `url(${form.inputC_4})` : '' }"></span>
          </div>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: 1fr 270px 198px; border: 1px solid #757575">
        <div style="display: grid; grid-template-columns: auto 1fr">
          <span style="width: 140px; height: 50px; display: grid; justify-content: center; justify-content: center; align-items: center; background-color: #ececec; border-right: 1px solid #757575">현장명</span>
          <span style="display: grid; justify-content: center; align-items: center; border-right: 1px solid #757575">{{ form.stdInfo.field_name }}</span>
        </div>
        <div style="display: grid; grid-template-columns: auto 1fr">
          <span style="width: 70px; height: 50px; display: grid; justify-content: center; justify-content: center; align-items: center; background-color: #ececec; border-right: 1px solid #757575">일자</span>
          <span style="display: grid; justify-content: center; align-items: center; border-right: 1px solid #757575">{{ new Date(form.headerDate).toISOString().slice(0, 10) }}</span>
        </div>
        <div style="display: grid; grid-template-columns: auto 1fr">
          <span style="width: 70px; height: 50px; display: grid; justify-content: center; align-items: center; background-color: #ececec; border-right: 1px solid #757575">날씨</span>
          <span style="display: grid; justify-content: center; align-items: center">{{ form.stdInfo.날씨 }}</span>
        </div>
      </div>

      <!-- 인원투입현황 / 장비투입현황  -->
      <div class="table-container" style="margin-top: 10px">
        <table>
          <colgroup>
            <col width="33px"/>
            <col width="188px"/>
            <col width="62px"/>
            <col width="62px"/>
            <col width="62px"/>

            <col width="33px"/>
            <col width="188px"/>
            <col width="62px"/>
            <col width="62px"/>
            <col width="62px"/>
          </colgroup>
          <tbody>
            <tr>
              <th rowspan="14">인<br />원<br />투<br />입<br />현<br />황</th>
              <th>구분</th>
              <th>전일</th>
              <th>금일</th>
              <th>누계</th>
              <th rowspan="14" style="width: 33px">장<br />비<br />투<br />입<br />현<br />황</th>
              <th>구분</th>
              <th>전일</th>
              <th>금일</th>
              <th>누계</th>
            </tr>
            <tr v-for="index in 12" :key="index">
              <td>{{ typeof form.budgetDay1[index - 1] !== "undefined" ? (form.budgetDay1[index - 1].구분 === "기타" ? form.budgetDay1[index - 1].구분_기타 : form.budgetDay1[index - 1].구분) : "&nbsp;" }}</td>
              <td>{{ typeof form.budgetDay1[index - 1] !== "undefined" && !isNaN(form.budgetDay1[index - 1].yesterday) ? form.budgetDay1[index - 1].yesterday : "" }}</td>
              <td>{{ typeof form.budgetDay1[index - 1] !== "undefined" && !isNaN(form.budgetDay1[index - 1].today) ? form.budgetDay1[index - 1].today : "" }}</td>
              <td>{{ typeof form.budgetDay1[index - 1] !== "undefined" && !isNaN(form.budgetDay1[index - 1].total) ? form.budgetDay1[index - 1].total : "" }}</td>

              <td>{{ typeof form.budgetDay2[index - 1] !== "undefined" ? (form.budgetDay2[index - 1].장비명 === '기타' ? form.budgetDay2[index - 1].장비명_기타 : form.budgetDay2[index - 1].장비명) : "" }}</td>
              <td>{{ typeof form.budgetDay2[index - 1] !== "undefined" && !isNaN(form.budgetDay2[index - 1].yesterday) ? form.budgetDay2[index - 1].yesterday : "" }}</td>
              <td>{{ typeof form.budgetDay2[index - 1] !== "undefined" && !isNaN(form.budgetDay2[index - 1].today) ? form.budgetDay2[index - 1].today : "" }}</td>
              <td>{{ typeof form.budgetDay2[index - 1] !== "undefined" && !isNaN(form.budgetDay2[index - 1].total) ? form.budgetDay2[index - 1].total : "" }}</td>
            </tr>
            <tr>
              <td>합계</td>
              <td>{{ allYesterday }}</td>
              <td>{{ allToday }}</td>
              <td>{{ total }}</td>

              <td>{{ typeof form.budgetDay2[12] !== "undefined" ? form.budgetDay2[9].장비명 : "" }}</td>
              <td>{{ typeof form.budgetDay2[12] !== "undefined" ? form.budgetDay2[9].yesterday : "" }}</td>
              <td>{{ typeof form.budgetDay2[12] !== "undefined" ? form.budgetDay2[9].today : "" }}</td>
              <td>{{ typeof form.budgetDay2[12] !== "undefined" ? form.budgetDay2[9].total : "" }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--작업내용-->
      <div class="table-container" style="margin-top: 10px">
        <table>
          <tbody>
            <tr>
              <th rowspan="2">작업내용</th>
              <th style="width: 480px">금일</th>
              <th style="width: 480px">명일</th>
            </tr>
            <tr>
              <td>
                <div class="w-full h-full p-2" style="min-height: 180px; white-space: pre; text-align: left;">{{ form.inputA_1 }}</div>
              </td>
              <td>
                <div class="w-full h-full p-2" style="min-height: 180px; white-space: pre; text-align: left;">{{ form.inputA_2 }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--안전점검사항-->
      <div class="table-container" style="margin-top: 10px; page-break-before: always">
        <table class="inspection-table">
          <tbody>
            <tr>
              <th rowspan="30" style="width: 33px">안<br />전<br />점<br />검<br />사<br />항</th>
              <th>구분</th>
              <th>점검항목</th>
              <th>양호</th>
              <th>불량</th>
              <th>N/A</th>
              <th>비고</th>
            </tr>
            <tr v-for="index in form.checkList.length" :key="index">
              <th v-if="typeof form.checkList[index - 1].title !== 'undefined'" :rowspan="form.checkList[index - 1].titleRow">{{ form.checkList[index - 1].title }}</th>
              <td v-if="typeof form.checkList[index - 1].label !== 'undefined'" class="text-left">{{ form.checkList[index - 1].label }}</td>
              <td v-if="typeof form.checkList[index - 1].label !== 'undefined'">
                <img v-if="form.checkList[index - 1].is_checked === 'Yes'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td v-if="typeof form.checkList[index - 1].label !== 'undefined'">
                <img v-if="form.checkList[index - 1].is_checked === 'No'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td v-if="typeof form.checkList[index - 1].label !== 'undefined'">
                <img v-if="form.checkList[index - 1].is_checked === 'N/A'" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
              </td>
              <td v-if="typeof form.checkList[index - 1].label !== 'undefined'">{{ form.checkList[index - 1].note }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--사업장 순회점검-->
      <div class="table-container" style="margin-top: 10px; break-inside: avoid">
        <table>
          <tbody>
            <tr>
              <th rowspan="2">사업장<br />순회점검</th>
              <th style="width: 480px">지적사항</th>
              <th style="width: 480px">조치사항</th>
            </tr>
            <tr>
              <td style="padding: 10px">
                <div class="w-full" style="min-height: 180px; white-space: pre-line; text-align: left;">{{ form.inputB_1 }}</div>
              </td>
              <td style="padding: 10px">
                <div class="w-full" style="min-height: 180px; white-space: pre-line; text-align: left;">{{ form.inputB_2 }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 사진대지 -->
      <photo-upload-grid-module v-model="form.photoList" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">
        <template #customTitle>
          <div style="font-size: 24px; font-weight: 700; line-height: 35px; padding-bottom: 16px">□ 사진대지</div>
        </template>
      </photo-upload-grid-module>
    </div>
  </div>
</template>
<script>
export default {
  name: "Print261",
  props: {
    board: Object,
    form: Object,
  },

  computed: {
    allYesterday() {
      if (this.form.budgetDay1) {
        const _yd = this.form.budgetDay1.reduce((prev, data) => {
          if (data.yesterday) return prev + Number(data.yesterday);
          else return prev;
        }, 0);
        return _yd;
      }
      return 0;
    },
    allToday() {
      if (this.form.budgetDay1) {
        const _td = this.form.budgetDay1.reduce((prev, data) => {
          if (data.today) return prev + Number(data.today);
          else return prev;
        }, 0);
        return _td;
      }
      return 0;
    },
    total() {
      // const _tt = this.list.reduce((prev, data) => {
      //   if (!!data.total) return prev + Number(data.total);
      //   else return prev;
      // }, 0);
      // return _tt;
      return this.allYesterday + this.allToday;
    },
  },
  mounted() {
    console.log("form", this.form);
    console.log("budgetDay1", this.form.budgetDay1);
    console.log("budgetDay2", this.form.budgetDay2);
  },
};
</script>

<style lang="scss" scoped>
.head {
  background-color: #ececec;
  display: grid;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.title {
  display: grid !important;
  grid-template-columns: 1fr 440px !important;

  justify-content: center;
  align-items: center;

  .sign {
    display: grid;
    grid-template-columns: 40px 1fr 1fr;

    div {
      height: 40px;

      span {
        display: grid;
        width: 100%;
        height: 100%;

        justify-content: center;
        align-items: center;
      }
    }
  }

  .body {
    display: grid;
    justify-content: center;
    align-items: center;
    height: 98px !important;
  }
}
.sign {
  border-left: 1px solid #757575;
  border-top: 1px solid #757575;

  .head {
    border-right: 1px solid #757575;
  }
  .body {
    border-right: 1px solid #757575;
  }

  div > .head {
    border-bottom: 1px solid #757575;
  }
}
.input-table {
  display: grid;
  grid-template-columns: 696fr 347fr;

  .grid {
    grid-template-columns: 1fr 55px 55px 55px;
  }

  .item {
    display: grid;
    justify-content: center;
    align-content: center;
    padding: 0.5rem;
  }

  .input1 {
    display: grid;
    grid-template-columns: 33px 1fr;
  }

  .input2 {
    display: grid;
    grid-template-columns: 33px 1fr;
  }

  .head {
    padding: 0.5rem;
  }
}

.input-table {
  border-top: 1px solid #757575;
  border-left: 1px solid #757575;

  .head {
    border-right: 1px solid #757575;
    border-bottom: 1px solid #757575;
  }
  .item {
    border-right: 1px solid #757575;
    border-bottom: 1px solid #757575;
  }
}

.table-container {
  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      font-size: 14px;
      border: 1px solid #757575;
      text-align: center;
      height: 35px;
    }
    th {
      background-color: #ececec;
      font-weight: 500;
    }
  }
}
table.inspection-table {
  tr {
    td {
      padding: 0 15px;

      img {
        margin: auto;
      }
    }

  }
}
.signCell {
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
