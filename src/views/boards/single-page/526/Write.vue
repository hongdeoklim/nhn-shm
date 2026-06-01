<template>
  <print v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!--화재감시자 정보-->
    <div class="mt-5 relative">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 화재감시자 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_1 }}</p>
          <ml-input
            v-else
            v-model="form.inputA_1"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속명</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_2 }}</p>
          <ml-input
            v-else
            v-model="form.inputA_2"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직책</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_3 }}</p>
          <ml-input
            v-else
            v-model="form.inputA_3"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">서명 또는 인</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputA_4" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputA_4" :src="form.inputA_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">선임일</div>
          <p v-if="isPrint" class="print-input flex-1">
            {{ form.inputA_5 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector
              class="w-full"
              v-model="form.inputA_5"
              :readonly="board.readonly"
            />
          </div>
        </div>
      </div>
    </div>

    <!--지정업체 정보-->
    <div class="mt-5 relative">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 지정업체 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_1 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_1"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속명</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_2 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_2"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직책</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_3 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_3"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">서명 또는 인</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputB_4" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputB_4" :src="form.inputB_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
<!--        <div class="col-span-4 flex items-center">-->
<!--          <div class="label-text mr-4">선임일</div>-->
<!--          <p v-if="isPrint" class="print-input flex-1">-->
<!--            {{ form.inputB_5 }}-->
<!--          </p>-->
<!--          <div v-else class="flex-1 flex items-center">-->
<!--            <date-selector-->
<!--              class="w-full"-->
<!--              v-model="form.inputB_5"-->
<!--              :readonly="board.readonly"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
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
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import FileUploadModule from "@/views/modules/FileUploadModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import TableCustom from "@/components/TableCustom.vue";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import FileUploader from "@/components/FileUploader";
import SignField from "@/components/SignField.vue";
import Print from "@/views/boards/single-page/526/Print.vue";

export default {
  components: {
    Print,
    SignField,
    FieldSelectModule,
    DateSelector,
    PhotoUploadGridModule,
    FileUploadModule,
    TableCustom,
    DisasterClassSelector,
    FileUploader,
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
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
  methods: {},
  data() {
    return {
      form: {
        stdInfo: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",

        photoList: [],
        fileList: [],
      },
    };
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
</style>
