<template>
  <div>
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!-- 수급인 정보 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 수급인 정보</h5>
      <div class="writeGridContainer">
        <div>
          <div>소속명</div>
          <p v-if="isPrint" class="print-input">{{ form.소속명 }}</p>
          <ml-input v-else v-model="form.소속명" :readonly="board.readonly" />
        </div>
        <div>
          <div>직책</div>
          <p v-if="isPrint" class="print-input">{{ form.직책 }}</p>
          <div v-else>
            <ml-input v-if="form.직책 === '직접입력'" v-model="직책데이터" ref="selectCustomInput" @blur="inputBlur" autofocus class="w-full" />
            <vs-select v-else v-model="form.직책" class="w-full flex-1" autocomplete>
              <vs-select-item :text="'관리감독자'" :value="'관리감독자'" />
              <vs-select-item :text="'직접입력'" :value="'직접입력'" />
              <vs-select-item v-show="false" :text="직책데이터" :value="직책데이터" />
            </vs-select>
          </div>
        </div>
        <div>
          <div>성명</div>
          <p v-if="isPrint" class="print-input">{{ form.성명 }}</p>
          <ml-input v-else v-model="form.성명" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.서명" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.서명" :src="form.서명" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div>
          <div>비고</div>
          <p v-if="isPrint" class="print-input">{{ form.비고 }}</p>
          <ml-input v-else v-model="form.비고" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 파일첨부 -->
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
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector.vue";
import TableInspect from "@/components/TableInspect.vue";
import SignField from "@/components/SignField.vue";

export default {
  components: {
    SignField,
    TableInspect,
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
    'form.직책'(value) {
      if (this.form.직책 === "직접입력") {
        this.직책데이터 = "";
        this.$nextTick(() => {
          this.$refs.selectCustomInput.focus();
        });
      } else this.$emit("input", this.직책데이터);
    },
  },
  data() {
    return {
      직책데이터: "",
      form: {

        stdInfo: {},
        fileList: [],
        소속명: "",
        직책: "",

        성명: "",
        서명: "",
        비고: "",
      },
    };
  },
  methods: {
    inputBlur() {
      this.form.직책 = this.직책데이터;
    },
  },
};
</script>
