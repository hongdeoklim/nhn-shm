<template>
  <div>
    <vs-row v-if="visibleTitle" class="mb-4">
      <vs-col>
        <h5><i class="dot"></i>{{ title }}</h5>
      </vs-col>
    </vs-row>
    <div class="writeGridContainer">
      <fragment v-for="type in types" :key="type">
        <div v-if="type === 'project_name'">
          <div class="title">분야명</div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.project_name }}
            </div>
            <ml-input class="w-full" v-model="form.project_name" :readonly="board.readonly" />
          </div>
        </div>
        <div v-if="type === 'field_name'">
          <div class="title">{{ fieldLabel }}</div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.field_name }}
            </div>
            <field-selector v-else class="w-full" v-model="form.field_id" :readonly="board.readonly" :field-name="form.field_name" @select="onSelectFieldSelector" :field-label="fieldLabel" />
          </div>
        </div>
        <div v-if="type === 'department'">
          <div class="title">
            {{ !!typeslabel.department ? typeslabel.department : "소속명" }}
          </div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.department }}
            </div>
            <ml-input v-else class="w-full" :value="form.department" :readonly="true" />
          </div>
        </div>
        <div v-if="type === 'com_name'">
          <div class="title">
            {{ !!typeslabel.com_name ? typeslabel.com_name : "부서명" }}
          </div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.section }}
            </div>
            <ml-input v-else class="w-full" :value="form.section" :readonly="true" />
          </div>
        </div>
        <div v-if="type === 'rank'">
          <div class="title">
            {{ !!typeslabel.rank ? typeslabel.rank : "직책" }}
          </div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.rank }}
            </div>
            <template v-else>
              <ml-input v-if="projectId === 7" class="w-full" v-model="form.rank" :readonly="board.readonly" />
              <ml-input v-else class="w-full" :value="form.rank" :readonly="true" />
            </template>
          </div>
        </div>
        <div v-if="type === 'writer_name'">
          <div class="title">
            {{ !!typeslabel.writer_name ? typeslabel.writer_name : "작성자" }}
          </div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.writer_name }}
            </div>
            <template v-else>
              <ml-input v-if="projectId === 7" class="w-full" v-model="form.writer_name" :readonly="board.readonly" />
              <ml-input v-else class="w-full" :value="form.writer_name" :readonly="true" />
            </template>
          </div>
        </div>
        <div v-if="type === 'director_name'">
          <div class="title">
            {{ !!typeslabel.director_name ? typeslabel.director_name : "관리책임자" }}
          </div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.director_name }}
            </div>
            <template v-else>
              <ml-input class="w-full" :value="form.director_name" :readonly="true" />
            </template>
          </div>
        </div>
        <div v-if="type === 'date'">
          <div class="title">
            {{ !!typeslabel.date ? typeslabel.date : "작성일" }}
          </div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.date }}
            </div>
            <date-selector v-else class="w-full" :value="form.date" :readonly="true" />
          </div>
        </div>
      </fragment>

      <div v-for="option of options" :key="option.label" v-show="option.type !== 'alert'">
        <div class="title">{{ option.label }}</div>
        <div v-if="isPrint">
          <div class="print-input">
            {{ form[`${option.label}`] }}
          </div>
        </div>
        <div v-else class="overflow-visible">
          <!-- 현재 date type 인 경우에만, option.key 를 사용하고 있다.
               다른 곳에서도 별도의 key (form.stdInfo.key)로 저장되어야 하는 경우 key date를 참고하여 v-model 에 key 를 추가하자.
           -->
          <date-selector v-if="option.type === 'date'" class="w-full" v-model="form[`${option.key ? option.key : option.label}`]" :readonly="board.readonly" />
          <ml-input v-else-if="option.type === 'text'" class="w-full" v-model="form[`${option.label}`]" :readonly="board.readonly" />
          <disaster-class-selector v-else-if="option.type === 'disaster'" class="w-full" v-model="form[`${option.label}`]" :readonly="board.readonly" :multiple="multipleDisaster" />
          <sign-field v-else-if="option.type === 'sign'" :style="'justify-self: start;'" class="sign-module" v-model="form[`${option.label}`]" :readonly="board.readonly" />
          <vs-select v-else-if="option.type === '요일'" class="w-full flex-1" autocomplete v-model="form[`${option.label}`]">
            <vs-select-item v-for="option in ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']" :key="option" :text="option" :value="option" />
          </vs-select>
          <vs-select v-else-if="option.type === '날씨'" class="w-full flex-1" autocomplete v-model="form[`${option.label}`]">
            <vs-select-item v-for="option in ['맑음', '흐림', '눈', '비']" :key="option" :text="option" :value="option" />
          </vs-select>
          <div v-else-if="option.type === 'period'" class="w-full flex">
            <date-selector class="w-full" v-model="form['period1']" :readonly="board.readonly" />
            <span class="px-3" style="align-self: center;">~</span>
            <date-selector class="w-full" v-model="form['period2']" :readonly="board.readonly" />
          </div>
        </div>
        <!-- <disaster-class-selector class="w-full" :readonly="board.readonly" :multiple="multipleDisaster" /> -->
      </div>
      <div v-if="!isPrint && (optionsType.includes('alert') || hostname === 'localhost' || hostname == 'nhsafe-dev.maot.co.kr' || hostname == 'nhsafe.maot.co.kr')" class="xl:col-span-12">
        <div class="title">알림 대상자 선택</div>
        <AlertUserSelector class="w-full" v-model="form.notification" :readonly="board.readonly" :field-name="form.field_name" />
      </div>
    </div>
  </div>
</template>

<script>
import FieldSelector from "@/components/selector/FieldSelector";
import DateSelector from "@/components/selector/DateSelector";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import SignField from "@/components/SignField.vue";
import AlertUserSelector from "@/components/selector/AlertUserSelector.vue";
import config from "/public/config";

export default {
  name: "FieldSelectModule",
  components: {
    DisasterClassSelector,
    DateSelector,
    FieldSelector,
    SignField,
    AlertUserSelector,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
    fieldName: String,
    visibleTitle: {
      type: Boolean,
      default: () => true,
    },
    title: {
      type: String,
      default: () => "기본정보",
    },
    options: {
      type: Array,
      default: () => [],
    },
    date: {
      type: String,
      default: () => {
        return new Date().format("yyyy-MM-dd");
      },
    },
    types: {
      type: Array,
      default: () => {
        return ["field_name", "department", "com_name", "rank", "writer_name"/*, "date"*/];
      },
    },
    typeslabel: {
      type: Object,
      default: () => {
        return {
          field_name: "사업장명",
          department: "소속명",
          com_name: "부서명",
          rank: "직책",
          writer_name: "작성자",
          date: "작성일",
        };
      },
    },
    initFieldName: {
      type: String,
      default: "현장명",
    },
    multipleDisaster: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    projectInfo() {
      return this.$store.state.project.projectInfo;
    },
    fieldListInfo() {
      return this.$store.state.project.fieldListInfo;
    },
    fieldLabel() {
      if (this.projectInfo.project_type === "총괄관리") {
        //ProjectId = 1
        return this.initFieldName;
      } else if (this.projectInfo.project_type === "내부종사자") {
        //ProjectId = 2
        return this.initFieldName;
      } else if (this.projectInfo.project_type === "용역위탁") {
        //ProjectId = 3
        return this.initFieldName;
      } else if (this.projectInfo.project_type === "도급") {
        //ProjectId = 4
        return this.initFieldName;
      } else if (this.projectInfo.project_type === "중대시민재해") {
        //ProjectId = 5
        return "시설물명";
      } else {
        return this.initFieldName;
      }
    },
    optionsType() {
      return this.options.map((op) => op.type);
    },
    memberInfo() {
      return this.$store.state.member.memberInfo;
    },
    /**
     * 사용자가 현재 프로젝트에서 선택하고 있는 현장의 ID를 반환합니다.
     */
    selectedField() {
      const metaKey = `selected_field_${this.projectId}`;

      if (this.memberInfo && this.memberInfo.meta) {
        const metaValue = this.memberInfo.meta[metaKey];
        if (metaValue) {
          return JSON.parse(metaValue);
        }
      }

      return null;
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler() {
        if (typeof this.value === "undefined" || typeof this.value.field_id === "undefined") {
          this.form.field_id = 0;
        } else {
          this.form.date = this.value.date;
          this.form.field_id = this.value.field_id;
          this.form.field_name = this.value.field_name;
          this.form.project_name = this.value.project_name;
          this.form.field_address = this.value.field_address;
          this.form.department = this.value.department;
          this.form.section = this.value.section;
          this.form.com_name = this.value.com_name;
          this.form.rank = this.value.rank;
          this.form.writer_name = this.value.writer_name;
          this.form.검토일 = this.value.검토일;
          this.form.계획일 = this.value.계획일;
          this.form.조사일 = this.value.조사일;
          this.form.점검일 = this.value.점검일;
          this.form.보수일 = this.value.보수일;
          this.form.진단일 = this.value.진단일;
          this.form.보강일 = this.value.보강일;
          this.form.교체일 = this.value.교체일;
          this.form.평가일 = this.value.평가일;
          this.form.점검장소 = this.value.점검장소;
          this.form.보수장소 = this.value.보수장소;
          this.form.재해형태 = this.value.재해형태;
          this.form.진단장소 = this.value.진단장소;
          this.form.보강장소 = this.value.보강장소;
          this.form.교체장소 = this.value.교체장소;
          this.form.평가자 = this.value.평가자;
          this.form.공정내용 = this.value.공정내용;
          this.form.요일 = this.value.요일;
          this.form.날씨 = this.value.날씨;
          this.form.notification = this.value.notification;
          this.form.period1 = this.value.period1;
          this.form.period2 = this.value.period2;

          this.form.해당기간 = this.value.해당기간;
        }

        for (const option of this.options) {
          if (this.value) {
            this.form[`${option.label}`] = this.value[`${option.label}`] ? this.value[`${option.label}`] : "";
          } else {
            this.form[`${option.label}`] = "";
          }
        }
      },
    },
    form: {
      immediate: false,
      deep: true,
      handler() {
        this.$emit("input", this.form);
      },
    },
    projectInfo: {
      immediate: true,
      deep: true,
      handler(value) {
        this.form.project_name = value.field_name;
      },
    },
    board: {
      immediate: true,
      deep: true,
      handler() {
        // post 를 불러왔을 경우에는
        // post 에 저장되어 있는 데이터를 사용하기 때문에,
        // board 의 정보로 데이터를 저장하지 않는다.
        if (!this.value || !this.value.com_name) {
          this.form.department = this.board.writer.department;
          this.form.section = this.board.writer.section;
          this.form.com_name = this.board.writer.com_name;

          // 문서를 새로 작성할 때, 만약 소규모현장(7)일 경우, "직책"과 "작성자" 값을 비운 상태로 표시한다.
          if (this.projectId === 7) {
            this.form.rank = this.selectedFieldRank || "";
            this.form.writer_name = this.selectedFieldWriterName || "";
          } else {
            this.form.rank = this.board.writer.rank;
            this.form.writer_name = this.board.writer.name;
          }

          if (typeof this.value === "undefined" || typeof this.value.field_id === "undefined") {
            this.form.field_id = 0;
          } else {
            this.form.field_id = this.value.field_id;
            this.form.field_name = this.value.field_name;
            this.form.field_address = this.value.address;
          }

          for (const option of this.options) {
            if (this.value) {
              this.form[`${option.label}`] = this.value[`${option.label}`] ? this.value[`${option.label}`] : "";
            } else {
              this.form[`${option.label}`] = "";
            }
          }
        }
      },
    },
    selectedField: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value && !this.form.field_id) {
          // 값을 바로 적용하면 업데이트되지 않는 경우가 있어서, nextTick에서 업데이트한다
          this.$nextTick(async () => {
            this.form.field_id = value.id;
            this.form.field_name = value.field_name;

            // 만약 7번 프로젝트일 경우
            if (this.projectId === 7) {
              if (!value.meta) {
                const info = await this.$store.dispatch("project/LOAD_FIELD", {fieldId: value.id});
                if (info && info.meta) {
                  value.meta = info.meta;
                }
              }
              const meta = JSON.parse(value.meta || '{}');
              if (meta['directors'] && meta['directors'].length > 0) {
                this.form.rank = meta['directors'][0].type || "";
                this.form.writer_name = meta['directors'][0].name || "";
                this.selectedFieldRank = this.form.rank;
                this.selectedFieldWriterName = this.form.writer_name;
              }
            }

            this.$emit("selectField", value);
          });
        }
      },
    },
    fieldListInfo: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value.data && value.data.length === 1) {
          // 신축공사현장만 해당
          if (this.projectId === 4) {
            // 현장 id를 하나만 가지고 있는 경우 현장명 자동 선택
            this.form.field_id = value.data[0].id;
            this.form.field_name = value.data[0].field_name;
          }
        }
      }
    }
  },
  data() {
    return {
      hostname: config.HOST_NAME,
      form: {
        field_id: 0,
        project_name: "",
        field_name: "",
        field_address: "",
        department: "",
        section: "",
        com_name: "",
        rank: "",
        writer_name: "",
        date: this.date,
        검토일: "",
        계획일: "",
        조사일: "",
        점검일: "",
        보수일: "",
        진단일: "",
        보강일: "",
        교체일: "",
        평가일: "",
        점검장소: "",
        보수장소: "",
        재해형태: "",
        진단장소: "",
        보강장소: "",
        교체장소: "",
        평가자: "",
        공정내용: "",
        요일: "",
        날씨: "",
        notification: [],
        period1: "",
        period2: "",

        해당기간: "",
        director_name: "",
      },
      selectedFieldRank: "",
      selectedFieldWriterName: "",
    };
  },

  created() {},

  methods: {
    onSelectFieldSelector(value) {
      this.form.field_name = value.field_name;
      this.form.field_address = value.address;

      this.form.director_name = value.director_name || "";

      this.$emit("selectField", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-module::v-deep {
  justify-content: normal !important;
  .sign-field {
    flex: 1;
    max-width: none;
  }
}
</style>
