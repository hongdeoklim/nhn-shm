<template>
  <div class="mt-component-form print-container">
    <vs-row  v-if="isShowTitle">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> {{title}}
        </h5>
      </vs-col>
    </vs-row>

    <!-- 테이블 헤더 -->
    <div v-if="isNote" class="mt-4 grid grid-cols-12 row-header">
      <div class="col-span-5 row-header__item">{{getHeaderTitle}}</div>
      <div class="col-span-1 row-header__item">{{getHeaderYes}}</div>
      <div class="col-span-1 row-header__item">{{getHeaderNo}}</div>
      <div class="col-span-1 row-header__item">{{getHeaderNa}}</div>
      <div class="col-span-4 row-header__item">{{getHeaderNote}}</div>
    </div>

    <div v-else class="mt-4 grid grid-cols-12 row-header">
      <div class="col-span-9 row-header__item">{{getHeaderTitle}}</div>
      <div class="col-span-1 row-header__item">{{getHeaderYes}}</div>
      <div class="col-span-1 row-header__item">{{getHeaderNo}}</div>
      <div class="col-span-1 row-header__item">{{getHeaderNa}}</div>
    </div>


    <!-- 테이블 본문 영역 -->
    <div class="grid grid-cols-12 row-content__body-item" v-for="(rows, indexRows) in list" :key="indexRows">
      <!-- title 속성이 지정된 경우, 표시한다 (중복될 경우 무시한다) -->
      <div v-if="rows.title && rows.title !== ''
            && (indexRows === 0 || list[indexRows].title !== list[indexRows - 1].title)"
           class="col-span-12 item-title">
        <b>{{rows.title}}</b>
      </div>

      <!-- 항목 이름  -->
      <div class="item-content" :class="isNote ? 'col-span-5' : 'col-span-9'">
        <span v-if="isNotDotInLabel" class="row-title-nodot" style="white-space:pre-line" v-text="rows.label"></span>
        <span v-else class="row-title" style="white-space:pre-line" v-text="rows.label"></span>
      </div>

      <!-- YES -->
      <div class="col-span-1 item-box">
        <template v-if="isPrint">
          <div class="item-box-check" v-if="rows.is_checked === 'Yes'" style="text-align: center;  align-self: center;">
            <vs-icon icon="check" size="small"  ></vs-icon>
          </div>
          <div v-else class="item-box-check">
          </div>
        </template>
        <vs-checkbox
          v-else
          class="item-box-check"
          :disabled="isReadonly"
          :checked="rows.is_checked === 'Yes'"
          @change="checkForm($event, rows.id, 'Yes')"
        ></vs-checkbox>
      </div>

      <!-- No -->
      <div class="col-span-1 item-box">
        <template v-if="isPrint">
          <div class="item-box-check" v-if="rows.is_checked === 'No'" style="text-align: center;  align-self: center;">
            <vs-icon icon="check" size="small"  ></vs-icon>
          </div>
          <div v-else class="item-box-check">
          </div>
        </template>
        <vs-checkbox
          v-else
          class="item-box-check"
          :disabled="isReadonly"
          :checked="rows.is_checked === 'No'"
          style="margin-right: 0"
          @change="checkForm($event, rows.id, 'No')"
        ></vs-checkbox>
      </div>

      <!-- N/A -->
      <div class="col-span-1 item-box">
        <template v-if="isPrint">
          <div class="item-box-check" v-if="rows.is_checked === 'N/A'" style="text-align: center;  align-self: center;">
            <vs-icon icon="check" size="small"  ></vs-icon>
          </div>
          <div v-else class="item-box-check">
          </div>
        </template>
        <vs-checkbox
          v-else
          class="item-box-check"
          :disabled="isReadonly"
          :checked="rows.is_checked === 'N/A'"
          @change="checkForm($event, rows.id, 'N/A')"
        ></vs-checkbox>
      </div>

      <!-- 비고 -->
      <div v-if="isNote" class="col-span-4 item-note border-right">
        <span v-if="isPrint" class="print-input"> {{rows.note}} </span>
        <ml-input v-else class="w-full flex-1" v-model="rows.note" @change="updateNote($event, rows.id, rows.note)"  :readonly="isReadonly"/>
      </div>
    </div>

    <!-- footer 지정된 경우, 표시한다 (중복될 경우 무시한다) -->
    <div v-if="footer && footer !== ''" class="row-header__item justify-start">
      <b class="ml-2">{{footer}}</b>
    </div>

  </div>


</template>

<script>
export default {
  name: 'TableInspect',
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    /**
     * 테이블 상단에 동그라미(●) 제목을 표시할지 여부
     */
    isShowTitle: Boolean,
    /**
     * 가장 오른쪽 열에 "비고" 칸을 표시할지 여부
     */
    isNote: Boolean,
    title: String,
    list: Array,
    tableHeaderTitle: String,
    tableHeaderYes: String,
    tableHeaderNo: String,
    tableHeaderNa: String,
    tableHeaderNote: String,
    footer: String,
    isNotDotInLabel: Boolean,
  },
  computed: {
    getHeaderTitle () {
      if (this.tableHeaderTitle) return this.tableHeaderTitle
      else return '점검내용'
    },
    getHeaderYes () {
      if (this.tableHeaderYes) return this.tableHeaderYes
      else return 'Yes'
    },
    getHeaderNo () {
      if (this.tableHeaderNo) return this.tableHeaderNo
      else return 'No'
    },
    getHeaderNa () {
      if (this.tableHeaderNa) return this.tableHeaderNa
      else return 'N/A'
    },
    getHeaderNote () {
      if (this.tableHeaderNote) return this.tableHeaderNote
      else return '비고'
    }
  },
  methods: {
    checkForm (value, indexRows, text) {
      if (value.target.checked) {
        this.$emit('update-list-check', indexRows - 1, text)
      } else {
        this.$emit('update-list-check', indexRows - 1, '')
      }
    },

    updateNote (value, indexRows, text) {
      this.$emit('update-note', indexRows - 1, text)
    }
  },
}
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
  margin-left: 15px;
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
  border: $border;
  //border-left: none;
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
  border-right: $border;
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
  border-left: $border;

  .item-title {
    padding: 10px;
    border-right: $border;
    border-bottom: $border;
  }

  .item-content {
    padding: 10px;
    align-self: center;
    color: #3c3c3c;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
      white-space: pre-wrap;
    }

    .row-title {
      font-weight: 500;
      display: inline-flex;
    }
    .row-title:before {
      content: "•";
      display: inline-block;
      width: 1em;
      margin-left: 1em;
    }

    .row-title-nodot {
      font-weight: 500;
      display: inline-flex;
    }
  }
  .item-box {
    border-left: $border;
    //border-right: $border;
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
  .item-box:last-child {
    border-right: $border;
  }
  .item-area {
    padding: 5px;
    align-self: center;
  }

  .item-note {
    padding: 5px;
    border-left: $border;
    height: 100%;
    display: inline-flex;
    align-items: center;
  }
}

.row-content__body-item:last-child {
  border-bottom: $border;
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

<style>
/*체크박스 중앙 정렬을 위함.. scope style 내에서는 적용이 안되서 외부로 뺐음*/
.row-content__body-item .item-box .vs-checkbox {
  margin-right: 0;
}
</style>
