<template>
  <div class="mt-component-form print-container">
    <vs-row class="my-4 center-flex">
      <h5><i class="dot"></i>{{title}}</h5>
      <div class="ml-auto">
        <vs-button
          v-if="!isPrint"
          class=""
          color="secondary"
          type="border"
          @click="handleRemoveRow">선택삭제</vs-button>
        <vs-button
          v-if="!isPrint"
          class="ml-4"
          color="secondary"
          @click="handleAddRow">항목추가</vs-button>
      </div>
    </vs-row>

<!--    head-->
    <div class="grid row-header" :style="!isPrint?
           'grid-template-columns: 50px 1fr 1fr 3fr 1fr'
           : 'grid-template-columns: 1fr 1fr 3fr 1fr'">

      <div v-if="!isPrint" class="row-header__item">
        <vs-checkbox
          v-model="tableAllCheck"
          @change="changeAllCheck"
        ></vs-checkbox>
      </div>
      <div class="row-header__item">{{colTitle_1}}</div>
      <div class="row-header__item">{{colTitle_2}}</div>
      <div class="row-header__item">{{colTitle_3}}</div>
      <div class="row-header__item">{{colTitle_4}}</div>
    </div>

    <!-- rows -->
    <div
      class="grid row-content"
      :style="!isPrint?
           'grid-template-columns: 50px 1fr 1fr 3fr 1fr'
           : 'grid-template-columns: 1fr 1fr 3fr 1fr'"
      v-for="(rows, indexRows) in tableList"
      :key="indexRows"
    >
      <div v-if="!isPrint" class="none-border-center">
        <vs-checkbox v-model="rows.is_checked"></vs-checkbox>
      </div>
      <div class="item-area p-1">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.col1" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.col1 }}</span>
      </div>
      <div class="item-area p-1">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.col2" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.col2 }}</span>
      </div>
      <div class="item-area p-1" style="align-self: center;">
        <div v-if="!isPrint" class="flex-1 flex items-center">
          <date-selector
            class="w-full flex-1"
            v-model="rows.start"
          />
          <p class="px-2">~</p>
          <date-selector
            class="w-full flex-1"
            v-model="rows.end"
          />
        </div>
        <span v-else class="print-input">{{ `${rows.start} ~ ${rows.end}` }}</span>

      </div>
      <div class="item-area p-1">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.col3" class="w-full flex-1 p-1"/>
        <span v-else class="print-input">{{ rows.col3 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DateSelector from './selector/DateSelector'
export default {
  name: 'TableDuration',
  components: {DateSelector},
  props: {
    title: String,
    colTitle_1: String,
    colTitle_2: String,
    colTitle_3: String,
    colTitle_4: String,
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler (value) {
        if (value && value.length > 0) {
          this.tableList = value
        }
      },
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
    // 항목추가
    handleAddRow () {
      this.tableList.push({
        is_checked: this.tableAllCheck,
        col1: '',
        col2: '',
        col3: '',
        start: '',
        end: '',
      })
      this.updateList()
    },
    // 선택삭제
    handleRemoveRow () {
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].is_checked) {
          this.tableList.remove(this.tableList[i])
          i = -1
        }
      }

      this.tableAllCheck = false
      this.updateList()
    },
    // 일괄 체크
    changeAllCheck () {
      for (const data of this.tableList) {
        data.is_checked = this.tableAllCheck
      }
    },
    // update
    updateList () {
      this.$emit('updateList', this.tableList)
    },
  },
  data () {
    return {
      tableAllCheck: false,
      tableList: [],
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
