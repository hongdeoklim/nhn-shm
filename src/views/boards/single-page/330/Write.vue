<template>
  <print330 v-if="isPrint" :board="board" :form="form" />
  <div v-else>
    <!-- 날짜 -->
    <div class="absolute top-0 flex items-center gap-4 header-date" :class="[!isPrint && 'py-6']" style="left: calc(180px + 10rem)">
      <div class="flex items-center justify-center gap-3">
        <p v-if="isPrint" class="print-input">{{ form.headerYear | moment("YYYY") }}</p>
        <input v-else type="number" :readonly="board.readonly" min="1800" max="9999" v-model="form.headerYear" style="width: 65px" />
        년
        <p v-if="isPrint" class="print-input">{{ form.headerMonth | moment("MM") }}</p>
        <input v-else type="number" :readonly="board.readonly" min="1" max="12" v-model="form.headerMonth" style="width: 50px" @input="formatMonth" />
        월
        <p v-if="isPrint" class="print-input">{{ form.headerDay | moment("DD") }}</p>
        <input v-else type="number" :readonly="board.readonly" min="1" max="31" v-model="form.headerDay" style="width: 50px" @input="formatDay" />
        일
      </div>
    </div>

    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!-- 사업장 정보 -->
    <div class="mb-6 mt-6">
      <p class="title mb-5"><i class="dot"></i>사업장 정보</p>
      <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">업체명</div>
          <span v-if="isPrint" class="print-input"> {{ form.companyName }} </span>
          <div v-else class="w-full flex-1">
            <ml-input v-if="projectId===7" :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.companyName" />
            <CompanySelector v-else :readonly="board.readonly" class="w-full flex-1" v-model="form.inputB_1" placeholder="선택" @select="targetCompany"></CompanySelector>
          </div>

        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">{{projectId===7? '직책':'대표자 직책'}}</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_2 }} </span>
          <ml-input v-else :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.inputB_2" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_3 }} </span>
          <ml-input v-else :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.inputB_3" />
        </div>
        <div class="empty col-span-8 flex items-center"><!--공백--></div>
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4 pt-2">서명 또는 인</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputB_4" class="flex-1 justify-start" />
          <div v-else class="w-full flex-1">
            <img v-if="form.inputB_4" :src="form.inputB_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
      </div>
    </div>

    <!--위임받는 자-->
    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>위임받는 자</p>
      <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4">
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4">직책</div>
          <span v-if="isPrint" class="print-input pt-2"> {{ form.inputC_2 }} </span>
          <ml-input v-else :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.inputC_2" />
        </div>
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4">성명</div>
          <span v-if="isPrint" class="print-input pt-2"> {{ form.inputC_3 }} </span>
          <ml-input v-else :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.inputC_3" />
        </div>
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4 pt-2">서명 또는 인</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputC_4" class="flex-1 justify-start" />
          <div v-else class="w-full flex-1">
            <img v-if="form.inputC_4" :src="form.inputC_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
      </div>
    </div>

    <!--위임하는 자-->
    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>위임하는 자</p>
      <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4">
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4 pt-2">직책</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_2 }} </span>
          <ml-input v-else :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.inputD_2" />
        </div>
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4 pt-2">성명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_3 }} </span>
          <ml-input v-else :readonly="board.readonly" class="w-full flex-1" placeholder="" v-model="form.inputD_3" />
        </div>
        <div class="col-span-4 flex items-start">
          <div class="label-text mr-4 pt-2">서명 또는 인</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputD_4" class="flex-1 justify-start" />
          <div v-else class="w-full flex-1">
            <img v-if="form.inputD_4" :src="form.inputD_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
      </div>
    </div>

    <file-upload-module :readonly="board.readonly" v-model="form.fileList" :is-print="isPrint" />
  </div>
</template>

<script>
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import SearchNavStartEnd from "../../../../components/nav/SearchNavStartEnd.vue";
import FileUploadModule from "../../../modules/FileUploadModule.vue";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import Print from "@/views/boards/single-page/282/Print";
import SignField from "@/components/SignField.vue";
import Print330 from "@/views/boards/single-page/330/Print.vue";
import moment from "moment";

export default {
  components: {
    Print330,
    SignField,
    Print,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    SearchNavStartEnd,
    FileUploadModule,
    FieldSelectModule,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    "value": {
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
    "form": {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
    "form.headerYear": {
      immediate: true,
      deep: true,
      handler(value) {
        this.form.headerDate = `${this.form.headerYear}-${this.form.headerMonth}-${this.form.headerDay}}`;
        this.form.headerDateString = `${this.form.headerYear}년 ${this.form.headerMonth}월 ${this.form.headerDay}일`;
      },
    },
    "form.headerMonth": {
      immediate: true,
      deep: true,
      handler(value) {
        this.form.headerDate = `${this.form.headerYear}-${this.form.headerMonth}-${this.form.headerDay}}`;
        this.form.headerDateString = `${this.form.headerYear}년 ${this.form.headerMonth}월 ${this.form.headerDay}일`;
      },
    },
    "form.headerDay": {
      immediate: true,
      deep: true,
      handler(value) {
        this.form.headerDate = `${this.form.headerYear}-${this.form.headerMonth}-${this.form.headerDay}}`;
        this.form.headerDateString = `${this.form.headerYear}년 ${this.form.headerMonth}월 ${this.form.headerDay}일`;
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

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",

        inputD_1: "",
        inputD_2: "",
        inputD_3: "",
        inputD_4: "",

        fileList: [],
        companyName: "",

        headerYear: moment(new Date()).format("YYYY"),
        headerMonth: moment(new Date()).format("MM"),
        headerDay: moment(new Date()).format("DD"),

        headerDate: "",
        headerDateString: "",
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
  methods: {
    targetCompany(value) {
      this.form.companyName = value.com_name;
      this.form.inputB_3 = value.com_ceo;
    },
    formatMonth() {
      this.form.headerMonth = String(this.form.headerMonth).padStart(2, "0");
    },
    formatDay() {
      this.form.headerDay = String(this.form.headerDay).padStart(2, "0");
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
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
.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
}
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}
.input-se {
  width: 100%;
  &::v-deep .start-end-title {
    width: 114px;
    font-weight: 500;
    font-size: 14px;
    justify-content: flex-start;
  }
  &::v-deep .mr-2 {
    flex: 1;
    margin-right: 20px !important;
  }
  &::v-deep .mr-2 + .mr-2 {
    margin-right: 0 !important;
    position: relative;
    &::before {
      content: "~";
      width: 10px;
      position: absolute;
      left: -15px;
      text-align: center;
    }
  }
  &::v-deep .inline-block {
    width: 100% !important;
  }
}

input[type="number"] {
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 0.7rem !important;
  transition: all 0.3s ease;

  &:focus {
    border: 1px solid rgba(var(--vs-primary), 1) !important;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 1199px) {
  .header-date {
    padding: 8px 0 !important;
  }
  .empty {
    display: none !important;
  }
}
</style>
