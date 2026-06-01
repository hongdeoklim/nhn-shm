<template>
  <div>
    <div class="flex items-end">
      <div style="flex: 1.2">
        <h1>안전보건 순회점검 보고서</h1>
        <h4 class="mt-6 mb-4">□ 기본정보</h4>
      </div>
      <table class="flex-1 sign">
        <colgroup>
          <col width="38" />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <tr>
          <td rowspan="2" class="gray p-0">
            <div class="flex justify-center items-center">
              <p style="writing-mode: vertical-lr">결&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;재</p>
            </div>
          </td>
          <td class="gray">담당</td>
          <td class="gray">팀장</td>
          <td class="gray">실장</td>
          <td class="gray">대표이사</td>
        </tr>
        <tr>
          <td>
            <div class="p-1" style="height: 80px">
              <img v-if="!!form.inputF_2" :src="form.inputF_2" class="w-full h-full object-contain" />
            </div>
          </td>
          <td>
            <div class="p-1" style="height: 80px">
              <img v-if="!!form.inputF_4" :src="form.inputF_4" class="w-full h-full object-contain" />
            </div>
          </td>
          <td>
            <div class="p-1" style="height: 80px">
              <img v-if="!!form.inputF_6" :src="form.inputF_6" class="w-full h-full object-contain" />
            </div>
          </td>
          <td>
            <div class="p-1" style="height: 80px">
              <img v-if="!!form.inputF_8" :src="form.inputF_8" class="w-full h-full object-contain" />
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 현장개요 ================================================ -->
    <!-- ========================================================================================================== -->
    <table style="margin-top: -1px">
      <tr>
        <td colspan="2" class="gray">현장명</td>
        <td colspan="6">{{ form.inputA_1 }}</td>
        <td colspan="2" class="gray">공사기간</td>
        <td colspan="6">{{ form.inputA_2 }}~{{ form.inputA_3 }}</td>
      </tr>
      <tr>
        <td colspan="2" class="gray">공사금액</td>
        <td colspan="6" class="text-right">{{ form.inputA_4.substring(0, form.inputA_4.length - 6) | comma }}<span class="ml-3">(백만원)</span></td>
        <td colspan="2" class="gray">발 주 처</td>
        <td colspan="6">{{ form.inputA_5 }}</td>
      </tr>
      <tr>
        <td colspan="2" class="gray">공정률</td>
        <td colspan="2" class="gray">계획</td>
        <td colspan="5">{{ form.inputA_6 }}<span class="ml-3">%</span></td>
        <td colspan="2" class="gray">실시</td>
        <td colspan="5">{{ form.inputA_7 }}<span class="ml-3">%</span></td>
      </tr>
      <tr>
        <td colspan="2" class="gray">현장주소</td>
        <td colspan="14">{{ form.inputA_8 }}</td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 점검결과 =============================================== -->
    <!-- ========================================================================================================== -->
    <div>
      <h4 class="mt-12 mb-4">□ 점검결과</h4>
      <table>
        <colgroup>
          <col width="140" />
          <col />
          <col width="140" />
          <col />
        </colgroup>
        <tr>
          <td class="gray">점검일자</td>
          <td>{{ form.inputB_1 | moment("YYYY-MM-DD dddd") }}</td>
          <td class="gray">보완조치일자</td>
          <td>{{ form.inputB_2 }}</td>
        </tr>
      </table>
      <table style="margin-top: -1px">
        <colgroup>
          <col width="140" />
        </colgroup>
        <tr>
          <td rowspan="2" class="gray">공정률</td>
          <td class="gray">경고</td>
          <td class="gray">보완</td>
          <td class="gray">권고</td>
          <td class="gray">중복지적</td>
        </tr>
        <tr>
          <td>
            <PrintRadio :value="form.inputB_4 === '경고'" class="justify-center" />
          </td>
          <td>
            <PrintRadio :value="form.inputB_4 === '보완'" class="justify-center" />
          </td>
          <td>
            <PrintRadio :value="form.inputB_4 === '권고'" class="justify-center" />
          </td>
          <td>
            <PrintRadio :value="form.inputB_4 === '중복지적'" class="justify-center" />
          </td>
        </tr>
      </table>
      <table style="margin-top: -1px">
        <colgroup>
          <col width="140" />
          <col width="220" />
          <col width="60" />
        </colgroup>
        <tr>
          <td rowspan="4" class="gray">안전평가<br />점수</td>
          <td rowspan="4">
            <div>
              <p class="mb-8">{{ form.inputB_5 }} / 100</p>
              <p>※ 금차 점검항목</p>
              <p>{{ form.inputB_6 }} / 50개</p>
            </div>
          </td>
          <td rowspan="4" class="gray break-words">기존평가결과</td>
          <td class="gray">회차</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_num_${post_i}`" class="gray">{{ post_i + 1 }}</td>
        </tr>
        <tr>
          <td class="gray">점검일</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_date_${post_i}`">{{ post.inputB_1 | moment("YYYY-MM-DD dddd") }}</td>
        </tr>
        <tr>
          <td class="gray">공정률</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_percent_${post_i}`">{{ !!post.inputA_7 ? `${post.inputA_7}%` : "" }}</td>
        </tr>
        <tr>
          <td class="gray">점 수</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_score_${post_i}`">{{ !!post.inputB_5 ? `${post.inputB_5}` : "" }}</td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 현장 안전교육 및 회의 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h4 class="mt-12 mb-4">□ 현장 안전교육 및 회의</h4>
      <div class="flex">
        <table>
          <colgroup>
            <col width="140" />
            <col />
            <col />
          </colgroup>
          <tr>
            <td class="gray">대 상</td>
            <td colspan="2">
              <div class="flex gap-6">
                <PrintRadio label="관리책임자 및 관리자" :value="form.inputC_1 === '관리책임자 및 관리자'" class="justify-center" />
                <PrintRadio label="근로자" :value="form.inputC_1 === '근로자'" class="justify-center" />
              </div>
            </td>
          </tr>
          <tr>
            <td class="gray">내 용</td>
            <td colspan="2" class="h-full">
              <p class="print-textarea no-block">{{ form.inputC_2 }}</p>
            </td>
          </tr>
          <tr>
            <td rowspan="3" class="gray">강 사</td>
            <td class="gray">직위</td>
            <td class="gray">서명</td>
          </tr>
          <tr>
            <td>{{ form.inputC_5 }}</td>
            <td class="p-0">
              <img v-if="!!form.inputC_6" :src="form.inputC_6" class="w-full h-full object-contain" />
            </td>
          </tr>
          <tr>
            <td>{{ form.inputC_7 }}</td>
            <td class="p-0">
              <img v-if="!!form.inputC_8" :src="form.inputC_8" class="w-full h-full object-contain" />
            </td>
          </tr>
          <tr>
            <td class="gray">시 간</td>
            <td colspan="2">{{ form.inputC_3 }}~{{ form.inputC_4 }}</td>
          </tr>
        </table>
        <table>
          <colgroup>
            <col width="140" />
            <col />
          </colgroup>
          <tr>
            <td rowspan="4" class="gray border-l-0">사진대지</td>
            <td style="height: 50%" class="p-0">
              <div class="flex items-center justify-center">
                <img v-if="!!form.photoList1[0]" :src="form.photoList1[0].path" alt="" />
              </div>
            </td>
          </tr>
          <tr>
            <td>{{ form.photoList1[0].input }}</td>
          </tr>
          <tr>
            <td style="height: 50%" class="p-0">
              <div class="flex items-center justify-center">
                <img v-if="!!form.photoList1[1]" :src="form.photoList1[1].path" alt="" />
              </div>
            </td>
          </tr>
          <tr>
            <td>{{ form.photoList1[1].input }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 안 전 보 건 점 검 표 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="text-center underline mb-4">안 전 보 건 점 검 표</h4>
      <TableInspectDouble
        :is-print="true"
        :is-table-numbering="true"
        table-numbering-title="보완번호"
        table-header-title="점검항목"
        :table-check-titles="[
          { title: '평가', yes: '△2', no: '△1', na: '○' },
          { title: '지적건수', yes: '경고', no: '보완', na: '권고' },
        ]"
        table-header-yes="양호"
        table-header-no="불량"
        table-header-na="N/A"
        tableTitleColor="#F9F9F9"
        v-model="form.inspect"
        class="mt-5"
      />
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 점검목록 상세 및 보완조치 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="mb-4">□ 점검목록 상세 및 보완조치</h4>
      <table>
        <colgroup>
          <col width="140" />
          <col />
          <col width="140" />
          <col />
        </colgroup>
        <tr>
          <td class="gray">구분</td>
          <td>{{ form.inputD_1 }}</td>
          <td class="gray">점검결과</td>
          <td>
            <div class="flex justify-center items-center gap-4">
              <PrintRadio :value="form.inputD_2 === '경고'" label="경고" class="justify-center" />
              <PrintRadio :value="form.inputD_2 === '보완'" label="보완" class="justify-center" />
              <PrintRadio :value="form.inputD_2 === '권고'" label="권고" class="justify-center" />
              <PrintRadio :value="form.inputD_2 === '중복지적'" label="중복지적" class="justify-center" />
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="p-0">
            <div class="flex items-center justify-center">
              <img v-if="!!form.photoList2[0]" :src="form.photoList2[0].path" alt="" />
            </div>
          </td>
          <td class="gray">조치요망</td>
          <td>
            <p class="print-textarea no-block">{{ form.inputD_3 }}</p>
          </td>
        </tr>
      </table>
      <table style="margin-top: -1px">
        <colgroup>
          <col />
          <col width="60" />
          <col />
        </colgroup>
        <tr>
          <td colspan="3" class="gray">현 장 보 완 조 치</td>
        </tr>
        <tr v-for="(photo, photo_i) in form.photoList3" :key="`photoList3_${photo_i}`">
          <td class="p-0">
            <div class="flex items-center justify-center">
              <img v-if="!!photo" :src="photo.path" alt="" />
            </div>
          </td>
          <td class="gray">보완<br />조치</td>
          <td>
            <p class="print-textarea no-block">{{ photo.input }}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 참석자 명단 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="my-4">□ 참석자 명단</h4>
      <table>
        <colgroup>
          <col width="64" />
        </colgroup>
        <tr>
          <td class="gray">No.</td>
          <td class="gray">구분</td>
          <td class="gray">소속명</td>
          <td class="gray">직책</td>
          <td class="gray">성명</td>
          <td class="gray">서명</td>
        </tr>
        <tr v-for="(sl, sl_i) in renderSignatureList" :key="sl.id">
          <td>{{ sl_i + 1 }}</td>
          <td>{{ sl.input1 }}</td>
          <td>{{ sl.input2 }}</td>
          <td>{{ sl.input3 }}</td>
          <td>{{ sl.input4 }}</td>
          <td class="p-0">
            <img v-if="!!sl.input5" :src="sl.input5" style="height: 58px" class="object-contain mx-auto" />
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 잘된점 / 우수사례 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="my-4">□ 잘된점 / 우수사례</h4>
      <table>
        <colgroup>
          <col width="140" />
          <col />
          <col width="60" />
          <col width="140" />
          <col />
        </colgroup>
        <tr>
          <td class="gray">구분</td>
          <td colspan="4">{{ form.photoHeadInput4 }}</td>
        </tr>
        <tr v-for="(photo, photo_i) in form.photoList4" :key="`photoList3_${photo_i}`">
          <td colspan="2" class="p-0">
            <div class="flex items-center justify-center">
              <img v-if="!!photo" :src="photo.path" alt="" />
            </div>
          </td>
          <td class="gray">사례<br />내용<br />({{ photo_i + 1 }})</td>
          <td colspan="2">
            <p class="print-textarea no-block">{{ photo.input }}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 권고사항 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="my-4">□ 권고사항</h4>
      <table>
        <colgroup>
          <col width="140" />
          <col />
          <col width="60" />
          <col width="140" />
          <col />
        </colgroup>
        <tr>
          <td class="gray">구분</td>
          <td colspan="4">{{ form.photoHeadInput5 }}</td>
        </tr>
        <tr v-for="(photo, photo_i) in form.photoList5" :key="`photoList3_${photo_i}`">
          <td colspan="2" class="p-0">
            <div class="flex items-center justify-center">
              <img v-if="!!photo" :src="photo.path" alt="" />
            </div>
          </td>
          <td class="gray">사례<br />내용<br />({{ photo_i + 1 }})</td>
          <td colspan="2">
            <p class="print-textarea no-block">{{ photo.input }}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 개선 및 향후 중점 검토 사항 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="my-4">□ 개선 및 향후 중점 검토 사항</h4>
      <table>
        <colgroup>
          <col width="140" />
          <col />
          <col width="60" />
          <col width="140" />
          <col />
        </colgroup>
        <tr>
          <td class="gray">구분</td>
          <td colspan="4">{{ form.photoHeadInput6 }}</td>
        </tr>
        <tr v-for="(photo, photo_i) in form.photoList6" :key="`photoList3_${photo_i}`">
          <td colspan="2" class="p-0">
            <div class="flex items-center justify-center">
              <img v-if="!!photo" :src="photo.path" alt="" />
            </div>
          </td>
          <td class="gray">사례<br />내용<br />({{ photo_i + 1 }})</td>
          <td colspan="2">
            <p class="print-textarea no-block">{{ photo.input }}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 총평 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h4 class="my-4">□ 총평</h4>
      <table>
        <tr>
          <td class="gray">□ 잘못된점</td>
        </tr>
        <tr>
          <td>
            <p class="print-textarea no-block">{{ form.inputE_1 }}</p>
          </td>
        </tr>
        <tr>
          <td class="gray">□ 잘된점</td>
        </tr>
        <tr>
          <td>
            <p class="print-textarea no-block">{{ form.inputE_2 }}</p>
          </td>
        </tr>
        <tr>
          <td class="gray">□ 권고사항</td>
        </tr>
        <tr>
          <td>
            <p class="print-textarea no-block">{{ form.inputE_3 }}</p>
          </td>
        </tr>
        <tr>
          <td class="gray">□ 개선 및 향후 중점 검토 사항</td>
        </tr>
        <tr>
          <td>
            <p class="print-textarea no-block">{{ form.inputE_4 }}</p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import PrintRadio from "@/components/print/PrintRadio.vue";
import TableInspectDouble from "@/components/TableInspectDouble.vue";
export default {
  name: "Print391",
  components: { PrintRadio, TableInspectDouble },
  props: {
    form: Object,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    renderSignatureList() {
      let signatureList = this.form.signatureList;
      const addIndex = 23 - (signatureList.length % 23);
      for (let index = 0; index < addIndex; index++) {
        signatureList.push({});
      }

      return signatureList;
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

img {
  max-width: 100%;
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

table.sign {
  td {
    padding: 10px 8px;
  }
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td {
    font-size: 18px;
    line-height: 26px;
    text-align: center;
    border: 1px solid #757575;
    padding: 16px 8px;
    word-break: keep-all;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  td.gray {
    font-weight: 500;
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
