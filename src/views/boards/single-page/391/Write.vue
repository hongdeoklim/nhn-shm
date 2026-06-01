<template>
  <div v-if="!isPrint">
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="{ ...this.board, readonly: this.board.readonly || isPostId }" :is-print="isPrint" :options="[{ type: 'alert' }]" @selectField="selectField" />

    <!-- 현장개요 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>현장개요</h5>
      <div class="writeGridContainer mt-6">
        <div>
          <div class="title">현장명</div>
          <div>
            <ml-input class="w-full" :value="form.inputA_1" readonly />
          </div>
        </div>
        <div>
          <div class="title">공사기간</div>
          <div>
            <div class="time">
              <ml-input class="w-full" :value="form.inputA_2" readonly />
              ~
              <ml-input class="w-full" :value="form.inputA_3" readonly />
            </div>
          </div>
        </div>
        <div>
          <div class="title">공사금액</div>
          <div>
            <comma-input class="w-full" :value="form.inputA_4" readonly />
          </div>
        </div>
        <div>
          <div class="title">발주처</div>
          <div>
            <div v-if="isPrint" class="print-input">
              {{ form.inputA_5 }}
            </div>
            <ml-input class="w-full" v-model="form.inputA_5" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div class="title">공정률</div>
          <div>
            <div class="flex justify-center items-center gap-5">
              <div class="flex justify-center items-center gap-2">
                <p style="min-width: 30px">계획</p>
                <ml-input class="w-full" v-model="form.inputA_6" :readonly="board.readonly" />
                <p>%</p>
              </div>
              <div class="flex justify-center items-center gap-2">
                <p style="min-width: 30px">실시</p>
                <ml-input class="w-full" v-model="form.inputA_7" :readonly="board.readonly" />
                <p>%</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="title">현장주소</div>
          <div>
            <div>
              <ml-input class="w-full" v-model="form.inputA_8" :readonly="board.readonly" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 점검결과 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>점검결과</h5>
      <div class="writeGridContainer mt-6">
        <div>
          <div class="title">점검일</div>
          <div class="flex items-center gap-2">
            <date-selector class="w-full" v-model="form.inputB_1" :readonly="board.readonly" />
            <ml-input class="w-16" :value="form.inputB_1 | moment('ddd')" :readonly="board.readonly" />
            <p style="min-width: 30px">요일</p>
          </div>
        </div>
        <div>
          <div class="title">보완조치일자</div>
          <div>
            <date-selector class="w-full" v-model="form.inputB_2" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div class="title">재해형태</div>
          <div class="overflow-visible">
            <disaster-class-selector class="w-full" v-model="form.inputB_3" :readonly="board.readonly" multiple />
          </div>
        </div>
        <div class="writeGridLineItem">
          <div class="title">점검결과</div>
          <div class="h-full flex items-center gap-3">
            <vs-radio v-model="form.inputB_4" vs-value="경고" :readonly="board.readonly">경고</vs-radio>
            <vs-radio v-model="form.inputB_4" vs-value="보완" :readonly="board.readonly">보완</vs-radio>
            <vs-radio v-model="form.inputB_4" vs-value="권고" :readonly="board.readonly">권고</vs-radio>
            <vs-radio v-model="form.inputB_4" vs-value="중복지적" :readonly="board.readonly">중복지적</vs-radio>
          </div>
        </div>
        <div>
          <div class="title">안전평가점수</div>
          <div>
            <ml-input class="w-full" v-model="form.inputB_5" readonly />
          </div>
          <p>/ 100</p>
        </div>
        <div>
          <div class="title">금차 점검항목</div>
          <div>
            <ml-input class="w-full" v-model="form.inputB_6" readonly />
          </div>
          <p>/ 50개</p>
        </div>
        <div>
          <div class="title">회차</div>
          <div>
            <ml-input class="w-full" v-model="form.inputB_7" readonly />
          </div>
        </div>
      </div>
    </div>

    <!-- 기존평가결과 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>기존평가결과</h5>
      <table class="mt-6">
        <tr>
          <td>회차</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_num_${post_i}`">{{ post_i + 1 }}</td>
        </tr>
        <tr>
          <td>점검일</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_day_${post_i}`">{{ post.inputB_1 | moment("YYYY-MM-DD dddd") }}</td>
        </tr>
        <tr>
          <td>공정률</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_percent_${post_i}`">{{ !!post.inputA_7 ? `${post.inputA_7}%` : "" }}</td>
        </tr>
        <tr>
          <td>점수</td>
          <td v-for="(post, post_i) in form.summary" :key="`summery_score_${post_i}`">
            {{ typeof post.inputB_5 === "undefined" ? "" : `${post.inputB_5}점` }}
          </td>
        </tr>
      </table>
    </div>

    <!-- 현장 안전교육 및 회의 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>현장 안전교육 및 회의</h5>
      <div class="writeGridContainer mt-6 mb-4">
        <div class="writeGridLineItem">
          <div class="title">대상</div>
          <div class="h-full flex items-center gap-3">
            <vs-radio v-model="form.inputC_1" vs-value="관리책임자 및 관리자" :readonly="board.readonly">관리책임자 및 관리자</vs-radio>
            <vs-radio v-model="form.inputC_1" vs-value="근로자" :readonly="board.readonly">근로자</vs-radio>
          </div>
        </div>
        <div class="writeGridLineItem">
          <div class="title">내용</div>
          <div>
            <ml-textarea class="w-full mb-0" v-model="form.inputC_2" :readonly="board.readonly" />
          </div>
        </div>
      </div>
      <div class="writeGridContainer my-4">
        <div>
          <div class="title">시간</div>
          <div class="time">
            <time-selector v-model="form.inputC_3" :readonly="board.readonly" />
            <p>~</p>
            <time-selector v-model="form.inputC_4" :readonly="board.readonly" />
          </div>
        </div>
      </div>
      <div class="writeGridContainer my-4">
        <div class="writeGridLineItem">
          <div class="title">강사</div>
          <div class="writeGridContainer">
            <div>
              <div class="title">직위</div>
              <div>
                <ml-input class="w-full" v-model="form.inputC_5" :readonly="board.readonly" />
              </div>
            </div>
            <div>
              <div class="title">서명</div>
              <div>
                <SignField class="w-full" v-model="form.inputC_6" :readonly="board.readonly" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="writeGridContainer my-4">
        <div class="writeGridLineItem">
          <div class="title">강사</div>
          <div class="writeGridContainer">
            <div>
              <div class="title">직위</div>
              <div>
                <ml-input class="w-full" v-model="form.inputC_7" :readonly="board.readonly" />
              </div>
            </div>
            <div>
              <div class="title">서명</div>
              <div>
                <SignField class="w-full" v-model="form.inputC_8" :readonly="board.readonly" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 현장 안전교육 및 회의 사진대지 -->
    <PhotoUploadGridModule v-model="form.photoList1" :is-print="isPrint" :readonly="board.readonly" section-title="현장 안전교육 및 회의 사진대지" placeholder="" :gridCount="2" :isCheckMode="false" />

    <!-- 안전보건점검표 -->
    <TableInspectDouble
      :is-print="isPrint"
      :is-readonly="board.readonly"
      title="안전보건점검표"
      :is-table-numbering="true"
      table-numbering-title="보완번호"
      table-header-title="점검항목"
      :table-check-titles="[
        { title: '평가', yes: '△2', no: '△1', na: '○' },
        { title: '지적건수', yes: '경고', no: '보완', na: '권고' },
      ]"
      table-header-yes="양호"
      table-header-no="불량"
      table-header-na="N/A"
      tableTitleColor="#F9F9F9"
      v-model="form.inspect"
      @input="inputInspect"
      class="mt-5"
    />

    <!-- 점검목록 상세 및 보완조치 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>점검목록 상세 및 보완조치</h5>
      <div class="flex items-start gap-5">
        <!-- grid grid-cols-1 xl:grid-cols-2 gap-5 -->
        <PhotoUploadGridModule v-model="form.photoList2" :is-print="isPrint" :readonly="board.readonly" :isShowTitle="false" placeholder="" :rowCount="1" :gridCount="1" :isCheckMode="false" :showFooterInput="false" class="flex-1" />
        <div class="flex-1 writeGridContainer mt-6">
          <div class="writeGridLineItem">
            <div class="title">구분</div>
            <div>
              <ml-input class="w-full" v-model="form.inputD_1" :readonly="board.readonly" />
            </div>
          </div>
          <div class="writeGridLineItem">
            <div class="title">점검결과</div>
            <div class="h-full flex items-center gap-3">
              <vs-radio v-model="form.inputD_2" vs-value="경고" :readonly="board.readonly">경고</vs-radio>
              <vs-radio v-model="form.inputD_2" vs-value="보완" :readonly="board.readonly">보완</vs-radio>
              <vs-radio v-model="form.inputD_2" vs-value="권고" :readonly="board.readonly">권고</vs-radio>
              <vs-radio v-model="form.inputD_2" vs-value="중복지적" :readonly="board.readonly">중복지적</vs-radio>
            </div>
          </div>
          <div class="writeGridLineItem">
            <div class="title">조치요망</div>
            <div>
              <ml-textarea class="w-full mb-0" rows="5" v-model="form.inputD_3" :readonly="board.readonly" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 현장보완조치 -->
    <PhotoUploadGridModule v-model="form.photoList3" :is-print="isPrint" :readonly="board.readonly" section-title="현장보완조치" placeholder="" :gridCount="2" :isCheckMode="false" :footerBeforeText="['보완조치', '현장의견']" />

    <!-- 참석자 명단 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="참석자 명단"
      :tableData="[
        {
          id: 'input1',
          title: '구분',
          type: 'select',
          selectData: ['점검자', '참석자'],
          placeholder: '선택',
        },
        { id: 'input2', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'input3',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자'],
          placeholder: '선택',
        },
        { id: 'input4', title: '성명', type: 'text', placeholder: '내용' },
        { id: 'input5', title: '서명', type: 'sign' },
      ]"
      :mobile="['input2', 'input4']"
      v-model="form.signatureList"
    />

    <!-- 잘된점 / 우수사례 -->
    <PhotoUploadGridModule v-model="form.photoList4" :is-print="isPrint" :readonly="board.readonly" section-title="잘된점 / 우수사례" placeholder="" :gridCount="2" footerBeforeText="사례내용">
      <template #customInput>
        <div class="writeGridContainer">
          <div class="writeGridLineItem">
            <div class="title">구분</div>
            <div>
              <ml-input class="w-full" v-model="form.photoHeadInput4" :readonly="board.readonly" />
            </div>
          </div>
        </div>
      </template>
    </PhotoUploadGridModule>

    <!-- 권고사항 -->
    <PhotoUploadGridModule v-model="form.photoList5" :is-print="isPrint" :readonly="board.readonly" section-title="권고사항" placeholder="" :gridCount="2" footerBeforeText="권고사항">
      <template #customInput>
        <div class="writeGridContainer">
          <div class="writeGridLineItem">
            <div class="title">구분</div>
            <div>
              <ml-input class="w-full" v-model="form.photoHeadInput5" :readonly="board.readonly" />
            </div>
          </div>
        </div>
      </template>
    </PhotoUploadGridModule>

    <!-- 개선 및 향후 중점 검토 사항 -->
    <PhotoUploadGridModule v-model="form.photoList6" :is-print="isPrint" :readonly="board.readonly" section-title="개선 및 향후 중점 검토 사항" placeholder="" :gridCount="2" footerBeforeText="권고내용">
      <template #customInput>
        <div class="writeGridContainer">
          <div class="writeGridLineItem">
            <div class="title">구분</div>
            <div>
              <ml-input class="w-full" v-model="form.photoHeadInput6" :readonly="board.readonly" />
            </div>
          </div>
        </div>
      </template>
    </PhotoUploadGridModule>

    <!-- 총평 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>총평</h5>
      <div class="writeGridContainer mt-6">
        <div class="writeGridLineItem">
          <div class="title">잘못된점</div>
          <div>
            <ml-textarea class="w-full mb-0" rows="5" v-model="form.inputE_1" :readonly="board.readonly" />
          </div>
        </div>
        <div class="writeGridLineItem">
          <div class="title">잘된점</div>
          <div>
            <ml-textarea class="w-full mb-0" rows="5" v-model="form.inputE_2" :readonly="board.readonly" />
          </div>
        </div>
        <div class="writeGridLineItem">
          <div class="title">권고사항</div>
          <div>
            <ml-textarea class="w-full mb-0" rows="5" v-model="form.inputE_3" :readonly="board.readonly" />
          </div>
        </div>
        <div class="writeGridLineItem">
          <div class="title">개선 및 향후 중점 검토 사항</div>
          <div>
            <ml-textarea class="w-full mb-0" rows="5" v-model="form.inputE_4" :readonly="board.readonly" />
          </div>
        </div>
      </div>
    </div>

    <!-- 확인자(결재) -->
    <div>
      <h5 class="mt-6"><i class="dot"></i>확인자(결재)</h5>
      <div class="writeGridContainer mt-6">
        <div>
          <div class="title">담당</div>
          <div>
            <ml-input class="w-full" v-model="form.inputF_1" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div class="title">서명</div>
          <div>
            <SignField class="w-full" v-model="form.inputF_2" :readonly="board.readonly" />
          </div>
        </div>
      </div>
      <div class="writeGridContainer mt-6">
        <div>
          <div class="title">팀장</div>
          <div>
            <ml-input class="w-full" v-model="form.inputF_3" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div class="title">서명</div>
          <div>
            <SignField class="w-full" v-model="form.inputF_4" :readonly="board.readonly" />
          </div>
        </div>
      </div>
      <div class="writeGridContainer mt-6">
        <div>
          <div class="title">실장</div>
          <div>
            <ml-input class="w-full" v-model="form.inputF_5" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div class="title">서명</div>
          <div>
            <SignField class="w-full" v-model="form.inputF_6" :readonly="board.readonly" />
          </div>
        </div>
      </div>
      <div class="writeGridContainer mt-6">
        <div>
          <div class="title">대표이사</div>
          <div>
            <ml-input class="w-full" v-model="form.inputF_7" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div class="title">서명</div>
          <div>
            <SignField class="w-full" v-model="form.inputF_8" :readonly="board.readonly" />
          </div>
        </div>
      </div>
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-6" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <Print v-else :form="form" />
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import TableCustom from "@/components/TableCustom.vue";
import SignField from "@/components/SignField.vue";
import DateSelector from "@/components/selector/DateSelector.vue";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import CustomOptionSelector from "@/components/selector/CustomOptionSelector.vue";
import TimeSelector from "@/components/selector/TimeSelector.vue";
import TableInspectDouble from "@/components/TableInspectDouble.vue";
import inspectData from "./inspectData";
import Print from "./Print";

export default {
  components: {
    Print,
    FieldSelectModule,
    FileUploadModule,
    PhotoUploadGridModule,
    TableCustom,
    SignField,
    DateSelector,
    DisasterClassSelector,
    CustomOptionSelector,
    TimeSelector,
    TableInspectDouble,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  data() {
    return {
      form: {
        stdInfo: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputA_6: "",
        inputA_7: "",
        inputA_8: "",

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: 0,
        inputB_6: 0,
        inputB_7: "",

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",
        inputC_5: "",
        inputC_6: "",
        inputC_7: "",
        inputC_8: "",

        inputD_1: "",
        inputD_2: "",
        inputD_3: "",
        inputD_4: "",
        inputD_5: "",
        inputD_6: "",
        inputD_7: "",
        inputD_8: "",

        inputE_1: "",
        inputE_2: "",
        inputE_3: "",
        inputE_4: "",

        inputF_1: "",
        inputF_2: "",
        inputF_3: "",
        inputF_4: "",
        inputF_5: "",
        inputF_6: "",
        inputF_7: "",
        inputF_8: "",

        inspect: inspectData,

        photoList1: [{ input: "안전보건회의 / 교육" }, { input: "현장 안전보건점검" }],
        photoList2: [],
        photoList3: [],
        photoHeadInput4: "",
        photoList4: [],
        photoHeadInput5: "",
        photoList5: [],
        photoHeadInput6: "",
        photoList6: [],

        signatureList: [],

        fileList: [],
      },
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    postList() {
      return JSON.parse(JSON.stringify(this.$store.state.board.list));
    },
    isPostId() {
      return !!this.$route.params.postId;
    },
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
        value.summary = {
          안전보건점검_현장명: [],
          안전보건점검_점검표: [],
        };

        value.summary["안전보건점검_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        value.summary["안전보건점검_점검표"].push({
          "안전보건 순회점검 보고서": 1,
        });
        value.title = this.board.writer.department;
        this.$emit("input", value);
      },
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
  methods: {
    selectField(data) {
      const { field_name, start_work_at, be_completed_at, deposit_amount } = data;
      this.form.inputA_1 = field_name;
      this.form.inputA_2 = start_work_at;
      this.form.inputA_3 = be_completed_at;
      this.form.inputA_4 = deposit_amount;

      this.loadListBoard();
    },
    async loadListBoard() {
      // 내용불러오기
      const projectId = this.projectId;
      const boardId = 391;
      const page = 1;
      const perPage = 16;
      const keyword = [`content$body.stdInfo.field_name*${this.form.stdInfo.field_name}`];

      await this.$store.dispatch("board/LOAD_POST_LIST", {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
      });

      this.form.inputB_7 = this.postList.length + 1;

      let _summary = this.postList.map((post) => this.getContent(post));
      if (this.postList.length < 6) {
        for (let index = 0; index < 6; index++) {
          if (!_summary[index]) _summary[index] = {};
        }
      }
      this.form.summary = _summary;
    },
    inputInspect() {
      this.form.inputB_6 = this.form.inspect.filter((_data) => _data.지적건수 && _data.평가).length;
      this.form.inputB_5 = this.form.inspect.reduce((score, _data) => {
        switch (_data.평가) {
          case "△2":
            return score + 2;
          case "△1":
            return score + 1;
          default:
            return score;
        }
      }, 0);
    },

    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.body;
      }
    },
  },
};
</script>

<style scoped lang="scss">
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  tr {
    &:first-child td {
      font-weight: 500;
      background: #f9f9f9;
    }

    td {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
      border: 1px solid #cdcdcd;
      padding: 16px 8px;

      &:first-child {
        font-weight: 500;
        background: #f9f9f9;
      }
    }
  }
}
</style>
