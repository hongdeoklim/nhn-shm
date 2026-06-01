<template>
  <div>
    <div>[별지 제3호 서식]</div>
    <h1 style="font-weight: 700; font-size: 32px; line-height: 46px; text-align: center; padding: 25px 0px">공사안전보건대장</h1>
    <!-- ========================================================================================================== -->
    <!-- =============================================== 1. 사업개요 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mb-4">1. 사업개요</h6>
      <table>
        <colgroup>
          <col width="70" />
          <col width="80" />
          <col />
          <col width="140" />
          <col />
        </colgroup>
        <tr>
          <td colspan="2" class="gray">공사명</td>
          <td colspan="3">{{ form.businessInfo.field_name }}</td>
        </tr>
        <tr>
          <td colspan="2" class="gray">현장주소</td>
          <td colspan="3">{{ form.businessInfo.address }}</td>
        </tr>
        <tr>
          <td colspan="2" class="gray">공사기간</td>
          <td colspan="3">{{ form.businessInfo.start_work_at }}~{{ form.businessInfo.be_completed_at }}</td>
        </tr>
        <tr>
          <td colspan="2" class="gray">공사금액</td>
          <td colspan="3">{{ form.businessInfo.deposit_amount ? new Intl.NumberFormat().format(parseInt(form.businessInfo.deposit_amount.replace(/,/g, ""))) : "-" }}</td>
        </tr>
        <!-- ============== 발주자 ============== -->
        <tr>
          <td rowspan="3" class="gray">발주자</td>
          <td class="gray">회사명</td>
          <td>{{ form.inputA_1 }}</td>
          <td class="gray" style="width: 140px">전화번호</td>
          <td>{{ form.inputA_4 }}</td>
        </tr>
        <tr>
          <td class="gray">대표자</td>
          <td>{{ form.inputA_2 }}</td>
          <td class="gray" style="width: 140px">지정된 담당자</td>
          <td>{{ form.inputA_5 }}</td>
        </tr>
        <tr>
          <td class="gray">주소</td>
          <td colspan="3">{{ form.inputA_3 }}</td>
        </tr>
        <!-- ============== 설계자 ============== -->
        <tr>
          <td rowspan="3" class="gray">설계자</td>
          <td class="gray">회사명</td>
          <td>{{ form.inputB_1 }}</td>
          <td class="gray" style="width: 140px">전화번호</td>
          <td>{{ form.inputB_4 }}</td>
        </tr>
        <tr>
          <td class="gray">대표자</td>
          <td>{{ form.inputB_2 }}</td>
          <td class="gray" style="width: 140px">설계안전보건대장 담당자</td>
          <td>{{ form.inputB_5 }}</td>
        </tr>
        <tr>
          <td class="gray">주소</td>
          <td colspan="3">{{ form.inputB_3 }}</td>
        </tr>
        <!-- ============== 시공자 ============== -->
        <tr>
          <td rowspan="4" class="gray">시공자</td>
          <td class="gray">회사명</td>
          <td>{{ form.inputC_1 }}</td>
          <td class="gray" style="width: 140px">전화번호</td>
          <td>{{ form.inputC_5 }}</td>
        </tr>
        <tr>
          <td class="gray">대표자</td>
          <td>{{ form.inputC_2 }}</td>
          <td rowspan="2" class="gray">공사안전보건대장 작성 담당자(연락처)</td>
          <td rowspan="2">{{ form.inputC_6 }}</td>
        </tr>
        <tr>
          <td class="gray">관리책임자</td>
          <td>{{ form.inputC_3 }}</td>
        </tr>
        <tr>
          <td class="gray">주소</td>
          <td colspan="3">{{ form.inputC_4 }}</td>
        </tr>
        <!-- ============== 건설사업관리기술(감리) ============== -->
        <tr>
          <td rowspan="3" class="gray">건설사업 관리기술 (감리)</td>
          <td class="gray">회사명</td>
          <td>{{ form.inputD_1 }}</td>
          <td class="gray">전화번호</td>
          <td>{{ form.inputD_4 }}</td>
        </tr>
        <tr>
          <td class="gray">대표자</td>
          <td>{{ form.inputD_2 }}</td>
          <td class="gray">현장 담당자</td>
          <td>{{ form.inputD_5 }}</td>
        </tr>
        <tr>
          <td class="gray">주소</td>
          <td colspan="3">{{ form.inputD_3 }}</td>
        </tr>
      </table>
      <table style="margin-top: -1px">
        <colgroup>
          <col width="150" />
        </colgroup>
        <!-- ============== 공사개요 ============== -->
        <tr>
          <td rowspan="4" class="gray">공사개요</td>
          <td class="gray">주요 구조물</td>
          <td class="gray">구조</td>
          <td class="gray">개소</td>
          <td class="gray">최대 굴착 깊이(m)</td>
          <td class="gray">최고높이(m)</td>
          <td class="gray">연면적/길이</td>
        </tr>
        <tr v-for="(_e, _e_i) in form.inputE_1" :key="`inputE_1_${_e_i}`">
          <td>{{ _e.input1 }}</td>
          <td>{{ _e.input2 }}</td>
          <td>{{ _e.input3 }}</td>
          <td>{{ _e.input4 || "" | comma }}</td>
          <td>{{ _e.input5 || "" | comma }}</td>
          <td>{{ _e.input6 }}</td>
        </tr>
        <!-- ============== 특수 구조물 개요 ============== -->
        <tr>
          <td class="gray">특수 구조물 개요</td>
          <td colspan="6">
            <div class="print-textarea" style="min-height: 170px">{{ form.inputF_1 }}</div>
          </td>
        </tr>
        <!-- ============== 주요 공법 ============== -->
        <tr>
          <td class="gray">주요 공법</td>
          <td colspan="6">
            <div class="print-textarea" style="min-height: 170px">{{ form.inputF_2 }}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- =============================== 2. 설계안전보건대장의 안전·보건조치 이행계획 ================================ -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mt-8 mb-4">2. 설계안전보건대장의 안전·보건조치 이행계획</h6>
      <table>
<!--        <colgroup>-->
<!--          <col width="70" />-->
<!--        </colgroup>-->
        <tr>
          <td class="gray">No.</td>
          <td class="gray">공종</td>
          <td class="gray">유해·위험요인</td>
          <td class="gray">위험성 감소대책</td>
          <td class="gray">시공자 이행계획</td>

        </tr>
        <tr v-for="(_g, _g_i) in form.inputG_1" :key="`inputG_1_${_g_i}`">
          <td>{{ _g_i + 1 }}</td>
          <td>
            <div class="print-textarea">{{ _g.input6 }}</div>
          </td>
          <td>
            <div class="print-textarea">{{ _g.input2 }}</div>
          </td>
          <td>
            <div class="print-textarea">{{ _g.input3 }}</div>
          </td>
          <td>
            <div class="print-textarea">{{ _g.input4 }}</div>
          </td>
<!--          <td>-->
<!--            <sign-field v-if="_g.input5" v-model="_g.input5" :readonly="board.readonly" :bordered="false" />-->
<!--            <div v-else class="signatureImg"></div>-->
<!--          </td>-->
        </tr>
      </table>

      <p style="font-size: 15px; padding: 8px 10px; text-align: end">
        점검기간 : {{checkSignInfo2.date}}
      </p>
      <div class="w-full flex" style="align-items: center; justify-content: flex-end;">
        <p style="font-size: 15px; padding: 8px 10px; text-align: end">확인자 : {{checkSignInfo2.name}}</p>
        <sign-field v-if="checkSignInfo2.sign" :value="checkSignInfo2.sign" :readonly="board.readonly" :bordered="false" />
        <div v-else class="signatureImg"></div>
      </div>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ==================== 3. 유해·위험방지계획서 심사 및 확인결과에 대한 조치내용(해당 시 작성) ==================== -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mt-8">3. 유해·위험방지계획서 심사 및 확인결과에 대한 조치내용(해당 시 작성)</h6>
      <p style="padding: 12px 10px">1) 심사결과 ({{ form.inputH_1 }})</p>
      <p style="padding: 12px 10px">2) 확인결과</p>
      <table>
        <colgroup>
          <col width="70" />
        </colgroup>
        <tr>
          <td class="gray">No.</td>
          <td class="gray">점검자</td>
          <td class="gray">점검일</td>
          <td class="gray">지적사항</td>
          <td class="gray">조치사항</td>
<!--          <td class="gray">발주자 서명</td>-->
        </tr>
        <tr v-for="(_h, _h_i) in form.inputH_2" :key="`inputG_1_${_h_i}`">
          <td>{{ _h_i + 1 }}</td>
          <td>
            <div>{{ _h.input2 }}</div>
          </td>
          <td>
            <div>{{ _h.input3 }}</div>
          </td>
          <td>
            <div>{{ _h.input4 }}</div>
          </td>
          <td>
            <div>{{ _h.input5 }}</div>
          </td>
<!--          <td>-->
<!--            <sign-field v-if="_h.input6" v-model="_h.input6" :readonly="board.readonly" :bordered="false" />-->
<!--            <div v-else class="signatureImg"></div>-->
<!--          </td>-->
        </tr>
      </table>
      <p style="font-size: 15px; padding: 8px 10px; text-align: end">
        점검기간 : {{checkSignInfo3.date}}
      </p>
      <div class="w-full flex" style="align-items: center; justify-content: flex-end;">
        <p style="font-size: 15px; padding: 8px 10px; text-align: end">확인자 : {{checkSignInfo3.name}}</p>
        <sign-field v-if="checkSignInfo3.sign" :value="checkSignInfo3.sign" :readonly="board.readonly" :bordered="false" />
        <div v-else class="signatureImg"></div>
      </div>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ====================================== 4. 산업안전보건관리비 변경내역 ====================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mt-8 mb-4">4. 산업안전보건관리비 변경내역</h6>
      <table>
        <tr>
          <td class="gray">일자</td>
          <td class="gray">당초 계상금액</td>
          <td class="gray">변경 계상금액</td>
          <td class="gray">실행금액</td>
          <td class="gray">변경사유</td>
        </tr>
        <tr v-for="(_i, _i_i) in form.inputI_1" :key="`inputI_1_${_i_i}`">
          <td>{{ _i.input1 }}</td>
          <td>{{ _i.input2 | comma }}</td>
          <td>{{ _i.input3 | comma }}</td>
          <td>{{ _i.input4 | comma }}</td>
          <td>{{ _i.input5 }}</td>
        </tr>
      </table>
      <p style="font-size: 12px; padding: 8px 10px">※ 설계안전보건대장 3.2) 유해·위험요인별 감소대책 내용 참조</p>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================= 5. 건설공사 산업재해예방 지도 계약여부, 지도결과 및 조치내용(해당 시 작성) =================== -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mt-8">5. 건설공사 산업재해예방 지도 계약여부, 지도결과 및 조치내용(해당 시 작성)</h6>
      <p style="padding: 12px 10px">1) 계약여부 ({{ form.inputJ_1 }})</p>
      <p style="padding: 12px 10px">2) 지도결과 및 조치내용</p>
      <table>
        <colgroup>
          <col width="70" />
        </colgroup>
        <tr>
          <td class="gray">No.</td>
          <td class="gray">지도자</td>
          <td class="gray">지도일</td>
          <td class="gray">지적사항</td>
          <td class="gray">조치사항</td>
        </tr>
        <tr v-for="(_j, _j_i) in form.inputJ_2" :key="`inputG_1_${_j_i}`">
          <td>{{ _j_i + 1 }}</td>
          <td>
            <div>{{ _j.input2 }}</div>
          </td>
          <td>
            <div>{{ _j.input3 }}</div>
          </td>
          <td>
            <div>{{ _j.input4 }}</div>
          </td>
          <td>
            <div>{{ _j.input5 }}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ================================== 6. 작성(변경) 일자 : 00년 00월 00일 ===================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mt-8">
        6. 작성(변경) 일자 : <span class="font-normal">{{ form.inputK_1 | moment("YY년 MM월 DD일") }}</span>
      </h6>
    </div>

    <!-- ========================================================================================================== -->
    <!-- ============================================ 7. 작성 및 확인자 ============================================ -->
    <!-- ========================================================================================================== -->
    <div class="print-container">
      <h6 class="mt-8">7. 작성 및 확인자</h6>
      <p style="padding: 12px 10px">1) 작성자</p>
      <table>
        <tr>
          <td class="gray">소속</td>
          <td class="gray">직위</td>
          <td class="gray">자격</td>
          <td class="gray">성명</td>
          <td class="gray">서명</td>
        </tr>
        <tr>
          <td>{{ form.inputL_1 }}</td>
          <td>{{ form.inputL_2 }}</td>
          <td>{{ form.inputL_3 }}</td>
          <td>{{ form.inputL_4 }}</td>
          <td>
            <img :src="form.inputL_5" class="w-full" />
          </td>
        </tr>
      </table>
      <p style="padding: 12px 10px">2) 확인자</p>
      <table>
        <tr>
          <td class="gray">소속</td>
          <td class="gray">직위</td>
          <td class="gray">자격</td>
          <td class="gray">성명</td>
          <td class="gray">서명</td>
        </tr>
        <tr>
          <td>{{ form.inputM_1 }}</td>
          <td>{{ form.inputM_2 }}</td>
          <td>{{ form.inputM_3 }}</td>
          <td>{{ form.inputM_4 }}</td>
          <td>
            <img :src="form.inputM_5" class="w-full" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import SignField from "@/components/SignField.vue";
import moment from "moment";
export default {
  name: "Print",
  components: {SignField},
  props: {
    board: Object,
    form: Object,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    resultCheckDate() {
      if (this.form.inputH_2.length > 0) {
        const dates = this.form.inputH_2.map(item => item.input3);
        const sortedDates = dates.sort();
        return `${sortedDates[0]} ~ ${sortedDates[sortedDates.length - 1]}`;
      }
      return "";
    },

    checkSignInfo2() {
      if (this.form.inputG_sign) {
        return {
          name: this.form.inputG_sign.name,
          sign: this.form.inputG_sign.sign,
          date: `${this.form.inputG_sign.beginDate} ~ ${this.form.inputG_sign.endDate}`,
        }
      }
      return {
        name: '',
        sign: '',
        date: '',
      }
    },

    checkSignInfo3() {
      if (this.form.inputH_sign) {
        return {
          name: this.form.inputH_sign.name,
          sign: this.form.inputH_sign.sign,
          date: `${this.form.inputH_sign.beginDate} ~ ${this.form.inputH_sign.endDate}`,
        }
      }
      return {
        name: '',
        sign: '',
        date: '',
      }
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td {
    text-align: center;
    border: 1px solid #757575;
    padding: 10px 8px;
    word-break: keep-all;
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
