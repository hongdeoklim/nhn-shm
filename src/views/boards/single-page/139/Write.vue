<template>
  <div v-if="!isPrint">
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" @selectField="onSelectField" />

    <!--    현장 개요-->
    <vs-row class="my-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 현장 개요</h5>
      </vs-col>
    </vs-row>
    <div class="writeGridContainer mt-4">
      <div>
        <div>현장명</div>
        <ml-input :readonly="true" :value="form.stdInfo.field_name" />
      </div>
      <div>
        <div>현장주소</div>
        <ml-input :readonly="true" :value="form.stdInfo.field_address" />
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>고용노동부</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_1" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>본사</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="(row, ii) in form.list_2" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="ii === 0 ? true : board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="ii === 0 ? true : board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>감리단</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_3" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>관할 경찰서</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_4" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>관할 소방서</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_5" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>시·도·군·구청(허가권자)</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_6" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>한국전력공사</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_7" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="my-4 flex items-end">
        <p class="title"><i class="dot"></i>지정 병원</p>
      </div>
      <div class="form-group grid">
        <div class="overflow-x-auto">
          <div class="form-group__header" style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #cdcdcd">
            <div class="form-group__header-title">부서명</div>
            <div class="form-group__header-title">연락처</div>
          </div>
          <div class="form-group__content" style="display: grid; grid-template-columns: 1fr 1fr" v-for="row in form.list_8" :key="row.id">
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_1" />
            </div>
            <div class="form-group__content-row">
              <ml-input :readonly="board.readonly" class="w-full" v-model="row.inputB_2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <file-upload-module :readonly="board.readonly" v-model="form.fileList" :is-print="isPrint" />
  </div>
  <print v-else :form="form" />
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
import Print from "./Print.vue";

export default {
  components: {
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    SearchNavStartEnd,
    FileUploadModule,
    FieldSelectModule,
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
  created() {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  data() {
    return {
      options: [
        { value: "총괄책임자", label: "총괄책임자" },
        { value: "관리감독자", label: "관리감독자" },
        { value: "관리감독자", label: "관리감독자" },
        { value: "담당자", label: "담당자" },
      ],
      form: {
        stdInfo: { field_name: "" },
        fieldInfo: {
          field_name: "",
          field_address: "",
          deposit_amount: "",
          director_name: "",
          safety_manager_name: "",
          start_work_at: "",
          be_completed_at: "",
        },
        fileList: [],

        list_1: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
        list_2: [
          { inputB_1: "농협네트웍스", inputB_2: "02-2140-5000", inputB_3: "" },
          // { inputB_1: '', inputB_2: '', inputB_3: ''},
        ],
        list_3: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
        list_4: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
        list_5: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
        list_6: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
        list_7: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
        list_8: [{ inputB_1: "", inputB_2: "", inputB_3: "" }],
      },
    };
  },
  computed: {},
  methods: {
    getId(array = [], id) {
      const index = array.findIndex((item) => item.id === id);
      if (index !== -1) {
        let max = Math.max(...array.map((o) => o.id));
        return ++max;
      } else {
        return array.length;
      }
    },
    handleCheckAll_1(e) {
      const checked = e.target.checked;
      this.form.list_1.forEach((e) => {
        e.inputB_check = checked;
      });
    },

    handleAddRow_B() {
      this.form.list_1.push({
        id: this.getId(this.form.list_1, this.form.list_1.length),
        inputB_check: false,
        inputB_1: "본사",
        inputB_2: "02-2140-5000",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
      });
    },
    handleRemoveRow_B() {
      if (this.form.list_1.length === 1) {
        //
      } else {
        this.form.list_1 = this.form.list_1.filter((x) => x.inputB_check === false);
        this.form.input_check_1 = false;
      }
    },
    onSelectField(data) {
      this.form.fieldInfo.field_name = data.field_name;
      this.form.fieldInfo.field_address = data.address;
      this.form.fieldInfo.deposit_amount = data.deposit_amount;
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

$border: 1px solid #cdcdcd;

.form-group {
  border-top: $border;
  border-bottom: $border;
  overflow: auto;
  width: 100%;

  &__header {
    background: #f9f9f9;
    height: 52px;
    width: 100%;
    display: flex;

    &-title {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title.title-checked {
      margin: 0 auto;
      border: none;
    }
  }

  &__content {
    width: 100%;
    display: flex;

    &-row {
      padding: 7px;
      border-bottom: $border;
    }

    &-row.row-checked {
      margin: 0;
      border-left: none;
      padding-left: 10px;
    }
  }
}
</style>
