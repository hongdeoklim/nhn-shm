<template>
  <div ref="monthPicker" id="monthPicker" class="relative z-50">
    <slot :inputValue="inputValue" :year="valueYear" :month="valueMonth" :onClick="openMonthPicker"></slot>
    <div v-if="isOpen" class="absolute left-0 w-full max-w-xs" style="bottom: -10px; transform: translate(0, 100%)">
      <span class="caret"></span>
      <div class="month-container">
        <!-- 년 -->
        <div class="year flex items-center py-2 mb-2">
          <feather-icon class="w-5 h-5 cursor-pointer" icon="ChevronLeftIcon" @click="prevYear" :style="{ color: isMin ? '#cbd5e0' : '' }" />
          <p class="flex-1 text-center">{{ inputYear }}</p>
          <feather-icon class="w-5 h-5 cursor-pointer" icon="ChevronRightIcon" @click="nextYear" :style="{ color: isMax ? '#cbd5e0' : '' }" />
        </div>
        <!-- 월 -->
        <div class="month grid grid-cols-3 gap-y-1 gap-x-2">
          <button
            type="button"
            v-for="_mon in month"
            :key="`month_${_mon}`"
            :class="[valueYear === `${inputYear}` && valueMonth === `${_mon}` ? 'active' : '', minDisableMonth.includes(_mon) || maxDisableMonth.includes(_mon) || disableYM.includes(`${inputYear}-${_mon}`) ? 'disabled' : '']"
            @click="!minDisableMonth.includes(_mon) && !maxDisableMonth.includes(_mon) && !disableYM.includes(`${inputYear}-${_mon}`) && clickMonth(_mon)"
          >
            {{ _mon }}월
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  props: {
    value: String,
    placeholder: String,
    readonly: Boolean,
    minDate: String,
    maxDate: String,
    disableYM: {
      type: Array,
      default: () => [],
      // ['2022-5','2022-7','2022-11']
    },
  },
  computed: {
    valueYear() {
      return !!this.inputValue ? moment(this.inputValue).format("YYYY") : "";
    },
    valueMonth() {
      return !!this.inputValue ? moment(this.inputValue).format("M") : "";
    },
    isMin() {
      return !!this.minDate && Number(this.inputYear) <= Number(moment(this.minDate).format("YYYY"));
    },
    minDisableMonth() {
      if (this.isMin) {
        const month = [];
        for (let index = Number(moment(this.minDate).format("MM")) - 1; 0 < index; index--) {
          month.push(index);
        }
        return month;
      } else return [];
    },
    isMax() {
      return !!this.maxDate && Number(moment(this.maxDate).format("YYYY")) <= Number(this.inputYear);
    },
    maxDisableMonth() {
      if (this.isMax) {
        const month = [];
        for (let index = Number(moment(this.maxDate).format("MM")) + 1; index <= 12; index++) {
          month.push(index);
        }
        return month;
      } else return [];
    },
  },
  watch: {
    value: {
      handler(value) {
        this.inputValue = value;
        this.inputYear = moment(!!this.value ? this.value : new Date()).format("YYYY");
      },
    },
    inputValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
    isOpen() {
      if (this.isOpen) {
        window.addEventListener("click", this.otherClickCheck);
      } else {
        window.removeEventListener("click", this.otherClickCheck);
      }
    },
  },
  data() {
    return {
      isOpen: false,
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

      inputValue: this.value,
      inputYear: moment(!!this.value ? this.value : new Date()).format("YYYY"),
    };
  },
  beforeDestroy() {
    if (this.isOpen) window.removeEventListener("click", this.otherClickCheck);
  },
  methods: {
    otherClickCheck(e) {
      let target = e.target;
      let isOther = false;

      while (target) {
        if (target.id === "monthPicker") isOther = true;
        target = target.parentNode;
      }

      //   결과 창 닫기
      if (!isOther) this.isOpen = false;
    },
    openMonthPicker() {
      if (this.readonly) return;
      this.isOpen = !this.isOpen;
    },
    // == Year ==
    prevYear() {
      if (!!this.minDate) {
        if (Number(moment(this.minDate).format("YYYY")) < Number(this.inputYear)) --this.inputYear;
      } else {
        --this.inputYear;
      }
    },
    nextYear() {
      if (!!this.maxDate) {
        if (Number(this.inputYear) < Number(moment(this.maxDate).format("YYYY"))) ++this.inputYear;
      } else {
        ++this.inputYear;
      }
    },

    // == Month ==
    clickMonth(_mon) {
      this.inputValue = `${this.inputYear}-${_mon}-1`;
      this.openMonthPicker();
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  font-family: inherit;
}
.caret {
  position: absolute;
  top: 0;
  left: 18px;

  display: block;
  width: 12px;
  height: 12px;

  background: white;

  border-top: solid 1px #cbd5e0;
  border-left: solid 1px #cbd5e0;

  -webkit-user-select: none;
  user-select: none;

  transform: translateY(-50%) rotate(45deg);
  z-index: 10;
}
.month-container {
  background: white;
  border-radius: 0.5rem;
  border: solid 1px #cbd5e0;
  padding: 10px;
}
.year {
  p {
    font-size: 16px;
    font-weight: 500;
  }
}

.month > button {
  color: #3c3c3c;
  font-size: 14px;
  font-weight: 400;

  background: none;
  border-radius: 4px;
  border: none;
  outline: none;
  padding: 8px 4px;

  cursor: pointer;

  &.disabled {
    color: #cbd5e0;
    cursor: default;
    &:hover {
      background: white;
    }
  }

  &.active {
    color: white;
    background: #3182ce !important;
  }

  &:hover {
    background: rgba(204, 214, 224, 0.3);
  }
}
</style>
