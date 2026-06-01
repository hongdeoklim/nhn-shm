<template>
  <div class="mt-component-form">
    <vs-row class="my-4">
      <h5><i class="dot"></i>{{ title }}</h5>
    </vs-row>

    <div class="nhsafe-grid row-header">
      <div class="row-header__item">No.</div>
      <div class="row-header__item">소속명(부서명)</div>
      <div class="row-header__item">직책</div>
      <div class="row-header__item">업무</div>
      <div class="row-header__item">이름</div>
      <div class="row-header__item">연락처</div>
      <div class="row-header__item">임무 및 역할</div>
    </div>
    <!-- rows -->
    <div
      class="nhsafe-grid row-content"
      v-for="(rows, indexRows) in targetList"
      :key="indexRows"
    >
      <div class="no none-border-center">{{ rows.no }}</div>
      <div class="item-area">
        <ml-input
          v-if="!isPrint"
          rows="1"
          v-model="rows.target"
          class="w-full flex-1 p-1"
          :readonly="true"
          placeholder="입력"
        />
        <span v-else class="print-input">{{ rows.target }}</span>
      </div>

      <div v-if="customRow(indexRows)" class="item-area">
        <vs-select
          v-if="!isPrint"
          autocomplete
          class="w-full flex-1 p-1"
          v-model="rows.type">
          <vs-select-item
            v-for="(item, index) in typeOptions" :key="index"
            v-if="hideOption(item, indexRows)"
            :text="item.text"
            :value="item.value"/>
        </vs-select>
        <span v-else class="print-input">{{ rows.type }}</span>
      </div>

      <div v-else class="item-area">
        <ml-input
          v-if="!isPrint"
          rows="1"
          v-model="rows.type"
          class="w-full flex-1 p-1"
          :readonly="true"
        />
        <span v-else class="print-input">{{ rows.type }}</span>
      </div>

      <div class="item-area">
        <ml-input
          v-if="!isPrint"
          rows="1"
          v-model="rows.task"
          :readonly="customRow(indexRows)"
          class="w-full flex-1 p-1"
        />
        <span v-else class="print-input">{{ rows.task }}</span>
      </div>
      <div class="item-area">
        <ml-input
          v-if="!isPrint"
          rows="1"
          v-model="rows.name"
          class="w-full flex-1 p-1"
          :readonly="isReadonly || customRow(indexRows)"
          placeholder="입력"
        />
        <span v-else class="print-input">{{ rows.name }}</span>
      </div>
      <div class="item-area">
        <ml-input
          v-if="!isPrint"
          rows="1"
          v-model="rows.phone"
          class="w-full flex-1 p-1"
          :readonly="isReadonly || customRow(indexRows)"
          placeholder="입력"
        />
        <span v-else class="print-input">{{ rows.phone }}</span>
      </div>
      <div class="item-area">
        <ml-textarea
          v-if="!isPrint"
          rows="4"
          v-model="rows.note"
          class="w-full flex-1 px-1 my-1 resize-y"
          :readonly="isReadonly || customRow(indexRows)"
          spellcheck="false"
          placeholder="입력필드"
        />
        <span v-else class="print-textarea">{{ rows.note }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NhsafeOrganizationChart",
  props: {
    title: String,
    list: Array,
    positionList: Array,
    noteList: Object,
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
        type: "",
        task: "",
        name: "",
        phone: "",
        note: "",
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
    handlePositionChange(data) {
      const type = data.type;
      if (typeof this.noteList !== 'undefined' && typeof this.noteList[type] !== 'undefined') {
        data.note = this.noteList[type]
      }
    },

    customRow (indexRows) {
      return indexRows === 1 || indexRows === 2
    },

    hideOption (option, rowIndex) {
      if (option && option.value) {
        for (let i=0, target; i<this.targetList.length; i++) {
          if (this.customRow(i)) {
            target = this.targetList[i]

            if (target.type === option.value && i != rowIndex) {
              return false;
            }
          }
        }
      }
      return true;
    }
  },
  data() {
    return {
      equipAllCheck: false,
      targetList: [],

      typeOptions: [
        {text: '선택', value: ''},
        {text: '안전 및 보건에 관한 협의체', value: '안전 및 보건에 관한 협의체'},
        {text: '노사협의체', value: '노사협의체'},
        {text: '산업안전보건위원회', value: '산업안전보건위원회'}
      ],
    };
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;

.nhsafe-grid {
  display: grid;
  grid-template-columns: 60px repeat(6, 1fr);
}

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

  .no {
    background-color: $bg;
    border-right: 1px solid #cdcdcd;
  }
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
