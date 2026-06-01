<template>
  <div class="mt-component-form">
    <vs-row class="my-4 center-flex">
      <h5><i class="dot"></i>{{ getTableTitle }}</h5>
      <div class="ml-auto">
        <vs-button
          v-if="!isPrint && !isReadonly"
          class=""
          color="secondary"
          type="border"
          @click="handleAddRow"
        >항목추가
        </vs-button
        >
        <vs-button
          v-if="!isPrint && !isReadonly"
          class="ml-4"
          color="secondary"
          @click="handleRemoveRow"
        >선택삭제
        </vs-button
        >
      </div>
    </vs-row>

    <div class="form-group grid">
      <div class="overflow-x-auto">
        <!--        header-->
        <div class="row-header"
             style="display: grid;"
             :style="{gridTemplateColumns:isPrint || isReadonly?'repeat(6, 1fr)':'40px repeat(6, 1fr)'}" >
          <div v-if="!isPrint && !isReadonly" class="row-header__item row-color-content">
            <vs-checkbox
              @change="handleCheckAll"
              v-model="allCheck"
            ></vs-checkbox>
          </div>
          <div class="row-header__item">업체명</div>
          <div class="row-header__item">주요 위험요인</div>
          <div class="row-header__item">재해형태</div>
          <div class="row-header__item">개선대책</div>
          <div class="row-header__item">개선일정</div>
          <div class="row-header__item">개선책임자</div>
        </div>

        <!--        rows-->
        <div
          class="row-content"
          style="display: grid; "
          :style="{gridTemplateColumns:isPrint || isReadonly?'repeat(6, 1fr)':'40px repeat(6, 1fr)'}"
          v-for="(row, indexRows) in list"
          :key="indexRows"
        >

          <div v-if="!isPrint && !isReadonly" class="none-border-center row-color-content">
            <vs-checkbox v-model="row.is_checked" :readonly="isReadonly"></vs-checkbox>
          </div>

          <div class="p-2">
            <span v-if="isPrint" class="print-input"> {{ row.input_1 }} </span>
            <CompanySelector
              v-else
              :readonly="isReadonly"
              class="w-full flex-1"
              v-model="row.input_1"
              placeholder="선택"
            ></CompanySelector>
          </div>

          <div class="p-2">
            <p v-if="isPrint" class="print-textarea">
              {{ row.input_2 }}
            </p>
            <ml-textarea
              class="m-0"
              :readonly="isReadonly"
              v-else

              rows="3"
              v-model="row.input_2"
            />
          </div>

          <div class="p-2">
            <p v-if="isPrint" class="print-input">
              {{ row.input_3 }}
            </p>
            <disaster-class-selector
              v-else
              class="w-full"
              :readonly="isReadonly"
              v-model="row.input_3"
            />
          </div>

          <div class="p-2">
            <p v-if="isPrint" class="print-textarea">
              {{ row.input_4 }}
            </p>
            <ml-textarea
              class="m-0"
              :readonly="isReadonly"
              v-else

              rows="3"
              v-model="row.input_4"
            />
          </div>

          <div class="p-2">
            <date-selector v-model="row.input_5" :readonly="isReadonly || isPrint"/>
          </div>

          <div class="flex-1 p-2">
            <p v-if="isPrint" class="print-input">
              {{ row.input_6 }}
            </p>
            <ml-input
              v-else
              :readonly="isReadonly"
              class="w-full"
              v-model="row.input_6"
            />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import DisasterClassSelector from '@/components/selector/DisasterClassSelector'
import DateSelector from '@/components/selector/DateSelector'
import CompanySelector from '@/components/selector/CompanySelector'
export default {
  name: 'TableRiskFactor',
  components: {
    CompanySelector,
    DateSelector,
    DisasterClassSelector},
  props: {
    tableTitle: String,
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler (value) {
        this.riskList = value
      }
    },

  },
  computed: {
    getTableTitle () {
      if (this.tableTitle) return this.tableTitle
      return '주요 위험요인'
    },
  },
  methods: {
    // 항목추가
    handleAddRow () {
      this.riskList.push({
        is_checked: this.allCheck,
        input_1: '',
        input_2: '',
        input_3: '',
        input_4: '',
        input_5: '',
        input_6: '',
      })
      this.updateList()
    },
    // 선택삭제
    handleRemoveRow () {
      for (let i = 0; i < this.riskList.length; i++) {
        if (this.riskList[i].is_checked) {
          this.riskList.remove(this.riskList[i])
          i = -1
        }
      }

      this.allCheck = false
      this.updateList()
    },
    // 전체 선택
    handleCheckAll (e) {
      const checked = e.target.checked
      this.riskList.forEach(e => {
        e.is_checked = checked
      })
    },
    // update
    updateList () {
      this.$emit('updateList', this.riskList)
    },
  },
  data () {
    return {
      showInfoPopup: false,
      allCheck: false,
      riskList: [],
    }
  }
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

.row-color-content {
  background-color: $bg;
  border-right: $border;
}
</style>
