<!-- 사업개요 -->
<!--163번 템플릿에서 사용됨-->
<template>
  <div>
    <vs-row class="my-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 현장 개요</h5>
      </vs-col>
    </vs-row>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">현장명</div>
        <span v-if="isPrint" class="print-input">{{ info.field_name }}</span>
        <ml-input
          v-else
          :readonly="true"
          :value="info.field_name"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사업금액</div>
        <span v-if="isPrint" class="print-input">{{ info.deposit_amount }}</span>
        <comma-input
          v-else
          :readonly="true"
          :value="info.deposit_amount"
          class="w-full flex-1"
        ></comma-input>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">계약번호</div>
        <span v-if="isPrint" class="print-input">{{ info.inputB_3 }}</span>
        <ml-input
          v-else
          :readonly="true"
          :value="info.inputB_3"
          class="w-full flex-1"
        />
      </div>
    </div>
    <!-- <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">구분</div>
        <span v-if="isPrint" class="print-input">{{ info.facility_category.cat1 }}</span>
        <ml-input
          v-else
          :readonly="true"
          :value="info.facility_category.cat1"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">종류</div>
        <span v-if="isPrint" class="print-input">{{ info.facility_category.cat2 }}</span>
        <ml-input
          v-else
          :readonly="true"
          :value="info.facility_category.cat2"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">세분류</div>
        <span v-if="isPrint" class="print-input">{{ info.facility_category.cat3 }}</span>
        <ml-input
          v-else
          :readonly="true"
          :value="info.facility_category.cat3"
          class="w-full flex-1"
        />
      </div>
    </div> -->
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">현장주소</div>
        <span v-if="isPrint" class="print-input">{{ info.address }}</span>
        <ml-input
          v-else
          :readonly="true"
          :value="info.address"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">착공일</div>
        <span v-if="isPrint" class="print-input">{{ info.start_work_at }}</span>
        <date-selector
          v-else
          class="w-full flex-1"
          v-model="info.start_work_at"
          :readonly="true"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">준공일</div>
        <span v-if="isPrint" class="print-input">{{ info.be_completed_at }}</span>
        <date-selector
          v-else
          class="w-full flex-1"
          v-model="info.be_completed_at"
          :readonly="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HttpRequest from '@/util/HttpRequest'
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'BusinessInfo',
  components: { DateSelector },
  props: {
    fieldId: Number,
    isPrint: Boolean,
  },

  data () {
    return {
      info: {
        field_name: '',
        deposit_amount: '',
        // facility_category: {
        //   cat1: '',
        //   cat2: '',
        //   cat3: '',
        // },
        address: '',
        start_work_at: '',
        be_completed_at: '',
      },
    }
  },
  watch: {
    fieldId: {
      immediate: true,
      deep: true,
      async handler (value) {
        if (value) {
          new Promise((resolve, reject) => {
            HttpRequest.get(`/api/v1/field/${value}`)
              .then((response) => {
                this.info = response
                this.$emit('update', this.info)
              })
              .catch((err) => reject(err))
          })
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
      this.equipmentList.push({
        is_checked: this.equipAllCheck,
        name: '',
        manufacturer: '',
        standard: '',
      })
      this.updateList()
    },
    // 선택삭제
    handleRemoveRow () {
      for (let i = 0; i < this.equipmentList.length; i++) {
        if (this.equipmentList[i].is_checked) {
          this.equipmentList.remove(this.equipmentList[i])
          i = -1
        }
      }

      this.equipAllCheck = false
      this.updateList()
    },
    // 일괄 체크
    changeAllCheck () {
      for (const data of this.equipmentList) {
        data.is_checked = this.equipAllCheck
      }
    },
    // update
    updateList () {
      this.$emit('updateList', this.equipmentList)
    },
  },
}
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$w-inpu0: 260px;
$w-inpu1: 220px;
$w-inpu2: 140px;
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-1 {
  background-color: #f9f9f9;
  border-bottom: $border;
}

.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 15px;
}

.text-box {
  line-height: 19px;
  margin-top: 15px;
  border: $border;
}

/* uploaded File */
.form-group {
  border: $border;
  overflow: auto;
  width: 100%;
  /*overflow-x: auto;*/

  &__header {
    height: 80px;
    width: 100%;
    display: flex;

    &-title {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title.title-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }
  }

  &__content {
    width: 100%;
    display: flex;

    &-row {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      padding: 7px;
    }

    &-row.row-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }

    &-row.row-w2 {
      min-width: $w-inpu1;
    }
  }
}

.row-w1 {
  min-width: $w-inpu1;
}

.row-w0 {
  min-width: $w-inpu0;
}

.bx {
  border-left: $border;
  border-right: $border;
}

.br {
  border-right: $border;
}

.bb {
  border-bottom: $border;
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
