<template>
  <Print v-if="isPrint" :inspectionTitles="inspectionTitles" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" :multiple-disaster="true" />

    <!-- 작업구분 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 작업구분</h5>
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-x-6 gap-y-4 mt-4">
        <template v-for="_title in inspectionTitles">
          <!-- "공통사항" 옵션은 기본으로 표시되도록 변경했기 때문에, 체크박스를 표시하지 않도록 v-if 구문을 추가했음 (2023-12-08) -->
          <div v-if="_title.id > 0" class="col-span-1 flex" :key="_title.id">
            <RadioTypeCheck :readonly="board.readonly" name="check_inspect" :label="_title.label" :checkValue="_title.label" v-model="form.inspectChecked" @input="onClickCheckInspection" />
          </div>
        </template>
      </div>
    </div>

    <!--작업허가서 정보-->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 작업허가서 정보</h5>
      <div class="writeGridContainer">
        <div>
          <div>작업일자</div>
          <DateSelectorRang v-model="form.inputB_1" :readonly="board.readonly" />
        </div>
        <div v-if="!isProject7">
          <div>협력업체명</div>
          <span v-if="isPrint" class="print-input"> {{ form.companyName }} </span>
          <CompanySelector v-else :readonly="board.readonly" v-model="form.inputB_2" placeholder="선택" @select="targetCompany"></CompanySelector>
        </div>
        <div v-if="!isProject7">
          <div>허가번호</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_3" />
        </div>

        <div v-if="!isProject7">
          <div>관리감독자</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_4" />
        </div>
        <div>
          <div>작업내용</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_5" />
        </div>
        <div>
          <div>작업장소</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_6" />
        </div>
        <div v-if="!isProject7">
          <div>주간작업</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_7 }} ~ {{ form.inputB_8 }}</p>
          <div v-else class="time">
            <time-selector v-model="form.inputB_7" :readonly="board.readonly" />
            <p class="px-2">~</p>
            <time-selector v-model="form.inputB_8" :readonly="board.readonly" />
          </div>
        </div>
        <div v-if="!isProject7">
          <div>야간연장<br />(18:00 이후)</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_9 }} ~ {{ form.inputB_10 }}</p>
          <div v-else class="time">
            <time-selector v-model="form.inputB_9" :readonly="board.readonly" />
            <p class="px-2">~</p>
            <time-selector v-model="form.inputB_10" :readonly="board.readonly" />
          </div>
        </div>
        <div v-if="!isProject7" class="hidden xl:block" />
        <div v-if="!isProject7">
          <div>주간인원</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_11 }}</p>
          <comma-input v-else :readonly="board.readonly" v-model="form.inputB_11" />
        </div>
        <div v-if="!isProject7">
          <div>야간인원</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_12 }}</p>
          <comma-input v-else :readonly="board.readonly" v-model="form.inputB_12" />
        </div>
        <div v-if="isProject7">
          <div>작업인원</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_13 }}</p>
          <comma-input v-else :readonly="board.readonly" v-model="form.inputB_13" />
        </div>
      </div>
    </div>

    <!--  목록표 -->
    <table-inspect-merge
      v-for="_title in inspectionTitles"
      :key="`inspect_${_title.id}`"
      v-show="form.inspectChecked === _title.label || form.checkedList.includes(_title.id)"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :title="_title.label"
      table-header-title="작업전 안전조치 및 확인 점검 사항(이행여부 = V, 해당사항없음 = N/A)"
      :tableHeaderCheck="[{ text: '양호' }, { text: '불량' }, { text: 'N/A' }]"
      :table-header-note="{ text: '비고(조치결과)' }"
      v-model="form[`inspectList_${_title.id + 1}`]"
      class="mt-28px"
    />

    <!-- 확인자 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 확인자</h5>
      <div v-if="!isProject7" class="writeGridContainer">
        <div>
          <div class="label-text mr-4 mt-2">안전관리자</div>
          <ml-input class="w-1/4 mr-4" v-model="form.inputC_1" :readonly="board.readonly" />
        </div>
        <div>
          <div class="label-text mr-4 mt-2">서명</div>
          <sign-field class="w-1/4" v-model="form.inputC_2" />
        </div>
      </div>
      <div class="writeGridContainer">
        <div>
          <div class="label-text mr-4 mt-2">관리책임자</div>
          <ml-input class="w-1/4 mr-4" v-model="form.inputC_3" :readonly="board.readonly" />
        </div>
        <div>
          <div class="label-text mr-4 mt-2">서명</div>
          <sign-field class="w-1/4" v-model="form.inputC_4" />
        </div>
      </div>
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
</template>

<script>
import Print from "./Print.vue";
import * as inspectData from "./inspectData";

import FieldSelectModule from "@/views/modules/FieldSelectModule";
import FileUploadModule from "@/views/modules/FileUploadModule";

import DateSelector from "@/components/selector/DateSelector";
import TimeSelector from "@/components/selector/TimeSelector.vue";
import CompanySelector from "@/components/selector/CompanySelector";
import TableInspectMerge from "@/components/TableInspectMerge";
import TableCustom from "@/components/TableCustom";
import SignField from "@/components/SignField";
import DateSelectorRang from "@/components/selector/DateSelectorRang";

export default {
  components: {
    Print,
    FieldSelectModule,
    FileUploadModule,
    DateSelector,
    TimeSelector,
    CompanySelector,
    TableInspectMerge,
    TableCustom,
    SignField,
    DateSelectorRang,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    isProject7() {
      return this.projectId === "7";
    },
    inspectionTitles() {
      if (this.isProject7) {
        return [
          { id: 1, label: "밀폐공간작업" },
          { id: 10, label: "화기작업" },
        ];
      } else {
        return [
          { id: 0, label: "공통사항" },
          { id: 1, label: "밀폐공간작업" },
          { id: 2, label: "비계 설치·해체 작업" },
          { id: 3, label: "동바리 설치·해체 작업" },
          { id: 4, label: "외부 로프 작업" },
          { id: 5, label: "건설용 리프트 설치·연장·해체 작업" },
          { id: 6, label: "지하층 용접 및 융단 작업" },
          { id: 7, label: "천정 상부(내부) 작업" },
          { id: 8, label: "Man Basket 작업" },
          { id: 9, label: "T/C 설치, 설치·연장·해체 작업" },
          { id: 10, label: "화기작업" },
        ];
      }
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},

        inspectionTitle: "",
        inspectChecked: "",
        checkedList: [0],
        inspectList_1: JSON.parse(JSON.stringify(inspectData.inspectData_1)),
        inspectList_2: JSON.parse(JSON.stringify(inspectData.inspectData_2)),
        inspectList_3: JSON.parse(JSON.stringify(inspectData.inspectData_3)),
        inspectList_4: JSON.parse(JSON.stringify(inspectData.inspectData_4)),
        inspectList_5: JSON.parse(JSON.stringify(inspectData.inspectData_5)),
        inspectList_6: JSON.parse(JSON.stringify(inspectData.inspectData_6)),
        inspectList_7: JSON.parse(JSON.stringify(inspectData.inspectData_7)),
        inspectList_8: JSON.parse(JSON.stringify(inspectData.inspectData_8)),
        inspectList_9: JSON.parse(JSON.stringify(inspectData.inspectData_9)),
        inspectList_10: JSON.parse(JSON.stringify(inspectData.inspectData_10)),
        inspectList_11: JSON.parse(JSON.stringify(inspectData.inspectData_11)),

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        inputB_7: "",
        inputB_8: "",
        inputB_9: "",
        inputB_10: "",
        inputB_11: "",
        inputB_12: "",
        inputB_13: "",

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",

        worker: [],
        fileList: [],
        companyName: "",
      },
      signlist: ["1. 신청자(협력사 소장)", "2. 검토자 (네트웍스 관리감독자)", "3. 검토자 (네트웍스 안전관리자)", "4. 승인자 (네트웍스 관리책임자)"],
    };
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];

            /**
             * 2023-12-08
             * 기존에 저장했던 내용이 Yes, No, N/A로 저장되어 있어서 체크박스가 정상적으로 표시되지 않는 오류가 있었음
             * 레거시 데이터가 현재 폼에서도 표시될 수 있도록 아래 코드를 추가함
             */
            if (Array.isArray(value[key])) {
              for (const item of value[key]) {
                if (typeof item.isChecked !== "undefined") {
                  if (item.isChecked === "Yes") {
                    item.isChecked = "양호";
                  } else if (item.isChecked === "No" || item.isChecked === "미흡") {
                    item.isChecked = "불량";
                  } else if (item.isChecked === "해당없음") {
                    item.isChecked = "N/A";
                  }
                }
              }
            }
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.form.inspectionTitle = value.inspectChecked;
        this.$emit("input", value);
      },
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
    targetCompany(value) {
      this.form.companyName = value.com_name;
    },
    onClickCheckInspection() {
      const checkedLabel = this.form.inspectChecked;

      const foundTitle = this.inspectionTitles.find((e) => e.label === checkedLabel);
      if (!foundTitle) {
        return;
      }
      const checkedId = foundTitle.id;
      this.form.checkedList = [0, checkedId];
    },
  },
};
</script>
