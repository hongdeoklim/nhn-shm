<template>
  <div>
    <div :class="['number-input-container', alignClass]">
      <span v-if="unit && unitPosition === 'left'" class="unit">{{ unit }}</span>
      <input
        type="text"
        :min="min"
        :max="max"
        :step="step"
        :readonly="readonly"
        v-model="displayValue"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="saveCursorPosition"
        @keyup="restoreCursorPosition"
        :class="['number-input', alignClass]"
      />
      <span v-if="unit && unitPosition === 'right'" class="unit">{{ unit }}</span>
      <div v-if="showControls" class="number-control-container">
        <button class="btn-up" @click="increaseValue"><feather-icon icon="ChevronUpIcon" svgClasses="h-3 w-3" /></button>
        <button class="btn-down" @click="decreaseValue"><feather-icon icon="ChevronDownIcon" svgClasses="h-3 w-3" /></button>
      </div>
    </div>
    <div class="printing">
      <div :class="['number-input-container', alignClass, 'print-container']">
        <span v-if="unit && unitPosition === 'left'" class="unit">{{ unit }}</span>
        <span class="number-input">{{ displayValue }}</span>
        <span v-if="unit && unitPosition === 'right'" class="unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    value: {
      type: Number | String,
      default: 0,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    step: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: '',
    },
    unitPosition: {
      type: String,
      default: 'right', // 'left' or 'right'
    },
    align: {
      type: String,
      default: 'right', // 'left', 'center' or 'right'
    },
    showControls: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['enter'],
  data() {
    return {
      internalValue: this.value,
      cursorPosition: null,
      isArrowKey: false, // 방향키 입력 여부를 추적
      isDeleteKey: false, // delete 키 입력 여부를 추적
      lengthAtSaveCursorPosition: 0,
      isCtrlAll: false, // ctrl + A 키 입력 여부를 추적
    };
  },
  computed: {
    displayValue: {
      get() {
        const returnValue = this.formatNumber(this.internalValue);
        return returnValue;
      },
      set(val) {
        const numericValue = Number(`${val}`.replace(/,/g, ''));
        if (!isNaN(numericValue)) {
          this.internalValue = numericValue;
          this.$emit('input', numericValue);
        }
      },
    },
    alignClass() {
      return `text-${this.align}`;
    },
  },
  methods: {
    saveCursorPosition(event) {
      // ctrl + A 키가 눌린것인지
      this.isCtrlAll = event.ctrlKey && event.key === 'a';

      // 방향키 입력 여부를 확인
      const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      this.isArrowKey = arrowKeys.includes(event.key);
      this.isDeleteKey = event.key === 'Delete';
      if (!this.isArrowKey && !this.isDeleteKey) {
        this.cursorPosition = event.target.selectionStart;
        this.lengthAtSaveCursorPosition = event.target.value.length;
      } else if (this.isDeleteKey) {
        this.cursorPosition = event.target.selectionStart;
      }

      // 첫 입력시 바로 숫자가 들어갈 수 있도록
      if (!this.isArrowKey && this.cursorPosition !== null && !this.isCtrlAll && event.target.value === '0' && event.key.match(/[0-9]/)) {
        event.target.value = '';
        this.cursorPosition = 1
      }
    },
    restoreCursorPosition(event) {
      if (!this.isArrowKey && this.cursorPosition !== null && !this.isCtrlAll) {
        const input = event.target;
        window.requestAnimationFrame(() => {
          const currentLength = input.value.length;
          const diff = currentLength - this.lengthAtSaveCursorPosition;
          let newCursorPosition = this.cursorPosition + diff;
          if (this.isDeleteKey) {
            newCursorPosition = this.cursorPosition;
          }
          input.setSelectionRange(newCursorPosition, newCursorPosition);
        });
      }

      // 만약 엔터 키가 눌렸다면, keyup.enter 이벤트를 발생시킴
      if (event.key === 'Enter') {
        this.$emit('enter', event);
      }
    },
    handleInput(event) {
      // 입력값에서 숫자, 콤마, 마이너스만 허용 (그 외에는 제거)
      let value = `${event.target.value}`.replace(/[^0-9.,-]/g, '');
      // 콤마를 제거하고 숫자로 변환
      value = value.replace(/,/g, '');
      value = Number(value);

      if (this.min || this.min === 0) {
        if (value < this.min) {
          value = this.min;
        }
      }

      if (this.max || this.max === 0) {
        if (value > this.max) {
          value = this.max;
        }
      }
      this.displayValue = value.toString();

      event.target.value = this.formatNumber(value);
    },
    handleBlur(event) {
      let value = Number(event.target.value.replace(/,/g, ''));
      if (isNaN(value)) {
        value = this.min;
      }
      if (value < this.min) {
        value = this.min;
      }
      if (value > this.max) {
        value = this.max;
      }
      this.internalValue = value;
      this.$emit('input', value);
    },
    formatNumber(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    increaseValue() {
      if (this.readonly) return;

      const newValue = Number(`${this.internalValue}`) + this.step;
      if (newValue <= this.max) {
        this.internalValue = newValue;
        this.$emit('input', newValue);
      }
    },
    decreaseValue() {
      if (this.readonly) return;

      const newValue = this.internalValue - this.step;
      if (newValue >= this.min) {
        this.internalValue = newValue;
        this.$emit('input', newValue);
      }
    },
  },
  watch: {
    value(val) {
      this.internalValue = val;
    },
  },
};
</script>

<style scoped>
.number-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.unit {
  margin: 0 4px;
}

.number-input {
  display: block;
  width: 100%;
  text-align: right;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  font-size: 1rem;
  color: rgb(60, 60, 60);
  transition: padding-right 0.1s; /* 패딩 변화 애니메이션 */
}

/* align 값이 right일 때 마우스 오버 시 패딩 적용 */
.number-input-container:hover .number-input,
.number-input-container:hover .number-input:hover {
  padding-right: 26px;
}

/* 웹킷 및 파이어폭스에서 스핀 버튼 숨기기 */
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type="number"] {
  -moz-appearance: textfield;
}

.number-control-container {
  position: absolute;
  right: 4px;
  top: 4px;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s;
}

.number-input-container:hover .number-control-container {
  opacity: 1;
  pointer-events: auto;
}

.number-control-container button {
  background: rgba(0,0,0,0.1);
  border: none;
  padding: 0 4px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 0;
  flex: 1;
  border-radius: 3px;
}
.btn-up:hover, .btn-down:hover {
  background: rgba(0,0,0,0.2);
}

.printing {
  display: none;
}

@media print {
  .printing {
    display: block;
  }
  .number-input-container {
    display: none;
  }
  .print-container {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
  }
  .print-container .unit {
    margin: 0 4px;
  }
  .print-container .number-input {
    display: block;
    width: 100%;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    font-size: 1rem;
    color: rgb(60, 60, 60);
  }
  .text-center .number-input {
    text-align: center;
  }
  .text-right .number-input {
    text-align: right;
  }
  .text-left .number-input {
    text-align: left;
  }
}
</style>
