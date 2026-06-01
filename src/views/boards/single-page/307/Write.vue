<template>
  <print307 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" init-field-name="현장명" />

    <!--    협의체 정보-->
    <vs-row class="mt-8">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 재해자 정보</h5>
      </vs-col>
    </vs-row>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">재해자 성명</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_1 }}</p>
        <ml-input v-else v-model="form.inputB_1" class="w-full flex-1" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">연령</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_2 }}</p>
        <ml-input v-else v-model="form.inputB_2" class="w-full flex-1" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">하수급인 승인여부</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_4 }}</p>
        <ml-input v-else-if="board.readonly" v-model="form.inputB_4" class="w-full flex-1" readonly />
        <vs-select :disabled="board.readonly" v-else v-model="form.inputB_4" autocomplete class="w-full flex-1">
          <vs-select-item text="승인" value="승인" />
          <vs-select-item text="미승인" value="미승인" />
        </vs-select>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">소속사</div>
        <CompanySelectorObj :readonly="board.readonly" class="w-full flex-1" v-model="form.inputB_3" placeholder="선택" @select="selectCompany" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">주소</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_5 }}</p>
        <ml-input v-else v-model="form.inputB_5" class="w-full flex-1" placeholder="직영근로자인 경우에만 기재" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">연락처</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_6 }}</p>
        <ml-input v-else v-model="form.inputB_6" class="w-full flex-1" placeholder="직영근로자인 경우에만 기재" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사고일자</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_7 }}</p>
        <div v-else class="flex-1 flex items-center">
          <date-selector class="w-full" v-model="form.inputB_7" :readonly="board.readonly" />
        </div>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사고시간</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_8 }}</p>
        <time-selector v-else class="w-full flex-1" v-model="form.inputB_8" :readonly="board.readonly" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">재해장소</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_9 }}</p>
        <ml-input v-else v-model="form.inputB_9" class="w-full flex-1" :readonly="board.readonly" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">발생형태</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_10 }}</p>
        <disaster-class-selector v-else class="w-full flex-1" v-model="form.inputB_10" :readonly="board.readonly" />
      </div>
    </div>

    <vs-row class="my-4 mt-8">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 사고개요</h5>
      </vs-col>
    </vs-row>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">사고내용</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputC_1" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">재해부위</div>
        <ml-input :readonly="board.readonly" v-model="form.inputC_2" class="w-full flex-1" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">처리경과</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputC_3" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">처리계획</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputC_4" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">사고원인(추정)</div>
        <ml-input :readonly="board.readonly" v-model="form.inputC_5" class="w-full flex-1" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">재발방지계획</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputC_6" :readonly="board.readonly" />
      </div>
    </div>

    <!--    사진대지-->
    <PhotoUploadGridModule :row-count="2" :grid-count="2" v-model="form.photoList" :isPrint="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="사고 현장 사진" />

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-8" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import TimeSelector from "@/components/selector/TimeSelector";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import Print307 from "@/views/boards/single-page/307/Print.vue";
import CompanySelectorObj from "@/components/selector/CompanySelectorObj.vue";

export default {
  components: {
    CompanySelectorObj,
    Print307,
    PhotoUploadGridModule,
    DisasterClassSelector,
    TimeSelector,
    DateSelector,
    FieldSelectModule,
    FileUploadModule,
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
        value.title = this.board.writer.department;
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
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

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",
        inputC_5: "",
        inputC_6: "",
        companyName: "",

        stdInfo: {},
        fileList: [],
        photoList: [
          {
            placeholder: "사고 현장 사진",
          },
          {
            placeholder: "사고 위치(도면 등)",
          },
        ],
      },
    };
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  methods: {
    selectCompany(value) {
      this.form.companyName = value.com_name;
    },
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.isPrint = true;
  //   }, 3000);
  // }
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$w-inpu0: 260px;
$w-inpu1: 220px;
$w-inpu2: 140px;
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-1 {
  background-color: #f9f9f9;
  border-bottom: $border;
}

.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
  padding-right: 12px;
  word-break: keep-all;
}

.mt-component-form {
  margin-top: 15px;
}

.text-box {
  line-height: 19px;
  margin-top: 15px;
  border: $border;
}

/* uploaded File */
.form-group {
  border: $border;
  overflow: auto;
  width: 100%;
  /*overflow-x: auto;*/

  &__header {
    height: 80px;
    width: 100%;
    display: flex;

    &-title {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title.title-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }
  }

  &__content {
    width: 100%;
    display: flex;

    &-row {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      padding: 7px;
    }

    &-row.row-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }

    &-row.row-w2 {
      min-width: $w-inpu1;
    }
  }
}

.row-w1 {
  min-width: $w-inpu1;
}

.row-w0 {
  min-width: $w-inpu0;
}

.bx {
  border-left: $border;
  border-right: $border;
}

.br {
  border-right: $border;
}

.bb {
  border-bottom: $border;
}
</style>
