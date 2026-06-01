<template>
  <print152 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <!--협의체 정보-->
    <div class="mt-5 relative z-10">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의체 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회의일</div>
          <p v-if="isPrint" class="w-full flex-1">
            {{ form.inputA_2 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector
              class="w-full"
              v-model="form.inputA_2"
              :readonly="board.readonly"
            />
          </div>
        </div>
        <div class="col-span-8 flex items-center"><!--공백--></div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">차수</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputA_3 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_3"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">노측 위원</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputA_4 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            type="number"
            v-model="form.inputA_4"
            class="w-full flex-1"
          />
          <span class="pl-2">명</span>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사측 위원</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputA_5 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            type="number"
            v-model="form.inputA_5"
            class="w-full flex-1"
          />
          <span class="pl-2">명</span>
        </div>
      </div>
    </div>

    <!-- 위험성평가협의회(사용자) -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      class="mt-6 z-0"
      title="산업안전보건위원회(사용자)"
      :tableData="[
        { id: 'cell1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'cell2',
          title: '직책',
          type: 'select',
          selectData: [
            '사용자대표',
            '안전관리자',
            '보건관리자',
            '사용자위원',
          ],
          placeholder: '선택',
        },
        { id: 'cell3', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'cell4', title: '서명', type: 'sign'},
        { id: 'cell5', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :max-size="10"
      v-model="form.userTableList"
    />


    <!-- 위험성평가협의회(근로자) -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="산업안전보건위원회(근로자)"
      :tableData="[
        { id: 'cell1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'cell2',
          title: '직책',
          type: 'select',
          selectData: [
            '근로자대표',
            '명예산업안전감독관',
            '근로자위원',
            '기타'
          ],
          placeholder: '선택',
        },
        { id: 'cell3', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'cell4', title: '서명', type: 'sign'},
        { id: 'cell5', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :max-size="10"
      v-model="form.workerTableList"
    />

    <!-- 심의 의결사항 -->
    <table-inspect
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      :isNote="true"
      tableHeaderTitle="심의 의결사항"
      tableHeaderNote="심의 결정사항"
      title="심의 의결사항"
      :list="form.inspectList"
      @update-list-check="updateListCheck"
    />
    <ul style="border: 1px solid #cdcdcd; border-top: 0" class="py-5 px-4">
      <li>※ 미이행 시 과태료</li>
      <li>
        <span class="px-2">•</span> 사업주 : (1차) 50만원, (2차) 250만원, (3차)
        500만원
      </li>
      <li>
        <span class="px-2">•</span> 근로자 : (1차) 10만원, (2차) 20만원, (3차)
        30만원
      </li>
    </ul>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">회의내용</div>
        <span v-if="isPrint"> {{ form.inputB_1 }} </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_1"
          :readonly="board.readonly"
        />
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList"
      section-title="사진대지"
      placeholder="점검 현장 사진"
      :is-print="isPrint"
      :readonly="board.readonly"
    />

    <!--    파일첨부-->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :readonly="board.readonly"
    ></file-upload-module>

  </div>
</template>

<script>
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import DateSelector from '@/components/selector/DateSelector'
import TableInspect from '@/components/TableInspect'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'
import FileUploadModule from '@/views/modules/FileUploadModule'
import PopupSignField from '@/popup/PopupSignField'
import SignField from '@/components/SignField'
import TableCustom from "@/components/TableCustom.vue";
import Print152 from "@/views/boards/single-page/152/Print.vue";

export default {
  components: {
    Print152,
    TableCustom,
    SignField,
    PopupSignField,
    FieldSelectModule,
    DateSelector,
    TableInspect,
    PhotoUploadGridModule,
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
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]

            if (key === 'userTableList' && 0 < value[key].length) {
              this.userTempId = value[key][value[key].length - 1].id
            }
            if (key === 'workerTableList' && 0 < value[key].length) this.workerTempId = value[key][value[key].length - 1].id
          }
        }
        if (!this.form || !this.form.inspectList || this.form.inspectList.length === 0) {
          this.form.inspectList = this.inspectTable
        }

      }
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {

        value.summary = {
          산업안전보건위원회_현장명: [],
          산업안전보건위원회_구분: []
        }

        value.summary['산업안전보건위원회_현장명'].push({
          [this.form.stdInfo.field_name]: 1
        })

        value.summary['산업안전보건위원회_구분'].push({
          [this.form.inputA_1]: 1
        })

        this.$emit('input', value)

      },
    },
  },
  data () {
    return {
      showSignPopup: false,
      form: {
        stdInfo: {},
        userTableList: [],
        workerTableList: [],
        inspectList: [],
        inputA_1: '',
        inputA_2: '',
        inputA_3: '',
        inputA_4: '',
        inputA_5: '',
        inputB_1: '',
        photoList: [],
        fileList: [],
      },
      userSelected: [],
      workerSelected: [],
      userTempId: 0,
      workerTempId: 0,
    }
  },
  computed: {
    inspectTable () {
      return [
        {
          id: 1,
          label: '산업재해 예방계획의 수립',
          is_checked: '',
        },
        {
          id: 2,
          label: '안전보건관리규정의 작성·변경',
          is_checked: '',
        },
        {
          id: 3,
          label: '근로자의 안전·보건교육',
          is_checked: '',
        },
        {
          id: 4,
          label: '작업환경의 점검 및 개선',
          is_checked: '',
        },
        {
          id: 5,
          label: '종사자의 건강진단 등 건강관리',
          is_checked: '',
        },
        {
          id: 6,
          label: '산업재해의 원인 조사 및 재발 방지대책 수립',
          is_checked: '',
        },
        {
          id: 7,
          label: '산업재해에 관한 통계의 기록 및 유지',
          is_checked: '',
        },
        {
          id: 8,
          label:
            '유해하거나 위험한 기계·기구와 그 밖의 설비를 도입한 경우 안전·보건조치',
          is_checked: '',
        },
        {
          id: 9,
          label: '근로자 안전보건 유지·증진을 위해 필요한 사항',
          is_checked: '',
        },
      ]
    },
    workerTableList () {
      console.log("computed workerTableList")
      return this.form.workerTableList
    }
  },
  created () {
    const keys = Object.keys(this.form)
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key]

        if (key === 'userTableList' && 0 < this.value[key].length) {
          this.userTempId = this.value[key][this.value[key].length - 1].id
        }
        if (key === 'workerTableList' && 0 < this.value[key].length) this.workerTempId = this.value[key][this.value[key].length - 1].id
      }
    }
    if (!this.form || !this.form.inspectList || this.form.inspectList.length === 0) {
      this.form.inspectList = this.inspectTable
    }
  },
  methods: {
    addTableRow (type) {
      const listID = type === 'userTableList' ? ++this.userTempId : ++this.workerTempId
      this.form[type].push({
        id: listID,
        cell1: '',
        cell2: '',
        cell3: '',
        cell4: '',
        cell5: '',
      })

      if (type === 'userTableList') {

      } else {
        this.worker.push({
          image : '',
          isTouch: false,
          background: '',
          id: listID,
        })
      }

    },
    async deleteSelectTable (type) {
      const seletedIds =
        type === 'userTableList'
          ? this.userSelected.map((item) => item.id)
          : this.workerSelected.map((item) => item.id)

      this.form[type] = this.form[type].filter(
        (item) => !seletedIds.includes(item.id)
      )

    },
    updateListCheck (indexRows, text) {
      this.form.inspectList[indexRows].is_checked = text
    },

    onTouchWorker(index) {
      this.worker[index].isTouch = true
    },

    onTouchUpWorker (index) {
      console.log("onTouchUpWorker", index)
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
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}

.upload-content {
  border: $border;

  &:last-child {
    border-left: none;
  }

  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }

  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}

.table ::v-deep {
  .vs-con-tbody {
    background: none !important;
    border: 0 !important;
  }
  thead tr {
    background: #f9f9f9 !important;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
  }
  tr {
    background: #fff !important;
    border-bottom: solid 1px #cdcdcd;
  }
}
</style>
