<template>
  <div v-if="!isPrint">
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" @selectField="onSelectField" />

    <!-- 농협네트웍스 -->

    <TableCustom
      :board="board"
      :is-print="isPrint"
      :controls="false"
      :multiple="false"
      title="농협네트웍스"
      :tableData="[
        { id: 'no', title: 'No.', type: 'no', width: 60, style: { borderRight: '1px solid #cdcdcd', backgroundColor: `#f9f9f9` } },
        { id: 'target', title: '소속명(부서명)', type: 'text', placeholder: '내용', readonly: true },
        { id: 'type', title: '직책', type: 'text', placeholder: '내용', readonly: true },
        { id: 'task', title: '업무', type: 'text', placeholder: '내용', readonly: true },
        { id: 'name', title: '이름', type: 'text', placeholder: '입력' },
        { id: 'phone', title: '연락처', type: 'text', placeholder: '입력' },
        { id: 'note', title: '비고', type: 'textarea', placeholder: '입력필드' },
      ]"
      :mobile="['target', 'name']"
      :value="[form.group1[0] /*2023-11-01 농협 피드백 :: 2번째 행을 숨겨달라 */]"
    />

    <!-- 관리자 그룹 -->
    <nhsafe-organization-partner-chart
      class="mt-5"
      title="협력업체"
      :list="form.group2"
      @updateList="(list) => updateGroupList('group2', list)"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
      :positionList="['안전보건총괄책임자', '안전보건책임자', '안전보건조정자', '관리감독자', '안전관리자', '보건관리자', '산업보건의', '현장관리자', '안전담당자', '보건담당자', '담당자']"
      :note-list="{
        안전보건총괄책임자: `■ 안전보건총괄책임자의 직무 등(산업안전보건법 시행령 제53조)
① 안전보건총괄책임자의 직무는 다음 각 호와 같다.
1. 법 제36조에 따른 위험성평가의 실시에 관한 사항
2. 법 제51조 및 제54조에 따른 작업의 중지
3. 법 제64조에 따른 도급 시 산업재해 예방조치
4. 법 제72조제1항에 따른 산업안전보건관리비의 관계수급인 간의 사용에 관한 협의ㆍ조정 및 그 집행의 감독
5. 안전인증대상기계등과 자율안전확인대상기계등의 사용 여부 확인
② 안전보건총괄책임자에 대한 지원에 관하여는 제14조제2항을 준용한다. 이 경우 “안전보건관리책임자”는 “안전보건총괄책임자”로, “법 제15조제1항”은 “제1항”으로 본다.
③ 사업주는 안전보건총괄책임자를 선임했을 때에는 그 선임 사실 및 제1항 각 호의 직무의 수행내용을 증명할 수 있는 서류를 갖추어 두어야 한다.`,
        안전보건책임자: `■ 안전보건관리책임자(산업안전보건법 제15조)
① 사업주는 현장을 실질적으로 총괄하여 관리하는 사람에게 해당 현장의 다음 각 호의 업무를 총괄하여 관리하도록 하여야 한다.
1. 현장의 산업재해 예방계획의 수립에 관한 사항
2. 제25조 및 제26조에 따른 안전보건관리규정의 작성 및 변경에 관한 사항
3. 제29조에 따른 안전보건교육에 관한 사항
4. 작업환경측정 등 작업환경의 점검 및 개선에 관한 사항
5. 제129조부터 제132조까지에 따른 근로자의 건강진단 등 건강관리에 관한 사항
6. 산업재해의 원인 조사 및 재발 방지대책 수립에 관한 사항
7. 산업재해에 관한 통계의 기록 및 유지에 관한 사항
8. 안전장치 및 보호구 구입 시 적격품 여부 확인에 관한 사항
9. 그 밖에 근로자의 유해ㆍ위험 방지조치에 관한 사항으로서 고용노동부령으로 정하는 사항
② 제1항 각 호의 업무를 총괄하여 관리하는 사람(이하 “안전보건관리책임자”라 한다)은 제17조에 따른 안전관리자와 제18조에 따른 보건관리자를 지휘ㆍ감독한다.
③ 안전보건관리책임자를 두어야 하는 사업의 종류와 현장의 상시근로자 수, 그 밖에 필요한 사항은 대통령령으로 정한다.`,
        안전보건조정자: '',
        // 관리감독자
        관리감독자: `■ 관리감독자의 업무 등(산업안전보건법 시행령 제15조)
① 법 제16조제1항에서 “대통령령으로 정하는 업무”란 다음 각 호의 업무를 말한다.  <개정 2021. 11. 19.>
1. 현장 내 법 제16조제1항에 따른 관리감독자(이하 “관리감독자”라 한다)가 지휘ㆍ감독하는 작업(이하 이 조에서 “해당작업”이라 한다)과 관련된 기계ㆍ기구 또는 설비의 안전ㆍ보건 점검 및 이상 유무의 확인
2. 관리감독자에게 소속된 근로자의 작업복ㆍ보호구 및 방호장치의 점검과 그 착용ㆍ사용에 관한 교육ㆍ지도
3. 해당작업에서 발생한 산업재해에 관한 보고 및 이에 대한 응급조치
4. 해당작업의 작업장 정리ㆍ정돈 및 통로 확보에 대한 확인ㆍ감독
5. 현장의 다음 각 목의 어느 하나에 해당하는 사람의 지도ㆍ조언에 대한 협조
가. 법 제17조제1항에 따른 안전관리자(이하 “안전관리자”라 한다) 또는 같은 조 제5항에 따라 안전관리자의 업무를 같은 항에 따른 안전관리전문기관(이하 “안전관리전문기관”이라 한다)에 위탁한 현장의 경우에는 그 안전관리전문기관의 해당 현장 담당자
나. 법 제18조제1항에 따른 보건관리자(이하 “보건관리자”라 한다) 또는 같은 조 제5항에 따라 보건관리자의 업무를 같은 항에 따른 보건관리전문기관(이하 “보건관리전문기관”이라 한다)에 위탁한 현장의 경우에는 그 보건관리전문기관의 해당 현장 담당자
다. 법 제19조제1항에 따른 안전보건관리담당자(이하 “안전보건관리담당자”라 한다) 또는 같은 조 제4항에 따라 안전보건관리담당자의 업무를 안전관리전문기관 또는 보건관리전문기관에 위탁한 현장의 경우에는 그 안전관리전문기관 또는 보건관리전문기관의 해당 현장 담당자
라. 법 제22조제1항에 따른 산업보건의(이하 “산업보건의”라 한다)
6. 법 제36조에 따라 실시되는 위험성평가에 관한 다음 각 목의 업무
가. 유해ㆍ위험요인의 파악에 대한 참여
나. 개선조치의 시행에 대한 참여
7. 그 밖에 해당작업의 안전 및 보건에 관한 사항으로서 고용노동부령으로 정하는 사항
② 관리감독자에 대한 지원에 관하여는 제14조제2항을 준용한다. 이 경우 “안전보건관리책임자”는 “관리감독자”로, “법 제15조제1항”은 “제1항”으로 본다.`,
        // 안전관리자
        안전관리자: `■ 안전관리자의 업무 등(산업안전보건법 시행령 제18조)
① 안전관리자의 업무는 다음 각 호와 같다.
1. 법 제24조제1항에 따른 산업안전보건위원회(이하 “산업안전보건위원회”라 한다) 또는 법 제75조제1항에 따른 안전 및 보건에 관한 노사협의체(이하 “노사협의체”라 한다)에서 심의ㆍ의결한 업무와 해당 현장의 법 제25조제1항에 따른 안전보건관리규정(이하 “안전보건관리규정”이라 한다) 및 취업규칙에서 정한 업무
2. 법 제36조에 따른 위험성평가에 관한 보좌 및 지도ㆍ조언
3. 법 제84조제1항에 따른 안전인증대상기계등(이하 “안전인증대상기계등”이라 한다)과 법 제89조제1항 각 호 외의 부분 본문에 따른 자율안전확인대상기계등(이하 “자율안전확인대상기계등”이라 한다) 구입 시 적격품의 선정에 관한 보좌 및 지도ㆍ조언
4. 해당 현장 안전교육계획의 수립 및 안전교육 실시에 관한 보좌 및 지도ㆍ조언
5. 현장 순회점검, 지도 및 조치 건의
6. 산업재해 발생의 원인 조사ㆍ분석 및 재발 방지를 위한 기술적 보좌 및 지도ㆍ조언
7. 산업재해에 관한 통계의 유지ㆍ관리ㆍ분석을 위한 보좌 및 지도ㆍ조언
8. 법 또는 법에 따른 명령으로 정한 안전에 관한 사항의 이행에 관한 보좌 및 지도ㆍ조언
9. 업무 수행 내용의 기록ㆍ유지
10. 그 밖에 안전에 관한 사항으로서 고용노동부장관이 정하는 사항
② 사업주가 안전관리자를 배치할 때에는 연장근로ㆍ야간근로 또는 휴일근로 등 해당 현장의 작업 형태를 고려해야 한다.
③ 사업주는 안전관리 업무의 원활한 수행을 위하여 외부전문가의 평가ㆍ지도를 받을 수 있다.
④ 안전관리자는 제1항 각 호에 따른 업무를 수행할 때에는 보건관리자와 협력해야 한다.
⑤ 안전관리자에 대한 지원에 관하여는 제14조제2항을 준용한다. 이 경우 “안전보건관리책임자”는 “안전관리자”로, “법 제15조제1항”은 “제1항”으로 본다.`,
        // 보건관리자
        보건관리자: `■ 보건관리자의 업무 등(산업안전보건법 시행령 제22조)
① 보건관리자의 업무는 다음 각 호와 같다.
1. 산업안전보건위원회 또는 노사협의체에서 심의ㆍ의결한 업무와 안전보건관리규정 및 취업규칙에서 정한 업무
2. 안전인증대상기계등과 자율안전확인대상기계등 중 보건과 관련된 보호구(保護具) 구입 시 적격품 선정에 관한 보좌 및 지도ㆍ조언
3. 법 제36조에 따른 위험성평가에 관한 보좌 및 지도ㆍ조언
4. 법 제110조에 따라 작성된 물질안전보건자료의 게시 또는 비치에 관한 보좌 및 지도ㆍ조언
5. 제31조제1항에 따른 산업보건의의 직무(보건관리자가 별표 6 제2호에 해당하는 사람인 경우로 한정한다)
6. 해당 현장 보건교육계획의 수립 및 보건교육 실시에 관한 보좌 및 지도ㆍ조언
7. 해당 현장의 근로자를 보호하기 위한 다음 각 목의 조치에 해당하는 의료행위(보건관리자가 별표 6 제2호 또는 제3호에 해당하는 경우로 한정한다)
가. 자주 발생하는 가벼운 부상에 대한 치료
나. 응급처치가 필요한 사람에 대한 처치
다. 부상ㆍ질병의 악화를 방지하기 위한 처치
라. 건강진단 결과 발견된 질병자의 요양 지도 및 관리
마. 가목부터 라목까지의 의료행위에 따르는 의약품의 투여
8. 작업장 내에서 사용되는 전체 환기장치 및 국소 배기장치 등에 관한 설비의 점검과 작업방법의 공학적 개선에 관한 보좌 및 지도ㆍ조언
9. 현장 순회점검, 지도 및 조치 건의
10. 산업재해 발생의 원인 조사ㆍ분석 및 재발 방지를 위한 기술적 보좌 및 지도ㆍ조언
11. 산업재해에 관한 통계의 유지ㆍ관리ㆍ분석을 위한 보좌 및 지도ㆍ조언
12. 법 또는 법에 따른 명령으로 정한 보건에 관한 사항의 이행에 관한 보좌 및 지도ㆍ조언
13. 업무 수행 내용의 기록ㆍ유지
14. 그 밖에 보건과 관련된 작업관리 및 작업환경관리에 관한 사항으로서 고용노동부장관이 정하는 사항
② 보건관리자는 제1항 각 호에 따른 업무를 수행할 때에는 안전관리자와 협력해야 한다.
③ 사업주는 보건관리자가 제1항에 따른 업무를 원활하게 수행할 수 있도록 권한ㆍ시설ㆍ장비ㆍ예산, 그 밖의 업무 수행에 필요한 지원을 해야 한다. 이 경우 보건관리자가 별표 6 제2호 또는 제3호에 해당하는 경우에는 고용노동부령으로 정하는 시설 및 장비를 지원해야 한다.
④ 보건관리자의 배치 및 평가ㆍ지도에 관하여는 제18조제2항 및 제3항을 준용한다. 이 경우 “안전관리자”는 “보건관리자”로, “안전관리”는 “보건관리”로 본다.`,
        // 산업보건의
        산업보건의: `■ 산업보건의의 직무 등(산업안전보건법 시행령 제22조)
① 산업보건의의 직무 내용은 다음 각 호와 같다.
1. 법 제134조에 따른 건강진단 결과의 검토 및 그 결과에 따른 작업 배치, 작업 전환 또는 근로시간의 단축 등 근로자의 건강보호 조치
2. 근로자의 건강장해의 원인 조사와 재발 방지를 위한 의학적 조치
3. 그 밖에 근로자의 건강 유지 및 증진을 위하여 필요한 의학적 조치에 관하여 고용노동부장관이 정하는 사항
② 산업보건의에 대한 지원에 관하여는 제14조제2항을 준용한다. 이 경우 “안전보건관리책임자”는 “산업보건의”로, “법 제15조제1항”은 “제1항”으로 본다.`,
        현장관리자: '',
        // 안전담당자
        안전담당자: `■ 안전보건관리담당자자의 업무(산업안전보건법 시행령 제25조)
안전보건관리담당자의 업무는 다음 각 호와 같다. <개정 2020. 9. 8.>
1. 법 제29조에 따른 안전보건교육 실시에 관한 보좌 및 지도ㆍ조언
2. 법 제36조에 따른 위험성평가에 관한 보좌 및 지도ㆍ조언
3. 법 제125조에 따른 작업환경측정 및 개선에 관한 보좌 및 지도ㆍ조언
4. 법 제129조부터 제131조까지의 규정에 따른 각종 건강진단에 관한 보좌 및 지도ㆍ조언
5. 산업재해 발생의 원인 조사, 산업재해 통계의 기록 및 유지를 위한 보좌 및 지도ㆍ조언
6. 산업 안전ㆍ보건과 관련된 안전장치 및 보호구 구입 시 적격품 선정에 관한 보좌 및 지도ㆍ조언`,
        // 보건담당자
        보건담당자: `■ 안전보건관리담당자자의 업무(산업안전보건법 시행령 제25조)
안전보건관리담당자의 업무는 다음 각 호와 같다. <개정 2020. 9. 8.>
1. 법 제29조에 따른 안전보건교육 실시에 관한 보좌 및 지도ㆍ조언
2. 법 제36조에 따른 위험성평가에 관한 보좌 및 지도ㆍ조언
3. 법 제125조에 따른 작업환경측정 및 개선에 관한 보좌 및 지도ㆍ조언
4. 법 제129조부터 제131조까지의 규정에 따른 각종 건강진단에 관한 보좌 및 지도ㆍ조언
5. 산업재해 발생의 원인 조사, 산업재해 통계의 기록 및 유지를 위한 보좌 및 지도ㆍ조언
6. 산업 안전ㆍ보건과 관련된 안전장치 및 보호구 구입 시 적격품 선정에 관한 보좌 및 지도ㆍ조언`,
        담당자: '',
      }"
    />

    <!--파일첨부-->
    <file-upload-module :readonly="board.readonly" v-model="form.fileList" class="mt-5" :is-print="isPrint" />
  </div>
  <print v-else :board="board" :form="form" />
</template>

<script>
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import SearchNavStartEnd from "../../../../components/nav/SearchNavStartEnd.vue";
import FileUploadModule from "../../../modules/FileUploadModule.vue";
import FieldSelectModule from "../../../modules/FieldSelectModule";
import TableCompanyGroup from "@/components/TableCompanyGroup";
import Print from "./Print";
import NhsafeOrganizationPartnerChart from "@/views/boards/single-page/126/NhsafeOrganizationPartnerChart.vue";

import TableCustom from "@/components/TableCustom.vue";

export default {
  components: {
    NhsafeOrganizationPartnerChart,
    TableCompanyGroup,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    SearchNavStartEnd,
    FileUploadModule,
    FieldSelectModule,
    Print,
    TableCustom,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        group1: [
          {
            no: 1,
            target: "(주)농협네트웍스",
            type: "안전보건총괄책임자",
            task: "관리책임자",
            name: "",
            phone: "",
            note: `■ 안전보건총괄책임자의 직무 등(산업안전보건법 시행령 제53조)
① 안전보건총괄책임자의 직무는 다음 각 호와 같다.
1. 법 제36조에 따른 위험성평가의 실시에 관한 사항
2. 법 제51조 및 제54조에 따른 작업의 중지
3. 법 제64조에 따른 도급 시 산업재해 예방조치
4. 법 제72조제1항에 따른 산업안전보건관리비의 관계수급인 간의 사용에 관한 협의ㆍ조정 및 그 집행의 감독
5. 안전인증대상기계등과 자율안전확인대상기계등의 사용 여부 확인
② 안전보건총괄책임자에 대한 지원에 관하여는 제14조제2항을 준용한다. 이 경우 “안전보건관리책임자”는 “안전보건총괄책임자”로, “법 제15조제1항”은 “제1항”으로 본다.
③ 사업주는 안전보건총괄책임자를 선임했을 때에는 그 선임 사실 및 제1항 각 호의 직무의 수행내용을 증명할 수 있는 서류를 갖추어 두어야 한다.`,
          },
          { no: 2, target: "(주)농협네트웍스", type: "안전보건협의체", task: "-", _hide_task: true, name: "", _hide_name: true, phone: "", _hide_phone: true, note: "", _hide_note: true },
        ],
        group2: [
          { no: "1", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "2", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "3", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "4", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "5", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "6", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "7", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "8", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "9", target: "", type: "", task: "", name: "", phone: "", note: "-" },
          { no: "10", target: "", type: "", task: "", name: "", phone: "", note: "-" },
        ],
        fileList: [],
      },
    };
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
  created() {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  methods: {
    updateGroupList(target, list) {
      this.form[target] = list;
    },
    onSelectField(field) {
      if (this.projectId === 7) {
        let workerSignatures = field.signatures ? field.signatures : [];
        workerSignatures = workerSignatures.map((signature) => {
          return {
            target: signature.target ? signature.target : "",
            type: signature.type ? signature.type : "",
            name: signature.name ? signature.name : "",
          }
        });

        console.log(workerSignatures)
        // workerSignatures 각 항목들을 group2의 해당하는 index에 넣어준다.
        for (let i = 0; i < workerSignatures.length && i < this.form.group2.length; i++) {
          this.form.group2[i].target = workerSignatures[i].target;
          this.form.group2[i].type = workerSignatures[i].type;
          this.form.group2[i].name = workerSignatures[i].name;
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
}

.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.input-se {
  width: 100%;

  &::v-deep .start-end-title {
    width: 114px;
    font-weight: 500;
    font-size: 14px;
    justify-content: flex-start;
  }

  &::v-deep .mr-2 {
    flex: 1;
    margin-right: 20px !important;
  }

  &::v-deep .mr-2 + .mr-2 {
    margin-right: 0 !important;
    position: relative;

    &::before {
      content: "~";
      width: 10px;
      position: absolute;
      left: -15px;
      text-align: center;
    }
  }

  &::v-deep .inline-block {
    width: 100% !important;
  }
}

$border: 1px solid #cdcdcd;

.form-group {
  border-top: $border;
  border-bottom: $border;
  overflow: auto;
  width: 100%;

  &__header {
    background: #f9f9f9;
    height: 52px;
    width: 100%;
    display: flex;

    &-title {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title.title-checked {
      margin: 0 auto;
      border: none;
    }
  }

  &__content {
    width: 100%;
    display: flex;

    &-row {
      padding: 7px;
      border-bottom: $border;
    }

    &-row.row-checked {
      margin: 0;
      border-left: none;
      padding-left: 10px;
    }
  }
}
</style>
