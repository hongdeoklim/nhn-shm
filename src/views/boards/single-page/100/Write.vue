<template>
  <Print v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--    기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :options="[
        { type: 'date', label: '점검일' },
        { type: 'text', label: '점검장소' },
        { type: 'disaster', label: '재해형태' },
      ]"
      :board="this.board"
      :is-print="isPrint"
      :multiple-disaster="true"
      @input="inputDisaster"
      @selectField="onSelectField"
    />

    <!-- 합동 안전점검 -->
    <table-inspect-merge
      :is-print="isPrint"
      :is-readonly="board.readonly"
      title="합동 안전점검"
      table-header-title="점검항목"
      :tableHeaderCheck="[{ text: '양호' }, { text: '불량' }, { text: 'N/A' }]"
      :tableHeaderNote="{ text: '비고(조치결과)' }"
      tableTitleColor="white"
      contentBefore="•"
      v-model="form.inspectList"
      class="mt-5"
    />

    <div class="writeGridContainer mt-8">
      <div class="writeGridLineItem">
        <div>점검 결과</div>
        <span v-if="isPrint" class="print-textarea"> {{ form.inputA_10 }} </span>
        <ml-textarea v-else class="mb-0" rows="5" v-model="form.inputA_10" :readonly="board.readonly" placeholder="입력필드" />
      </div>
    </div>

    <!-- 도급인 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="도급인"
      :tableData="[
        { id: 'target', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'type',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자', '직접입력'],
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'name', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'sign', title: '서명', type: 'sign' },
        { id: 'note', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :mobile="['target', 'name']"
      v-model="form.signatureList1"
    />

    <!-- 수급인  -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="수급인 "
      :tableData="[
        { id: 'target', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'type',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자', '직접입력'],
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'name', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'sign', title: '서명', type: 'sign' },
        { id: 'note', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :mobile="['target', 'name']"
      v-model="form.signatureList2"
      :default-data="false"
    >
      <template #headButton v-if="projectId === 7">
        <vs-button class="mr-4" type="border" color="secondary" @click="showPrevBoard=true">수급인 정보 불러오기</vs-button>
      </template>
    </table-custom>

    <!-- 확인자-->
    <div>
      <h5 class="mt-8"><i class="dot"></i>확인자</h5>
      <div class="writeGridContainer mt-4">
        <div v-if="checkProject">
          <div>관리감독자</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputE_1 }}</p>
          <ml-input v-else v-model="form.inputE_1" :readonly="board.readonly" />
        </div>
        <div v-if="checkProject">
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputE_2" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputE_2" :src="form.inputE_2" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div v-if="checkProject" class="hidden xl:block"><!--Space--></div>

        <div v-if="checkProject">
          <div>안전관리자</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputE_3 }}</p>
          <ml-input v-else v-model="form.inputE_3" :readonly="board.readonly" />
        </div>
        <div v-if="checkProject">
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputE_4" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputE_4" :src="form.inputE_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div v-if="checkProject" class="hidden xl:block"><!--Space--></div>

        <div>
          <div>관리책임자</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputE_5 }}</p>
          <ml-input v-else v-model="form.inputE_5" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputE_6" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputE_6" :src="form.inputE_6" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div class="hidden xl:block"><!--Space--></div>
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="점검 현장 사진" />

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>

    <popup-load-prev-board v-model="showPrevBoard" :setBoardId="688" @selectRowData="selectRowData" title="수급인 정보" :multi-select="true"/>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableCustom from "@/components/TableCustom.vue";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import SignField from "@/components/SignField.vue";
import TableInspectMerge from "@/components/TableInspectMerge";
import Print from "./Print.vue";
import * as inspectData from "./inspectData";
import PopupLoadPrevBoard from "@/popup/PopupLoadPrevBoard.vue";

export default {
  components: {
    PopupLoadPrevBoard,
    FileUploadModule,
    TableCustom,
    FieldSelectModule,
    PhotoUploadGridModule,
    SignField,
    TableInspectMerge,
    Print,
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
          if (key === "inspectList" && value[key] && 0 < value[key].length && (JSON.stringify(value[key]).includes("Yes") || JSON.stringify(value[key]).includes("No"))) {
            this.form.inspectList = this.form.inspectList.map((data) => {
              let checkStr = data.isChecked;
              switch (data.isChecked) {
              case "Yes":
                checkStr = "양호";
                break;
              case "No":
                checkStr = "불량";
                break;
              }
              return { ...data, isChecked: checkStr };
            });
          }
          if ((key === "inspectList" || key === "photoList" || key === "signatureList1" || key === "signatureList2") && !value[key]) {
            // Empty
          } else if (typeof value[key] !== "undefined") {
            this.form[key] = value[key];
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        // value.summary = {
        //   작업장합동점검_현장명: [],
        //   작업장합동점검_점검대상: [],
        // };
        //
        // value.summary["작업장합동점검_현장명"].push({
        //   [this.form.stdInfo.field_name]: 1,
        // });
        //
        // for (const data of this.form.targetInspectionList) {
        //   value.summary["작업장합동점검_점검대상"].push({
        //     [data.target]: 1,
        //   });
        // }

        value.summary = {
          안전보건점검_현장명: [],
          안전보건점검_점검표: [],
        };

        value.summary["안전보건점검_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        value.summary["안전보건점검_점검표"].push({
          "합동 안전점검": 1,
        });

        this.$emit("input", value);
      },
    },
  },
  computed: {
    projectId() {
      return Number(this.$route.params.proj_id);
    },
    checkProject() {
      if (`${this.projectId}` === "7") {
        return false;
      }
      return true;
    },
  },
  data() {
    return {
      showPrevBoard: false,
      form: {
        stdInfo: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputA_6: "",
        inputA_7: "",
        inputA_8: "",
        inputA_9: "",
        inputA_10: "",

        inputD_1: {},
        inputD_2: "",
        inputD_3: {},
        inputD_4: "",
        inputD_5: {},
        inputD_6: "",
        inputD_7: {},
        inputD_8: "",

        inputE_1: "",
        inputE_2: "",
        inputE_3: "",
        inputE_4: "",
        inputE_5: "",
        inputE_6: "",

        photoList: [],
        fileList: [],
        equipmentList: [{}],
        targetInspectionList: [{}],
        signatureList1: [],
        signatureList2: [],
        inspectList: inspectData.inspectList,

        disasters: "",
      },
    };
  },
  created() {
    // const keys = Object.keys(this.form);
    // for (const key of keys) {
    //   if ((key === "inspectList" || key === "photoList" || key === "signatureList1" || key === "signatureList2") && !value[key]) {
    //     // Empty
    //   } else if (typeof value[key] !== "undefined") {
    //     this.form[key] = value[key];
    //   }
    // }
  },
  methods: {
    inputDisaster(field) {
      const disasters = field.재해형태;
      this.form.disasters = "";
      for (const disaster of disasters) {
        this.form.disasters += `${disaster} `;
      }
    },

    // 현장이 선택되면, 연결된 서명 정보를 "수급인" 항목에 표시합니다.
    onSelectField(field) {
      if (this.projectId === 7) {
        this.form.signatureList2 = field.signatures ? field.signatures : [];
      }
    },

    selectRowData(data) {
      if (!data) return

      let numberId = this.form.signatureList2.length + 1
      // 수급인 정보 불러오기
      for (const item of data) {
        const content = item.content
        if (!content) continue

        const rowData = {
          id: numberId++,
          target: content.소속명,
          type: content.직책 === "관리감독자" ? "관리감독자" : "직접입력",
          name: content.성명,
          sign: content.서명,
          note: content.비고,
        }
        if (rowData.type === "직접입력") {
          rowData.type_직접입력 = content.직책
        }
        this.form.signatureList2.push(rowData)
      }
    }
  },
};
</script>
