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
      :types="['field_name', 'department', 'com_name', 'rank', 'director_name']"
    />

    <table-inspect-merge
      :is-print="isPrint"
      :is-readonly="board.readonly"
      title="중점사항"
      table-header-title="점검항목"
      :tableHeaderCheck="[{ text: '양호' }, { text: '불량' }, { text: 'N/A' }]"
      :tableHeaderNote="{ text: '비고(조치결과)' }"
      tableTitleColor="white"
      contentBefore="•"
      v-model="form.inspectList"
      class="mt-5"
    />

    <table-inspect-merge
      :is-print="isPrint"
      :is-readonly="board.readonly"
      title="일반사항"
      table-header-title="점검항목"
      :tableHeaderCheck="[{ text: '양호' }, { text: '불량' }, { text: 'N/A' }]"
      :tableHeaderNote="{ text: '비고(조치결과)' }"
      tableTitleColor="white"
      contentBefore="•"
      v-model="form.inspectListNormal"
      class="mt-5"
    />

    <div class="writeGridContainer mt-8">
      <div class="writeGridLineItem">
        <div>점검자 의견</div>
        <span v-if="isPrint" class="print-textarea"> {{ form.checkComment }} </span>
        <ml-textarea v-else class="mb-0" rows="5" v-model="form.checkComment" :readonly="board.readonly" />
      </div>
    </div>

    <!-- 확인자 -->
    <h5 class="mt-8"><i class="dot"></i>확인자</h5>
    <div class="writeGridContainer mt-4">
      <div>
        <div>관리책임자</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.confirmName }}</p>
        <ml-input v-else v-model="form.confirmName" :readonly="board.readonly"/>
      </div>
      <div>
        <div>서명</div>
        <sign-field v-if="!isPrint && !board.readonly" v-model="form.confirmSign" />
        <div v-else class="w-full flex-1 p-1">
          <img v-if="form.confirmSign" :src="form.confirmSign" width="100%" alt="Signature" class="signatureImg" />
          <div v-else class="signatureImg"></div>
        </div>
      </div>
      <!-- <div class="col-span-4 flex items-start">Space</div> -->
    </div>

    <!-- 사진대지 -->
    <PhotoUploadGridModule
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList" :isPrint="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="점검 현장 사진" />

    <!--    파일첨부-->
    <FileUploadModule id="fileList" class="w-full mt-4" v-model="form.fileList" :isPrint="isPrint" :readonly="board.readonly" />
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import TableInspectMerge from "@/components/TableInspectMerge";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import SignField from "@/components/SignField.vue";
import Print from "./Print.vue";
import * as inspectData from "./inspectData";

export default {
  components: {
    FieldSelectModule,
    TableInspectMerge,
    PhotoUploadGridModule,
    FileUploadModule,
    SignField,
    Print,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            if (key === 'inspectList') {
              this.form[key] = value[key]
              if (0 < value[key].length && (JSON.stringify(value[key]).includes("Yes") || JSON.stringify(value[key]).includes("No"))) {
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
            } else if (key === 'inspectListNormal') {
              for (const item of this.form[key]) {
                let obj = value[key].find((v) => v.title === item.title && v.content === item.content)
                if (obj === undefined) {
                  // 신규로 추가된 메뉴
                } else {
                  // 기존메뉴
                  item.isChecked = obj.isChecked
                  item.note = obj.note
                }
              }

              if (0 < value[key].length && (JSON.stringify(value[key]).includes("Yes") || JSON.stringify(value[key]).includes("No"))) {
                this.form.inspectListNormal = this.form.inspectListNormal.map((data) => {
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

            } else {
              this.form[key] = value[key];
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
          '작업장 순회점검일지': 1,
        });

        this.$emit("input", value);
      },
    },
    // 기존게시글에서 관리책임자 이름을 가져오기 위함
    'form.stdInfo': {
      immediate: true,
      deep: true,
      handler(value) {
        if (value.field_id && !value.director_name) {
          this.getDirectorName(value.field_id);
        }
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        inspectionInfo: [],
        photoList: [],
        fileList: [],
        inspectList: JSON.parse(JSON.stringify(inspectData.inspectList)),
        inspectListNormal: JSON.parse(JSON.stringify(inspectData.inspectListNormal)),
        checkComment: "",
        confirmName: "",
        confirmSign: "",

        disasters: "",
      },
    };
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        if (key === 'inspectList') {
          this.form[key] = this.value[key]

        } else if (key === 'inspectListNormal') {
          for (const item of this.form[key]) {
            let obj = this.value[key].find((v) => v.title === item.title && v.content === item.content)
            if (obj === undefined) {
              // 신규로 추가된 메뉴
            } else {
              // 기존메뉴
              item.isChecked = obj.isChecked
              item.note = obj.note
            }
          }

        } else {
          this.form[key] = this.value[key];
        }
      }
    }
  },
  methods: {
    inputDisaster(field) {
      const disasters = field.재해형태;
      this.form.disasters = "";
      for (const disaster of disasters) {
        this.form.disasters += `${disaster} `;
      }
    },

    async getDirectorName(id) {
      console.log("getDirectorName", id);
      await this.$store.dispatch("project/LOAD_FIELD", {fieldId: id});
      const info = this.$store.state.project.fieldInfo;
      if (info) {
        this.form.stdInfo.director_name = info.director_name;
      }
    }
  },
};
</script>

<style scoped></style>
