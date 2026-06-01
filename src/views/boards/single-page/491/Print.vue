<template>
  <div>
    <div class="print-break-page">
      <div class="title">안전관리자 선임보고서</div>

      <!-- 본사 -->
      <table>
        <colgroup>
          <col width="100" />
        </colgroup>
        <tbody>
          <tr>
            <th class="head" rowspan="3">본사</th>
            <td>
              <p class="thead">사업장명</p>
              <p>{{ form.inputA_1 }}</p>
            </td>
            <td>
              <p class="thead">사업자등록번호</p>
              <p>{{ form.inputA_2 | comNumber}}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">사업주 또는 대표자</p>
              <p>{{ form.inputA_3 }}</p>
            </td>
            <td>
              <p class="thead">전화번호</p>
              <p>{{ form.inputA_4 }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="thead">소재지</p>
              <p>{{ form.inputA_5 }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 현장 개요 -->
      <p>※ 아래의 * 란은 원수급인이나 건설공사시공주도총괄ㆍ관리자만 작성합니다</p>
      <table>
        <colgroup>
          <col width="100" />
        </colgroup>
        <tbody>
          <tr>
            <th class="head" rowspan="8">현장 개요</th>
            <td>
              <p class="thead">현장명(사업개시번호)</p>
              <p>{{ form.inputB_1 }}</p>
            </td>
            <td>
              <p class="thead">도급인 또는 건설공사시공주도총괄·관리자</p>
              <p>{{ form.inputB_3 }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">전화번호</p>
              <p>{{ form.inputB_2 }}</p>
            </td>
            <td>
              <p class="thead">휴대전화번호</p>
              <p>{{ form.inputB_4 }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="thead">소재지</p>
              <p>{{ form.inputB_5 }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">공사기간</p>
              <p>
                <span v-if="!!form.inputB_6">{{ form.inputB_6 }}</span>
                <span v-if="!!form.inputB_6 || !!form.inputB_7" class="mx-1">~</span>
                <span v-if="!!form.inputB_7">{{ form.inputB_7 }}</span>
              </p>
            </td>
            <td>
              <p class="thead">공사금액(상시근로자 수)</p>
              <p class="float-right">{{ form.inputB_8 | comma }}({{ form.inputB_9 | comma }})</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">굴착깊이(M)*</p>
              <p>{{ form.inputB_10 | comma }}</p>
            </td>
            <td>
              <p class="thead">건축물ㆍ공작물의 최대높이(M)*</p>
              <p>{{ form.inputB_11 | comma }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">건축물의 연면적(㎡)*</p>
              <p>{{ form.inputB_12 | comma }}</p>
            </td>
            <td>
              <p class="thead">건축물의 최대층고(M)*</p>
              <p>{{ form.inputB_13 | comma }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">PC(Precast Concrete)조립작업 유무*</p>
              <p>{{ form.inputB_14 }}</p>
            </td>
            <td>
              <p class="thead">다리의 최대 지간 길이(M)*</p>
              <p>{{ form.inputB_15 | comma }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p class="thead">터널길이(M)*</p>
              <p>{{ form.inputB_16 | comma }}</p>
            </td>
            <td>
              <p class="thead">댐의 용도 및 저수용량(TON)*</p>
              <p>{{ form.inputB_17 | comma }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- TargetList -->
      <table v-for="targetItem in form.targetList" v-bind:key="targetItem.id" class="print-container">
        <colgroup>
          <col width="100" />
          <col width="100" />
        </colgroup>
        <tbody>
          <tr>
            <th class="head" rowspan="10">{{ targetItem.title }}</th>
            <td colspan="2">
              <p class="thead" style="min-width: auto">성명</p>
              <p>{{ targetItem.data[0].name }}</p>
              <p class="thead" style="min-width: auto">생년월일</p>
              <p>{{ targetItem.data[0].birth }}</p>
            </td>
            <td>
              <p class="thead">기관명</p>
              <p>{{ targetItem.data[0].company }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="thead">전자우편 주소</p>
              <p>{{ targetItem.data[0].email }}</p>
            </td>
            <td>
              <p class="thead">전화번호</p>
              <p>{{ targetItem.data[0].phone }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <p class="thead">자격/면허번호</p>
              <p>{{ targetItem.data[0].licenseCode }}</p>
            </td>
          </tr>
          <tr class="text-center">
            <td rowspan="3">경력</td>
            <td>기관명</td>
            <td>기간</td>
          </tr>
          <tr class="text-center" v-for="(career, career_i) in targetItem.data[0].list" :key="career_i">
            <td>{{ career.input1 }}</td>
            <td>{{ !!career.input2.sDate ? `${career.input2.sDate} ~ ${career.input2.eDate}` : "" }}</td>
          </tr>
          <tr class="text-center">
            <td rowspan="2">학력</td>
            <td>학교</td>
            <td>학과</td>
          </tr>
          <tr class="text-center">
            <td>{{ targetItem.data[0].educationLevel }}</td>
            <td>{{ targetItem.data[0].major }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <p class="thead">선임 등 연ㆍ월ㆍ일</p>
              <p>{{ targetItem.data[0].assignmentDate }}</p>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <p class="thead">전담·겸임구분</p>
              <p>{{ targetItem.data[0].type }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mx-5 mb-2">「산업안전보건법 시행규칙」 제14조제2항에 따라 위와 같이 보고서를 제출합니다.</p>
      <div class="flex justify-end items-center gap-1">
        <p class="text-right">{{ nowDate.year }}</p>
        <div>년</div>
        <p class="text-right">{{ nowDate.month }}</p>
        <div>월</div>
        <p class="text-right">{{ nowDate.day }}</p>
        <div>일</div>
      </div>
      <div class="flex justify-end items-center gap-5">
        <div>보고인(사업주 또는 대표자)</div>
        <div class="flex items-center">{{ form.inputC_1 }}, <img v-if="!!form.inputC_2" :src="form.inputC_2" alt="서명" style="width: 120px; height: 60px; object-fit: contain" /></div>
        <div>(서명 또는 인)</div>
      </div>
      <div class="print-foot">지방고용노동청(지청)장<span>귀하</span></div>
    </div>
    <div class="print-container">
      <p>[별 지]</p>
      <div class="title">안전관리자 선임보고서</div>
      <div v-for="(targetItem, targetItem_i) in form.targetList" v-bind:key="targetItem.id" v-show="1 < targetItem.data.length">
        <table v-for="(_data, _data_i) in targetItem.data" :key="`${targetItem_i}_${_data_i}`" v-show="_data_i !== 0" class="print-container">
          <colgroup>
            <col width="100" />
            <col width="100" />
          </colgroup>
          <tbody>
            <tr>
              <th class="head" rowspan="10">{{ targetItem.title }}</th>
              <td colspan="2">
                <p class="thead" style="min-width: auto">성명</p>
                <p>{{ _data.name }}</p>
                <p class="thead" style="min-width: auto">생년월일</p>
                <p>{{ _data.birth }}</p>
              </td>
              <td>
                <p class="thead">기관명</p>
                <p>{{ _data.company }}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <p class="thead">전자우편 주소</p>
                <p>{{ _data.email }}</p>
              </td>
              <td>
                <p class="thead">전화번호</p>
                <p>{{ _data.phone }}</p>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <p class="thead">자격/면허번호</p>
                <p>{{ _data.licenseCode }}</p>
              </td>
            </tr>
            <tr class="text-center">
              <td rowspan="3">경력</td>
              <td>기관명</td>
              <td>기간</td>
            </tr>
            <tr class="text-center" v-for="(career, career_i) in _data.list" :key="career_i">
              <td>{{ career.input1 }}</td>
              <td>{{ !!career.input2.sDate ? `${career.input2.sDate} ~ ${career.input2.eDate}` : "" }}</td>
            </tr>
            <tr class="text-center">
              <td rowspan="2">학력</td>
              <td>학교</td>
              <td>학과</td>
            </tr>
            <tr class="text-center">
              <td>{{ _data.educationLevel }}</td>
              <td>{{ _data.major }}</td>
            </tr>
            <tr>
              <td colspan="3">
                <p class="thead">선임 등 연ㆍ월ㆍ일</p>
                <p>{{ _data.assignmentDate }}</p>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <p class="thead">전담·겸임구분</p>
                <p>{{ _data.type }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Print",
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    nowDate() {
      return { year: moment().format("YYYY"), month: moment().format("M"), day: moment().format("DD") };
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-family: Noto Sans KR;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0em;
  text-align: center;

  padding: 32px 0;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  border-top: solid 2px #cdcdcd;
  border-bottom: solid 2px #cdcdcd;

  margin-bottom: 10px;

  th {
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    text-align: center;
    background: #f9f9f9;
    border: 1px solid #cdcdcd;
    border-left: 0;
  }
  td {
    height: 26px;
    border: 1px solid #cdcdcd;

    & > p {
      padding: 2px 10px;
    }
  }
  tr > td:last-child {
    border-right: 0;
  }
}

p {
  display: inline-block;
  min-width: 92px;
  font-family: Noto Sans KR;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0px;
  text-align: left;

  &.thead {
    min-width: 140px;
    font-weight: 500;
  }
}

.print-foot {
  display: flex;
  justify-items: center;

  font-family: Noto Sans KR;
  font-size: 20px;
  font-weight: 500;
  line-height: 39px;
  letter-spacing: 0em;
  text-align: left;
  border-bottom: 3px solid #777777;

  padding: 2px 30px;

  span {
    font-family: Noto Sans KR;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: center;
    margin-left: 6px;
  }
}
</style>
