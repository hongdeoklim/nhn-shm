<template>
  <div class="print-container">
    <vs-row v-if="isShowTitle" class="mt-component-form mb-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> {{title}}
        </h5>
      </vs-col>
    </vs-row>

    <div class="pc hidden xl:block">
      <div v-for="(tableRow, indexTableRow) in list"
           class="table_content" :key="indexTableRow">
        <!-- 테이블 헤더 -->
        <div class="grid row-header"
             :style="
           isNote?
           tableRow.isTypeMode?
           'grid-template-columns: 50px auto 82px 82px 82px 380px'
           : 'grid-template-columns: auto 82px 82px 82px 380px'  :
           tableRow.isTypeMode?
           'grid-template-columns: 50px auto 82px 82px 82px'
           : 'grid-template-columns: auto 82px 82px 82px'">
          <div v-if="tableRow.isTypeMode" class="row-header__item">{{getHeaderType(tableRow)}}</div>
          <div class="row-header__item">{{getHeaderTitle(tableRow)}}</div>
          <div class="row-header__item">{{getHeaderYes(tableRow)}}</div>
          <div class="row-header__item">{{getHeaderNo(tableRow)}}</div>
          <div class="row-header__item">{{getHeaderNa(tableRow)}}</div>
          <div v-if="isNote" class="row-header__item">{{getHeaderNote(tableRow)}}</div>
        </div>

        <!-- 테이블 본문 영역 -->
        <div class="grid row-content__body-item" style="border-bottom: none;"
             :style="
           isNote?
           tableRow.isTypeMode?
           'grid-template-columns: 50px auto 82px 82px 82px 380px'
           : 'grid-template-columns: auto 82px 82px 82px 380px'  :
           tableRow.isTypeMode?
           'grid-template-columns: 50px auto 82px 82px 82px'
           : 'grid-template-columns: auto 82px 82px 82px'"
             v-for="(rows, indexRows) in tableRow.list" :key="indexRows">
          <!-- title 속성이 지정된 경우, 표시한다 (중복될 경우 무시한다) -->
          <div v-if="rows.title && rows.title !== ''
            && (indexRows === 0 || tableRow.list[indexRows].title !== tableRow.list[indexRows - 1].title)"
               class="col-span-12 item-title">
            <b>{{rows.title}}</b>
          </div>

          <!-- 항목 구분  -->
          <div v-if="tableRow.isTypeMode" class="item-type">
            <span class="row-title" style="white-space:pre-line" v-text="rows.type"></span>
          </div>

          <!-- 항목 이름  -->
          <div v-if="!tableRow.isInputMode" class="item-content">
            <span class="row-title" style="white-space:pre-line" v-text="rows.label"></span>
          </div>
          <div v-else class="item-content grid" :style="'grid-template-columns: 100px 1fr; align-items:center'">
            <span class="row-title" style="white-space:pre-line" v-text="rows.label"></span>
            <span v-if="isPrint" class="w-full flex-1">{{rows.labelContent}}</span>
            <ml-input
              v-else
              :readonly="isPrint"
              class="w-full flex-1"
              v-model="rows.labelContent"/>
          </div>

          <!-- YES -->
          <div class="item-box">
            <template v-if="isPrint">
              <div class="item-box-check" v-if="rows.is_checked === 'Yes'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="medium"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :readonly="isReadonly"
              :checked="rows.is_checked === 'Yes'"
              @change="checkForm($event, indexTableRow, indexRows, 'Yes')"
            ></vs-checkbox>
          </div>

          <!-- No -->
          <div class="item-box">
            <template v-if="isPrint">
              <div class="item-box-check" v-if="rows.is_checked === 'No'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="medium"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :readonly="isReadonly"
              :checked="rows.is_checked === 'No'"
              style="margin-right: 0"
              @change="checkForm($event, indexTableRow, indexRows, 'No')"
            ></vs-checkbox>
          </div>

          <!-- N/A -->
          <div class="item-box">
            <template v-if="isPrint">
              <div class="item-box-check" v-if="rows.is_checked === 'N/A'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="medium"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :readonly="isReadonly"
              :checked="rows.is_checked === 'N/A'"
              @change="checkForm($event, indexTableRow, indexRows, 'N/A')"
            ></vs-checkbox>
          </div>

          <div class="item-box item-content">
            <span v-if="isPrint" class="w-full flex-1">{{rows.note}}</span>
            <ml-input
              v-else
              :readonly="isPrint"
              class="w-full flex-1"
              v-model="rows.note"
              placeholder="비고(보완계획)"
            />
          </div>

        </div>

      </div>
    </div>

    <div class="mobile block xl:hidden">
      <div v-for="(tableRow, indexTableRow) in list" class="border-left border-right" :class="indexTableRow === 0 ? 'border-top' : ''">
        <h5 class="border-bottom" style="line-height: 3; text-align: center;">{{tableRow.headerTitle}}</h5>
        <div v-for="(rows, indexRows) in tableRow.list" class="text-left p-3 border-bottom grid gap-3">
          <p>{{ rows.type}}. {{ rows.label }}</p>
          <div class="checkbox-list">
            <label class="checkbox cursor-pointer" :class="rows.is_checked === 'Yes' ? 'active' : ''">
              작성
              <vs-checkbox
                class="item-box-check hidden"
                :readonly="isReadonly"
                :checked="rows.is_checked === 'Yes'"
                @change="checkForm($event, indexTableRow, indexRows, 'Yes')"
              ></vs-checkbox>
            </label>
            <label class="checkbox cursor-pointer" :class="rows.is_checked === 'No' ? 'active' : ''">
              미작성
              <vs-checkbox
                class="item-box-check hidden"
                :readonly="isReadonly"
                :checked="rows.is_checked === 'No'"
                @change="checkForm($event, indexTableRow, indexRows, 'No')"
              ></vs-checkbox>
            </label>
            <label class="checkbox cursor-pointer" :class="rows.is_checked === 'N/A' ? 'active' : ''">
              N/A
              <vs-checkbox
                class="item-box-check hidden"
                :readonly="isReadonly"
                :checked="rows.is_checked === 'N/A'"
                @change="checkForm($event, indexTableRow, indexRows, 'N/A')"
              ></vs-checkbox>
            </label>
          </div>
          <ml-input
            :readonly="isPrint"
            class="w-full flex-1"
            v-model="rows.note"
            placeholder="비고(보완계획)"
          />
        </div>
      </div>
    </div>
  </div>


</template>

<script>
export default {
  name: 'TableInspectDivision',
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    /**
     * 테이블 상단에 동그라미(●) 제목을 표시할지 여부
     */
    isShowTitle: Boolean,
    title: String,
    list: Array,
    footer: String,
    headerNA: {
      type: String,
      default: 'N/A'
    },
    headerNote: {
      type: String,
      default: "비고(보완계획)",
    },
    isNote: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getHeaderType (row) {
      if (row.headerTypeTitle) return row.headerTypeTitle
      else return '구분'
    },
    getHeaderTitle (row) {
      if (row.headerTitle) return row.headerTitle
      else return '점검내용'
    },
    getHeaderYes (row) {
      if (row.headerYesTitle) return row.headerYesTitle
      else return 'Yes'
    },
    getHeaderNo (row) {
      if (row.headerNoTitle) return row.headerNoTitle
      else return 'No'
    },
    getHeaderNa (row) {
      if (row.headerNATitle) return row.headerNATitle
      else return this.headerNA
    },
    getHeaderNote (row) {
      if (row.headerNoteTitle) return row.headerNoteTitle
      else return this.headerNote
    },

    checkForm (value, indexTableRow, indexRows, text) {
      if (value.target.checked) {
        this.$emit('update-list-check', indexTableRow, indexRows, text)
      } else {
        this.$emit('update-list-check', indexTableRow, indexRows, '')
      }
    },

    updateNotePre (value, indexRows, text) {
      this.$emit('update-note-pre', indexRows - 1, text)
    },
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
  margin-top: 15px;
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
.table_content {
  border-bottom: none;
}
.table_content:last-child {
  border-bottom: $border;
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

  .item-type {
    padding: 10px;
    align-self: center;
    color: #3c3c3c;
    border-right: $border;
    text-align: center;
    height: 100%;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
      white-space: pre-wrap;
    }

    .row-title {
      font-weight: 500;
      display: inline-flex;
    }
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

.checkbox-list {
  display: flex;
  .checkbox {
    flex: 1 0 auto;

    text-align: center;
    line-height: 3;
    background-color: #ffffff;
    color: #2C2C2C;
    border-top: 1px solid #cdcdcd;
    border-bottom: 1px solid #cdcdcd;

    &.active {
      background-color: #6670CB;
      color: white;
    }

    &:first-child {
      border-radius: 8px 0 0 8px;
      border-left: 1px solid #cdcdcd;
      border-right: 1px solid #cdcdcd;
    }

    &:last-child {
      border-radius: 0 8px 8px 0;
      border-left: 1px solid #cdcdcd;
      border-right: 1px solid #cdcdcd;
    }
  }
}

</style>

<style>
/*체크박스 중앙 정렬을 위함.. scope style 내에서는 적용이 안되서 외부로 뺐음*/
.row-content__body-item .item-box .vs-checkbox {
  margin-right: 0;
}
</style>
