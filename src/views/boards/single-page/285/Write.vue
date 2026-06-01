<template>
  <print v-if="isPrint" :form="form"/>
  <div v-else>

    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
      @selectField="selectField"
      init-field-name="현장명" />

    <!-- 본사정보 -->
    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>업체정보</p>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 ">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">{{projectId===7?'업체명':'사업장명'}}</div>
          <ml-input
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputB_1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사업주 또는 대표자</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_2 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputB_2"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">(서명 또는 인)</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputB_5" class="flex-1 p-1 justify-start"/>
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputB_5" :src="form.inputB_5" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
<!--        <div class="col-span-4 flex items-center">-->
<!--          <div class="label-text mr-4">전화번호</div>-->
<!--          <span v-if="isPrint" class="print-input"> {{ form.inputB_3 }} </span>-->
<!--          <ml-input-->
<!--            v-else-->
<!--            :readonly="board.readonly"-->
<!--            class="w-full flex-1"-->
<!--            v-model="form.inputB_3"-->
<!--          />-->
<!--        </div>-->
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소재지</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_4 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputB_4"
          />
        </div>
      </div>
    </div>

    <!-- 현장 개요 -->
    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>현장 개요</p>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 ">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">현장명</div>
          <span v-if="isPrint"> {{ form.inputC_1 }} </span>
          <ml-input
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발주자 또는 도급인</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_2 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_2"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">현장주소(소재지)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_3 }} </span>
          <ml-input
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_3"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표번호</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_4 }} </span>
          <ml-input
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_4"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">착공일</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_5 }} </span>
          <date-selector
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_5"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">준공일</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_6 }} </span>
          <date-selector
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_6"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">착공일</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_7 }} </span>
          <date-selector
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_7"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">준공일</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_8 }} </span>
          <date-selector
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_8"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사업금액</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_9 }} </span>
          <comma-input
            v-else
            :readonly="true"
            class="w-full flex-1"
            v-model="form.inputC_9"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">상시근로자수</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_10 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_10"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">굴착깊이(M)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_11 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_11"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">건축물·공작물의 최대높이(M)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_12 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_12"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">건축물의 연면적(㎡)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_13 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_13"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">건축물의 최대층고(M)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_14 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_14"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">PC조립작업 유무</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_15 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_15"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">교량의 최대 지간 길이(M)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_16 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_16"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">터널길이(M)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_17 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_17"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">댐의 용도 및 저수용량(TON)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_18 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputC_18"
          />
        </div>
      </div>
    </div>
    <div class="mb-6 tip">
      <div class="flex items-center">
        <feather-icon icon="AlertCircleIcon" class="mr-2" style="cursor: pointer; width:16px;" />
        <span class="title">‘굴착깊이(M)’ ~ ‘댐의 용도 및 저수용량(TON)’ 항목은 원수급인인 경우에만 해당합니다.</span>
      </div>

    </div>

    <!-- 안전보건(총괄)책임자 -->
    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>안전보건(총괄)책임자</p>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 ">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_1 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputD_1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_2 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputD_2"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직책</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_3 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputD_3"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">자격/면허번호</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_4 }} </span>
          <ml-input
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputD_4"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">선임일</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_5 }} </span>
          <DateSelector
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            placeholder="날짜선택"
            v-model="form.inputD_5"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">구분</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_6 }} </span>
          <vs-select v-else class="w-full flex-1" autocomplete v-model="form.inputD_6" :disabled="board.readonly">
            <vs-select-item text="전담" value="전담"/>
            <vs-select-item text="겸임" value="겸임"/>
          </vs-select>
        </div>
      </div>
    </div>
    <div class="mb-6 tip">
      <div class="flex items-center">
        <feather-icon icon="AlertCircleIcon" class="mr-2" style="cursor: pointer; width:16px;" />
        <span class="title">첨부서류</span>
      </div>
      <div class="grid pl-6">
        <span>1. 자격ㆍ학력 또는 경력 등을 증명할 수 있는 서류</span>
        <span>2. 재직증명서</span>
        <span>3. 직무교육 이수증(안전보건관리책임자 교육이수증)</span>
      </div>
    </div>
    <file-upload-module :readonly="board.readonly" v-model="form.fileList" :is-print="isPrint" />
  </div>
</template>

<script>
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'
import SearchNavStartEnd from '../../../../components/nav/SearchNavStartEnd.vue'
import FileUploadModule from '../../../modules/FileUploadModule.vue'
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import Print from './Print'
import SignField from "@/components/SignField.vue";

export default {
  components: {
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
    FieldSelectModule
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }

      }
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {
        this.$emit('input', value)
      }
    }
  },
  data () {
    return {
      form: {
        stdInfo: {},

        // 본사정보
        companyInfo: {},
        inputB_1: '',
        inputB_2: '',
        inputB_3: '',
        inputB_4: '',
        inputB_5: '',

        selectField: {},
        inputC_1: '',
        inputC_2: '',
        inputC_3: '',
        inputC_4: '',
        inputC_5: '',
        inputC_6: '',
        inputC_7: '',
        inputC_8: '',
        inputC_9: '',
        inputC_10: '',
        inputC_11: '',
        inputC_12: '',
        inputC_13: '',
        inputC_14: '',
        inputC_15: '',
        inputC_16: '',
        inputC_17: '',
        inputC_18: '',

        inputD_1: '',
        inputD_2: '',
        inputD_3: '',
        inputD_4: '',
        inputD_5: '',
        inputD_6: '',
        fileList: [],
      }
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    postId() {
      return parseInt(this.$route.params.postId);
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
  async mounted () {
    // 신규 등록(postId가 없는 경우)일 때만 기본값 설정
    if (!this.postId || isNaN(this.postId)) {
      // nhsafe 호스트명 확인
      const isNhSafe = window.location.hostname.includes('nhsafe');

      if (this.projectId === 7 && isNhSafe) {
        try {
          // companyId 28로 업체 정보 불러오기
          await this.$store.dispatch("company/LOAD_COMPANY", {
            companyId: 28,
          });

          const companyInfo = this.$store.state.company.companyInfo;

          if (companyInfo) {
            if (this.form.inputB_1 === '') {
              this.form.inputB_1 = companyInfo.com_name || '';
            }
            if (this.form.inputB_2 === '') {
              this.form.inputB_2 = companyInfo.com_ceo || '';
            }
            if (this.form.inputB_4 === '') {
              this.form.inputB_4 = companyInfo.com_address || '';
            }
          }
        } catch (error) {
          console.error('업체 정보 로딩 실패:', error);
        }
      }
    }
  },
  methods: {
    targetCompany (value) {
      this.form.companyInfo = value

      this.form.inputB_2 = value.com_ceo
      this.form.inputB_3 = value.com_tel
      this.form.inputB_4 = value.com_address
    },

    selectField (value) {
      this.form.selectField = value

      this.form.inputC_1 = value.field_name
      this.form.inputC_3 = value.address
      this.form.inputC_4 = value.phone
      this.form.inputC_5 = value.start_work_at
      this.form.inputC_6 = value.be_completed_at
      this.form.inputC_7 = value.start_work_at
      this.form.inputC_8 = value.be_completed_at
      this.form.inputC_9 = value.deposit_amount
    }
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.isPrint = true;
  //   }, 3000);
  // }
}
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
  word-break: keep-all;
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
.tip {
  border-top: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd;
  background: #f9f9f9;
  padding: 8px;
  color: #3c3c3c;
  font-size: 14px;

  .title {
    font-size: 14px;
  }
}
</style>
