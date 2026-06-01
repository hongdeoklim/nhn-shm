<template>
  <Print v-if="isPrint" :board="board" :form="form" />
  <div v-else>
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!-- TBM 정보 -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> TBM 정보</h5>
      <div class="writeGridContainer">
        <div>
          <div>TBM 실시일</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_1 }}</p>
          <date-selector v-else :readonly="board.readonly" v-model="form.inputB_1" />
        </div>
        <div>
          <div>TBM 실시시간</div>
          <div v-if="!isPrint" class="time">
            <time-selector v-model="form.inputB_2" />
            <p>~</p>
            <time-selector v-model="form.inputB_3" />
          </div>
          <span v-else class="print-input">{{ `${form.inputB_2} ~ ${form.inputB_3}` }}</span>
        </div>
        <div>
          <div>해당기간</div>
          <DateSelectorRang v-model="form.inputB_8" :readonly="board.readonly" />
        </div>
        <div>
          <div>작업명</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
          <ml-input v-else v-model="form.inputB_4" :readonly="board.readonly" />
        </div>
        <div>
          <div>작업내용</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
          <ml-input v-else v-model="form.inputB_5" :readonly="board.readonly" />
        </div>
        <div>
          <div>TBM 장소</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>
          <ml-input v-else v-model="form.inputB_6" :readonly="board.readonly" />
        </div>
        <div>
          <div>위험성평가 실시여부</div>
          <div>
            <vs-radio class="mr-4" v-model="form.inputB_7" vs-value="예" color="secondary" :disabled="board.readonly">예</vs-radio>
            <vs-radio v-model="form.inputB_7" vs-value="아니오" color="secondary" :disabled="board.readonly">아니오</vs-radio>
          </div>
        </div>
      </div>
    </div>

    <!--    잠재위험요인-->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="잠재위험요인"
      :tableData="[
        { id: 'no', title: '연번', type: 'no', width: '80px' },
        { id: 'input1', title: '잠재위험요인', type: 'text' },
        { id: 'input2', title: '대책 (※ 제거 → 대체 → 통제 순서 고려)', type: 'text' },
      ]"
      v-model="form.risk_factors"
      class="mt-28px"
    />

    <!-- 중점위험요인 -->
    <div v-if="form.중점위험요인" class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 중점위험요인</h5>
      <div class="writeGridContainer">
        <div class="writeGridLineItem">
          <div>선정</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.중점위험요인.선정 }}</p>
          <ml-input v-else v-model="form.중점위험요인.선정" :readonly="board.readonly" />
        </div>
        <div class="writeGridLineItem">
          <div>대책</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.중점위험요인.대책 }}</p>
          <ml-input v-else v-model="form.중점위험요인.대책" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 작업 전 안전조치 확인 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="작업 전 안전조치 확인"
      :tableData="[
        { id: 'no', title: '연번', type: 'no', width: '80px' },
        { id: '잠재위험요소', title: '잠재위험요소(중점위험 포함)', type: 'text' },
        { id: '조치여부', title: '조치여부', type: 'radio', radioItems: [{label: '예', value: 'Y'}, {label: '아니오', value: 'N'}] },
        { id: '아니오_조치내용', title: '‘아니오’인 경우 조치 내용', type: 'customType' },
      ]"
      v-model="form.작업전안전조치확인.list"
      class="mt-28px"
    >
      <template #customType="{ index, trData, value, input }">
        <div v-if="trData && trData.조치여부 === 'N'">
          <ml-input v-if="isPrint" class="print-input flex-1" :value="trData.아니오_조치내용" />
          <ml-input v-else class="w-full" v-model="trData.아니오_조치내용" :readonly="board.readonly" @input="input" />
        </div>
      </template>
    </table-custom>

    <div class="writeGridContainer">
      <div class="writeGridLineItem">
        <div>교육 내용</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.작업전안전조치확인.교육내용 }}</p>
        <ml-textarea v-else v-model="form.작업전안전조치확인.교육내용" :readonly="board.readonly" />
      </div>
      <div class="writeGridLineItem">
        <div>기타 특이사항</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.작업전안전조치확인.기타특이사항 }}</p>
        <ml-textarea v-else v-model="form.작업전안전조치확인.기타특이사항" :readonly="board.readonly" />
      </div>
    </div>


    <!--    참석자 명단 ※TBM에 참여하지 않은 작업자를 확인하여 미팅 참석 유도-->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="참석자 명단 ※TBM에 참여하지 않은 작업자를 확인하여 미팅 참석 유도"
      :tableData="[
        { id: 'type', title: '공종', type: 'text' },
        { id: 'name', title: '이름', type: 'text' },
        { id: 'sign', title: '서명', type: 'sign' },
        { id: 'note', title: '비고', type: 'text' },
      ]"
      :default-data="false"
      v-model="form.participant"
      class="mt-28px"
    >
      <template #headButton v-if="projectId === 7">
        <vs-button class="mr-4" type="border" color="secondary" @click="showPrevBoard=true">참석자 정보 불러오기</vs-button>
      </template>
    </table-custom>

    <!--    TBM 회의 사진대지-->
    <photo-upload-grid-module
      class="mt-28px"
      section-title="TBM 회의 사진대지"
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      placeholder="신축현장 점검"
      withDatePicker
    />

    <!--    위험요인 조치 사진대지 -->
    <photo-upload-grid-module
      class="mt-28px"
      section-title="위험요인 조치 사진대지"
      :add-count="2"
      :row-count="2"
      :grid-count="2"
      v-model="form.위험요인조치사진대지"
      :is-print="isPrint"
      :readonly="board.readonly"
      useDeleteLatestItem
      placeholder="신축현장 점검"
    >
      <template #footer="{file, fileIndex}">
        <div class="flex items-center gap-2 pt-4">
          <span v-if="fileIndex % 2 === 0" class="px-2 py-1" style="background-color: #FF9F43; border-radius: 4px; color: #fff;">조치 전</span>
          <span v-else class="px-2 py-1" style="background-color: #00CFE8; border-radius: 4px; color: #fff;">조치 후</span>
          <span>내용</span>
          <ml-input v-model="file.input" class="flex-1"/>
        </div>
      </template>
    </photo-upload-grid-module>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly" class="mt-28px" />

    <popup-load-prev-board v-model="showPrevBoard" :setBoardId="688" @selectRowData="selectRowData" title="수급인 정보" :multi-select="true"/>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import TimeSelector from "@/components/selector/TimeSelector.vue";
import DateSelector from "@/components/selector/DateSelector.vue";
import DateSelectorRang from "@/components/selector/DateSelectorRang";
import TableCustom from "@/components/TableCustom.vue";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import Print from "./Print.vue";
import PopupLoadPrevBoard from "@/popup/PopupLoadPrevBoard.vue";

export default {
  components: {
    PopupLoadPrevBoard,
    FieldSelectModule,
    TimeSelector,
    DateSelector,
    DateSelectorRang,
    TableCustom,
    PhotoUploadGridModule,
    FileUploadModule,
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

        if (keys.indexOf('중점위험요인') === -1) {
          this.form.중점위험요인 = {
            선정: "",
            대책: "",
          }
        }

        if (keys.indexOf('작업전안전조치확인') === -1) {
          this.form.작업전안전조치확인 = {
            list: [],
            교육내용: "",
            기타특이사항: "",
          }
        }

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
      showPrevBoard: false,
      form: {
        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        inputB_7: "",
        inputB_8: "",

        risk_factors: [],
        participant: [],
        중점위험요인: {
          선정: "",
          대책: "",
        },
        작업전안전조치확인: {
          list: [],
          교육내용: "",
          기타특이사항: "",
        },

        stdInfo: {},
        fileList: [],
        photoList: [],
        위험요인조치사진대지: [],
      },
    };
  },
  computed: {
    projectId() {
      return Number(this.$route.params.proj_id);
    },
  },
  methods: {
    selectRowData(data) {
      if (!data) return

      let numberId = this.form.participant.length + 1
      // 정보 불러오기
      for (const item of data) {
        const content = item.content
        if (!content) continue

        const rowData = {
          id: numberId++,
          name: content.성명,
          sign: content.서명,
          note: content.비고,
        }
        this.form.participant.push(rowData)
      }
    }
  },
};
</script>
