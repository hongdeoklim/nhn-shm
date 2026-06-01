<template>
  <div>
    <h1 style="margin-right: 25%">건설기계·장비별 안전점검표</h1>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 기본정보 ================================================ -->
    <!-- ========================================================================================================== -->
    <h4>□ 기본정보</h4>
    <table style="margin-top: -130px">
      <colgroup>
        <col width="140" />
        <col />
        <col width="140" />
        <col />
        <col width="102" />
        <col width="38" />
        <col />
      </colgroup>
      <tr>
        <td colspan="5" class="border-0"></td>
        <td rowspan="2" class="gray">
          <p style="writing-mode: vertical-lr">결&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;재</p>
        </td>
        <td class="gray">관리책임자</td>
      </tr>
      <tr>
        <td colspan="5" class="border-0"></td>
        <td>
          <div style="height: 80px">
            <img v-if="!!form.inputA_2" :src="form.inputA_2" class="w-full h-full object-contain" alt="서명" />
          </div>
        </td>
      </tr>
      <tr>
        <td class="gray">현장명</td>
        <td>{{ form.stdInfo.field_name }}</td>
        <td class="gray">소속명</td>
        <td>{{ form.stdInfo.department }}</td>
        <td colspan="2" class="gray">부서명</td>
        <td>{{ form.stdInfo.com_name }}</td>
      </tr>
      <tr>
        <td class="gray">직책</td>
        <td>{{ form.stdInfo.rank }}</td>
        <td class="gray">작성자</td>
        <td>{{ form.stdInfo.writer_name }}</td>
        <td colspan="2" class="gray">작성일</td>
        <td>{{ form.stdInfo.date }}</td>
      </tr>
      <tr>
        <td class="gray">{{projectId===7? '해당기간':'점검일'}}</td>
        <td>{{ projectId===7? form.stdInfo.해당기간 : form.stdInfo.점검일 }}</td>
        <td class="gray">{{projectId===7? '작업장소':'점검장소'}}</td>
        <td>{{ projectId===7? form.stdInfo.작업장소 : form.stdInfo.점검장소 }}</td>
        <td colspan="2" class="gray">재해형태</td>
        <td>{{ typeof form.stdInfo.재해형태 === "object" ? form.stdInfo.재해형태.join(", ") : form.stdInfo.재해형태 }}</td>
      </tr>
      <tr>
        <td class="gray">점검대상</td>
        <td colspan="6">
          <div class="grid grid-cols-2 gap-x-6 gap-y-2">
            <div v-for="target in inspectionTitle" :key="`checkbox_${target}`" class="col-span-1 flex items-center">
              <img v-if="form.inspectChecked.includes(target)" src="@/assets/icons/checked_on.svg" style="margin-top: 1px" />
              <img v-else src="@/assets/icons/checked_off.svg" style="margin-top: 1px" />
              <span class="ml-2">{{ target }}</span>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 장비정보 ================================================ -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h4 class="mt-12 mb-4">□ 장비정보</h4>
      <table>
        <tr>
          <td class="gray">장비명</td>
          <td class="gray">제조사 또는 모델명</td>
          <td class="gray">장비 규격(정격하중 또는 인양하중 등)</td>
        </tr>
        <tr v-for="(equ, equ_i) in form.equipmentList" :key="`equ_${equ_i}`">
          <td>{{ equ.input1 }}</td>
          <td>{{ equ.input2 }}</td>
          <td>{{ equ.input3 }}</td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 체크리스트 =============================================== -->
    <!-- ========================================================================================================== -->
    <div v-for="(target, target_i) in inspectionTitle" :key="`checkList_${target}`"
         v-show="form.inspectChecked.includes(target)" class="print-container" :style="'page-break-after: always;'">
      <h4 class="mt-12 mb-4">□ {{ target }}</h4>
      <table>
        <colgroup>
          <col />
          <col width="60" />
          <col width="60" />
          <col width="60" />
          <col width="380" />
        </colgroup>
        <tr>
          <td class="gray">점검내용</td>
          <td class="gray">양호</td>
          <td class="gray">불량</td>
          <td class="gray">N/A</td>
          <td class="gray">비고(조치결과)</td>
        </tr>
        <tbody v-for="(data, data_i) in form[`inspectList_${target_i + 1}`]" :key="`isp_1_1_${data_i}`">
          <tr v-if="!!data.title && (data_i === 0 || data.title !== form[`inspectList_${target_i + 1}`][data_i - 1].title)">
            <td colspan="5" class="text-left font-bold">{{ data.title }}</td>
          </tr>
          <tr>
            <td class="text-left">
              <div v-if="typeof data.content === 'object'">
                <span v-for="(l, l_i) in data.content" :key="`${data_i}_label_${l_i}`" v-html="l" class="before-label"></span>
              </div>
              <span v-else v-html="data.content" class="before-label"></span>
              <div v-if="!!data.table" v-html="data.table" class="table-label"></div>
            </td>
            <td><img v-if="data.isChecked === '양호'" src="@/assets/icons/checked_on.svg" class="check" /> <img v-else src="@/assets/icons/checked_off.svg" class="check" /></td>
            <td><img v-if="data.isChecked === '불량'" src="@/assets/icons/checked_on.svg" class="check" /> <img v-else src="@/assets/icons/checked_off.svg" class="check" /></td>
            <td><img v-if="data.isChecked === 'N/A'" src="@/assets/icons/checked_on.svg" class="check" /> <img v-else src="@/assets/icons/checked_off.svg" class="check" /></td>
            <td><span>{{data.note}}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 사진대지 ================================================ -->
    <!-- ========================================================================================================== -->
    <photo-upload-grid-module v-model="form.photoList" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">
      <template #customTitle>
        <div style="font-size: 24px; font-weight: 700; line-height: 35px; padding-bottom: 16px">□ 사진대지</div>
      </template>
    </photo-upload-grid-module>
  </div>
</template>

<script>
export default {
  name: "Print219",
  props: {
    form: Object,
    inspectionTitle: Array,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-weight: 700;
  font-size: 32px;
  line-height: 46px;
  text-align: center;
  padding: 25px 0px;
}

h4 {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 35px;
}

img.check {
  margin: auto;
  margin-top: -1px;
}

.before-label {
  display: list-item;
  list-style-type: "·";
  padding-left: 6px;
  margin-left: 6px;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td {
    text-align: center;
    border: 1px solid #757575;
    padding: 10px 8px;
    word-break: keep-all;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  td.gray {
    background: #f0f0f0;
  }

  td > div.print-textarea {
    min-height: 0;
    text-align: left !important;
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
