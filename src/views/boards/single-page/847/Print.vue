<template>
  <div class="print-container">
    <div class="header">화재감시자 지정서</div>
    <div class="content">
      <div class="content-table">
        <table>
          <tbody>
          <tr>
            <th>소속명</th>
            <td>{{ form.inputA_2 }}</td>
            <th>성명</th>
            <td>
              <div class="flex justify-center" style="align-items: center;">
                <div class="signName">{{ form.inputA_1 }}</div>
                <div class="signatureContainer pl-4">
                  <div style="position: absolute;">
                    <img v-if="form.inputA_4!==''" :src="form.inputA_4" style="max-height: 40px;"/>
                  </div>
                  (서명)
                </div>

              </div>
            </td>
          </tr>

          <tr>
            <td colspan="4">
              <div class="textarea1">
                위 사람은 산업안전보건기준에 관한 규칙 제241조의2에 의거 화재를 예방하기 위한 화재감시자 업무를 수행하기 위하여
                {{ form.stdInfo.field_name }} 화기감시자로 지정합니다.
              </div>
            </td>
          </tr>

          <tr>
            <th>화재감시자<br/>지정 대상사업</th>
            <td colspan="3">
              <div class="textarea2">
                1. 작업반경 11미터 이내에 건물구조 자체나 내부(개구부 등으로 개방된 부분을 포함한다)에 가연성 물질이 있는 장소<br/><br/>
                2. 작업반경 11미터 이내 바닥 하부에 가연성 물질이 11미터 이상 떨어져 있지만 불꽃에 의해 쉽게 발화될 우려가 있는 장소<br/><br/>
                3. 가연성 물질이 금속으로 제작된 칸막이·벽·천장·지붕의 반대쪽 면에 인접해 있어 열전도나 열복사에 의해 발화될 우려가 있는 장소<br/><br/>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="4">
              <div class="textarea1">
                화재감시자는 현장 무단이탈 시에는 작업을 대기 조치하고 부득이한 경우에는 새로운 화재감시자를 지정하여야 하며 사전에 ㈜농협네트웍스 관리감독자 및 안전관리자에게 사전통보 하여야한다.
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="4">
              <div class="textarea3">
                <div class="yyyyMMdd p-8" >
                  <span class="year pr-6">{{ new Date(form.stdInfo.date).format('yyyy') }} 년</span>
                  <span class="month pr-6">{{ new Date(form.stdInfo.date).format('MM') }} 월</span>
                  <span class="day">{{ new Date(form.stdInfo.date).format('dd') }} 일</span>
                </div>
                <div>
                  <span class="pr-6">{{ form.inputB_2}}</span>
                  <span class="">{{ form.stdInfo.field_name }}</span>
                </div>
                <div style="display: inline-flex; align-items: center;">
                  <span class="pr-6">{{ form.inputB_3}}</span>
                  <span class="pr-6">{{ form.inputB_1}}</span>

<!--                  <span class="signatureContainer" style="display: inline-flex; align-items: center;">-->
<!--                      <div style="position: absolute; left: 53%;">-->
<!--                        (인)-->
<!--                      </div>-->
<!--                      <img v-if="form.inputB_4!==''" :src="form.inputB_4" style="max-height: 60px;"/>-->
<!--                    </span>-->
                  <div class="flex items-center justify-center relative">
                    <span class="signContainer1" style="color: #999999">(서명 또는 인) </span>
                    <img v-if="!!form.inputB_4" :src="form.inputB_4" width="160" class="absolute" style="object-fit: contain" />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

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
  text-decoration: underline;
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
  .print-textarea no-block {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 230px;
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

.signCell {
  min-width: 250px;
  position: relative;
  > div {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;

    .signName {
      min-width: 140px;
      text-align: center;
    }

    img {
      position: absolute;
      right: 0;
      top: 50%;
      height: 56px;
      transform: translateY(-50%);
    }
  }
}
.textarea1 {
  display: inline-flex;
  align-items: center;
  justify-content: start;
  text-align: start;
  min-height: 230px;
  padding-left: 24px;
  padding-right: 24px;
}
.textarea2 {
  display: inline-flex;
  align-items: center;
  justify-content: start;
  text-align: start;
  min-height: 580px;
  padding-left: 24px;
  padding-right: 24px;
}
.textarea3 {
  align-items: center;
  justify-content: center;
  padding: 30px;
  font-weight: 500;
  font-size: 24px;
}
.signContainer1 {
  position: relative;

  img {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(100%, 0);
  }
}
</style>
