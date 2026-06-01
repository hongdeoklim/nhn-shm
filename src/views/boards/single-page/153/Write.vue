<template>
  <print153 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!--협의체 정보-->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의체 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">구분</div>
          <vs-select class="w-full flex-1" autocomplete v-model="form.inputA_1" :disabled="board.readonly">
            <vs-select-item text="정기" value="정기"/>
            <vs-select-item text="임시" value="임시"/>
          </vs-select>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">협의일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_2 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector
              class="w-full"
              v-model="form.inputA_2"
              :readonly="board.readonly"
            />
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회의장소</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_3 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_3"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">노측 위원</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_4 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            type="number"
            v-model="form.inputA_4"
            class="w-full flex-1"
          />
          <span class="pl-2">명</span>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사측 위원</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_5 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            type="number"
            v-model="form.inputA_5"
            class="w-full flex-1"
          />
          <span class="pl-2">명</span>
        </div>
      </div>
    </div>


    <!-- 노·사협의체(사용자) -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="사측 위원(사용자)"
      :tableData="[
        { id: 'cell1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'cell2',
          title: '직책',
          type: 'select',
          selectData: [
            '사용자대표',
            '안전관리자',
            '보건관리자',
            '사용자위원',
          ],
          placeholder: '선택',
        },
        { id: 'cell3', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'cell4', title: '서명', type: 'sign'},
        { id: 'cell5', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      max-size="10"
      v-model="form.userTableList"
    />


    <!-- 위험성평가협의회(근로자) -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="노측 위원(근로자)"
      :tableData="[
        { id: 'cell1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'cell2',
          title: '직책',
          type: 'select',
          selectData: [
            '근로자대표',
            '명예산업안전감독관',
            '근로자위원',
          ],
          placeholder: '선택',
        },
        { id: 'cell3', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'cell4', title: '서명', type: 'sign'},
        { id: 'cell5', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      max-size="10"
      v-model="form.workerTableList"
    />

    <!-- 노·사협의체(심의·의결사항, 안전계획 등) 협의내용  -->
    <div class="mt-8">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5>
            <i class="dot"></i> 노·사협의체(심의·의결사항, 안전계획 등) 협의내용
          </h5>
        </vs-col>
      </vs-row>

      <div class="print-container flex items-start mt-4">
        <div class="label-text mr-4 mt-2">산업재해 예방방법 및 산업재해가 발생한 경우의 대피방법</div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputB_4 }}</p>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_4"
          :readonly="board.readonly"
        />
      </div>
      <div class="print-container flex items-start">
        <div class="label-text mr-4 mt-2">작업의 시작시간, 작업 및 작업장 간의 연락방법</div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputB_5 }}</p>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_5"
          :readonly="board.readonly"
        />
      </div>
      <div class="print-container flex items-start">
        <div class="label-text mr-4 mt-2">그 밖의 산업재해 예방과 관련된 사항</div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputB_6 }}</p>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_6"
          :readonly="board.readonly"
        />
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      placeholder="점검 현장 사진"
    />

    <!--    파일첨부-->
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
import TimeSelector from "@/components/selector/TimeSelector";
import TableInspect from "@/components/TableInspect";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import CompanySelector from "@/components/selector/CompanySelector";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import FieldSelector from "@/components/selector/FieldSelector";
import SignField from '@/components/SignField'
import TableCustom from "@/components/TableCustom.vue";
import Print153 from "@/views/boards/single-page/153/Print.vue";

export default {
  components: {
    Print153,
    TableCustom,
    SignField,
    FieldSelector,
    FieldSelectModule,
    DateSelector,
    TimeSelector,
    TableInspect,
    PhotoUploadGridModule,
    FileUploadModule,
    CompanySelector,
    DisasterClassSelector,
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

            if (key === "userTableList" && 0 < value[key].length) {
              this.userTempId = value[key][value[key].length - 1].id;
            }
            if (key === "workerTableList" && 0 < value[key].length) this.workerTempId = value[key][value[key].length - 1].id;
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.summary = {
          노사협의체_현장명: [],
          노사협의체_재해형태: [],
        };

        value.summary["노사협의체_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        value.summary["노사협의체_재해형태"].push({
          [this.form.inputB_3]: 1,
        });

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        userTableList: [],
        workerTableList: [],
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
        inputB_6: "",
        inputB_7: "",
        inputB_8: "",
        inputB_9: "",
        inputB_10: "",
        inputB_11: "",
        inputB_12: "",
        photoList: [],
        fileList: [],
        fieldTitle: "",
      },
      userSelected: [],
      workerSelected: [],
      userTempId: 0,
      workerTempId: 0,
    };
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];

        if (key === "userTableList" && 0 < this.value[key].length) {
          this.userTempId = this.value[key][this.value[key].length - 1].id;
        }
        if (key === "workerTableList" && 0 < this.value[key].length) this.workerTempId = this.value[key][this.value[key].length - 1].id;
      }
    }
  },
  methods: {
    addTableRow(type) {
      this.form[type].push({
        id: type === "userTableList" ? ++this.userTempId : ++this.workerTempId,
        cell1: "",
        cell2: "",
        cell3: "",
        cell4: "",
        cell5: "",
      });
    },
    deleteSelectTable(type) {
      const selectedIds = type === "userTableList" ? this.userSelected.map((item) => item.id) : this.workerSelected.map((item) => item.id);
      this.form[type] = this.form[type].filter(
        (item) => !selectedIds.includes(item.id)
      );
    },
    onChangeField(field) {
      this.form.fieldTitle = field.field_name;
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
  padding-right: 4px;
  word-break: keep-all;
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

.table ::v-deep {
  .vs-con-tbody {
    background: none !important;
    border: 0 !important;
  }
  thead tr {
    background: #f9f9f9 !important;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
  }
  tr {
    background: #fff !important;
    border-bottom: solid 1px #cdcdcd;
  }
}
</style>
