<template>
  <print v-if="isPrint" :board="board" :form="form" />
  <div v-else>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" init-field-name="현장명" />

    <!-- 관리감독자 정보  -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i>관리감독자 정보</h5>
      <div class="writeGridContainer">
        <div>
          <div>성명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputE_1 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputE_1" />
        </div>
        <div>
          <div>소속명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputE_2 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputE_2" />
        </div>
        <div>
          <div>직책</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputE_3 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputE_3" />
        </div>
        <div>
          <div>자격/면허번호</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputE_4 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputE_4" />
        </div>
        <div>
          <div>선임일</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputE_5 }} </span>
          <DateSelector v-else :readonly="board.readonly" placeholder="날짜선택" v-model="form.inputE_5" />
        </div>
      </div>
    </div>

    <!-- 지정업체 정보 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i>지정업체 정보</h5>
      <div class="writeGridContainer">
        <div>
          <div>성명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_1 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputD_1" />
        </div>
        <div>
          <div>소속명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_2 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputD_2" />
        </div>
        <div>
          <div>직책</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_3 }} </span>
          <ml-input v-else :readonly="board.readonly" v-model="form.inputD_3" />
        </div>
        <div>
          <div>서명 또는 인</div>
          <sign-field :readonly="isPrint || board.readonly" v-model="form.inputD_6" />
        </div>
      </div>
    </div>

    <file-upload-module :readonly="board.readonly" v-model="form.fileList" :is-print="isPrint" class="mt-28px" />
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import SignField from "@/components/SignField.vue";
import Print from "./Print";
import FileUploadModule from "@/views/modules/FileUploadModule";

export default {
  components: {
    FieldSelectModule,
    DateSelector,
    SignField,
    Print,
    FileUploadModule,
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
      form: {
        stdInfo: {},

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",
        inputC_5: "",

        inputD_1: "",
        inputD_2: "",
        inputD_3: "",
        inputD_4: "",
        inputD_5: "",
        inputD_6: "",

        inputE_1: "",
        inputE_2: "",
        inputE_3: "",
        inputE_4: "",
        inputE_5: "",
        inputE_6: "",

        fileList: [],
        companyName: "",
      },
    };
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
