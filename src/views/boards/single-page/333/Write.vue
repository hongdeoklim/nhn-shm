<template>
  <div v-if="!isPrint">
    <!--    기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!--    협의체 정보-->
    <div>
      <vs-row class="mt-8">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의체 정보</h5>
        </vs-col>
      </vs-row>
      <div class="writeGridContainer mt-4">
        <div>
          <div>평가차수</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_1 }}</p>
          <ml-input v-else v-model="form.inputB_1" :readonly="true"/>
        </div>
        <div>
          <div>평가기간</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_2 }} ~ {{ form.inputB_3 }}</p>
          <div v-else style="display: flex; align-items: center">
            <date-selector v-model="form.inputB_2" :readonly="board.readonly" @change="checkDate(form.inputB_2)" />
            &nbsp;~&nbsp;
            <date-selector v-model="form.inputB_3" :readonly="board.readonly" @change="checkDate(form.inputB_3)" />
          </div>
        </div>
        <div>
          <div>회의일</div>
          <p v-if="isPrint" class="print-input flex-1">
            {{ form.inputB_4 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector class="w-full" v-model="form.inputB_4" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div>회의시간</div>
          <p v-if="isPrint" class="print-input flex-1">
            {{ form.inputB_8 }} ~ {{ form.inputB_9 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <div class="grid" style="grid-template-columns: auto 20px auto">
              <time-selector class="w-full" v-model="form.inputB_8" :readonly="board.readonly" />
              <span style="display: flex; justify-content: center; align-items: center;">~</span>
              <time-selector class="w-full" v-model="form.inputB_9" :readonly="board.readonly" />
            </div>
          </div>
        </div>

        <div>
          <div>회의장소</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_5 }}</p>
          <ml-input v-else v-model="form.inputB_5" :readonly="board.readonly"/>
        </div>
        <div>
          <div>참석인원</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_6 }}</p>
          <ml-input v-else v-model="form.inputB_6" :readonly="board.readonly"/>
        </div>
      </div>
    </div>

    <!--    협의내용-->
    <!--    <vs-row class="mt-8">-->
    <!--      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">-->
    <!--        <h5><i class="dot"></i> 협의내용</h5>-->
    <!--      </vs-col>-->
    <!--    </vs-row>-->
    <!--    <div class="print-container col-span-12 flex items-start mt-4">-->
    <!--      <div class="label-text mr-4 mt-2">협럭업체 건의사항<br />(근로자 의견)</div>-->
    <!--      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputC_1 }}</p>-->
    <!--      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputC_1" class="flex-1 w-full" rows="5" />-->
    <!--    </div>-->
    <!--    <div class="print-container col-span-12 flex items-start">-->
    <!--      <div class="label-text mr-4 mt-2">전달사항<br />(경영자 의견)</div>-->
    <!--      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputC_2 }}</p>-->
    <!--      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputC_2" class="flex-1 w-full" rows="5" />-->
    <!--    </div>-->

    <!--    이전 회차 FEED BACK-->
    <!--    <vs-row class="mt-4">-->
    <!--      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">-->
    <!--        <h5><i class="dot"></i> 이전 회차 FEED BACK</h5>-->
    <!--      </vs-col>-->
    <!--    </vs-row>-->
    <!--    <div class="print-container col-span-12 flex items-start mt-4">-->
    <!--      <div class="label-text mr-4 mt-2">양호사항<br />(전회 우수사례)</div>-->
    <!--      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputD_1 }}</p>-->
    <!--      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputD_1" class="flex-1 w-full" rows="5" />-->
    <!--    </div>-->
    <!--    <div class="print-container col-span-12 flex items-start">-->
    <!--      <div class="label-text mr-4 mt-2">불량사항<br />(전회 미결사항)</div>-->
    <!--      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputD_2 }}</p>-->
    <!--      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputD_2" class="flex-1 w-full" rows="5" />-->
    <!--    </div>-->
    <!--    <div class="print-container col-span-12 flex items-start">-->
    <!--      <div class="label-text mr-4 mt-2">추가 위험요인</div>-->
    <!--      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputD_3 }}</p>-->
    <!--      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputD_3" class="flex-1 w-full" rows="5" />-->
    <!--    </div>-->

    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 회의내용</h5>
      </vs-col>
    </vs-row>
    <div class="print-container col-span-12 flex items-start mt-4">
      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputE_1 }}</p>
      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputE_1" class="flex-1 w-full" rows="5" />
    </div>

    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 기타사항</h5>
      </vs-col>
    </vs-row>
    <div class="print-container col-span-12 flex items-start mt-4">
      <p v-if="isPrint" class="print-textarea flex-1">{{ form.inputE_2 }}</p>
      <ml-textarea :readonly="board.readonly" v-else v-model="form.inputE_2" class="flex-1 w-full" rows="5" />
    </div>

    <!--    참석자 명단-->
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
    <!--    참석자-->
    <!--    <PhotoUploadGridModule v-model="form.photoListParticipant" :is-print="isPrint" :readonly="board.readonly" section-title="참석자 사진대지" placeholder="신축현장 점검" />-->

    <!--    조치결과-->
    <!--    <PhotoUploadGridModule v-model="form.photoListResult" :is-print="isPrint" :readonly="board.readonly" section-title="조치결과 사진대지" placeholder="신축현장 점검" />-->

    <!--    회의사진-->
    <PhotoUploadGridModule v-model="form.photoListMeeting" :is-print="isPrint" :readonly="board.readonly" :gridCount="2" section-title="회의 사진" placeholder="회의 사진"
                           :with-date-picker="!(projectId===4||projectId===7)"/>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <print v-else :form="form" />
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableInspect from "@/components/TableInspect";
import TableInspectDivision from "@/components/TableInspectDivision";
import TableDuration from "../../../../components/TableDuration";
import TableRiskFactor from "@/components/TableRiskFactor";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import TableCustom from "@/components/TableCustom.vue";
import Print from '@/views/boards/single-page/333/Print.vue'
import TimeSelector from '@/components/selector/TimeSelector.vue'

export default {
  components: {
    TimeSelector,
    Print,
    TableCustom,
    PhotoUploadGridModule,
    TableRiskFactor,
    TableDuration,
    TableInspectDivision,
    TableInspect,
    FieldSelectModule,
    FileUploadModule,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
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
  methods: {
    checkDate(input) {
      if (Date.parse(this.form.inputB_2) > Date.parse(this.form.inputB_3)) {
        if (input === this.form.inputB_2) {
          this.form.inputB_3 = this.form.inputB_2;
        } else {
          this.form.inputB_2 = this.form.inputB_3;
        }
      }
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id)
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},

        inputB_1: "정기",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        inputB_7: "",
        inputB_8: "",
        inputB_9: "",

        inputC_1: "",
        inputC_2: "",

        inputD_1: "",
        inputD_2: "",
        inputD_3: "",

        inputE_1: "",
        inputE_2: "",

        photoListParticipant: [],
        photoListResult: [],
        photoListMeeting: [],
        fileList: [],
        participant: [],
      },

      workRank: ["감독관", "관리책임자", "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체"],
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
