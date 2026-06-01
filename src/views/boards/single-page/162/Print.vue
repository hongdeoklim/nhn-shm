<template>
  <div>
    <!--    기본정보-->
    <table id="basicInfoTable">
      <tbody>
        <tr>
          <td class="titleCell bordered" height="60">현장명</td>
          <td class="bordered">{{ form.stdInfo.field_name }}</td>
          <td class="bordered title" colspan="4"><span style="color: #0000ff">수시</span> 위험성 평가표</td>
          <td rowspan="10" class="bordered titleCell">평<br />가<br />자</td>
          <td rowspan="2" colspan="2" class="bordered titleCell">작성자<br />(협력사)</td>
          <td rowspan="2" class="bordered signCell">
            <div>
              <div class="signName">{{ form.checker[0].input2 }}<br v-if="form.checker[0].input2" />{{ form.checker[0].input4 }}</div>
              <div class="signatureContainer">(서명)</div>
              <img :src="form.checker[0].input5" />
            </div>
          </td>

          <td rowspan="2" style="padding: 0"></td>
        </tr>
        <tr>
          <td rowspan="2" class="titleCell bordered" height="60">업체명</td>
          <td rowspan="2">{{ form.stdInfo.com_name }}</td>
          <td colspan="3" class="titleCell bordered" height="30">위험도 수준</td>
          <td rowspan="2" class="titleCell bordered">관리기준</td>
        </tr>
        <tr>
          <td class="titleCell bordered">등급</td>
          <td class="titleCell bordered">점수</td>
          <td class="titleCell bordered">수준</td>
          <td rowspan="5" class="titleCell bordered">검<br />토<br />자</td>
          <td rowspan="3" class="titleCell bordered">관리감독자<br />(시공사)</td>
          <td rowspan="3" class="bordered signCell">
            <div>
              <div class="signName">{{ form.checker[1].input2 }}<br v-if="form.checker[1].input2" />{{ form.checker[1].input4 }}</div>
              <div class="signatureContainer">(서명)</div>
              <img :src="form.checker[1].input5" />
            </div>
          </td>
          <td rowspan="3" style="padding: 0"></td>
        </tr>
        <tr>
          <td rowspan="2" class="titleCell bordered" height="60">공종명</td>
          <td rowspan="2" class="bordered">{{ form.inputB_2 }}</td>
          <td class="titleCell bordered" height="30" style="color: #e42728; font-weight: bold">A</td>
          <td class="bordered textRight">16~20 점</td>
          <td rowspan="2" class="bordered textCenter">허용 불가</td>
          <td rowspan="2" class="bordered">
            <div class="criteriaTitle">위험작업 불허</div>
            <div>관련공정 및 활동 즉시 중지</div>
          </td>
        </tr>
        <tr>
          <td class="titleCell bordered" height="30" style="color: #e42728; font-weight: bold">B</td>
          <td class="bordered textRight">15 점</td>
        </tr>
        <tr>
          <td class="titleCell bordered" height="60">작업기간</td>
          <td class="bordered">{{ form.inputB_8 }} &nbsp;~&nbsp; {{ form.inputB_9 }}</td>
          <td class="titleCell bordered" style="color: #e42728; font-weight: bold">C</td>
          <td class="bordered textRight">9~12 점</td>
          <td class="bordered textCenter">중대한 위험</td>
          <td class="bordered">
            <div class="criteriaTitle">조건부 허용 위험</div>
            <div>현재 위험이 없으면 작업을 계속하되, 위험감소 활동을 실시</div>
          </td>
          <td rowspan="2" class="titleCell bordered">안전관리자<br />시공사</td>
          <td rowspan="2" class="bordered signCell">
            <div>
              <div class="signName">{{ form.checker[2].input2 }}<br v-if="form.checker[2].input2" />{{ form.checker[2].input4 }}</div>
              <div class="signatureContainer">(서명)</div>
              <img :src="form.checker[2].input5" />
            </div>
          </td>
          <td height="30" style="padding: 0"></td>
        </tr>
        <tr>
          <td rowspan="2" class="titleCell bordered" height="60">평가일시</td>
          <td rowspan="2" class="bordered">{{ form.inputB_4 }}</td>
          <td rowspan="2" class="titleCell bordered" style="color: #e42728; font-weight: bold">D</td>
          <td rowspan="2" class="bordered textRight">8 점</td>
          <td rowspan="2" class="bordered textCenter">통제</td>
          <td rowspan="2" class="bordered">
            <div class="criteriaTitle">위험작업 수용</div>
            <div>관리적 대책 필요</div>
          </td>
          <td height="30" style="padding: 0"></td>
        </tr>
        <tr>
          <td colspan="2" rowspan="3" class="titleCell bordered">승인자<br />(시공사 관리책임자)</td>
          <td rowspan="3" class="bordered signCell">
            <div>
              <div class="signName">{{ form.checker[3].input2 }}<br v-if="form.checker[3].input2" />{{ form.checker[3].input4 }}</div>
              <div class="signatureContainer">(서명)</div>
              <img :src="form.checker[3].input5" />
            </div>
          </td>
          <td rowspan="3" style="padding: 0"></td>
        </tr>
        <tr>
          <td rowspan="2" class="titleCell bordered">차수</td>
          <td rowspan="2" class="bordered">{{ form.inputB_7 }}</td>
          <td class="titleCell bordered" style="color: #ff8510; font-weight: bold" height="30">E</td>
          <td class="bordered textRight">4~6 점</td>
          <td class="bordered textCenter">경미</td>
          <td rowspan="2" class="bordered">
            <div class="criteriaTitle">허용 가능한 위험</div>
            <div>현 상태로 계속 작업 가능</div>
          </td>
        </tr>
        <tr>
          <td class="titleCell bordered" style="color: #28c76f; font-weight: bold" height="30">F</td>
          <td class="bordered textRight">1~3 점</td>
          <td class="bordered textCenter">무시</td>
        </tr>
      </tbody>
    </table>

    <table id="detailTable" style="margin-top: 16px" class="pageBreak">
      <thead>
        <tr>
          <th colspan="3">❶ 작업개요</th>
          <th colspan="6">❷ 위험성 평가 관련 세부 사항</th>
          <th rowspan="2" style="background-color: #fffce3">❸ 검토의견<br /><span style="color: #cdcdcd">(주)농협네트웍스</span></th>
          <th rowspan="2" style="background-color: #fffce3">담당자</th>
        </tr>
        <tr>
          <th>작업내용</th>
          <th>예상작업일</th>
          <th>작업위치</th>
          <th style="color: #e42728">유해·위험요인</th>
          <th>재해형태</th>
          <th style="width: 45px">빈도</th>
          <th style="width: 45px">강도</th>
          <th style="width: 45px; padding: 0" class="riskCell">위험도</th>
          <th style="color: #0029ff">개선대책</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in form.riskAppraisalList" :key="index">
          <td height="80" class="textCenter">{{ row.input_5 }}</td>
          <td class="textCenter" style="width: 110px; padding: 0">{{ row.input_13 }} ~ {{ row.input_14 }}</td>
          <td class="textCenter">{{ row.input_15 }}</td>
          <td >{{ row.input_2_print }}</td>
          <td class="textCenter">{{ row.input_3_print }}</td>
          <td class="textCenter">{{ row.input_6 }}</td>
          <td class="textCenter">{{ row.input_7 }}</td>
          <td class="textCenter riskCell" :class="'riskCell' + row.input_8">{{ row.input_8 }}</td>
          <td>{{ row.input_4 }}</td>
          <td>{{ row.input_10 }}</td>
          <td>
            <div style="display: flex; width: 100%; min-height: 80px; flex-direction: column; justify-content: space-evenly">
              <div style="display: flex; width: 100%; justify-content: space-between">
                <div style="text-align: center; white-space: nowrap">
                  <div>❚ 이행담당자</div>
                  <div>{{ row.input_11 }}</div>
                </div>
                <div style="color: #9ca0a4; word-break: keep-all; padding-left: 20px; align-self: center">(서명)</div>
              </div>
              <div style="display: flex; width: 100%; justify-content: space-between">
                <div style="text-align: center; white-space: nowrap">
                  <div>❚ 점검담당자</div>
                  <div>{{ row.input_12 }}</div>
                </div>
                <div style="color: #9ca0a4; word-break: keep-all; padding-left: 20px; align-self: center">(서명)</div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="11" class="titleCell" style="text-align: left; padding-top: 8px; padding-bottom: 8px">❹ 누락 공종 및 추가위험 도출 사항</td>
        </tr>
        <tr>
          <td height="80" class="textCenter"></td>
          <td class="textCenter" style="width: 110px; padding: 0"></td>
          <td class="textCenter"></td>
          <td></td>
          <td class="textCenter"></td>
          <td class="textCenter"></td>
          <td class="textCenter"></td>
          <td class="textCenter riskCell"></td>
          <td></td>
          <td></td>
          <td>
            <div style="display: flex; width: 100%; min-height: 80px; flex-direction: column; justify-content: space-evenly">
              <div style="display: flex; width: 100%; justify-content: space-between">
                <div style="text-align: center; white-space: nowrap">
                  <div>❚ 이행담당자</div>
                  <div>&nbsp;</div>
                </div>
                <div style="color: #9ca0a4; word-break: keep-all; padding-left: 20px; align-self: center">(서명)</div>
              </div>
              <div style="display: flex; width: 100%; justify-content: space-between">
                <div style="text-align: center; white-space: nowrap">
                  <div>❚ 점검담당자</div>
                  <div>&nbsp;</div>
                </div>
                <div style="color: #9ca0a4; word-break: keep-all; padding-left: 20px; align-self: center">(서명)</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!--참석자 명단-->
    <h1 class="titleFull">위험성평가 참석자 명단</h1>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-6 flex items-start">
        <div class="label-text mr-4 mt-2">차수</div>
        <span class="print-input"> {{ form.inputB_7 }} </span>
      </div>
      <div class="col-span-6 flex items-start">
        <div class="label-text mr-4 mt-2">평가일시</div>
        <span class="print-input"> {{ form.inputB_4 }} </span>
      </div>
    </div>

    <table style="margin-top: 24px" class="pageBreak">
      <tr>
        <td style="width: 50%; padding-right: 5px; vertical-align: top;">
          <table class="attendeeTable">
            <tbody>
              <tr>
                <td class="titleCell">No.</td>
                <td class="titleCell">소속</td>
                <td class="titleCell">직급</td>
                <td class="titleCell">직책</td>
                <td class="titleCell">성명</td>
                <td class="titleCell">서명</td>
                <td class="titleCell">비고</td>
              </tr>
              <tr v-for="index in 15" :key="index">
                <td>{{ index }}</td>
                <td>{{ !!form.participant[index - 1] ? form.participant[index - 1].input1 : "" }}</td>
                <td>{{ !!form.participant[index - 1] ? form.participant[index - 1].input2 : "" }}</td>
                <td>{{ !!form.participant[index - 1] ? form.participant[index - 1].input3 : "" }}</td>
                <td>{{ !!form.participant[index - 1] ? form.participant[index - 1].input4 : "" }}</td>
                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                  <img v-if="!!form.participant[index - 1]" height="44" :src="form.participant[index - 1].input5" />
                </td>
                <td>{{ !!form.participant[index - 1] ? form.participant[index - 1].input6 : "" }}</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td style="width: 10px"></td>
        <td style="width: 50%; padding-left: 5px; vertical-align: top;">
          <table class="attendeeTable">
            <tbody>
              <tr>
                <td class="titleCell">No.</td>
                <td class="titleCell">소속</td>
                <td class="titleCell">직급</td>
                <td class="titleCell">직책</td>
                <td class="titleCell">성명</td>
                <td class="titleCell">서명</td>
                <td class="titleCell">비고</td>
              </tr>
              <tr v-for="index in 15" :key="index + 15">
                <td>{{ index + 15 }}</td>
                <td>{{ !!form.participant[index + 15 - 1] ? form.participant[index + 15 - 1].input1 : "" }}</td>
                <td>{{ !!form.participant[index + 15 - 1] ? form.participant[index + 15 - 1].input2 : "" }}</td>
                <td>{{ !!form.participant[index + 15 - 1] ? form.participant[index + 15 - 1].input3 : "" }}</td>
                <td>{{ !!form.participant[index + 15 - 1] ? form.participant[index + 15 - 1].input4 : "" }}</td>
                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                  <img v-if="!!form.participant[index + 15 - 1]" height="44" :src="form.participant[index + 15 - 1].input5" />
                </td>
                <td>{{ !!form.participant[index + 15 - 1] ? form.participant[index + 15 - 1].input6 : "" }}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>

    <!-- 사진대지 -->
    <photo-upload-grid-module v-model="form.photoList" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">
      <template #customTitle>
        <h1 style="font-size: 24px; font-weight: bold; text-align: center; line-height: 110px">위험성평가 사진대지</h1>
      </template>
    </photo-upload-grid-module>
  </div>
</template>

<script>
export default {
  name: "Print162",
  props: {
    board: Object,
    form: Object,
  },
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
$approval-border: 2px solid #cdcdcd;
$title-bg-color: #f9f9f9;

th,
td {
  break-inside: avoid;
}

.bordered {
  border: 1px solid $border-color;
}
.titleCell {
  background-color: $title-bg-color;
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
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
.textCenter {
  text-align: center;
}
.textRight {
  text-align: right;
}
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .signTitle {
    width: 125px;
    height: 38px;
  }
  .signBody {
    height: 100px;
    border-bottom: 0;
  }
}
#basicInfoTable {
  td {
    padding: 0 14px;
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
}
#detailTable {
  thead {
    border-bottom: double $border-color;
  }
  th {
    background-color: $title-bg-color;
    text-align: center;
    height: 50px;
  }
  td {
    padding: 0 14px;
  }
  th,
  td {
    border: 1px solid $border-color;
    font-size: 14px;
  }
  .riskCell {
    background-color: #fff6df;
  }
  .riskCellA,
  .riskCellB,
  .riskCellC,
  .riskCellD {
    color: #e42728;
  }
  .riskCella,
  .riskCellb,
  .riskCellc,
  .riskCelld {
    color: #e42728;
  }
  .riskCellE,
  .riskCelle {
    color: #ff8510;
  }
  .riskCellF,
  .riskCellf {
    color: #28c76f;
  }
}
.criteriaTitle {
  color: #3c3c3c;
  font-weight: bold;
  text-decoration: underline;
}
.contentTable {
  td {
    border: 1px solid $border-color;
    padding: 19px 14px;
  }
  .titleCell {
    width: 180px;
    padding: 19px 0;
    font-size: 14px;
    font-weight: 500;
  }
}
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}
.circleNumber {
}

.attendeeTable {
  td {
    height: 50px;
    border: 1px solid $border-color;
    text-align: center;
    line-height: 14px;
  }
}

.photoWrap {
  .photoContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 400px;
    border-radius: 6px;
    border: dashed 1px $border-color;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
}
/*.photoWrap:nth-child(2n) {
  page-break-after: always;
}*/
img {
  -webkit-print-color-adjust: exact;
}
.pageBreak {
  page-break-after: always;
}
</style>
