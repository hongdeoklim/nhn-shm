<template>
  <div>
    <div class="header">밀폐공간 점검 체크리스트</div>
    <div class="content">
      <div class="content-table">
        <table>
          <tbody>
          <tr>
            <th colspan="1">업체명</th>
            <td colspan="3">{{ form.stdInfo.department }}</td>
            <th colspan="1">점검일</th>
            <td colspan="3">{{ new Date(form.stdInfo.점검일).format('yyyy.MM.dd') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="content">
      <div class="content-table">
        <table>
          <tbody>
          <tr>
            <th style="width: 100%;" rowspan="3" colspan="16">밀폐공간 확인 내용<br/>(적합 O, 부적합 X)</th>
<!--            <th style="width: 120px;" colspan="2">협력사<br/>(점검시간)</th>-->
            <th style="width: 120px;" colspan="2">관리감독자<br/>(종료 시간)</th>
            <th style="width: 120px;" colspan="2">관리책임자<br/>(종료 시간)</th>
          </tr>
          <tr>
<!--            <td colspan="2">-->
<!--              <div class="signatureContainer">-->
<!--                <div>-->
<!--                  <img v-if="form.inputB_2!==''" :src="form.inputB_2" style="max-height: 40px;"/>-->
<!--                </div>-->
<!--              </div>-->
<!--            </td>-->
            <td colspan="2">
              <div class="signatureContainer">
                <div>
                  <img v-if="form.inputB_4!==''" :src="form.inputB_4" style="max-height: 40px;"/>
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="signatureContainer">
                <div>
                  <img v-if="form.inputB_6!==''" :src="form.inputB_6" style="max-height: 40px;"/>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">{{form.inputC_1 }}</td>
            <td colspan="2">{{form.inputC_2 }}</td>
<!--            <td colspan="2">{{form.inputC_3 }}</td>-->
          </tr>

<!--          table 1-->
          <tr v-for="(data, index) in form.tableList1" :key="index">
            <th v-if="index===0" rowspan="6" colspan="2">작업 전</th>
            <td colspan="14" style="text-align: start;">
              <span>· {{ data.title }}</span>
            </td>
            <td style="width: 120px; text-align: -webkit-center;" colspan="2">
              <div v-if="data.check1" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
            </td>
            <td style="width: 120px; text-align: -webkit-center;" colspan="2">
              <div v-if="data.check2" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
            </td>
<!--            <td style="width: 120px; text-align: -webkit-center;" colspan="2">-->
<!--              <div v-if="data.check3" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >-->
<!--                <vs-icon icon="check" size="x-small"></vs-icon>-->
<!--              </div>-->
<!--              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >-->
<!--                <vs-icon icon="check" size="x-small"></vs-icon>-->
<!--              </div>-->
<!--            </td>-->
          </tr>

<!--          table 2-->
          <tr v-for="(data, index) in form.tableList2" :key="index">
            <th v-if="index===0" rowspan="6" colspan="2">작업 중</th>
            <td colspan="14" style="text-align: start;">
              <span>· {{ data.title }}</span>
            </td>
            <td style="width: 120px; text-align: -webkit-center;" colspan="2">
              <div v-if="data.check1" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
            </td>
            <td style="width: 120px; text-align: -webkit-center;" colspan="2">
              <div v-if="data.check2" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
            </td>
<!--            <td style="width: 120px; text-align: -webkit-center;" colspan="2">-->
<!--              <div v-if="data.check3" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >-->
<!--                <vs-icon icon="check" size="x-small"></vs-icon>-->
<!--              </div>-->
<!--              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >-->
<!--                <vs-icon icon="check" size="x-small"></vs-icon>-->
<!--              </div>-->
<!--            </td>-->
          </tr>

          <tr>
            <th style="width: 100%;" rowspan="2" colspan="16">작업 종료 후 확인</th>
            <th style="width: 120px;" colspan="2">관리감독자<br/>(종료 시간)</th>
            <th style="width: 120px;" colspan="2">관리책임자<br/>(확인 시간)</th>
          </tr>
          <tr>
            <td colspan="2">{{form.inputE_1 }}</td>
            <td colspan="2">{{form.inputE_2 }}</td>
          </tr>

<!--          table 3-->
          <tr v-for="(data, index) in form.tableList3" :key="index">
            <th v-if="index===0" rowspan="5" colspan="2">작업 후</th>
            <td colspan="14" style="text-align: start;">
              <span>· {{ data.title }}</span>
            </td>
            <td style="width: 120px; text-align: -webkit-center;" colspan="2">
              <div v-if="data.check1" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
            </td>
            <td style="width: 120px; text-align: -webkit-center;" colspan="2">
              <div v-if="data.check2" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
            </td>
          </tr>
          <tr style="height: 120px;">
            <th colspan="4" class="justify-center">부적합 의견</th>
            <td colspan="18" style="text-align: start; word-break: break-all">{{ form.inputF_1 }}</td>
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
  methods: {
    getCheckBoxUrl(checked) {
      if(checked) {
        return `@/assets/images/print/print_check_checked.svg`;
      } else {
        return `@/assets/images/print/print_check_unchecked.svg`;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding: 20px 0;
}
.content{
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

      th, td {
        border: 1px solid #757575;
        text-align: center;
        min-height: 50px;
        height: 50px;
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
