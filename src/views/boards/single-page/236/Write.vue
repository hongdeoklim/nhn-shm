<template>
  <div>
    <!--    기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :options="[
        { type: 'date', label: '보강일' },
        { type: 'text', label: '보강장소' },
      ]"
      :board="this.board"
      :is-print="isPrint"
    />

    <!--    시설물 개요-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 시설물 개요(중대시민재해용)</h5>
      </vs-col>
    </vs-row>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">현장(시설물)명</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
        <field-selector
          v-else
          class="w-full flex-1"
          v-model="form.inputB_1"
          :readonly="true"
          @select="onSelectFieldSelector"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">계약금액</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_2 }}</p>
        <comma-input
          v-else
          v-model="form.inputB_2"
          class="w-full flex-1"
          :readonly="true"
        ></comma-input>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">구분</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_3"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">종류</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_4"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">세분류</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_5"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">종별</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_6"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">안전 등급</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_7 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_7"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">시설물 위치(상세주소)</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_8 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_8"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">형식</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_9 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_9"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">준공일</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_10 }}</p>
        <date-selector
          v-else
          class="w-full flex-1"
          v-model="form.inputB_10"
          :readonly="board.readonly"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">규모1</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_11 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_11"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">규모2</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_12 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_12"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">규모3</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_13 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_13"
          class="w-full flex-1"
          :readonly="true"
        />
      </div>
    </div>

    <!--    보강 내용-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 보강 내용</h5>
      </vs-col>
    </vs-row>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">보강 구분</div>
        <p v-if="isPrint" class="print-input">{{ form.inputC_1 }}</p>
        <custom-option-selector
          v-else
          class="flex-1 w-full"
          :options="result_options"
          v-model="form.inputC_1"
          :readonly="board.readonly"
        />
      </div>
    </div>

    <div class="print-container flex items-start mt-4">
      <div class="label-text mr-4 mt-2">내용</div>
      <p v-if="isPrint" class="print-textarea">{{ form.inputC_2 }}</p>
      <ml-textarea
        v-else
        class="flex-1 w-full"
        rows="5"
        v-model="form.inputC_2"
        :readonly="board.readonly"
      />
    </div>
    <div class="print-container flex items-start">
      <div class="label-text mr-4 mt-2">결과</div>
      <p v-if="isPrint" class="print-textarea">{{ form.inputC_3 }}</p>
      <ml-textarea
        v-else
        class="flex-1 w-full"
        rows="5"
        v-model="form.inputC_3"
        :readonly="board.readonly"
      />
    </div>
    <div class="print-container flex items-start">
      <div class="label-text mr-4 mt-2">조치사항</div>
      <p v-if="isPrint" class="print-textarea">{{ form.inputC_4 }}</p>
      <ml-textarea
        v-else
        class="flex-1 w-full"
        rows="5"
        v-model="form.inputC_4"
        :readonly="board.readonly"
      />
    </div>

    <!--    사진대지-->
    <PhotoUploadGridModule
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      placeholder="신축현장 점검"
    />

    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :is-print="isPrint"
      :readonly="board.readonly"
    ></file-upload-module>
  </div>
</template>

<script>
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import CustomOptionSelector from "@/components/selector/CustomOptionSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FieldSelector from "@/components/selector/FieldSelector";

export default {
  components: {
    FieldSelector,
    CustomOptionSelector,
    FileUploadModule,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    FieldSelectModule,
    PhotoUploadGridModule,
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
      result_options: ["직접", "도급", "용역", "위탁", "기타"],
      form: {
        stdInfo: {},
        photoList: [],

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

        inputE_1: "",
        inputE_2: "",
        inputE_3: "",
        inputE_4: "",
        inputE_5: "",
        inputE_6: "",
        inputE_7: "",

        inputF_1: "",
        inputF_2: "",
        inputF_3: "",
        inputF_4: "",
        inputF_5: "",
        inputF_6: "",
        inputF_7: "",

        inputG_1: "",
        inputG_2: "",
        inputG_3: "",
        inputG_4: "",
        inputG_5: "",
        inputG_6: "",
        inputG_7: "",

        fileList: [],
      },
    };
  },
  methods: {
    onSelectFieldSelector(value) {
      this.form.inputB_2 = value.deposit_amount; // 계약금액

      if (value.facility_category) {
        this.form.inputB_3 = value.facility_category.cat1; // 구분
        this.form.inputB_4 = value.facility_category.cat2; // 종류
        this.form.inputB_5 = value.facility_category.cat3; // 세분류
        this.form.inputB_6 = value.facility_category.classification; // 종별
      }
      this.form.inputB_7 = value.safety_grade; // 안전 등급
      this.form.inputB_8 = value.address; // 시설물 위치
      this.form.inputB_9 = value.format; // 형식
      this.form.inputB_10 = value.be_completed_at; // 준공일
      this.form.inputB_11 = value.scale1; // 규모1
      this.form.inputB_12 = value.scale2; // 규모2
      this.form.inputB_13 = value.scale3; // 규모3
    },
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}

.upload-content {
  border: $border;

  &:last-child {
    border-left: none;
  }

  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }

  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}
</style>
