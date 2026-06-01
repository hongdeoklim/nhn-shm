<template>
  <div class="mt-component-form">
    <vs-row class="my-4 ">
      <h5 style="align-self: center"><i class="dot"></i>점검 대상 단위현장</h5>
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
      class="grid row-header"
      style="grid-template-columns: auto 1fr 1fr 1fr 1fr"
    >
      <div>
        <div v-if="!isPrint && !isReadonly" style="width: 80px;" class="row-header__item">
          <vs-checkbox
            v-model="equipAllCheck"
            @change="changeAllCheck"
          ></vs-checkbox>
        </div>
      </div>
      <div class="row-header__item">단위현장명</div>
      <div class="row-header__item">담당자</div>
      <div class="row-header__item">연락처</div>
      <div class="row-header__item">비고</div>
    </div>
    <!-- rows -->
    <div
      class="grid row-content"
      style="grid-template-columns: auto 1fr 1fr 1fr 1fr"
      v-for="(rows, indexRows) in pobList"
      :key="indexRows"x
    >
      <div>
        <div v-if="!isPrint && !isReadonly" style="width: 80px;" class=" none-border-center">
          <vs-checkbox v-model="rows.is_checked"></vs-checkbox>
        </div>
      </div>
      <div class=" item-area">
        <field-selector v-if="!isPrint" rows="1" v-model="rows.data1" class="w-full flex-1 p-1" :readonly="isReadonly"/>
        <span v-else class="print-input">{{ rows.data1 }}</span>
      </div>
      <div class=" item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.data2" class="w-full flex-1 p-1" :readonly="isReadonly"/>
        <span v-else class="print-input">{{ rows.data2 }}</span>
      </div>
      <div class=" item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.data3" class="w-full flex-1 p-1" :readonly="isReadonly"/>
        <span v-else class="print-input">{{ rows.data3 }}</span>
      </div>
      <div class=" item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.data4" class="w-full flex-1 p-1" :readonly="isReadonly"/>
        <span v-else class="print-input">{{ rows.data4 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import FieldSelector from '@/components/selector/FieldSelector'
export default {
  name: 'TablePlaceOfBusiness',
  components: {FieldSelector},
  props: {
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
          this.pobList = value
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
      this.pobList.push({
        is_checked: this.equipAllCheck,
        data1: '',
        data2: '',
        data3: '',
        data4: '',
      })
      this.updateList()
    },
    // 선택삭제
    handleRemoveRow () {
      for (let i = 0; i < this.pobList.length; i++) {
        if (this.pobList[i].is_checked) {
          this.pobList.remove(this.pobList[i])
          i = -1
        }
      }

      this.equipAllCheck = false
      this.updateList()
    },
    // 일괄 체크
    changeAllCheck () {
      for (const data of this.pobList) {
        data.is_checked = this.equipAllCheck
      }
    },
    // update
    updateList () {
      this.$emit('updateList', this.pobList)
    },
  },
  data () {
    return {
      equipAllCheck: false,
      pobList: [],
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
