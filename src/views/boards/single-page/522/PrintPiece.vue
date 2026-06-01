<template>
  <div>
    <!--    기본정보-->
    <table id="basicInfoTable" class="borderTable" cellspacing="0">
      <colgroup>
        <col width="180" />
        <col width="431" />
        <col width="180" />
        <col width="431" />
        <col width="50" />
        <col width="431" />
      </colgroup>

      <thead>
        <tr>
          <th colspan="7"><h1 class="text-center">최초 위험성평가표</h1></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>현장명</th>
          <td class="text-center">{{ form.stdInfo.field_name }}</td>
          <th>업체명</th>
          <td class="text-center">{{ form.stdInfo.department }}</td>
          <th rowspan="3">평<br />가<br />자</th>
          <td rowspan="3" class="p-0">
            <div class="w-full h-full" style="display: grid; grid-template-columns: 168fr 160fr 100px">
              <div class="border-right border-bottom grid text-center" style="align-items: center; justify-content: center">작성자<br />(협력사)</div>
              <div class="border-bottom" style="display: flex; align-items: center; justify-content: center">
                {{ form.checker[0].input2 }}<br />
                {{ form.checker[0].input4 }}
              </div>
              <div class="border-bottom flex items-center justify-center relative">
                <span class="signContainer1" style="color: #999999">(서명) </span>
                <img v-if="!!form.checker[0].input5" :src="form.checker[0].input5" width="100" class="absolute" style="object-fit: contain; right: 0" />
              </div>
              <div class="border-right grid text-center" style="align-items: center; justify-content: center">승인자<br />(시공사 관리책임자)</div>
              <div style="display: flex; align-items: center; justify-content: center">
                {{ form.checker[1].input2 }}<br />
                {{ form.checker[1].input4 }}
              </div>
              <div class="flex items-center justify-center relative">
                <span class="signContainer1" style="color: #999999">(서명) </span>
                <img v-if="!!form.checker[1].input5" :src="form.checker[1].input5" width="100" class="absolute" style="object-fit: contain; right: 0" />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>공종명</th>
          <td class="text-center">{{ form.selectRiskType ? form.selectRiskType.toString() : "" }}</td>
          <th>작업기간</th>
          <td class="text-center">{{ form.inputB_8 }} ~ {{ form.inputB_9 }}</td>
        </tr>
        <tr>
          <th>평가일</th>
          <td class="text-center">{{ form.inputB_4 }}</td>
          <th>차수</th>
          <td class="text-center">{{ form.inputB_7 }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 체크리스트 -->
    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i>{{ type }}</h5>
      </vs-col>
    </vs-row>
    <table id="detailTable" style="margin-top: 16px" class="w-full borderTable" cellspacing="0">
      <colgroup>
        <col width="46" />
        <col width="160" />
        <col />
        <col width="50" />
        <col width="50" />
        <col width="50" />
        <col width="50" />
        <col />
        <col width="200" />
      </colgroup>

      <thead>
        <tr>
          <th rowspan="2">번호</th>
          <th rowspan="2">작업내용</th>
          <th rowspan="2">유해·위험요인 파악</th>
          <th rowspan="2">해당여부</th>
          <th colspan="3">위험 등급</th>
          <th rowspan="2">위험성 감소대책</th>
          <th rowspan="2">비고</th>
        </tr>
        <tr>
          <th>상</th>
          <th>중</th>
          <th>하</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in riskAppraisalList" :key="index">
          <td class="text-center">{{ row.id }}</td>

          <!-- 작업내용 -->
          <td class="text-center" style="white-space: pre-wrap">{{ get작업내용(row.id) }}</td>

          <!-- 유해위험요인 -->
          <td style="white-space: pre-wrap">{{ get유해위험요인(row.id) }}</td>

          <!-- 해당여부 -->
          <td class="text-center">
            <div class="item-box-check" v-if="row.해당여부 === true" style="text-align: center; align-self: center">
              <vs-icon icon="check" size="small"></vs-icon>
            </div>
            <div v-else class="item-box-check"></div>
          </td>

          <!-- 상 -->
          <td class="text-center">
            <div class="print-radio flex items-center gap-2 justify-center">
              <i style="margin-right: -2px"><feather-icon v-if="row.위험등급 === `${row.id}|상`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
            </div>
          </td>

          <!-- 중 -->
          <td class="text-center">
            <div class="print-radio flex items-center gap-2 justify-center">
              <i style="margin-right: -2px"><feather-icon v-if="row.위험등급 === `${row.id}|중`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
            </div>
          </td>

          <!-- 하 -->
          <td class="text-center">
            <div class="print-radio flex items-center gap-2 justify-center">
              <i style="margin-right: -2px"><feather-icon v-if="row.위험등급 === `${row.id}|하`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
            </div>
          </td>

          <!-- 위험성감소대책 -->
          <td style="white-space: pre-wrap">{{ get위험성감소대책(row.id) }}</td>

          <!-- 비고 -->
          <td>{{ row.비고 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { option_1, option_2, option_3, option_4, option_5, option_6, option_7, option_8, option_9 } from "./options";
export default {
  name: "PrintPiece",
  props: {
    board: Object,
    form: Object,
    type: String,
    start: Number,
    length: Number,
  },
  computed: {
    riskAppraisalList() {
      return this.form.riskAppraisalObject[this.type].slice(this.start, this.start + this.length);
    },
    options() {
      return {
        철거공사: option_1,
        금속공사: option_2,
        "석재 및 타일공사": option_3,
        "기계설비 공사": option_4,
        도장공사: option_5,
        전기공사: option_6,
        "조적·미장방수공사": option_7,
        수장공사: option_8,
        통신공사: option_9,
      };
    },
  },
  methods: {
    get작업내용(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).작업내용;
      } catch (e) {
        return "";
      }
    },
    get유해위험요인(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).유해위험요인;
      } catch (e) {
        return "";
      }
    },
    get위험성감소대책(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).위험성감소대책;
      } catch (e) {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
$approval-border: 2px solid #cdcdcd;
$title-bg-color: #f9f9f9;
table.borderTable {
  border-top: 1px solid $border-color;
  border-left: 1px solid $border-color;

  th,
  td {
    border-right: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    height: 60px;
    padding: 8px 8px;

    font-size: 1rem;
  }

  th {
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.print-radio,
.print-checkbox {
  display: flex;
  align-items: center;

  & > i {
    width: 20px;
    height: 20px;
    border: 2px solid #cdcdcd;
    position: relative;
    margin-right: 6px;
  }
  & .feather-icon {
    transform: translateY(-4px);
  }
}

.print-radio {
  & > i {
    border-radius: 20px;
  }
}
</style>
