<template>
  <div class="mt-component-form">
    <vs-row class="my-4">
      <h5 v-if="title" style="align-self: center"><i class="dot"></i>{{title}}</h5>
      <div class="ml-auto">
        <vs-button
          v-if="!isPrint && !isReadonly"
          class=""
          color="secondary"
          type="border"
          @click="handleAddRow">항목추가</vs-button>
        <vs-button
          v-if="!isPrint && !isReadonly"
          class="ml-4"
          color="secondary"
          @click="handleRemoveRow">선택삭제</vs-button>
      </div>
    </vs-row>

    <div
      class="grid row-header border-left border-right"
      :style="isPrint || isReadonly ? 'grid-template-columns: 1fr 50px 50px 80px'
       : 'grid-template-columns: 50px 1fr 50px 50px 80px'"
    >
      <div v-if="!isPrint && !isReadonly" class="row-header__item">
        <vs-checkbox
          v-model="etcAllCheck"
          @change="changeAllCheck"
        ></vs-checkbox>
      </div>
      <div class="row-header__item">{{getHeaderTitle}}</div>
      <div class="row-header__item border-left">{{getHeaderYes}}</div>
      <div class="row-header__item border-left">{{getHeaderNo}}</div>
      <div class="row-header__item border-left">{{getHeaderNa}}</div>
    </div>
    <!-- rows -->
    <div
      class="grid row-content border-left border-right"
      :style="isPrint || isReadonly ? 'grid-template-columns: 1fr 50px 50px 80px'
       : 'grid-template-columns: 50px 1fr 50px 50px 80px'"
      v-for="(rows, indexRows) in etcList"
      :key="indexRows"
    >
      <div v-if="!isPrint && !isReadonly" class="none-border-center">
        <vs-checkbox v-model="rows.is_checked"></vs-checkbox>
      </div>
      <div class="item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.note"
                  class="w-full flex-1 p-1" :readonly="isReadonly"
                  @change="updateNote($event, indexRows, rows.note)"/>
        <span v-else class="print-input">{{ rows.note }}</span>
      </div>

      <!-- YES -->
      <div class="item-area center-flex border-left">
        <template v-if="isPrint">
          <div class="item-box-check" v-if="rows.checked === 'Yes'" style="text-align: center;  align-self: center;">
            <vs-icon icon="check" size="small"  ></vs-icon>
          </div>
          <div v-else class="item-box-check">
          </div>
        </template>
        <vs-checkbox
          v-else
          class="item-box-check"
          :disabled="isReadonly"
          :checked="rows.checked === 'Yes'"
          @change="checkForm($event, indexRows, 'Yes')"
        ></vs-checkbox>
      </div>

      <!-- No -->
      <div class="item-area center-flex border-left">
        <template v-if="isPrint">
          <div class="item-box-check" v-if="rows.checked === 'No'" style="text-align: center;  align-self: center;">
            <vs-icon icon="check" size="small"  ></vs-icon>
          </div>
          <div v-else class="item-box-check">
          </div>
        </template>
        <vs-checkbox
          v-else
          class="item-box-check"
          :disabled="isReadonly"
          :checked="rows.checked === 'No'"
          style="margin-right: 0"
          @change="checkForm($event, indexRows, 'No')"
        ></vs-checkbox>
      </div>

      <!-- N/A -->
      <div class="item-area center-flex border-left">
        <template v-if="isPrint">
          <div class="item-box-check" v-if="rows.checked === 'N/A'" style="text-align: center;  align-self: center;">
            <vs-icon icon="check" size="small"  ></vs-icon>
          </div>
          <div v-else class="item-box-check">
          </div>
        </template>
        <vs-checkbox
          v-else
          class="item-box-check"
          :disabled="isReadonly"
          :checked="rows.checked === 'N/A'"
          @change="checkForm($event, indexRows, 'N/A')"
        ></vs-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableEtcCheck',
  props: {
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
    title: String,
    tableHeaderTitle: String,
    tableHeaderYes: String,
    tableHeaderNo: String,
    tableHeaderNa: String,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler (value) {
        if (value && value.length > 0) {
          this.etcList = value
        }
      },
    },
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
  },
  methods: {
    checkForm (value, indexRows, text) {
      if (value.target.checked) {
        this.$emit('update-list-check', indexRows, text)
      } else {
        this.$emit('update-list-check', indexRows, '')
      }
    },
    // 항목추가
    handleAddRow () {
      this.etcList.push({
        is_checked: this.etcAllCheck,
        note: '',
        checked: '',
      })
      this.updateList()
    },
    // 선택삭제
    handleRemoveRow () {
      for (let i = 0; i < this.etcList.length; i++) {
        if (this.etcList[i].is_checked) {
          this.etcList.remove(this.etcList[i])
          i = -1
        }
      }

      this.etcAllCheck = false
      this.updateList()
    },
    // 일괄 체크
    changeAllCheck () {
      for (const data of this.etcList) {
        data.is_checked = this.etcAllCheck
      }
    },
    // update
    updateList () {
      this.$emit('updateList', this.etcList)
    },
    updateNote (value, indexRows, text) {
      this.$emit('update-note', indexRows - 1, text)
    }
  },
  data () {
    return {
      etcAllCheck: false,
      etcList: [],
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
