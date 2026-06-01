<template>
  <div v-if="!isPrint">
    <!--    기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :options="[
        { type: 'date', label: '점검일' },
        { type: 'text', label: '점검장소' },
        { type: 'disaster', label: '재해형태' },
        // { type: 'sign', label: '서명' },
      ]"
      :board="this.board"
      :is-print="isPrint"
    />

    <!--    점검대상-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 점검대상</h5>
      </vs-col>
    </vs-row>
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-x-6 gap-y-4 mt-4">
      <div v-for="_title in inspectionTitle" :key="`checkbox_${_title}`" class="col-span-1 flex items-center">
        <div v-if="isPrint || board.readonly" class="flex items-center">
          <div v-if="form.inspectChecked.includes(_title)" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          <div v-else style="border: 2px solid rgb(180, 180, 180)" class="w-5 h-5 rounded-sm mr-2"></div>
          <span class="flex-1">
            {{ _title }}
          </span>
        </div>
        <div v-else>
          <span class="flex">
            <vs-checkbox :readonly="board.readonly" v-model="form.inspectChecked" :vs-value="_title">{{ _title }}</vs-checkbox>
          </span>
        </div>
      </div>
    </div>

    <table-inspect-merge
      v-for="(_title, _title_i) in inspectionTitle"
      :key="`inspect_${_title}`"
      v-show="form.inspectChecked.includes(_title)"
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      :title="_title"
      :is-note="true"
      :tableHeaderCheck="[{ text: '양호' }, { text: '불량' }, { text: 'N/A' }]"
      :table-header-note="{ text: '비고(조치결과)' }"
      tableTitleColor="white"
      contentBefore="•"
      v-model="form[`inspectList_${_title_i + 1}`]"
    />

    <!-- 확인자-->
    <h5 class="mt-8"><i class="dot"></i>확인자</h5>
    <div class="writeGridContainer mt-4">
      <div>
        <div>관리책임자</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.inputA_1 }}</p>
        <ml-input v-else v-model="form.inputA_1" :readonly="board.readonly" />
      </div>
      <div>
        <div>서명</div>
        <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputA_2" class="flex-1 justify-self-start sign-module" />
        <div v-else class="w-full flex-1 p-1">
          <img v-if="form.inputA_2" :src="form.inputA_2" width="100%" alt="Signature" class="signatureImg" />
          <div v-else class="signatureImg"></div>
        </div>
      </div>
    </div>

    <!--    사진대지-->
    <PhotoUploadGridModule :row-count="2" :grid-count="2" v-model="form.photoList" :isPrint="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="신축현장 점검" />

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :isPrint="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <Print v-else :form="form" :inspectionTitle="inspectionTitle" />
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableInspectMerge from "@/components/TableInspectMerge";
import * as inspectData from "./inspectData";
import Print from "./Print.vue";
import SignField from "@/components/SignField.vue";

export default {
  components: {
    SignField,
    FileUploadModule,
    TableInspectMerge,
    FieldSelectModule,
    PhotoUploadGridModule,
    Print,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  data() {
    return {
      inspectionTitle: ["공통", "용접·용단 작업 등 (화재·폭발)", "가설전기 및 전기공사 (감전)", "밀폐공간 작업 (질식·중독)"],

      form: {
        inspectionTitle: "",
        stdInfo: {},
        photoList: [],
        fileList: [],

        inspectChecked: ["공통"],
        inspectList_1: inspectData.inspectTable_1,
        inspectList_2: inspectData.inspectTable_2,
        inspectList_3: inspectData.inspectTable_3,
        inspectList_4: inspectData.inspectTable_4,

        inputA_1: "",
        inputA_2: "",
      },
    };
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
        value.summary = {
          안전보건점검_현장명: [],
          안전보건점검_점검표: [],
        };

        value.summary["안전보건점검_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        value.summary["안전보건점검_점검표"].push({
          "위험작업별 안전점검표": 1,
        });
        this.form.inspectionTitle = value.inspectChecked.join(" ");
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
};
</script>
