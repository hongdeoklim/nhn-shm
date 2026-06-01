<template>
  <div>
    <!-- 금속공사 -->
    <print-piece v-if="useIndex('금속공사') >= 0" :class="useIndex('금속공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="금속공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('금속공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="금속공사" :start="7" :length="6"/>

    <!-- 기계설비 공사 -->
    <print-piece v-if="useIndex('기계설비공사') >= 0" :class="useIndex('기계설비공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="기계설비공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('기계설비공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="기계설비공사" :start="7" :length="7"/>

    <!-- 방수공사 -->
    <print-piece v-if="useIndex('방수공사') >= 0" :class="useIndex('방수공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="방수공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('방수공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="방수공사" :start="7" :length="5"/>

    <!-- 도장공사 -->
    <print-piece v-if="useIndex('도장공사') >= 0" :class="useIndex('도장공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="도장공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('도장공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="도장공사" :start="7" :length="5"/>

    <!-- 수장공사 -->
    <print-piece v-if="useIndex('수장공사') >= 0" :class="useIndex('수장공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="수장공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('수장공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="수장공사" :start="7" :length="5"/>

    <!-- 전기공사 -->
    <print-piece v-if="useIndex('전기공사') >= 0" :class="useIndex('전기공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="전기공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('전기공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="전기공사" :start="7" :length="5"/>

    <!-- 조적미장공사 -->
    <print-piece v-if="useIndex('조적미장공사') >= 0" :class="useIndex('조적미장공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="조적미장공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('조적미장공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="조적미장공사" :start="7" :length="6"/>

    <!-- 철거공사 -->
    <print-piece v-if="useIndex('철거공사') >= 0" :class="useIndex('철거공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="철거공사" :start="0" :length="7"/>

    <!-- 석재 및 타일공사 -->
    <print-piece v-if="useIndex('석재 및 타일공사') >= 0" :class="useIndex('석재 및 타일공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="석재 및 타일공사" :start="0" :length="7"/>
    <print-piece v-if="useIndex('석재 및 타일공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="석재 및 타일공사" :start="7" :length="3"/>

    <!-- 통신공사 -->
    <print-piece v-if="useIndex('통신공사') >= 0" :class="useIndex('통신공사') > 0 ? 'print-break-page' : ''"
                 :board="board" :form="form" type="통신공사" :start="0" :length="8"/>
    <print-piece v-if="useIndex('통신공사') >= 0" class="print-break-page"
                 :board="board" :form="form" type="통신공사" :start="8" :length="7"/>


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
              <td>{{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input1 : "" }}</td>
              <td>{{ signatureList(form.participant, index - 1, 'input2') }}</td>
              <td>{{ signatureList(form.participant, index - 1, 'input3') }}</td>
              <td>{{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input4 : "" }}</td>
              <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                <img v-if="typeof form.participant[index - 1] !== 'undefined'" height="44" :src="form.participant[index - 1].input5" />
              </td>
              <td>{{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input6 : "" }}</td>
            </tr>
            </tbody>
          </table>
        </td>
        <td style="width: 10px"></td>
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
            <tr v-for="index in 15" :key="index + 15">
              <td>{{ index + 15 }}</td>
              <td>{{ typeof form.participant[index + 15 - 1] !== "undefined" ? form.participant[index + 15 - 1].input1 : "" }}</td>
              <td>{{ signatureList(form.participant, index + 15 - 1, 'input2') }}</td>
              <td>{{ signatureList(form.participant, index + 15 - 1, 'input3') }}</td>
              <td>{{ typeof form.participant[index + 15 - 1] !== "undefined" ? form.participant[index + 15 - 1].input4 : "" }}</td>
              <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                <img v-if="typeof form.participant[index + 15 - 1] !== 'undefined'" height="44" :src="form.participant[index + 15 - 1].input5" />
              </td>
              <td>{{ typeof form.participant[index + 15 - 1] !== "undefined" ? form.participant[index + 15 - 1].input6 : "" }}</td>
            </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>

    <!-- 사진대지 -->
    <photo-upload-grid-module
      v-model="form.photoList"
      :is-print="true"
      :is-print-grid="true"
      :customTitle="true"
      section-title="사진대지"
      placeholder="점검 현장 사진">
      <template #customTitle>
        <h1 style="font-size: 24px; font-weight: bold; text-align: center; line-height: 110px">위험성평가 사진대지</h1>
      </template>
    </photo-upload-grid-module>
  </div>
</template>

<script>
import PrintPiece from "@/views/boards/single-page/523/PrintPiece.vue";

export default {
  name: "Print523",
  components: { PrintPiece },
  props: {
    board: Object,
    form: Object,
  },
  methods: {

    signatureList(list, index, key) {
      if (list.length === 0) return ''
      const data = list[index]
      if (data) {
        return data[`${key}_${data[key]}`] ? data[`${key}_${data[key]}`] : data[key];
      }
      return ''
    },
    useIndex (type) {
      return this.form.selectRiskType.indexOf(type);
    }
  }
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
    white-space: nowrap;
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
