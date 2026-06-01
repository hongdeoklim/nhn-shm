<template>
  <Print v-if="isPrint" :board="board" :form="form" />
  <div v-else>
    <!-- 날짜 -->
    <div class="absolute top-0 flex items-center gap-4" :class="[!isPrint && 'py-6']" style="left: calc(200px + 1.5rem)">
      <p v-if="isPrint || !!postId" class="print-input" style="width: 150px; background-color: #fafafa">{{ form.headerDate | moment("YYYY년 MM월 DD일") }}</p>
      <!-- <vc-date-picker v-else-if="!!form.stdInfo.field_name" class="inline-block" :masks="masks" v-model="form.headerDate">
        <template v-slot="{ inputValue, togglePopover }">
          <ml-input class="w-full" :value="inputValue" @click="togglePopover({ placement: 'auto-start' })" />
        </template>
      </vc-date-picker> -->
      <date-selector v-else-if="form.stdInfo && !!form.stdInfo.field_name" style="width: 95px" class="inline-block" format="YYYY년 MM월 DD일" v-model="form.headerDate" :useIcon="false" />
    </div>

    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="{ ...board, readonly: !!postId }"
      :is-print="isPrint"
      :options="[
        { type: '요일', label: '요일' },
        { type: '날씨', label: '날씨' },
      ]"
      @selectField="onSelectField"
    />

    <!-- 현장개요 -->
    <div class="mt-28px" v-if="form.fieldInfo">
      <h5 class="mb-4"><i class="dot"></i> 현장개요</h5>
      <div class="writeGridContainer">
        <div>
          <div>현장주소(소재지)</div>
          <p v-if="isPrint" class="print-input">{{ form.fieldInfo.address }}</p>
          <ml-input readonly v-else v-model="form.fieldInfo.address" />
        </div>
        <div>
          <div>착공일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.fieldInfo.start_work_at }}
          </p>
          <date-selector v-else readonly v-model="form.fieldInfo.start_work_at" />
        </div>
        <div>
          <div>준공일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.fieldInfo.be_completed_at }}
          </p>
          <date-selector v-else readonly v-model="form.fieldInfo.be_completed_at" />
        </div>
      </div>
    </div>

    <!-- 인원투입 현황 -->
    <table-budget-day
      v-if="form.stdInfo && !!form.stdInfo.field_name"
      :isPrint="isPrint"
      title="인원투입 현황"
      :infoHeader="[
        {
          label: '구분',
          type: 'select',
          option: budgetDay1Options,
        },
      ]"
      :colPlaceholders="['자동입력(전일까지누계 합산)', '숫자입력', '자동입력(전일누계 + 금일)']"
      :totalPlaceholders="['자동입력(전일까지금액 합산)', '자동입력(전체 합산)', '자동입력(전체 합산)']"
      :readonly="board.readonly || readonlyDay"
      v-model="form.budgetDay1"
      :hideBudgetDay="form.hideBudgetDay1"
      :max-length="50"
      class="mt-28px"
      @listChanged="changeBudgetDay1Index"
    >
      <template #buttons>
        <vs-button v-if="hasAdminPermission" class="mx-2" color="secondary" type="border" @click="adminOptionPeoplePopup = true">옵션관리</vs-button>
      </template>
    </table-budget-day>

    <!-- 장비투입 현황 -->
    <table-budget-day
      v-if="form.stdInfo && !!form.stdInfo.field_name"
      :isPrint="isPrint"
      title="장비투입 현황"
      :infoHeader="[{ label: '장비명', type: 'select', option: budgetDay2Options }]"
      :colPlaceholders="['자동입력(전일까지누계 합산)', '숫자입력', '자동입력(전일누계 + 금일)']"
      :totalPlaceholders="['자동입력(전월금액 합산)', '자동입력(전체 합산)', '자동입력(전체 합산)']"
      :readonly="board.readonly || readonlyDay"
      v-model="form.budgetDay2"
      :hideBudgetDay="form.hideBudgetDay2"
      :max-length="50"
      @listChanged="changeBudgetDay2Index"
    >
      <template #buttons>
        <vs-button v-if="hasAdminPermission" class="mx-2" color="secondary" type="border" @click="adminOptionEquipmentPopup = true">옵션관리</vs-button>
      </template>
    </table-budget-day>

    <!-- 작업내용 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 작업내용</h5>
      <div class="writeGridContainer">
        <div class="writeGridLineItem">
          <div>금일</div>
          <p v-if="isPrint" class="print-textarea">{{ form.inputA_1 }}</p>
          <ml-textarea v-else rows="5" v-model="form.inputA_1" :readonly="board.readonly" />
        </div>
        <div class="writeGridLineItem">
          <div>명일</div>
          <p v-if="isPrint" class="print-textarea">{{ form.inputA_2 }}</p>
          <ml-textarea v-else rows="5" v-model="form.inputA_2" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 안전점검사항 -->
    <table-inspect-left-title
      class="mt-28px"
      title="안전점검사항"
      :isShowTitle="true"
      :is-note="true"
      tableHeaderType="구분"
      tableHeaderTitle="점검항목"
      tableHeaderYes="양호"
      tableHeaderNo="불량"
      tableHeaderNa="N/A"
      table-header-note="비고(조치결과)"
      v-model="form.checkList"
    />

    <!-- 사업장 순회점검 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 사업장 순회점검</h5>
      <div class="writeGridContainer">
        <div class="writeGridLineItem">
          <div>지적사항</div>
          <p v-if="isPrint" class="print-textarea">{{ form.inputB_1 }}</p>
          <ml-textarea v-else rows="5" v-model="form.inputB_1" :readonly="board.readonly" />
        </div>
        <div class="writeGridLineItem">
          <div>조치사항</div>
          <p v-if="isPrint" class="print-textarea">{{ form.inputB_2 }}</p>
          <ml-textarea v-else rows="5" v-model="form.inputB_2" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 확인자 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 확인자</h5>
      <div class="writeGridContainer">
        <div>
          <div>안전관리자</div>
          <ml-input v-model="form.inputC_1" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-model="form.inputC_2" />
        </div>
      </div>
      <div class="writeGridContainer">
        <div>
          <div>관리책임자</div>
          <ml-input v-model="form.inputC_3" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-model="form.inputC_4" />
        </div>
      </div>
    </div>

    <!--    사진대지-->
    <PhotoUploadGridModule :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" class="mt-28px" />

    <!-- 파일첨부-->
    <file-upload-module id="fileList" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly" class="mt-28px"></file-upload-module>

    <popup-option :active.sync="adminOptionPeoplePopup" v-model="인원투입구분옵션" title="인원투입구분 옵션관리" @update="updatePeopleOption" />
    <popup-option :active.sync="adminOptionEquipmentPopup" v-model="장비투입장비명옵션" title="장비투입장비명 옵션관리" @update="updateEquipmentOption" />

    <!-- 디버깅 로그 플로팅 창 (enableDebugMode가 true일 때만 표시) -->
    <div v-if="enableDebugMode && debugLogs.length > 0" style="position: fixed; bottom: 20px; right: 20px; width: 600px; max-height: 400px; background: white; border: 2px solid #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999; display: flex; flex-direction: column;">
      <div style="padding: 10px; background: #333; color: white; display: flex; justify-content: space-between; align-items: center; border-radius: 6px 6px 0 0;">
        <strong>디버깅 로그</strong>
        <div>
          <button @click="copyDebugLogs" style="margin-right: 8px; padding: 4px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">복사</button>
          <button @click="clearDebugLogs" style="padding: 4px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">지우기</button>
        </div>
      </div>
      <textarea
        ref="debugTextarea"
        readonly
        :value="debugLogs.join('\n')"
        style="flex: 1; padding: 10px; font-family: 'Courier New', monospace; font-size: 12px; border: none; resize: none; overflow-y: auto;"
      ></textarea>
    </div>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import TableBudgetDay from "@/components/table-budget/TableBudgetDay.vue";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import DateSelector from "@/components/selector/DateSelector";
import TableInspectLeftTitle from "@/components/TableInspectLeftTitle";
import SignField from "@/components/SignField";
import Print from "./Print";
import moment from "moment";
import PopupOption from "./PopupOption.vue";

export default {
  components: {
    PopupOption,
    FieldSelectModule,
    TableBudgetDay,
    PhotoUploadGridModule,
    FileUploadModule,
    DateSelector,
    TableInspectLeftTitle,
    SignField,
    Print,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  data() {
    return {
      /**
       * 디버깅 모드 플래그
       *
       * 사용 방법:
       * 1. 디버깅이 필요한 경우: enableDebugMode: true 로 설정
       * 2. 프로덕션 환경: enableDebugMode: false 로 설정 (기본값)
       *
       * enableDebugMode가 false일 때:
       * - 디버깅 로그 창이 화면에 표시되지 않음
       * - addDebugLog() 호출 시 로그가 누적되지 않음 (성능 최적화)
       * - 디버깅 관련 오버헤드 없음
       */
      enableDebugMode: false,

      debugLogs: [], // 디버깅 로그 배열
      lastEmittedFormValue: null, // 마지막으로 emit한 form 값 저장
      masks: {
        input: "YYYY년 MM월 DD일",
      },
      form: {
        headerDate: "",

        stdInfo: {},
        fieldInfo: {
          address: "",
          start_work_at: "",
          be_completed_at: "",
        },

        budgetDay1: [],
        budgetDay2: [],
        budgetDay1Total: 0,
        budgetDay2Total: 0,
        hideBudgetDay1: [],
        hideBudgetDay2: [],

        inputA_1: "",
        inputA_2: "",

        inputB_1: "",
        inputB_2: "",
        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",
        photoList: [],
        fileList: [],

        checkList: [
          { title: "현장정리정돈", titleRow: 3, label: "1. 작업장 및 주변 정리정돈 상태는?", is_checked: "" },
          { label: "2. 작업용 공도구 정리정돈 상태는?", is_checked: "" },
          { label: "3. 야적장 및 창고 정리정돈 상태는?", is_checked: "" },

          { title: "개인보호구", titleRow: 3, label: "1. 근로자 개인보호구 착용상태는?", is_checked: "" },
          { label: "2. 작업별 개인보호구는 적정한가?", is_checked: "" },
          { label: "3. 불량,파손된 개인보호구는 없는가?", is_checked: "" },

          { title: "작업용 공도구", titleRow: 3, label: "1. 작업전 공도구점검은 실시여부는?", is_checked: "" },
          { label: "2. 공도구 접지 및 보호커버 상태는?", is_checked: "" },
          { label: "3. 전선 피복 및 플러그 상태는?", is_checked: "" },

          { title: "안전시설", titleRow: 4, label: "1. 작업장내 추락위험구간은 없는가?", is_checked: "" },
          { label: "2. 방호조치 미실시 개구부는 없는가?", is_checked: "" },
          { label: "3. 근로자 이동통로는 확보되었는가?", is_checked: "" },
          { label: "4. 낙하물 위험구간 방호조치는?", is_checked: "" },

          { title: "장비", titleRow: 3, label: "1. 장비작업계획은 수립하였는가?", is_checked: "" },
          { label: "2. 작업전 장비점검은 실시하였는가?", is_checked: "" },
          { label: "3. 장비작업구간 신호수 배치하였는가?", is_checked: "" },

          { title: "근로자", titleRow: 3, label: "1. 작업자가 작업내용을 숙지하였는가?", is_checked: "" },
          { label: "2. 작업자의 건강상태는 양호한가?", is_checked: "" },
          { label: "3. 불안전한 행동을 하지는 않는가?", is_checked: "" },

          { title: "기계설비", titleRow: 3, label: "1. 기계설비 청소 및 정비상태는?", is_checked: "" },
          { label: "2. 안전장치는 제거하지 않았는가?", is_checked: "" },
          { label: "3. 작동상태에는 이상이 없는가?", is_checked: "" },

          { title: "차량운행", titleRow: 2, label: "1. 현장내 규정속도 준수하고 있는가?", is_checked: "" },
          { label: "2. 차량과 근로자 동선은 구분되었는가?", is_checked: "" },

          { title: "기타", titleRow: 2, label: "1. 현장내 환경 저해요소는 없는가?", is_checked: "" },
          { label: "2. 기타 잠재위험요인은 없는가?", is_checked: "" },
        ],
        budgetDay1Index: [],
        budgetDay2Index: [],
      },

      adminOptionPeoplePopup: false,
      adminOptionEquipmentPopup: false,
      인원투입구분옵션: [],
      장비투입장비명옵션: [],
      인원투입구분옵션기본값: [
        { value: "직영인부" },
        { value: "가시설공사" },
        { value: "철거공사" },
        { value: "철근콘크리트 공사" },
        { value: "철골 공사" },
        { value: "금속 공사" },
        { value: "습식방수공사" },
        { value: "수장 공사" },
        { value: "기계설비 공사" },
        { value: "전기 공사" },
        { value: "통신 공사" },
        { value: "소방 공사" },
        { value: "냉난방기" },
        { value: "운송설비" },
        { value: "조경식재" },
        { value: "쇼케이스" },
        { value: '현장직원' },
        { value: '현장대리인' },
        { value: '석공사' },
        { value: '토공사' },
      ],
      장비투입장비명옵션기본값: [{ value: "백호" }, { value: "덤프" }, { value: "스카이" }, { value: "크레인" }, { value: "펌프카" }, { value: "천공기" }],
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    postId() {
      return this.$route.params.postId;
    },
    headerDate() {
      return this.form.headerDate ? moment(this.form.headerDate).format("YYYY-MM-DD") : null;
    },
    postList() {
      const _postList = this.$store.state.board.postListInfo.data;
      if (_postList) return _postList.map((post) => this.getContent(post));
      else return [];
    },
    disabledDate() {
      if (this.postList) return this.postList.map((post) => moment(post.headerDate).format("YYYY-MM-DD"));
      else return [];
    },
    readonlyDay() {
      if (!!this.disabledDate && !!this.headerDate && !this.postId) return this.disabledDate.includes(this.headerDate);
      else return false;
    },
    budgetDay1Options() {
      // 배열이 없거나 유효하지 않으면 기본 옵션 반환
      if (!this.form.budgetDay1 || !Array.isArray(this.form.budgetDay1)) {
        return [...this.인원투입구분옵션, "기타"];
      }

      // "조미방 공사"를 "습식방수공사"로 변환하여 useOptions 생성
      const useOptions = this.form.budgetDay1.map((option) => {
        const 구분 = option.구분 === "조미방 공사" ? "습식방수공사" : option.구분;
        return 구분;
      });

      const options = this.인원투입구분옵션
      // .sort((a, b) => a.value.localeCompare(b.value)) // 오름차순 정렬
        .map((option) => {
          if (useOptions.includes(option.value)) return { ...option, hide: true };
          else return option;
        });

      return [...options, "기타"];
    },
    budgetDay2Options() {
      // 배열이 없거나 유효하지 않으면 기본 옵션 반환
      if (!this.form.budgetDay2 || !Array.isArray(this.form.budgetDay2)) {
        return [...this.장비투입장비명옵션, "기타"];
      }

      const useOptions = this.form.budgetDay2.map((option) => option.장비명);
      const options = this.장비투입장비명옵션.map((option) => {
        if (useOptions.includes(option.value)) return { ...option, hide: true };
        else return option;
      });

      return [...options, "기타"];
    },
    hasAdminPermission() {
      return parseInt(this.$store.state.auth.userInfo.is_superuser) === 1;
    },
  },
  watch: {
    "value": {
      immediate: true,
      deep: true,
      handler(value) {
        if (!value) return;

        // value watcher 트리거 시 budgetDay1 확인
        if (value.budgetDay1 && value.budgetDay1.length > 0) {
          this.addDebugLog('value watcher 트리거 - budgetDay1[0]', {
            구분: value.budgetDay1[0].구분,
            구분_기타: value.budgetDay1[0].구분_기타,
            yesterday: value.budgetDay1[0].yesterday,
            today: value.budgetDay1[0].today
          });
        }

        // 데이터 마이그레이션을 value에서 먼저 수행
        const migratedBudgetDay1 = value.budgetDay1 ? JSON.parse(JSON.stringify(value.budgetDay1)) : [];
        if (migratedBudgetDay1.length > 0) {
          migratedBudgetDay1.forEach(item => {
            if (item.구분 === "조미방 공사") {
              item.구분 = "습식방수공사";
            } else if (item.구분 === "철근콘크리트 공사") {
              item.구분 = "철근콘크리트공사";
            }
            if (this.인원투입구분옵션 && this.인원투입구분옵션.length > 0) {
              const isExist = this.인원투입구분옵션.some((opt) => opt.value === item.구분);
              if (!isExist && item.구분 !== "기타") {
                item.구분_기타 = item.구분;
                item.구분 = "기타";
              }
            }
          });
        }

        const migratedBudgetDay2 = value.budgetDay2 ? JSON.parse(JSON.stringify(value.budgetDay2)) : [];
        // budgetDay2 마이그레이션 로직 (필요시 추가)

        // 모든 속성 복사 (undefined가 아닐 때만)
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key] !== undefined) {
            this.form[key] = value[key];
          }
        }

        // 마이그레이션된 budgetDay로 덮어쓰기
        this.form.budgetDay1 = migratedBudgetDay1;
        this.form.budgetDay2 = migratedBudgetDay2;
      },
    },
    "form": {
      immediate: true,
      deep: true,
      handler(value) {
        // budgetDay Total 계산
        const budgetDay1Total = (value.budgetDay1 || []).reduce((prev, _bd) => {
          return prev + (Number(_bd.today) || 0);
        }, 0);
        const budgetDay2Total = (value.budgetDay2 || []).reduce((prev, _bd) => {
          return prev + (Number(_bd.today) || 0);
        }, 0);

        const formToEmit = {
          ...value,
          budgetDay1Total,
          budgetDay2Total,
        };

        // yesterday 값이 포함되어 있는지 확인 (디버깅용)
        if (formToEmit.budgetDay1 && formToEmit.budgetDay1.length > 0) {
          this.addDebugLog('form watcher: budgetDay1[0].yesterday', formToEmit.budgetDay1[0].yesterday);
        }

        // JSON 비교로 무한 루프 방지
        const currentValue = JSON.stringify(formToEmit);
        if (this.lastEmittedFormValue === currentValue) {
          return;
        }

        this.lastEmittedFormValue = currentValue;
        this.$emit("input", formToEmit);
      },
    },
    headerDate() {
      this.loadListApproval();
    },
    'form.stdInfo.field_name': {
      handler(newVal, oldVal) {
        // 신규 작성일 때만 headerDate를 오늘로 설정
        // postId가 있으면 상세/수정 페이지이므로 headerDate를 변경하지 않음
        // headerDate가 이미 있으면 변경하지 않음
        if (newVal && newVal !== oldVal && !this.postId && !this.form.headerDate) {
          this.$nextTick(() => {
            // headerDate를 설정하면 headerDate watcher가 자동으로 loadListApproval()을 호출함
            this.$set(this.form, "headerDate", moment(new Date()).format("YYYY-MM-DD"));
          });
        }
      },
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 디버깅 로그 함수
    addDebugLog(message, data = null) {
      // enableDebugMode가 false면 로그를 누적하지 않음 (성능 최적화)
      if (!this.enableDebugMode) {
        return;
      }

      const timestamp = moment().format('HH:mm:ss.SSS');
      let logMessage = `[${timestamp}] ${message}`;
      if (data !== null) {
        if (typeof data === 'object') {
          logMessage += `\n${JSON.stringify(data, null, 2)}`;
        } else {
          logMessage += `: ${data}`;
        }
      }
      this.debugLogs.push(logMessage);

      // 로그가 너무 많아지면 오래된 것 제거 (최대 100개)
      if (this.debugLogs.length > 100) {
        this.debugLogs.shift();
      }

      // textarea를 맨 아래로 스크롤
      this.$nextTick(() => {
        if (this.$refs.debugTextarea) {
          this.$refs.debugTextarea.scrollTop = this.$refs.debugTextarea.scrollHeight;
        }
      });
    },
    copyDebugLogs() {
      const logsText = this.debugLogs.join('\n');
      navigator.clipboard.writeText(logsText).then(() => {
        alert('로그가 클립보드에 복사되었습니다!');
      }).catch(err => {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다. 콘솔을 확인해주세요.');
      });
    },
    clearDebugLogs() {
      this.debugLogs = [];
    },

    onSelectField(data) {
      // fieldInfo가 없으면 초기화
      if (!this.form.fieldInfo) {
        this.$set(this.form, 'fieldInfo', {});
      }
      this.form.fieldInfo.address = data.address;
      this.form.fieldInfo.start_work_at = data.start_work_at;
      this.form.fieldInfo.be_completed_at = data.be_completed_at;
      this.$nextTick(() => {
        this.$set(this.form, "headerDate", moment(new Date()).format("YYYY-MM-DD"));
      });
    },
    async loadListApproval() {
      if (!this.form.stdInfo || !this.form.stdInfo.field_name) return;

      this.loading(true);
      this.resetForm();

      // this.form.fieldInfo.start_work_at 날짜의 1월 1일 데이터
      const fieldStartWorkAt = this.form.fieldInfo.start_work_at ? moment(this.form.fieldInfo.start_work_at).format("YYYY-01-01") : '2025-01-01';

      const projectId = this.projectId;
      const boardId = 261;
      const page = 1;
      const perPage = 10000;
      const fieldId = this.form.stdInfo.field_id;
      const dateTarget = "content$body.headerDate";
      const dateBegin = fieldStartWorkAt ? fieldStartWorkAt : `${moment(this.headerDate).format("YYYY")}-01-01`;
      const dateEnd = moment(this.headerDate).add(1, "days").format("YYYY-MM-DD");
      // const keyword = [`content$body.stdInfo.field_name*${this.form.stdInfo.field_name}`];

      await this.$store.dispatch("board/LOAD_POST_LIST", {
        projectId,
        boardId,
        page,
        perPage,
        // keyword,
        fieldId,
        dateTarget,
        dateBegin,
        dateEnd,
      });

      this.oldDataSetting();
    },
    oldDataSetting() {
      this.addDebugLog('========== oldDataSetting 시작 ==========');
      this.addDebugLog('현재 날짜 (headerDate)', this.headerDate);
      this.addDebugLog('전체 게시글 수', this.postList.length);

      // 이미 작성되어있는 날짜는 저장버튼이 안보이도록 숨김처리
      // 수정 페이지라면 기존에 작성된 날짜는 저장버튼이 보이도록 한다.
      if (this.disabledDate.includes(this.headerDate) && !this.postId) this.$emit("saveButtonControl", false);
      else this.$emit("saveButtonControl", true);

      if (0 < this.postList.length) {
        const _budgetData1 = [];
        const _budgetData2 = [];

        this.postList.map((post) => {
          const postDate = moment(post.headerDate).format("YYYY-MM-DD");
          this.addDebugLog(`처리 중인 게시글 날짜: ${postDate}`);

          if (postDate === this.headerDate) {
            this.addDebugLog('  -> 현재 날짜와 동일하므로 누계 계산에서 제외');
            return;
          }

          this.addDebugLog(`  -> 누계 계산에 포함, budgetDay1 항목 수: ${post.budgetDay1 ? post.budgetDay1.length : 0}`);

          post.budgetDay1.map((_day) => {
            // 누계 계산 전에 각 항목에 마이그레이션 적용
            const migratedDay = { ..._day };
            if (migratedDay.구분 === "조미방 공사") {
              migratedDay.구분 = "습식방수공사";
            } else if (migratedDay.구분 === "철근콘크리트 공사") {
              migratedDay.구분 = "철근콘크리트공사";
            }
            if (this.인원투입구분옵션 && this.인원투입구분옵션.length > 0) {
              const isExist = this.인원투입구분옵션.some((opt) => opt.value === migratedDay.구분);
              if (!isExist && migratedDay.구분 !== "기타") {
                migratedDay.구분_기타 = migratedDay.구분;
                migratedDay.구분 = "기타";
              }
            }

            this.addDebugLog('    처리 중인 항목 (마이그레이션 후)', { 구분: migratedDay.구분, 구분_기타: migratedDay.구분_기타, today: migratedDay.today });

            const _dataIndex = _budgetData1.findIndex((e) => {
              return migratedDay.구분 === "기타" ? e.구분_기타 === migratedDay.구분_기타 : e.구분 === migratedDay.구분;
            });

            if (_dataIndex === -1) {
              const _y = Number(migratedDay.today);
              const yesterday = typeof _y !== "number" || isNaN(_y) ? 0 : _y;
              this.addDebugLog(`      -> 신규 항목 추가, yesterday: ${yesterday}`);

              _budgetData1.push({
                ...migratedDay,
                today: 0,
                yesterday,
                total: 0,
              });
            } else {
              const _t = Number(migratedDay.today);
              const today = typeof _t !== "number" || isNaN(_t) ? 0 : _t;
              const prevYesterday = _budgetData1[_dataIndex].yesterday;
              _budgetData1[_dataIndex].yesterday = Number(prevYesterday) + today;
              this.addDebugLog(`      -> 기존 항목 누적, 이전 yesterday: ${prevYesterday} + today: ${today} = 새 yesterday: ${_budgetData1[_dataIndex].yesterday}`);
            }
          });

          post.budgetDay2.map((_day) => {
            if (moment(post.headerDate).format("YYYY-MM-DD") === this.headerDate) return;

            // 누계 계산 전에 각 항목에 마이그레이션 적용
            const migratedDay = { ..._day };
            // budgetDay2 마이그레이션 로직 (필요시 추가)
            if (this.장비투입장비명옵션 && this.장비투입장비명옵션.length > 0) {
              const isExist = this.장비투입장비명옵션.some((opt) => opt.value === migratedDay.장비명);
              if (!isExist && migratedDay.장비명 !== "기타") {
                migratedDay.장비명_기타 = migratedDay.장비명;
                migratedDay.장비명 = "기타";
              }
            }

            const _dataIndex = _budgetData2.findIndex((e) => {
              return migratedDay.장비명 === "기타" ? e.장비명_기타 === migratedDay.장비명_기타 : e.장비명 === migratedDay.장비명;
            });
            if (_dataIndex === -1) {
              const _y = Number(migratedDay.today);
              const yesterday = typeof _y !== "number" || isNaN(_y) ? 0 : _y;

              _budgetData2.push({
                ...migratedDay,
                today: 0,
                yesterday,
                total: 0,
              });
            } else {
              const _t = Number(migratedDay.today);
              const today = typeof _t !== "number" || isNaN(_t) ? 0 : _t;
              _budgetData2[_dataIndex].yesterday = Number(_budgetData2[_dataIndex].yesterday) + today;
            }
          });
        });

        this.addDebugLog('누계 계산 완료, _budgetData1 항목 수', _budgetData1.length);
        this.addDebugLog('_budgetData1 상세 (이미 마이그레이션 적용됨)', _budgetData1.slice(0, 3).map(item => ({
          구분: item.구분,
          구분_기타: item.구분_기타,
          yesterday: item.yesterday
        })));

        // hideBudgetDay에만 누계 데이터 저장
        this.$set(this.form, "hideBudgetDay1", _budgetData1);
        this.$set(this.form, "hideBudgetDay2", _budgetData2);
        this.addDebugLog('hideBudgetDay1/2에 누계 데이터 저장 완료');

        // 현재 날짜의 작성된 데이터가 있는지 확인
        let hasCurrentDateData = false;
        this.postList.forEach((post) => {
          if (moment(post.headerDate).format("YYYY-MM-DD") === this.headerDate) {
            hasCurrentDateData = true;
          }
        });

        this.addDebugLog(`현재 날짜의 기존 데이터 존재 여부: ${hasCurrentDateData}`);

        // 현재 날짜의 데이터가 있으면 불러오고, 없으면 빈 배열로 시작
        if (hasCurrentDateData) {
          this.addDebugLog('현재 날짜의 기존 데이터 불러오기');
          this.postList.map((post) => {
            if (moment(post.headerDate).format("YYYY-MM-DD") === this.headerDate) {
              // DB에서 불러온 데이터의 yesterday는 무시하고 새로 계산한 _budgetData1의 yesterday를 사용
              const sortedBudgetDay1 = post.budgetDay1.map(item => {
                // DB 데이터도 마이그레이션 적용 (매칭을 위해)
                const migratedItem = { ...item };
                if (migratedItem.구분 === "조미방 공사") {
                  migratedItem.구분 = "습식방수공사";
                } else if (migratedItem.구분 === "철근콘크리트 공사") {
                  migratedItem.구분 = "철근콘크리트공사";
                }
                if (this.인원투입구분옵션 && this.인원투입구분옵션.length > 0) {
                  const isExist = this.인원투입구분옵션.some((opt) => opt.value === migratedItem.구분);
                  if (!isExist && migratedItem.구분 !== "기타") {
                    migratedItem.구분_기타 = migratedItem.구분;
                    migratedItem.구분 = "기타";
                  }
                }

                const yesterdayData = _budgetData1.find(e => {
                  return migratedItem.구분 === "기타" ? e.구분_기타 === migratedItem.구분_기타 : e.구분 === migratedItem.구분;
                });

                return {
                  ...migratedItem,
                  yesterday: yesterdayData ? yesterdayData.yesterday : 0,
                  total: Number(migratedItem.today || 0) + Number(yesterdayData ? yesterdayData.yesterday : 0)
                };
              });

              this.addDebugLog('budgetDay1 yesterday 병합 완료', sortedBudgetDay1.slice(0, 3).map(item => ({
                구분: item.구분,
                구분_기타: item.구분_기타,
                yesterday: item.yesterday,
                today: item.today,
                total: item.total
              })));

              if (post.budgetDay1Index) {
                this.$set(this.form, "budgetDay1Index", post.budgetDay1Index);
              }
              if (this.form.budgetDay1Index && this.form.budgetDay1Index.length > 0) {
                sortedBudgetDay1.forEach((item) => {
                  const match = this.form.budgetDay1Index.find((idx) => {
                    const idMatch = item.id && idx.id && item.id === idx.id;
                    const typeMatch = item.구분 === idx.구분 && (item.구분_기타 || null) === (idx.구분_기타 || null);
                    return idMatch || typeMatch;
                  });
                  if (match) {
                    item.index = match.index;
                  }
                });
              }
              // 정렬 수행
              sortedBudgetDay1.sort((a, b) => {
                const valA = a.index !== undefined && a.index !== null && a.index !== "" ? Number(a.index) : Infinity;
                const valB = b.index !== undefined && b.index !== null && b.index !== "" ? Number(b.index) : Infinity;
                return valA - valB;
              });
              this.$set(this.form, "budgetDay1", sortedBudgetDay1);

              // budgetDay2도 동일하게 처리
              const sortedBudgetDay2 = post.budgetDay2.map(item => {
                // DB 데이터도 마이그레이션 적용 (매칭을 위해)
                const migratedItem = { ...item };
                // budgetDay2 마이그레이션 로직 (필요시 추가)

                const yesterdayData = _budgetData2.find(e => {
                  return migratedItem.장비명 === "기타" ? e.장비명_기타 === migratedItem.장비명_기타 : e.장비명 === migratedItem.장비명;
                });

                return {
                  ...migratedItem,
                  yesterday: yesterdayData ? yesterdayData.yesterday : 0,
                  total: Number(migratedItem.today || 0) + Number(yesterdayData ? yesterdayData.yesterday : 0)
                };
              });

              if (post.budgetDay2Index) {
                this.$set(this.form, "budgetDay2Index", post.budgetDay2Index);
              }
              if (this.form.budgetDay2Index && this.form.budgetDay2Index.length > 0) {
                sortedBudgetDay2.forEach((item) => {
                  const match = this.form.budgetDay2Index.find((idx) => {
                    const idMatch = item.id && idx.id && item.id === idx.id;
                    const typeMatch = item.장비명 === idx.장비명 && (item.장비명_기타 || null) === (idx.장비명_기타 || null);
                    return idMatch || typeMatch;
                  });
                  if (match) {
                    item.index = match.index;
                  }
                });
              }
              // 정렬 수행
              sortedBudgetDay2.sort((a, b) => {
                const valA = a.index !== undefined && a.index !== null && a.index !== "" ? Number(a.index) : Infinity;
                const valB = b.index !== undefined && b.index !== null && b.index !== "" ? Number(b.index) : Infinity;
                return valA - valB;
              });
              this.$set(this.form, "budgetDay2", sortedBudgetDay2);
            }
          });
        } else {
          this.addDebugLog('신규 문서 작성: _budgetData1/2를 budgetDay1/2로 설정 (yesterday 값 포함)');
          // _budgetData1을 그대로 budgetDay1로 설정 (today는 0, yesterday는 계산된 값)
          this.$set(this.form, "budgetDay1", _budgetData1);
          this.$set(this.form, "budgetDay2", _budgetData2);
        }

      }

      // oldDataSetting 완료 후 budgetDay1[0] 확인
      if (this.form.budgetDay1 && this.form.budgetDay1.length > 0) {
        this.addDebugLog('oldDataSetting 완료 - budgetDay1[0]', {
          구분: this.form.budgetDay1[0].구분,
          구분_기타: this.form.budgetDay1[0].구분_기타,
          yesterday: this.form.budgetDay1[0].yesterday,
          today: this.form.budgetDay1[0].today,
          total: this.form.budgetDay1[0].total
        });
      }

      this.addDebugLog('========== oldDataSetting 완료 ==========');
      this.loading(false);
    },
    resetForm() {
      this.$set(this.form, "budgetDay1", []);
      this.$set(this.form, "budgetDay2", []);
      this.$set(this.form, "hideBudgetDay1", []);
      this.$set(this.form, "hideBudgetDay2", []);
    },
    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.body;
      }
    },
    loading(open) {
      const loadingDialog = new CustomEvent("loadingDialog", {
        detail: {
          open,
        },
      });
      window.dispatchEvent(loadingDialog);
    },

    async loadData() {
      await this.$store.dispatch("keyValue/LOAD_PEOPLE_OPTION");
      // await this.$store.dispatch("keyValue/LOAD_EQUIPMENT_OPTION");

      // 인원투입구분 옵션
      const peopleOption = this.$store.state.keyValue.peopleOption;
      if (peopleOption && Array.isArray(peopleOption)) {
        this.인원투입구분옵션 = peopleOption;
      } else {
        this.인원투입구분옵션 = this.인원투입구분옵션기본값;
      }

      // 장비투입장비명 옵션
      const equipmentOption = this.$store.state.keyValue.equipmentOption;
      if (equipmentOption && Array.isArray(equipmentOption)) {
        this.장비투입장비명옵션 = equipmentOption;
      } else {
        this.장비투입장비명옵션 = this.장비투입장비명옵션기본값;
      }
    },

    async updatePeopleOption() {
      console.log('updatePeopleOption')
      await this.$store.dispatch("keyValue/SAVE_PEOPLE_OPTION", { config: this.인원투입구분옵션  });
    },
    async updateEquipmentOption() {
      console.log('updateEquipmentOption')
      await this.$store.dispatch("keyValue/SAVE_EQUIPMENT_OPTION", { config: this.장비투입장비명옵션  });
    },

    changeBudgetDay1Index(data) {
      if (data && Array.isArray(data)) {
        this.addDebugLog('changeBudgetDay1Index 호출', {
          budgetDay1_length: data.length,
          hideBudgetDay1_length: this.form.hideBudgetDay1.length
        });
        this.form.budgetDay1Index = [];
        data.forEach((item) => {
          if (item.index !== undefined && item.index !== null && item.index !== '') {
            this.form.budgetDay1Index.push({ id: item.id, index: item.index, 구분: item.구분, 구분_기타: item.구분_기타 ? item.구분_기타 : null });
          }
        });
      }
    },
    changeBudgetDay2Index(data) {
      if (data && Array.isArray(data)) {
        this.addDebugLog('changeBudgetDay2Index 호출', {
          budgetDay2_length: data.length,
          hideBudgetDay2_length: this.form.hideBudgetDay2.length
        });
        this.form.budgetDay2Index = [];
        data.forEach((item) => {
          if (item.index !== undefined && item.index !== null && item.index !== '') {
            this.form.budgetDay2Index.push({ id: item.id, index: item.index, 장비명: item.장비명, 장비명_기타: item.장비명_기타 ? item.장비명_기타 : null });
          }
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
