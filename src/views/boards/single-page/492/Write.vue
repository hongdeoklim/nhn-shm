<template>
  <div v-if="!isPrint">
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!-- 본사 -->
    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 수행평가 대상</h5>
        </vs-col>
      </vs-row>

      <div class="writeGridContainer">
        <div>
          <div>훈련일</div>
          <date-selector v-model="form.inputA_1" />
        </div>
        <div>
          <div>훈련장소</div>
          <ml-input v-model="form.inputA_2" />
        </div>
        <div>
          <div>훈련명</div>
          <ml-input v-model="form.inputA_3" />
        </div>
      </div>
    </div>

    <!-- 훈련실시 현황 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="훈련실시 현황"
      :tableData="[
        { id: 'input1', title: '훈련시간', type: 'timeArr', placeholder: '내용' },
        { id: 'input2', title: '상황내용', type: 'textarea', placeholder: '내용' },
        { id: 'input3', title: '대응조치', type: 'textarea', placeholder: '내용' },
        { id: 'input4', title: '조치자', type: 'text', placeholder: '내용' },
      ]"
      v-model="form.currentSituationList"
      class="mt-4"
    />

    <!-- 문제점 및 개선방안 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="문제점 및 개선방안"
      :tableData="[
        { id: 'input1', title: '구분', type: 'text', placeholder: '내용' },
        { id: 'input2', title: '문제점', type: 'textarea', placeholder: '내용' },
        { id: 'input3', title: '대응조치', type: 'textarea', placeholder: '내용' },
        { id: 'input4', title: '조치자', type: 'text', placeholder: '내용' },
      ]"
      v-model="form.improvementList"
      class="mt-4"
    />

    <!-- 훈련결과 -->
    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 훈련결과</h5>
        </vs-col>
      </vs-row>

      <div class="w-1/4 flex justify-between" style="min-width: 200px;">
        <vs-radio v-model="form.inputB_1" :disabled="board.readonly" vs-name="적합" vs-value="적합">적합</vs-radio>
        <vs-radio v-model="form.inputB_1" :disabled="board.readonly" vs-name="보완" vs-value="보완">보완</vs-radio>
        <vs-radio v-model="form.inputB_1" :disabled="board.readonly" vs-name="부적합" vs-value="부적합">부적합</vs-radio>
      </div>
    </div>

    <table-inspect-custom
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      title="비상조치훈련 평가표"
      check-title="평가결과(점)"
      main-grid-style="90px 1fr 324px 320px"
      check-grid-style="50px 50px 50px 50px 50px 1fr"
      :check-list="['1', '2', '3', '4', '5', { label: '해당없음', value: '0' }]"
      check-key="is_checked"
      :list="form.inspectList">
      <template slot="footer">
        <div class="row-header" style="white-space: pre-wrap;"> 평가 </div>
        <div class="col-span-2 grid p-0" style="grid-template-columns: 100px 1fr;">
          <div class="row-header border-right"> 총평 </div>
          <div class="p-2">
            <ml-textarea v-model="form.command"/>
          </div>
        </div>
        <div class="grid p-0" style="grid-template-columns: 100px 1fr;">
          <div class="row-header border-right"> 평가점수 </div>
          <div class="p-2" style="display: flex; justify-content: center; align-items: center;">
            {{ inspectTotal }}
          </div>
        </div>
      </template>
    </table-inspect-custom>

    <!-- 확인자-->
    <h5 class="mt-8"><i class="dot"></i>확인자</h5>
    <div class="writeGridContainer mt-4">
      <div>
        <div>관리감독자</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.sign_1_name }}</p>
        <ml-input v-else v-model="form.sign_1_name" :readonly="board.readonly"/>
      </div>
      <div>
        <div>서명</div>
        <sign-field v-if="!isPrint && !board.readonly" v-model="form.sign_1_data" class="flex-1 justify-self-start sign-module" />
        <div v-else class="w-full flex-1 p-1">
          <img v-if="form.sign_1_data" :src="form.sign_1_data" width="100%" alt="Signature" class="signatureImg" />
          <div v-else class="signatureImg"></div>
        </div>
      </div>
    </div>
    <div class="writeGridContainer mt-4">
      <div>
        <div>안전관리자</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.sign_2_name }}</p>
        <ml-input v-else v-model="form.sign_2_name" :readonly="board.readonly"/>
      </div>
      <div>
        <div>서명</div>
        <sign-field v-if="!isPrint && !board.readonly" v-model="form.sign_2_data" class="flex-1 justify-self-start sign-module" />
        <div v-else class="w-full flex-1 p-1">
          <img v-if="form.sign_2_data" :src="form.sign_2_data" width="100%" alt="Signature" class="signatureImg" />
          <div v-else class="signatureImg"></div>
        </div>
      </div>
    </div>
    <div class="writeGridContainer mt-4">
      <div>
        <div>관리책임자</div>
        <p v-if="isPrint" class="w-full flex-1">{{ form.sign_3_name }}</p>
        <ml-input v-else v-model="form.sign_3_name" :readonly="board.readonly"/>
      </div>
      <div>
        <div>서명</div>
        <sign-field v-if="!isPrint && !board.readonly" v-model="form.sign_3_data" class="flex-1 justify-self-start sign-module" />
        <div v-else class="w-full flex-1 p-1">
          <img v-if="form.sign_3_data" :src="form.sign_3_data" width="100%" alt="Signature" class="signatureImg" />
          <div v-else class="signatureImg"></div>
        </div>
      </div>
    </div>

    <!-- 참석자 명단-->
    <table-custom
      class="mt-4"
      :board="board"
      :is-print="isPrint"
      title="참석자 명단"
      :tableData="[
        { id: 'input1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'input2',
          title: '직급',
          type: 'select',
          selectData: workRank,
          placeholder: '선택',
        },
        {
          id: 'input3',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자'],
          placeholder: '선택',
        },
        { id: 'input4', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'input5', title: '서명', type: 'sign' },
        { id: 'input6', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :mobile="['input1', 'input4']"
      v-model="form.participant"
    />

    <!--    사진대지-->
    <PhotoUploadGridModule
      v-model="form.photoList"
      :isPrint="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      :gridCount="2"
      placeholder="00센터 신축현장 점검"
      :showFooterInput="false"
    />

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
import TableInspect from '@/components/TableInspect'
import SignField from "@/components/SignField.vue";
import Print from "./Print.vue";
import TableInspectCustom from '@/components/TableInspectCustom.vue'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'

export default {
  components: {
    PhotoUploadGridModule,
    TableInspectCustom,
    TableInspect,
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
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }

        if (!this.form || !this.form.inspectList || this.form.inspectList.length === 0) {
          this.form.inspectList = this.inspectTable
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
  computed: {
    inspectTable () {
      return [
        {
          id: 1,
          title: '훈련계획',
          label: '훈련계획은 훈련목적에 부합하는가',
          is_checked: '',
        },
        {
          id: 2,
          title: '훈련계획',
          label: '훈련시 사고예방을 위한 안전조치를 취하였는가?',
          is_checked: '',
        },
        {
          id: 3,
          title: '훈련계획',
          label: '훈련시나리오는 시설의 규모, 특성을 반영하여 작성되었는가?',
          is_checked: '',
        },
        {
          id: 4,
          title: '훈련계획',
          label: '훈련기관과의 원활한 업무협력이 이루어지고 있는가?\n' +
            '(인근시설과의 상호협력 포함)',
          is_checked: '',
        },
        {
          id: 5,
          title: '위기상황\n조직',
          label: '위기상황 조직이 구성되어 있으며, 임무를 숙지하고 있는가?',
          is_checked: '',
        },
        {
          id: 6,
          title: '위기상황\n조직',
          label: '신속한 대응 및 단계별 임무수행이 적절하게 이루어지고 있는가?',
          is_checked: '',
        },
        {
          id: 7,
          title: '위기상황\n전파',
          label: '경보방송 및 비상방송을 정상적으로 작동하는가?',
          is_checked: '',
        },
        {
          id: 8,
          title: '위기상황\n전파',
          label: '위기상황전파 및 통보가 적정하게 이루어지고 있는가?',
          is_checked: '',
        },
        {
          id: 9,
          title: '위기상황\n전파',
          label: '보고 및 전파 시 각자의 임무와 역할을 숙지하고 행동하는가?',
          is_checked: '',
        },
        {
          id: 10,
          title: '초동대응\n(대피)',
          label: '초동대응을 위한 지휘통제가 적절한가?',
          is_checked: '',
        },
        {
          id: 11,
          title: '초동대응\n(대피)',
          label: '초동대응이 신속하고 적절하게 이루어졌는가?',
          is_checked: '',
        },
        {
          id: 12,
          title: '초동대응\n(대피)',
          label: '모든 재실자들이 대피에 참여하는가?',
          is_checked: '',
        },
        {
          id: 13,
          title: '초동대응\n(대피)',
          label: '대피유도를 위한 대피 유도원을 배치하였는가?',
          is_checked: '',
        },
        {
          id: 14,
          title: '초동대응\n(대피)',
          label: '대피유도원의 역할은 적절히 수행되는가?',
          is_checked: '',
        },
        {
          id: 15,
          title: '초동대응\n(대피)',
          label: '안전취약 직원에 대하여 고려하였는가?',
          is_checked: '',
        },
        {
          id: 16,
          title: '초동대응\n(대피)',
          label: '현장대피는 신속하고 정확하게 이루어졌는가?',
          is_checked: '',
        },
        {
          id: 17,
          title: '비상대응',
          label: '집결지에서 인원파악을 실시하였는가?',
          is_checked: '',
        },
        {
          id: 18,
          title: '비상대응',
          label: '현장에서 협업기능이 원활하게 가동되는가?',
          is_checked: '',
        },
        {
          id: 19,
          title: '상황종료\n피드백',
          label: '상황판단에 따른 재난상황 종료는 적절한가?',
          is_checked: '',
        },
        {
          id: 20,
          title: '상황종료\n피드백',
          label: '훈련종료 후 강평/피드백을 실시하였는가?',
          is_checked: '',
        },
      ]
    },
    inspectTotal () {
      let sum = 0;
      for (const item of this.form.inspectList) {
        if (this.isNumber(item.is_checked)) {
          sum += Number(`${item.is_checked}`)
        }
      }
      return sum
    }
  },
  data() {
    return {
      form: {
        stdInfo: {},
        fileList: [],
        photoList: [],
        currentSituationList: [],
        improvementList: [],
        inspectList: [],
        participant: [],

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputB_1: "",

        sign_1_name: "",
        sign_1_data: "",
        sign_2_name: "",
        sign_2_data: "",
        sign_3_name: "",
        sign_3_data: "",

        command: "",
      },

      workRank: ["감독관", "관리책임자", "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체"],
    };
  },
  methods: {
    updateListCheck (indexRows, text) {
      this.form.inspectList[indexRows].is_checked = text
    },
    isNumber (num) {
      try {
        return Number(num)
      } catch (err) {
        return false
      }
    }
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
