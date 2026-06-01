<template>
  <div>
    <!--    기본정보-->
    <table id="basicInfoTable" class="borderTable" cellspacing="0">
      <colgroup>
        <col width="180" />
        <col width="431"/>
        <col width="180" />
        <col width="431" />
        <col width="50" />
        <col width="431"/>
      </colgroup>

      <thead>
      <tr>
        <th colspan="7"><h1 class="text-center">수시 위험성평가표</h1></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th>현장명</th>
        <td class="text-center">{{form.stdInfo.field_name}}</td>
        <th>업체명</th>
        <td class="text-center">{{form.stdInfo.department}}</td>
        <th rowspan="3">평<br>가<br>자</th>
        <td rowspan="3" class="p-0">
          <div class="w-full h-full" style="display: grid; grid-template-columns: 168fr 160fr 100px">
            <div class="border-right border-bottom grid text-center" style="align-items: center; justify-content: center;">작성자<br>(협력사)</div>
            <div class="border-bottom" style="display: flex; align-items: center; justify-content: center;">
              {{form.checker[0].input2}}<br>
              {{form.checker[0].input4}}
            </div>
            <div class="border-bottom flex items-center justify-center relative">
              <span class="signContainer1" style="color: #999999">(서명) </span>
              <img v-if="!!form.checker[0].input5" :src="form.checker[0].input5" width="100" class="absolute" style="object-fit: contain; right: 0;" />
            </div>
            <div class="border-right grid text-center" style="align-items: center; justify-content: center;">승인자<br>(시공사 관리책임자)</div>
            <div style="display: flex; align-items: center; justify-content: center;">
              {{form.checker[1].input2}}<br>
              {{form.checker[1].input4}}
            </div>
            <div class="flex items-center justify-center relative">
              <span class="signContainer1" style="color: #999999">(서명) </span>
              <img v-if="!!form.checker[1].input5" :src="form.checker[1].input5" width="100" class="absolute" style="object-fit: contain; right: 0;" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <th>공종명</th>
        <td class="text-center">{{form.selectRiskType ? form.selectRiskType.toString() : ''}}</td>
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
        <h5><i class="dot"></i>{{type}}</h5>
      </vs-col>
    </vs-row>
    <table id="detailTable" style="margin-top: 16px" class="w-full borderTable" cellspacing="0">
      <colgroup>
        <col width="46" />
        <col width="160"/>
        <col width="520"/>
        <col width="50"/>
        <col width="50" />
        <col width="50" />
        <col width="520"/>
        <col width="160"/>
        <col width="160"/>
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">번호</th>
          <th rowspan="2">작업내용</th>
          <th rowspan="2">유해·위험요인</th>
          <th colspan="3">위험성 확인결과</th>
          <th rowspan="2">개선대책</th>
          <th rowspan="2">개선완료일</th>
          <th rowspan="2">담당자</th>
        </tr>
        <tr>
          <th>적정</th>
          <th>보완</th>
          <th>해당<br>없음</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in riskAppraisalList" :key="index">
          <td class="text-center">{{ row.id }}</td>

          <!-- 작업내용 -->
          <td style="white-space: pre-wrap">{{ get작업내용(row.id) }}</td>

          <!-- 유해위험요인 -->
          <td style="white-space: pre-wrap">{{ get유해위험요인(row.id) }}</td>

          <!-- 적정 -->
          <td class="text-center">
            <div class="print-radio flex items-center gap-2 justify-center">
              <i style="margin-right:-2px;"><feather-icon v-if="row.위험성확인결과 === `${row.id}|적정`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
            </div>
          </td>

          <!-- 보완 -->
          <td class="text-center">
            <div class="print-radio flex items-center gap-2 justify-center">
              <i style="margin-right:-2px;"><feather-icon v-if="row.위험성확인결과 === `${row.id}|보완`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
            </div>
          </td>

          <!-- 해당없음 -->
          <td class="text-center">
            <div class="print-radio flex items-center gap-2 justify-center">
              <i style="margin-right:-2px;"><feather-icon v-if="row.위험성확인결과 === `${row.id}|해당없음`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
            </div>
          </td>

          <!-- 개선대책 -->
          <td>
            <p style="white-space: pre-wrap">{{ get개선대책(row.id) }}</p>
          </td>
          <!-- 개선완료일 -->
          <td class="text-center">{{ row.개선완료일 }}</td>
          <!-- 담당자 -->
          <td class="text-center">{{ row.담당자 }} </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import option_0 from "./option_0"
import option_1 from "./option_1"
import option_2 from "./option_2"
import option_3 from "./option_3"
import option_4 from "./option_4"
import option_5 from "./option_5"
import option_6 from "./option_6"
import option_7 from "./option_7"
import option_8 from "./option_8"
import option_9 from "./option_9"
export default {
  name: "PrintPiece",
  props: {
    board: Object,
    form: Object,
    type: String,
    start: Number,
    length: Number,
  },
  computed:{
    riskAppraisalList () {

      return this.form.riskAppraisalObject[this.type].slice(this.start, this.start + this.length)
    },
    options () {
      return {
        '금속공사': option_0,
        '기계설비공사': option_1,
        '방수공사': option_2,
        '도장공사': option_3,
        '수장공사': option_4,
        '전기공사': option_5,
        '조적미장공사': option_6,
        '철거공사': option_7,
        '석재 및 타일공사': option_8,
        '통신공사': option_9,
      }
    }
  },
  methods: {

    get작업내용(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).작업내용;
      } catch (e) {
        return ''
      }
    },
    get유해위험요인(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).유해위험요인;
      } catch (e) {
        return ''
      }
    },
    get개선대책(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).개선대책;
      } catch (e) {
        return ''
      }
    },
  }
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
