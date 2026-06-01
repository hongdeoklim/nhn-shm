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
    <div class="mt-4 grid row-header"
         :style="isNormal?
           'grid-template-columns: 1fr 50px 50px 50px 80px'
           : 'grid-template-columns: 1fr 50px 50px 80px'">
      <div class="row-header__item">{{getHeaderTitle}}</div>
      <div class="row-header__item">{{getHeaderYes}}</div>
      <div v-if="isNormal" class="row-header__item">{{getHeaderNormal}}</div>
      <div class="row-header__item">{{getHeaderNo}}</div>
      <div class="row-header__item">{{getHeaderNa}}</div>
    </div>


    <!-- 테이블 본문 영역 -->
<!--    뉴타입-->
    <div v-if="isCheckType">
      <div class="grid row-content__body-item"
           v-for="(rows, indexRows) in list" :key="'list'+indexRows"
           :style="'grid-template-columns: 1fr 50px 50px 80px'">

        <div class="grid grid-cols-3">
          <!-- title 속성이 지정된 경우, 표시한다 (중복될 경우 무시한다) -->
          <div v-if="rows.title && rows.title !== ''
            && (indexRows === 0 || list[indexRows].title !== list[indexRows - 1].title)"
               class="item-content col-span-1">
            <span>{{rows.title}}</span>
          </div>

          <!-- 항목 이름  -->
          <div :class="rows.title ? 'col-span-1, border-left' : 'col-span-2'"
               :style="rows.title ? 'display:grid; grid-template-columns: 1fr 1fr':'display:flex'">
            <div v-for="(checkRows, checkRowsIndex) in rows.checkList"
                 :key="'checklist'+checkRowsIndex" class="flex"
                 style="padding-top: 3px; padding-bottom: 3px; padding-left: 10px; padding-right: 10px;">
              <vs-checkbox
                class="item-box-check "
                :disabled="isReadonly"
                v-model="checkRows.check"
              ></vs-checkbox>
              <div>
                {{checkRows.label}}
              </div>
            </div>
          </div>

          <div class="col-span-1 item-note">
            <span> {{rows.note}} </span>
          </div>
        </div>

        <!-- YES -->
        <div class="item-box">
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
      </div>
    </div>

<!--    기존-->
    <div v-else>
      <div  class="grid row-content__body-item"
            v-for="(rows, indexRows) in list" :key="'list'+indexRows"
            :style="isNormal?
           'grid-template-columns: 1fr 50px 50px 50px 80px'
           : 'grid-template-columns: 1fr 50px 50px 80px'">
        <!-- title 속성이 지정된 경우, 표시한다 (중복될 경우 무시한다) -->
        <div v-if="rows.title && rows.title !== ''
            && (indexRows === 0 || list[indexRows].title !== list[indexRows - 1].title)"
             class="col-span-12 item-title">
          <b>{{rows.title}}</b>
        </div>

        <!-- 항목 이름  -->
        <div class="item-content">
          <span v-if="isNotDotInLabel" class="row-title-nodot" style="white-space:pre-line" v-text="rows.label"></span>
          <span v-else class="row-title" style="white-space:pre-line" v-text="rows.label"></span>
        </div>

        <!-- YES -->
        <div class="item-box">
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

        <!--      normal-->
        <div v-if="isNormal" class="item-box">
          <template v-if="isPrint">
            <div class="item-box-check" v-if="rows.is_checked === 'Normal'" style="text-align: center;  align-self: center;">
              <vs-icon icon="check" size="small"  ></vs-icon>
            </div>
            <div v-else class="item-box-check">
            </div>
          </template>
          <vs-checkbox
            v-else
            class="item-box-check"
            :disabled="isReadonly"
            :checked="rows.is_checked === 'Normal'"
            @change="checkForm($event, rows.id, 'Normal')"
          ></vs-checkbox>
        </div>

        <!-- No -->
        <div class="col-span-1 item-box">
          <template v-if="isPrint">
            <div class="item-box-check" v-if="rows.is_checked === 'No'" style="text-align: center;  align-self: center;">
              <vs-icon icon="check" size="small"></vs-icon>
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
  name: 'TableInspectEp',
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
    isNormal: Boolean,
    title: String,
    list: Array,
    tableHeaderTitle: String,
    tableHeaderYes: String,
    tableHeaderNo: String,
    tableHeaderNormal: String,
    tableHeaderNa: String,
    footer: String,
    isNotDotInLabel: Boolean,

    // 신규 타입
    isCheckType:  {
      type: Boolean,
      default: false,
    }
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
    getHeaderNormal () {
      if (this.tableHeaderNormal) return this.tableHeaderNormal
      else return '보통'
    },
    getHeaderNa () {
      if (this.tableHeaderNa) return this.tableHeaderNa
      else return 'N/A'
    },
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
