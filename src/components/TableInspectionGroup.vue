<template>
  <div class="mt-component-form">
    <vs-row class="my-4 center-flex">
      <h5><i class="dot"></i>{{ title }}</h5>
      <div class="ml-auto">
        <vs-button v-if="!isPrint" class="" color="secondary" type="border" @click="handleAddRow">항목추가</vs-button>
        <vs-button v-if="!isPrint" class="ml-4" color="secondary" @click="handleRemoveRow">선택삭제</vs-button>
      </div>
    </vs-row>

    <div class="grid grid-cols-8 row-header">
      <div class="col-span-1 row-header__item">
        <vs-checkbox v-model="equipAllCheck" @change="changeAllCheck"></vs-checkbox>
      </div>
      <div class="col-span-1 row-header__item">점검대상</div>
      <div class="col-span-1 row-header__item">소속명(부서명)/직급</div>
      <div class="col-span-1 row-header__item">직책</div>
      <div class="col-span-1 row-header__item">성명</div>
      <div class="col-span-1 row-header__item">연락처</div>
      <div class="col-span-1 row-header__item">점검방법</div>
      <div class="col-span-1 row-header__item">점검회차</div>
    </div>
    <!-- rows -->
    <div class="grid grid-cols-8 row-content" v-for="(rows, indexRows) in targetList" :key="indexRows">
      <div class="col-span-1 none-border-center">
        <vs-checkbox v-if="!isPrint" v-model="rows.is_checked"></vs-checkbox>
      </div>
      <div class="col-span-1 item-area">
        <div v-if="!isPrint" class="w-full flex-1 flex flex-col gap-1 p-1">
          <vs-select autocomplete v-model="rows.target" class="w-full">
            <vs-select-item text="건설공사 기간 연장" value="건설공사 기간 연장" />
            <vs-select-item text="도급전 정보 제공" value="도급전 정보 제공" />
            <vs-select-item text="반기별 점검" value="반기별 점검" />
            <vs-select-item text="보건교육" value="보건교육" />
            <vs-select-item text="비상대피 교육" value="비상대피 교육" />
            <vs-select-item text="비상대피 자체평가" value="비상대피 자체평가" />
            <vs-select-item text="비상대피 훈련" value="비상대피 훈련" />
            <vs-select-item text="비상연락/지원 체계도" value="비상연락/지원 체계도" />
            <vs-select-item text="비상연락망" value="비상연락망" />
            <vs-select-item text="비상조치계획 수립" value="비상조치계획 수립" />
            <vs-select-item text="현장 경영방침" value="현장 경영방침" />
            <vs-select-item text="산업재해조사" value="산업재해조사" />
            <vs-select-item text="설계변경 요청" value="설계변경 요청" />
            <vs-select-item text="수급인 산재예방 평가" value="수급인 산재예방 평가" />
            <vs-select-item text="순회점검" value="순회점검" />
            <vs-select-item text="시정 및 예방조치" value="시정 및 예방조치" />
            <vs-select-item text="아차사고" value="아차사고" />
            <vs-select-item text="안전교육" value="안전교육" />
            <vs-select-item text="안전보건관리 수행평가" value="안전보건관리 수행평가" />
            <vs-select-item text="안전보건 예산" value="안전보건 예산" />
            <vs-select-item text="안전보건 확보 의무" value="안전보건 확보 의무" />
            <vs-select-item text="안전보건대장 작성" value="안전보건대장 작성" />
            <vs-select-item text="안전보건협의체 구성" value="안전보건협의체 구성" />
            <vs-select-item text="위험성평가" value="위험성평가" />
            <vs-select-item text="유해위험요인 파악" value="유해위험요인 파악" />
            <vs-select-item text="작업계획서" value="작업계획서" />
            <vs-select-item text="작업중지제" value="작업중지제" />
            <vs-select-item text="작업허가서" value="작업허가서" />
            <vs-select-item text="장비점검" value="장비점검" />
            <vs-select-item text="재발방지계획서" value="재발방지계획서" />
            <vs-select-item text="중대재해 발생 조사" value="중대재해 발생 조사" />
            <vs-select-item text="작업환경 측정" value="작업환경 측정" />
            <vs-select-item text="기타" value="기타" />
          </vs-select>
          <ml-input v-if="rows.target === '기타'" v-model="rows.targetOther" class="w-full" />
        </div>
        <div v-else>
          <span class="print-input">{{ rows.target }}</span>
          <span v-if="rows.target === '기타'" class="print-input">{{ rows.targetOther }}</span>
        </div>
      </div>
      <div class="col-span-1 item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.group" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.group }}</span>
      </div>
      <div class="col-span-1 item-area">
        <vs-select v-if="!isPrint" class="w-full flex-1 p-1" autocomplete v-model="rows.type">
          <vs-select-item text="안전보건총괄책임자" value="안전보건총괄책임자" />
          <vs-select-item text="안전보건책임자" value="안전보건책임자" />
          <vs-select-item text="안전보건조정자" value="안전보건조정자" />
          <vs-select-item text="관리감독자" value="관리감독자" />
          <vs-select-item text="안전관리자" value="안전관리자" />
          <vs-select-item text="보건관리자" value="보건관리자" />
          <vs-select-item text="산업보건의" value="산업보건의" />
          <vs-select-item text="현장관리자" value="현장관리자" />
          <vs-select-item text="안전담당자" value="안전담당자" />
          <vs-select-item text="보건담당자" value="보건담당자" />
          <vs-select-item text="담당자" value="담당자" />
        </vs-select>
        <span v-else class="print-input">{{ rows.type }}</span>
      </div>
      <div class="col-span-1 item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.name" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.name }}</span>
      </div>
      <div class="col-span-1 item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.phone" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.phone }}</span>
      </div>
      <div class="col-span-1 item-area">
        <ml-textarea v-if="!isPrint" rows="4" v-model="rows.note" class="w-full flex-1 px-1 my-1" />
        <span v-else class="print-textarea">{{ rows.note }}</span>
      </div>

      <div class="col-span-1 item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.cycle" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.cycle }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableInspectionGroup",
  props: {
    title: String,
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value && value.length > 0) {
          this.targetList = value;
        }
      },
    },
  },
  methods: {
    // 항목추가
    handleAddRow() {
      this.targetList.push({
        is_checked: this.equipAllCheck,
        target: "",
        group: "",
        type: "",
        name: "",
        phone: "",
        note: "",
        cycle: "",
      });
      this.updateList();
    },
    // 선택삭제
    handleRemoveRow() {
      for (let i = 0; i < this.targetList.length; i++) {
        if (this.targetList[i].is_checked) {
          this.targetList.remove(this.targetList[i]);
          i = -1;
        }
      }

      this.equipAllCheck = false;
      this.updateList();
    },
    // 일괄 체크
    changeAllCheck() {
      for (const data of this.targetList) {
        data.is_checked = this.equipAllCheck;
      }
    },
    // update
    updateList() {
      this.$emit("updateList", this.targetList);
    },
  },
  data() {
    return {
      equipAllCheck: false,
      targetList: [],
    };
  },
  mounted() {
    // 컴포넌트가 초기화되면 기본적으로 1개의 항목을 추가한다.
    if (!this.isReadonly && !this.isPrint && this.targetList.length === 0) {
      this.handleAddRow();
    }
  }
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.label-text {
  width: 127px;
  font-weight: 500;
  font-size: 14px;
}
.mt-component-form {
  margin-top: 25px;
}
.vs-checkbox-default {
  margin: 0;
}
.ml-group-checkBox ~ .ml-group-checkBox {
  /*margin-left: 15px;*/
  margin: 0;
}

/* Table */
.row-header {
  background-color: $bg;
  text-align: center;

  &__checkbox-title {
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: $border;
    width: 100%;
  }
  &__checkboxs {
    display: flex;
    height: 50%;
    width: 100%;
    div {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    div:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }
}
.row-header__item {
  border-top: $border;
  border-bottom: $border;
  border-left: none;
  border-right: none;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-header__item.item-col {
  flex-direction: column;
}
.row-header__item:last-child {
  border-right: none;
}

.none-border-center {
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* row data */
.row-content {
  border-bottom: $border;
  &__title {
    background-color: $bg;
    height: 100%;
  }
  &__body {
  }
}
.row-content__body-item {
  .item-content {
    padding: 15px;
    border-left: $border;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
      white-space: pre-wrap;
    }
  }
  .item-box {
    border-left: $border;
    border-right: $border;
    display: flex;
    .item-box-check {
      flex: 1;
      justify-content: center !important;
    }
    .item-box-check:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }
  .item-area {
    padding: 5px;
    align-self: center;
  }
}
.row-content__body-item ~ .row-content__body-item {
  border-top: $border;
}
.vs-component.vs-con-textarea.vs-textarea-primary {
  margin: 0;
}
.row-content-none-data {
  height: 120px;
  border-bottom: $border;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
