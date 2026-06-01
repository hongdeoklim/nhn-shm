<template>
  <div>
    <!-- 날짜 -->
    <div v-if="viewForm" class="top-date absolute top-0 flex items-center gap-4">
      <div v-if="isPrint" class="flex items-center justify-center gap-3">
        <p class="print-input">{{ form.headerDate | moment("YYYY") }}</p>
        년
        <p class="print-input">{{ form.headerDate | moment("M") }}</p>
        월
      </div>
      <month-picker v-else class="inline-block" v-model="form.headerDate" :readonly="board.readonly" :minDate="form.fieldInfo.start_work_at">
        <template v-slot="{ inputValue, year, month, onClick }">
          <div class="flex items-center justify-center gap-3 cursor-pointer" @click="onClick">
            <ml-input style="width: 100px" class="header-month" :class="[board.readonly && 'readonly']" :value="year" readonly />
            <p>년</p>
            <ml-input style="width: 100px" class="header-month" :class="[board.readonly && 'readonly']" :value="month" readonly />
            <p>월</p>
          </div>
        </template>
      </month-picker>
    </div>

    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" @selectField="onSelectField" />

    <!-- 사업개요 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 사업개요</h5>
        </vs-col>
      </vs-row>
      <div class="writeGridContainer">
        <div>
          <div>현장주소(소재지)</div>
          <p v-if="isPrint" class="print-input">{{ form.fieldInfo.address }}</p>
          <ml-input readonly v-else v-model="form.fieldInfo.address" />
        </div>
        <div>
          <div>사업(공사)금액</div>
          <p v-if="isPrint" class="print-input">
            {{ form.fieldInfo.deposit_amount | comma }}
          </p>
          <comma-input readonly v-else v-model="form.fieldInfo.deposit_amount" />
        </div>
        <div>
          <div>계상금액(합계)</div>
          <p v-if="isPrint" class="print-input">{{ form.fieldInfo.amount_sumup | comma }}</p>
          <comma-input v-else v-model="form.fieldInfo.amount_sumup" readonly />
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
        <div>
          <div>집행금액(합계)</div>
          <p v-if="isPrint" class="print-input">{{ form.budgetTotal.total | comma }}</p>
          <comma-input v-else readonly v-model="form.budgetTotal.total" />
        </div>
        <div>
          <div>집행률</div>
          <p v-if="isPrint" class="print-input">{{ form.fieldInfo.percent }}</p>
          <ml-input v-else readonly v-model="form.fieldInfo.percent" />
        </div>
        <div>
          <div>공정률</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
          <ml-input v-else v-model="form.inputB_1" type="number" />
        </div>
      </div>
    </div>

    <!-- 산업안전보건관리비(전기, 통신, 소방 포함) -->
    <TableBudgetSimple
      v-if="viewForm"
      title="산업안전보건관리비(전기, 통신, 소방 포함)"
      :is-print="isPrint"
      :readonly="board.readonly || disableYM.includes(headerDate)"
      v-model="form.budget1"
      @budgetTotal="(data) => (form.budgetTotal = data)"
    >
            <template #custom-input>
              <label style="display: flex; position: relative; align-items: center" class="customInput" :title="form.budget1[form.budget1.length - 1].now" @click="openPopup">
                <comma-input
                  :placeholder="!!form.budget1[form.budget1.length - 1].now ? '' : '업체선택, 합산금액'"
                  class="w-full h-full"
                  :class="[!board.readonly && !disableYM.includes(headerDate) && 'white-bg']"
                  style="border-radius: 5px"
                  :value="form.budget1[form.budget1.length - 1].now"
                  readonly
                />
                <vs-icon
                  icon-pack="feather"
                  icon="icon-home"
                  style="padding-left: 6px; padding-right: 6px; position: absolute; top: auto; right: 0; bottom: auto; font-size: 24px; border-left: 1px solid #cdcdcd; margin-right: 1px; background-color: none"
                />
              </label>
            </template>
    </TableBudgetSimple>
    <Popup329List v-if="viewForm" v-model="isPopupOpen" :targetDate="form.headerDate" :setSelectIds="form.popupSelectIds" @handleClickSelect="handleClickSelect" />

    <!-- 파일첨부 -->
    <file-upload-module v-if="viewForm" id="fileList" class="w-full mt-4" title="안전관리비 사용내역 첨부(스캔)" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableBudgetSimple from "@/components/table-budget/TableBudgetSimple";
import Popup329List from "./Popup329List.vue";
import moment from "moment";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    FieldSelectModule,
    DateSelector,
    FileUploadModule,
    TableBudgetSimple,
    Popup329List,
  },
  props: {
    isPrint: Boolean,
    header: Object,
    board: Object,
    value: Object,
    postId: [String, Number],
  },
  validations: {
    form: {
      headerDate: { required },
      stdInfo: {
        field_name: { required },
      },
      budget1: { required },
      inputB_1: { required },
    },
  },
  data() {
    return {
      readonlyHeaderDate: false,
      isPopupOpen: false,
      oldHeaderDate: "",
      isSetState: this.$route.params.postId || this.postId ? "start" : "fin", // start | load | fin
      form: {
        headerDate: "",
        stdInfo: {},
        fieldInfo: {
          address: "",
          ceo: "",
          deposit_amount: "",
          start_work_at: "",
          be_completed_at: "",
          percent: "",
          amount_sumup: 0,
        },
        popupSelectIds: [],
        budget1: [
          { label: "안전·보건관리자 임금 등" },
          { label: "안전시설비 등" },
          { label: "보호구 등" },
          { label: "안전보건진단비 등" },
          { label: "안전보건교육비 등" },
          { label: "근로자 건강장해예방비 등" },
          { label: "건설재해예방전문지도기관 기술지도비" },
          { label: "본사 전담조직 근로자 임금 등" },
          { label: "위험성평가 등에 따른 소요비용" },
          { label: "기타(하도급업체 사용분)", type: "custom" },
        ],
        budgetTotal: {},
        fileList: [],
        inputB_1: "",
      },
    };
  },
  computed: {
    myInfo() {
      return this.$store.state.auth.userInfo;
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    postList() {
      if (this.$store.state.board.list) return [...JSON.parse(JSON.stringify(this.$store.state.board.list))]
        .reverse()
        .map((post) => this.getContent(post))
        .sort((a, b) => {
          const aDate = new Date(a.headerDate);
          const bDate = new Date(b.headerDate);
          if (bDate - aDate > 0) {
            return 1
          } else if (bDate - aDate < 0) {
            return -1
          } else {
            return 0
          }
        });
      else [];
    },
    viewForm() {
      return !!this.form.stdInfo.field_name;
    },

    // 작성된 관리비 중에서 현재 작성 중인 달을 제외한 나머지 달을 반환
    // 반환된 달은 저장할 수 없도록 비활성화 처리
    disableYM() {
      if (!this.viewForm) return [];
      else {
        const ym = this.postList.map((post) => {
          return moment(post.headerDate).format("YYYY-M-1");
        });
        return ym.filter((_ym) => _ym !== this.oldHeaderDate);
      }
    },
    headerDate() {
      return this.form.headerDate;
    },
    nextDate() {
      this.postList.sort((a, b) => {
        return new Date(b.headerDate) - new Date(a.headerDate)
      });
      const lastPost = this.postList[0]
      if (lastPost) {
        return moment(lastPost.headerDate, "YYYY-MM-DD").add(1, "month").format("YYYY-MM-DD")
      }
      return moment(this.form.fieldInfo.start_work_at, "YYYY-MM-DD").format("YYYY-MM-01");
    }
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler(value) {
        // form 과 같은 데이터 인지 체크
        if (JSON.stringify(value) !== JSON.stringify(this.form)) {
          const keys = Object.keys(this.form);
          for (const key of keys) {
            if (value[key]) {
              this.form[key] = value[key];
            }
          }
        }

        if (!!value.stdInfo.field_name && this.isSetState === "start") {
          this.form.budget1 = this.form.budget1
            .filter((bg) => bg.label !== "")
            .map((bg) => {
              if (`${this.projectId}` === '7') {
                delete bg.type;
              } else {
                // 만약 label의 시작이 "기타"인 경우, type: 'custom' 부여한다
                if (bg.label.indexOf("기타") === 0) {
                  bg.type = "custom";
                } else {
                  delete bg.type;
                }
              }
              return bg;
            });
          this.isSetState = "load";
          this.oldHeaderDate = moment(this.form.headerDate).format("YYYY-M-1");
          this.loadListBoard();
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.summary = {
          안전보건예산_현장명: [],
          안전보건예산_항목명: [],
        };

        let totalBudget = 0; // 예산타입 합산
        for (const data of this.form.budget1) {
          totalBudget += Number(`${data.now}`);
          value.summary["안전보건예산_항목명"].push({
            [data.label]: Number(`${data.now}`),
          });
        }

        value.summary["안전보건예산_현장명"].push({
          [this.form.stdInfo.field_name]: totalBudget,
        });

        // 집행율
        if (!!value.budgetTotal.total && !!value.fieldInfo.amount_sumup) {
          const _total = Number(value.budgetTotal.total) || 0;
          const _amount_sumup = Number(value.fieldInfo.amount_sumup) || 0;

          if (0 < _total && 0 < _amount_sumup) value.fieldInfo.percent = Math.floor((_total / _amount_sumup) * 100);
          else value.fieldInfo.percent = 0;
        }
        this.$emit("input", value);
      },
    },
    headerDate: {
      immediate: true,
      deep: true,
      handler(value) {
        if (this.isSetState === "fin" && !!value) {
          this.oldDataSetting();
        }
      },
    },
  },
  async created() {
    // form 과 같은 데이터 인지 체크
    const value = this.value;
    if (JSON.stringify(value) !== JSON.stringify(this.form)) {
      const keys = Object.keys(this.form);
      for (const key of keys) {
        if (value[key]) {
          this.form[key] = value[key];
        }
      }
    }

    if (value.stdInfo && value.stdInfo.field_name && this.isSetState === "start") {
      this.form.budget1 = this.form.budget1
        .filter((bg) => bg.label !== "")
        .map((bg) => {
          if (`${this.projectId}` === '7') {
            delete bg.type;
          } else {
            // 만약 label의 시작이 "기타"인 경우, type: 'custom' 부여한다
            if (bg.label.indexOf("기타") === 0) {
              bg.type = "custom";
            } else {
              delete bg.type;
            }
          }
          return bg;
        });
      this.isSetState = "load";
      this.oldHeaderDate = moment(this.form.headerDate).format("YYYY-M-1");
      await this.loadListBoard();
    }
  },
  methods: {
    loading(open) {
      const loadingDialog = new CustomEvent("loadingDialog", {
        detail: {
          open,
        },
      });
      window.dispatchEvent(loadingDialog);
    },

    openPopup() {
      if (!this.board.readonly && !this.disableYM.includes(this.headerDate)) this.isPopupOpen = true;
    },
    async loadListBoard() {
      // 내용불러오기
      const projectId = this.projectId;
      const boardId = 250;
      const page = 1;
      const perPage = 10000;
      const keyword = [`content$body.stdInfo.field_name*${this.form.stdInfo.field_name}`];

      this.loading(true)
      await this.$store.dispatch("board/LOAD_POST_LIST", {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
      }).finally(() => {
        this.loading(false)
      });

      // 필드 최신내용 불러오기
      await this.loadLatelyField();

      if (this.isSetState === "fin") {
        if (this.form.fieldInfo.start_work_at) this.form.headerDate = moment(this.form.fieldInfo.start_work_at).format("YYYY-M-1");
        else this.form.headerDate = moment(new Date()).format("YYYY-M-1");
      } else this.isSetState = "fin";

    },

    // 필드 최신내용 불러오기
    async loadLatelyField() {
      const fieldId = this.form.stdInfo.field_id
      if (fieldId) {
        const loadLatelyField = await this.$store.dispatch("project/LOAD_FIELD", {fieldId});
        if (loadLatelyField) {
          this.form.fieldInfo.address = loadLatelyField.address;
          this.form.fieldInfo.deposit_amount = loadLatelyField.deposit_amount;
          this.form.fieldInfo.start_work_at = loadLatelyField.start_work_at ? loadLatelyField.start_work_at : "";
          this.form.fieldInfo.be_completed_at = loadLatelyField.be_completed_at ? loadLatelyField.be_completed_at : "";
          this.form.fieldInfo.amount_sumup = loadLatelyField.amount_sumup;
        }
      }
    },

    onSelectField(data) {
      this.form.headerDate = "";

      if (data) {
        this.form.fieldInfo.address = data.address;
        this.form.fieldInfo.deposit_amount = data.deposit_amount;
        this.form.fieldInfo.start_work_at = data.start_work_at ? data.start_work_at : "";
        this.form.fieldInfo.be_completed_at = data.be_completed_at ? data.be_completed_at : "";
        this.form.fieldInfo.amount_sumup = data.amount_sumup;
      } else {
        this.form.fieldInfo = {
          address: "",
          ceo: "",
          deposit_amount: "",
          start_work_at: "",
          be_completed_at: "",
          percent: "",
          amount_sumup: 0,
        };
      }

      this.form.budget1 = [
        { label: "안전·보건관리자 임금 등" },
        { label: "안전시설비 등" },
        { label: "보호구 등" },
        { label: "안전보건진단비 등" },
        { label: "안전보건교육비 등" },
        { label: "근로자 건강장해예방비 등" },
        { label: "건설재해예방전문지도기관 기술지도비" },
        { label: "본사 전담조직 근로자 임금 등" },
        { label: "위험성평가 등에 따른 소요비용" },
      ];

      if (`${this.projectId}` === '7') {
        this.form.budget1.push({ label: "기타(하도급업체 사용분)" });
      } else {
        this.form.budget1.push({ label: "기타(하도급업체 사용분)", type: "custom" });
      }

      this.loadListBoard();
    },

    oldDataSetting() {
      const isIncludes = this.disableYM.includes(this.headerDate); // 이미 작성된 달
      let firstPost = null;
      let lastPost = null;

      // =================================
      //   전월 사용금액 가져오기
      // =================================
      { // 사용한 변수를 삭제하기위해 블럭으로 감싸줌
        const _tempPostList = this.postList
          .sort((a, b) => {
            const aDate = new Date(a.headerDate);
            const bDate = new Date(b.headerDate);
            if (aDate - bDate > 0) {
              return 1
            } else if (aDate - bDate < 0) {
              return -1
            } else {
              return 0
            }
          })
        firstPost = _tempPostList[0];
        const _totalObject = {};
        for (let i = 0, post; i<_tempPostList.length; i++) {
          post = _tempPostList[i];

          if (i > 0) {
            for (const bud of post.budget1) {
              bud.prev = _totalObject[bud.label] ? Number(`${_totalObject[bud.label]}`) : 0;
            }
          }

          // now 값을 더해줌
          for (const bud of post.budget1) {
            if (bud.label !== "") {
              if (!_totalObject[bud.label]) _totalObject[bud.label] = 0;
              _totalObject[bud.label] += Number(`${bud.now}`);
            }
          }
        }


        // 마지막 작성일의 게시글 데이터를 prev로 넣어줌
        lastPost = _tempPostList[_tempPostList.length - 1];
        this.form.budget1 = lastPost.budget1.map((bud) => {
          const rowItem = { ...bud, now: 0, prev: Number(`${bud.now}`) + Number(`${bud.prev}`) };

          if (`${this.projectId}` === '7') {
            delete rowItem.type;
          } else {
            // 만약 label의 시작이 "기타"인 경우, type: 'custom' 부여한다
            if (rowItem.label.indexOf("기타") === 0) {
              rowItem.type = "custom";
            } else {
              delete rowItem.type;
            }
          }

          return rowItem;
        });

        // this.form.budget1 항목 중에서, label 값이 ''인 아이템 제거한다
        this.form.budget1 = this.form.budget1.filter((bud) => bud.label !== "");
      }

      // =================================
      //   당월 사용금액 가져오기
      // =================================
      //   - 해당월 이거나, 기존월 인 경우
      if (this.headerDate === this.oldHeaderDate || isIncludes) {
        const nowPost = this.postList.find((_post) => {
          const m = moment(this.form.headerDate);
          return moment(_post.headerDate).format("YYYY-M") === moment(m).format("YYYY-M");
        });
        this.form.budget1 = nowPost.budget1.filter((bg) => bg.label !== "");
      }
      //   - 그외 (당월 사용금액 0원으로 초기화)
      else {
        const prior = new Date(firstPost.headerDate) - new Date(this.form.headerDate) >= 0
        const budget1 = this.form.budget1.map((bg) => {
          if (prior) {
            // 첫번째 작성달보다 이전인 경우
            return { ...bg, now: 0, prev: 0 };
          }
          return bg
        });
        this.form.budget1 = budget1;
      }

      // =================================
      //   당월 사용금액 데이터 중 type 제거
      // =================================
      // 기존에 type 이 custom 으로 되어있는 경우가 있어서 제거
      // {}를 넣은 이유는 const budget1를 사용하고 삭제하기 위함
      {
        const budget1 = this.form.budget1.map((bg) => {
          if (`${this.projectId}` === '7') {
            delete bg.type;
          }
          return bg;
        });
        this.form.budget1 = budget1;
      }

      // =================================
      //   저장버튼 노출 여부 설정
      // =================================
      // 1. 저장 가능한 상태
      //   - 수정페이지인 경우 (this.oldHeaderDate is notnull): 해당월 이거나, 신규월 인 경우
      //   - 신규작성인 경우 : 신규월 인 경우
      if (
        (this.oldHeaderDate && (this.oldHeaderDate === this.headerDate || !isIncludes))
        || (!this.oldHeaderDate && !isIncludes)
      ) {
        this.$emit("saveButtonControl", true);
      }
      // 2. 그외 상태 (저장 불가능)
      else {
        this.$emit("saveButtonControl", false);
      }
    },

    handleClickSelect(selectDatas) {
      this.form.popupSelectIds = selectDatas.map((data) => data.id);
      const total = selectDatas.reduce((prev, data) => {
        return prev + Number(this.getContent(data).budgetTotal.now);
      }, 0);
      const files = selectDatas.reduce((prev, data) => {
        return prev.concat(this.getContent(data).fileList);
      }, []);

      this.$set(this.form.budget1[9], "now", total);
      this.form.budget1[9].now = total;

      this.form.fileList = files;
    },

    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.body;
      }
    },
    validate() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        // if (new Date(this.nextDate) - new Date(this.$v.form.headerDate.$model) < 0) return `${moment(this.nextDate).format('YYYY년 MM월')} 관리비를 먼저 작성해 주세요`;
        if (!this.$v.form.headerDate.required) return "날짜는 반드시 선택해야 합니다";
        if (!this.$v.form.stdInfo.field_name.required) return "위험성평가 정보는 반드시 불러와야 합니다";

        const checkBudget1 = this.form.budget1.reduce((prev, data) => {
          return typeof data.now === "number" && prev;
        }, true);
        if (!checkBudget1) return "비어있는 당월 사용금액이 있습니다";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.customInput ::v-deep {
  .white-bg input {
    background: white;
    cursor: pointer;
  }
}

.header-month::v-deep {
  input {
    background: white;
  }
  &.readonly input {
    background: #fafafa !important;
  }
}

.top-date {
  left: calc(180px + 1.5rem);
  padding-top: 1.5rem;
}
@media (max-width: 1200px) {
  .top-date {
    padding-top: 0.625rem;
  }
}
</style>
