<template>
  <print259 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
      :typeslabel="{
        com_name: this.projectId === 7 ? '사무소명' : '부서명',
      }"
      @selectField="onSelectField"
    />

    <!--협의체 정보-->
    <div class="mt-5 relative z-10">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의체 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <!--        <div class="col-span-4 flex items-center">-->
        <!--          <div class="label-text mr-4">구분</div>-->
        <!--          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_1 }}</p>-->
        <!--          <ml-input-->
        <!--            v-else-if="board.readonly"-->
        <!--            v-model="form.inputA_1"-->
        <!--            :readonly="board.readonly"-->
        <!--            class="w-full flex-1"-->
        <!--          />-->
        <!--          <vs-select-->
        <!--            v-else-->
        <!--            v-model="form.inputA_1"-->
        <!--            autocomplete-->
        <!--            :disabled="board.readonly"-->
        <!--            class="w-full flex-1"-->
        <!--          >-->
        <!--            <vs-select-item text="정기" value="정기" />-->
        <!--            <vs-select-item text="수시" value="수시" />-->
        <!--          </vs-select>-->
        <!--        </div>-->
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">{{ this.projectId === 7 ? "회의일" : "협의일" }}</div>
          <p v-if="isPrint" class="print-input flex-1">
            {{ form.inputA_2 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector class="w-full" v-model="form.inputA_2" :readonly="board.readonly" />
          </div>
        </div>
        <div class="empty col-span-8"><!--여백--></div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회의장소</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_3 }}</p>
          <ml-input v-else v-model="form.inputA_3" :readonly="board.readonly" class="w-full flex-1" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">도급인</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_4 }}</p>
          <comma-input v-else :readonly="board.readonly" v-model="form.inputA_4" class="w-full flex-1" />
          <span class="pl-2">명</span>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">수급인</div>
          <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_5 }}</p>
          <comma-input v-else :readonly="board.readonly" v-model="form.inputA_5" class="w-full flex-1" />
          <span class="pl-2">명</span>
        </div>
      </div>
    </div>

    <table-custom
      :board="board"
      :is-print="isPrint"
      class="mt-6 z-0"
      title="도급인"
      :tableData="[
        { id: 'input1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'input2',
          title: '직급',
          type: 'select',
          selectData: workRank,
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'input3', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'input4', title: '서명', type: 'sign' },
        { id: 'input5', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :max-size="10"
      v-model="form.user"
    />
    <table-custom
      :board="board"
      :is-print="isPrint"
      class="mt-6"
      title="수급인"
      :tableData="[
        { id: 'input1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'input2',
          title: '직급',
          type: 'select',
          selectData: 수급인,
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'input3', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'input4', title: '서명', type: 'sign' },
        { id: 'input5', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :max-size="10"
      v-model="form.worker"
      :default-data="false"
    >
      <template #headButton v-if="projectId === 7">
        <vs-button class="mr-4" type="border" color="secondary" @click="showPrevBoard=true">수급인 정보 불러오기</vs-button>
      </template>
    </table-custom>

    <!-- 협의내용 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의내용</h5>
        </vs-col>
      </vs-row>

      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">작업 시작 시간</div>
        <span v-if="isPrint" class="print-textarea flex-1">
          {{ form.inputB_4 }}
        </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputB_4" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">작업장 간의 연락방법</div>
        <span v-if="isPrint" class="print-textarea flex-1">
          {{ form.inputB_5 }}
        </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputB_5" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">재해발생 위험이 있는 경우 대피 방법</div>
        <span v-if="isPrint" class="print-textarea flex-1">
          {{ form.inputB_6 }}
        </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputB_6" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">작업장에서의 법 제36조에 따른 위험성평가의 실시에 관한 사항</div>
        <span v-if="isPrint" class="print-textarea flex-1">
          {{ form.inputB_7 }}
        </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputB_7" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">사업주와 수급인 또는 수급인 상호 간의 연락 방법 및 작업공정의 조정</div>
        <span v-if="isPrint" class="print-textarea flex-1">
          {{ form.inputB_9 }}
        </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputB_9" :readonly="board.readonly" />
      </div>
      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">기타</div>
        <span v-if="isPrint" class="print-textarea flex-1">
          {{ form.inputB_10 }}
        </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputB_10" :readonly="board.readonly" />
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-start mb-4">
          <div class="label-text mr-4">대피로 약도 첨부</div>
          <p v-if="isPrint" class="print-input flex-1">
            {{ form.inputB_8.fileName }}
          </p>
          <file-uploader :readonly="board.readonly" v-else v-model="form.inputB_8" class="w-full flex-1" />
        </div>
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="점검 현장 사진" />

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>

    <popup-load-prev-board v-model="showPrevBoard" :setBoardId="688" @selectRowData="selectRowData" title="수급인 정보" :multi-select="true"/>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import FileUploadModule from "@/views/modules/FileUploadModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import TableCustom from "@/components/TableCustom.vue";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import FileUploader from "@/components/FileUploader";
import Print259 from "@/views/boards/single-page/259/Print.vue";
import PopupLoadPrevBoard from "@/popup/PopupLoadPrevBoard.vue";

export default {
  components: {
    PopupLoadPrevBoard,
    Print259,
    FieldSelectModule,
    DateSelector,
    PhotoUploadGridModule,
    FileUploadModule,
    TableCustom,
    DisasterClassSelector,
    FileUploader,
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

        // 도급인, 수급인 항목에 직책 값 넣기 : 어느 수정 사항인지 체크 필요
        // if(value.user.length > 0) {
        //   for(const user of value.user) {
        //     user.input2 = '도급인';
        //   }
        // }
        // if(value.worker.length > 0) {
        //   for(const worker of value.worker) {
        //     worker.input2 = '수급인';
        //   }
        // }
      },
    },
  },
  created() {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
  methods: {
    // 현장 정보에 연결되어 있는 수급인 서명 정보를 불러와서 적용한다
    onSelectField(field) {
      // 만약 프로젝트 ID가 7이라면 아래의 로직을 실행합니다.
      if (this.projectId === 7) {
        console.log(field.signatures);
        // form.inputA_5에 field.signatures의 길이를 할당합니다. 만약 field.signatures가 없다면 0을 할당합니다.
        this.form.inputA_5 = field.signatures ? field.signatures.length : 0;

        // field.signatures가 있고 그 길이가 0보다 크다면 workerSignatures에 field.signatures를 할당합니다.
        // 그렇지 않다면 workerSignatures에 빈 객체를 할당합니다.
        let workerSignatures = field.signatures && field.signatures.length > 0 ? field.signatures : [
          {
            input1: "",
            input2: "",
            input3: "",
            input4: "",
            input5: "",
          },
        ];
        // workerSignatures 배열의 각 요소에 대해 아래의 로직을 실행합니다.
        workerSignatures = workerSignatures.map((signature) => {
          // 각 요소를 새로운 객체로 변환하여 반환합니다.
          // 이때, 각 필드는 signature 객체의 해당 필드를 할당하거나, 해당 필드가 없다면 빈 문자열을 할당합니다.
          // console.log('signature', signature)

          // signature.type 값이 workRank 배열에 포함되어 있다면, 해당 값을 그대로 할당합니다.
          // 아닐 경우, '직접입력'을 할당합니다.
          const type = this.workRank.includes(signature.type) ? signature.type : "직접입력";
          let typeCustom = '';
          if (signature.type === '직접입력') {
            typeCustom = signature.type_직접입력;
          } else if (type === '직접입력') {
            typeCustom = signature.type;
          }

          return {
            input1: signature.target ? signature.target : "",
            input2: type,
            input2_직접입력: typeCustom,
            input3: signature.name ? signature.name : "",
            input4: signature.sign ? signature.sign : "",
            input5: signature.note ? signature.note : "",
          };
        });
        // form 객체의 'worker' 필드에 workerSignatures를 할당합니다.
        this.$set(this.form, "worker", workerSignatures);
      }
    },
    selectRowData(data) {
      if (!data) return

      let numberId = this.form.worker.length + 1
      // 수급인 정보 불러오기
      for (const item of data) {
        const content = item.content
        if (!content) continue

        const rowData = {
          id: numberId++,
          input1: content.소속명,
          input2: content.직책 === "관리감독자" ? "관리감독자" : "직접입력",
          input3: content.성명,
          input4: content.서명,
          input5: content.비고,
        }
        if (rowData.input2 === "직접입력") {
          rowData.input2_직접입력 = content.직책
        }
        this.form.worker.push(rowData)
      }
    }
  },
  data() {
    return {
      workRank: ["감독관", "관리책임자",  "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체", "직접입력"],
      수급인: ["감독관", "관리책임자", "관리감독자",  "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체", "직접입력"],
      // workRank: ["관리책임자", "관리감독자", "안전관리자", "근로자", "직접입력"],
      showPrevBoard: false,
      form: {
        stdInfo: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",

        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        inputB_7: "",
        inputB_8: {},
        inputB_9: "",
        inputB_10: "",

        user: [],
        worker: [],

        photoList: [],
        fileList: [],
      },
    };
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.isPrint = true;
  //   }, 3000);
  // }
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .empty {
    display: none !important;
  }
}
</style>
