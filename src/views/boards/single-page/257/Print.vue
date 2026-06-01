<template>
  <div>
    <div class="content">
      <div class="header-table">
        <table>
          <tbody>
            <tr>
              <td class="header-in-table">작업허가서</td>
              <td rowspan="2" class="th-background" style="width: 40px">결<br /><br />재</td>
              <td v-if="!isProject7" class="th-background" style="width: 150px">안전관리자</td>
              <td class="th-background" style="width: 150px">관리책임자</td>
            </tr>
            <tr>
              <td class="content-title" valign="bottom">□ 기본정보</td>
              <td v-if="!isProject7" class="signCell" :style="{ backgroundImage: typeof form.inputC_2 !== 'undefined' ? `url(${form.inputC_2})` : '' }"></td>
              <td class="signCell" :style="{ backgroundImage: typeof form.inputC_4 !== 'undefined' ? `url(${form.inputC_4})` : '' }"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isProject7" class="content-table">
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
              <th>작업구분</th>
              <td colspan="5" class="check-container">
                <div class="grid grid-cols-12">
                  <div v-for="item of inspectionTitles" :key="item.id" class="col-span-5" v-show="item.label !== '공통사항'">
                    <img v-if="form.inspectChecked === item.label" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                    <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
                    {{ item.label }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="content-table">
        <table>
          <tbody>
            <tr>
              <th>현장명</th>
              <td colspan="3">{{ form.stdInfo.field_name }}</td>
              <th>소속명</th>
              <td>{{ form.stdInfo.department }}</td>
            </tr>
            <tr>
              <th>직책</th>
              <td>{{ form.stdInfo.rank }}</td>
              <th>작성자</th>
              <td>{{ form.stdInfo.writer_name }}</td>
              <th>작업일자</th>
              <td>{{ form.inputB_1.sDate }} <span v-if="!!form.inputB_1.sDate || !!form.inputB_1.eDate">~</span>{{ form.inputB_1.eDate }}</td>
            </tr>
            <tr>
              <th>작업내용</th>
              <td>{{ form.inputB_5 }}</td>
              <th>작업장소</th>
              <td>{{ form.inputB_6 }}</td>
              <th>작업인원</th>
              <td>{{ form.inputB_13 | comma }}</td>
            </tr>
            <tr>
              <th>작업구분</th>
              <td colspan="5" class="check-container">
                <div class="grid grid-cols-12">
                  <div v-for="item of inspectionTitles" :key="item.id" class="col-span-5" v-show="item.label !== '공통사항'">
                    <img v-if="form.inspectChecked === item.label" src="@/assets/images/print/print_check_checked.svg" alt="checked" />
                    <img v-else src="@/assets/images/print/print_check_unchecked.svg" alt="unchecked" />
                    {{ item.label }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 작업허가서 정보 -->
    <div v-if="!isProject7" class="content">
      <div class="content-title">□ 작업허가서 정보</div>
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>작업일자</th>
              <td colspan="3">{{ form.inputB_1.sDate }} <span v-if="!!form.inputB_1.sDate || !!form.inputB_1.eDate">~</span>{{ form.inputB_1.eDate }}</td>
              <th>협력업체</th>
              <td>{{ form.companyName }}</td>
            </tr>
            <tr>
              <th>허가번호</th>
              <td>{{ form.inputB_3 }}</td>
              <th>관리감독자</th>
              <td>{{ form.inputB_4 }}</td>
              <th>작업내용</th>
              <td>{{ form.inputB_5 }}</td>
            </tr>
            <tr>
              <th>작업장소</th>
              <td colspan="5">{{ form.inputB_6 }}</td>
            </tr>
            <tr>
              <th>주간작업</th>
              <td colspan="3">{{ form.inputB_7 }} ~ {{ form.inputB_8 }}</td>
              <th>주간인원</th>
              <td>{{ form.inputB_11 }}</td>
            </tr>
            <tr>
              <th>야간연장<br />(18:00 이후)</th>
              <td colspan="3">{{ form.inputB_9 }} ~ {{ form.inputB_10 }}</td>
              <th>야간인원</th>
              <td>{{ form.inputB_12 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--    사전조사 및 작업계획서 내용-->
    <div class="content">
      <div class="content-table">
        <div v-for="title of inspectionTitles" :key="title" v-show="form.inspectChecked === title.label || form.checkedList.includes(title.id)">
          <div class="content-title">□ {{ title.label }}</div>
          <table>
            <tbody>
              <tr>
                <td class="th-background"><span style="font-size: 14px">작업전 안전조치 및 확인 점검 사항(이행여부 = V, 해당사항없음 = N/A)</span></td>
                <td class="th-background" style="width: 70px">양호</td>
                <td class="th-background" style="width: 70px">불량</td>
                <td class="th-background" style="width: 70px">N/A</td>
                <td class="th-background" style="width: 388px">비고(조치결과)</td>
              </tr>
              <tr v-for="(table, table_i) of form[`inspectList_${title.id + 1}`]" :key="`${title.label}_${table_i}`">
                <td class="text-left">
                  <span v-html="table.content"></span><span v-for="(sign, signIndex) of table.sign" :key="signIndex" style="padding-left: 18px">{{ sign.name }} : {{ sign.value }}</span>
                </td>
                <td><PrintCheckbox :value="table.isChecked === '양호'" class="justify-center"/></td>
                <td><PrintCheckbox :value="table.isChecked === '불량'" class="justify-center"/></td>
                <td><PrintCheckbox :value="table.isChecked === 'N/A'" class="justify-center"/></td>
                <td>
                  <span>{{ table.note }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";

export default {
  name: "Print257",
  components: {
    PrintCheckbox,
  },
  props: {
    inspectionTitles: Array,
    form: Object,
    board: Object,
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    isProject7() {
      return this.projectId === "7";
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
}
.content {
  .content-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    margin-top: 20px;
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

      &:last-child {
        margin-bottom: 0;
      }

      th,
      td {
        border: 1px solid #757575;
        text-align: center;
        min-height: 55px;
        height: 55px;
        font-size: 18px;
      }
      th {
        width: 110px;
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

  .th-background {
    background-color: #ececec;
    white-space: nowrap;
  }
}
</style>
