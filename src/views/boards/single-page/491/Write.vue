<template>
  <div v-if="!isPrint">
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" @selectField="selectField" />

    <!-- 본사 -->
    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 본사</h5>
        </vs-col>
      </vs-row>

      <div class="writeGridContainer">
        <div>
          <div>업체명</div>
          <company-selector v-model="form.inputA_1" :onlyRelated="false" popupTitle="업체 검색" @select="selectHeadOffice" :readonly="board.readonly" />
        </div>
        <div>
          <div>사업자등록번호</div>
          <ml-input v-model="form.inputA_2" readonly />
        </div>
        <div>
          <div>사업주 또는 대표자</div>
          <ml-input v-model="form.inputA_3" readonly />
        </div>
        <div>
          <div>전화번호</div>
          <ml-input v-model="form.inputA_4" readonly />
        </div>
        <div></div>
        <div></div>
        <div class="writeGridLineItem">
          <div>소재지</div>
          <ml-input v-model="form.inputA_5" readonly />
        </div>
      </div>
    </div>

    <!-- 현장 개요 -->
    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 현장 개요</h5>
          <p class="ml-3">※ 아래의 * 란은 원수급인이나 건설공사시공주도총괄ㆍ관리자만 작성합니다</p>
        </vs-col>
      </vs-row>

      <div class="writeGridContainer">
        <div>
          <div>현장명</div>
          <ml-input v-model="form.inputB_1" readonly />
        </div>
        <div>
          <div>전화번호</div>
          <ml-input v-model="form.inputB_2" readonly />
        </div>
        <div>
          <div>도급인 또는 건설공사시공주도총괄·관리자</div>
          <ml-input v-model="form.inputB_3" :readonly="board.readonly" />
        </div>
        <div>
          <div>휴대전화번호</div>
          <ml-input v-model="form.inputB_4" :readonly="board.readonly" />
        </div>
        <div class="writeGridLineItem">
          <div>소재지</div>
          <ml-input v-model="form.inputB_5" readonly />
        </div>
        <div>
          <div>착공일</div>
          <date-selector v-model="form.inputB_6" readonly />
        </div>
        <div>
          <div>준공일</div>
          <date-selector v-model="form.inputB_7" readonly />
        </div>
        <div>
          <div>공사금액</div>
          <comma-input v-model="form.inputB_8" readonly />
        </div>
        <div>
          <div>상시근로자수(명)</div>
          <comma-input v-model="form.inputB_9" :readonly="board.readonly" />
        </div>
        <div>
          <div>굴착깊이(M)*</div>
          <comma-input v-model="form.inputB_10" :readonly="board.readonly" />
        </div>
        <div>
          <div>건축물·공작물의 최대높이(M)*</div>
          <comma-input v-model="form.inputB_11" :readonly="board.readonly" />
        </div>
        <div>
          <div>건축물의 연면적(㎡)*</div>
          <comma-input v-model="form.inputB_12" :readonly="board.readonly" />
        </div>
        <div>
          <div>건축물의 최대층고(M)*</div>
          <comma-input v-model="form.inputB_13" :readonly="board.readonly" />
        </div>
        <div>
          <div>PC(Precast Concrete)조립작업 유무*</div>
          <ml-input v-model="form.inputB_14" :readonly="board.readonly" />
        </div>
        <div>
          <div>다리의 최대 지간 길이(M)*</div>
          <comma-input v-model="form.inputB_15" :readonly="board.readonly" />
        </div>
        <div>
          <div>터널길이(M)*</div>
          <comma-input v-model="form.inputB_16" :readonly="board.readonly" />
        </div>
        <div>
          <div>댐의 용도 및 저수용량(TON)*</div>
          <comma-input v-model="form.inputB_17" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 선임대상</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-3 flex items-center" v-for="(checkbox, checkIndex) in form.targetList" v-bind:key="checkbox.id">
          <div v-if="isPrint || board.readonly" class="flex">
            <div v-if="checkbox.check" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
              <vs-icon icon="check" size="x-small"></vs-icon>
            </div>
            <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
              <vs-icon icon="check" size="x-small"></vs-icon>
            </div>
            {{ checkbox.label }}
          </div>
          <label v-else class="flex">
            <vs-checkbox :readonly="board.readonly" v-model="checkbox.check"> </vs-checkbox>
            {{ checkbox.label }}
          </label>
        </div>
      </div>

      <div v-for="(targetItem, targetItem_i) in form.targetList" v-bind:key="targetItem.id">
        <div v-if="targetItem.check">
          <div class="flex justify-between items-center mt-8 mb-5">
            <h5><i class="dot"></i> {{ targetItem.title }}</h5>
            <div v-if="!board.readonly" class="flex gap-3">
              <vs-button color="secondary" @click="handleAddRow(targetItem_i)">인원 추가</vs-button>
              <vs-button color="secondary" type="border" @click="handleRemoveRow(targetItem_i)">마지막 항목 삭제</vs-button>
            </div>
          </div>
          <div v-for="(targetData, targetData_i) in targetItem.data" :key="`${targetItem_i}_${targetData_i}`" class="row-data">
            <div class="writeGridContainer mb-0">
              <div>
                <div>성명</div>
                <ml-input v-model="targetData.name" :readonly="board.readonly" />
              </div>
              <div>
                <div>생년월일</div>
                <date-selector v-model="targetData.birth" :readonly="board.readonly" />
              </div>
              <div>
                <div>기관명</div>
                <ml-input v-model="targetData.company" :readonly="board.readonly" />
              </div>
              <div>
                <div>전자우편 주소</div>
                <ml-input v-model="targetData.email" :readonly="board.readonly" />
              </div>
              <div>
                <div>전화번호</div>
                <ml-input v-model="targetData.phone" :readonly="board.readonly" />
              </div>
              <div>
                <div>자격/면허번호</div>
                <ml-input v-model="targetData.licenseCode" :readonly="board.readonly" />
              </div>
            </div>
            <table-custom
              :board="board"
              :is-print="isPrint"
              :controls="false"
              :multiple="false"
              v-model="targetData.list"
              :tableData="[
                { id: 'input1', title: '경력 - 기관명', type: 'text', placeholder: '내용' },
                { id: 'input2', title: '경력 - 기간', type: 'dateArr' },
              ]"
            />
            <div class="writeGridContainer mb-0">
              <div>
                <div>학력 - 학교</div>
                <ml-input v-model="targetData.educationLevel" :readonly="board.readonly" />
              </div>
              <div>
                <div>학력 - 학과</div>
                <ml-input v-model="targetData.major" :readonly="board.readonly" />
              </div>
              <div>
                <div>선임일</div>
                <date-selector v-model="targetData.assignmentDate" :readonly="board.readonly" />
              </div>
              <div>
                <div>구분</div>
                <vs-select v-model="targetData.type" autocomplete :disabled="board.readonly" class="w-full flex-1">
                  <vs-select-item v-for="typeOption in ['전담', '겸임']" :key="typeOption" :text="typeOption" :value="typeOption" />
                </vs-select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 보고인</h5>
        </vs-col>
      </vs-row>
      <div class="mb-4">「산업안전보건법 시행규칙」 제14조제2항에 따라 위와 같이 보고서를 제출합니다.</div>
      <div class="writeGridContainer">
        <div>
          <div>사업주 또는 대표자</div>
          <ml-input v-model="form.inputC_1" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-model="form.inputC_2" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <print v-else :form="form" />
</template>

<script>
import CompanySelector from "@/components/selector/CompanySelector.vue";
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector.vue";
import TableCustom from "@/components/TableCustom.vue";
import SignField from "@/components/SignField.vue";
import Print from "./Print.vue";

export default {
  components: {
    CompanySelector,
    Print,
    SignField,
    TableCustom,
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
        stdInfo: {},
        fileList: [],

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
        inputB_13: "",
        inputB_14: "",
        inputB_15: "",
        inputB_16: "",
        inputB_17: "",

        inputC_1: "",
        inputC_2: "",

        targetList: [
          {
            id: 1,
            check: false,
            label: "안전관리자",
            title: "안전관리자(안전관리자가 2명 이상인 경우에는 별지에 추가로 적습니다)",
            data: [
              {
                name: "",
                birth: "",
                company: "",
                email: "",
                phone: "",
                licenseCode: "",
                list: [
                  { input1: "", input2: { sDate: "", eDate: "" } },
                  { input1: "", input2: { sDate: "", eDate: "" } },
                ],
                educationLevel: "",
                major: "",
                assignmentDate: "",
                type: "",
              },
            ],
          },
          {
            id: 2,
            check: false,
            label: "보건관리자",
            title: "보건관리자(보건관리자가 2명 이상인 경우에는 별지에 추가로 적습니다)",
            data: [
              {
                name: "",
                birth: "",
                company: "",
                email: "",
                phone: "",
                licenseCode: "",
                list: [
                  { input1: "", input2: { sDate: "", eDate: "" } },
                  { input1: "", input2: { sDate: "", eDate: "" } },
                ],
                educationLevel: "",
                major: "",
                assignmentDate: "",
                type: "",
              },
            ],
          },
          {
            id: 3,
            check: false,
            label: "산업보건의",
            title: "산업보건의(산업보건의가 2명 이상인 경우에는 별지에 추가로 적습니다)",
            data: [
              {
                name: "",
                birth: "",
                company: "",
                email: "",
                phone: "",
                licenseCode: "",
                list: [
                  { input1: "", input2: { sDate: "", eDate: "" } },
                  { input1: "", input2: { sDate: "", eDate: "" } },
                ],
                educationLevel: "",
                major: "",
                assignmentDate: "",
                type: "",
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    selectField(data) {
      this.form.inputB_1 = data.field_name;
      this.form.inputB_2 = data.phone;
      this.form.inputB_5 = data.address;
      this.form.inputB_6 = data.date_work_start;
      this.form.inputB_7 = data.date_complete;
      this.form.inputB_8 = data.deposit_amount;
    },
    selectHeadOffice(data) {
      this.form.inputA_2 = data.com_number;
      this.form.inputA_3 = data.com_ceo;
      this.form.inputA_4 = data.com_number;
      this.form.inputA_5 = data.com_address;
    },
    handleAddRow(index) {
      this.form.targetList[index].data.push({
        name: "",
        birth: "",
        company: "",
        email: "",
        phone: "",
        licenseCode: "",
        list: [
          { input1: "", input2: { sDate: "", eDate: "" } },
          { input1: "", input2: { sDate: "", eDate: "" } },
        ],
        educationLevel: "",
        major: "",
        assignmentDate: "",
        type: "",
      });
    },
    handleRemoveRow(index) {
      if (1 < this.form.targetList[index].data.length) this.form.targetList[index].data.pop();
    },
  },
};
</script>

<style scoped lang="scss">
.row-data {
  border-top: solid 1px #dcdcdc;
  border-bottom: solid 1px #dcdcdc;
  padding: 14px 0;
  margin-bottom: 14px;
}
</style>
