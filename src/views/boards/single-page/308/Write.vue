<template>
  <print308 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" init-field-name="현장명" />

    <!--    재해자 정보(주소와 연락처는 직영근로자인 경우에만 기재)-->
    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 재해자 정보</h5>
      </vs-col>
    </vs-row>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">재해자 성명</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_1 }}</p>
        <ml-input v-else :readonly="board.readonly" v-model="form.inputB_1" class="w-full flex-1" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">연령</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_2 }}</p>
        <ml-input v-else :readonly="board.readonly" v-model="form.inputB_2" class="w-full flex-1" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">하수급인 승인여부</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
        <vs-select v-model="form.inputB_4" autocomplete v-else :readonly="board.readonly" class="w-full flex-1">
          <vs-select-item text="승인" value="승인" />
          <vs-select-item text="미승인" value="미승인" />
        </vs-select>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">소속사</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_3 }}</p>
        <CompanySelectorObj :readonly="board.readonly" class="w-full flex-1" v-model="form.inputB_3" placeholder="선택" @select="selectCompany" />
      </div>

      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">주소</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_5 }}</p>
        <ml-input v-else :readonly="board.readonly" v-model="form.inputB_5" class="w-full flex-1" placeholder="직영근로자인 경우에만 기재" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">연락처</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_6 }}</p>
        <ml-input v-else :readonly="board.readonly" v-model="form.inputB_6" class="w-full flex-1" placeholder="직영근로자인 경우에만 기재" />
      </div>

      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사고일자</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.inputB_7 }}</p>
        <date-selector :readonly="board.readonly" v-else class="w-full flex-1" v-model="form.inputB_7" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사고시간</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.inputB_8 }}</p>
        <time-selector :readonly="board.readonly" v-else class="w-full flex-1" v-model="form.inputB_8" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">재해장소</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_9 }}</p>
        <ml-input v-else :readonly="board.readonly" v-model="form.inputB_9" class="w-full flex-1" />
      </div>

      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">발생형태</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_10 }}</p>
        <disaster-class-selector v-else class="w-full flex-1" :readonly="board.readonly" v-model="form.inputB_10" />
      </div>

      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">사고원인</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputB_11" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">재발방지조치</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputB_12" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">잔존 유해 위험 요인 조치 계획</div>
        <ml-textarea class="flex-1 w-full" style="margin-bottom: 0" rows="5" v-model="form.inputB_13" :readonly="board.readonly" />
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" />

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import TimeSelector from "@/components/selector/TimeSelector";
import DateSelector from "@/components/selector/DateSelector";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import Print308 from "@/views/boards/single-page/308/Print.vue";
import CompanySelectorObj from "@/components/selector/CompanySelectorObj.vue";

export default {
  components: {
    CompanySelectorObj,
    Print308,
    PhotoUploadGridModule,
    DisasterClassSelector,
    DateSelector,
    TimeSelector,
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
        stdInfo: {},
        fileList: [],
        photoList: [{ placeholder: "재발방지 조치 사진" }, { placeholder: "재발방지 조치 사진" }],

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
        companyName: "",
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
