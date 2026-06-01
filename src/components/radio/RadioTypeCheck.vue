<template>
  <div v-if="isPrint" class="flex items-center justify-center select-none cursor-default">
    <img v-if="inputValue === checkValue" src="@/assets/icons/checked_on.svg" />
    <img v-else src="@/assets/icons/checked_off.svg" />
    <p v-if="!!label" class="ml-2">
      {{ label }}
    </p>
  </div>
  <div v-else-if="readonly" class="flex items-center justify-center select-none cursor-default">
    <div v-if="inputValue === checkValue" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center">
      <vs-icon icon="check" size="x-small"></vs-icon>
    </div>
    <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center">
      <vs-icon icon="check" size="x-small"></vs-icon>
    </div>
    <p v-if="!!label" class="ml-2">
      {{ label }}
    </p>
  </div>
  <div v-else class="radio-check-container">
    <div class="relative flex items-center justify-center">
      <input type="radio" v-model="inputValue" :name="name" :id="`${name}_${checkValue}`" :value="checkValue" />
      <label class="check-icon" :for="`${name}_${checkValue}`"><feather-icon icon="CheckIcon" style="width: 16px; height: 16px; color: white" /></label>
    </div>
    <label v-if="label" :for="`${name}_${checkValue}`">{{ label }}</label>
  </div>
</template>

<script>
export default {
  props: {
    isPrint: Boolean,
    readonly: Boolean,
    name: String | Number,
    checkValue: String | Number,
    label: String | Number,
    value: { type: String | Number | Boolean, default: false },
  },
  watch: {
    value: {
      handler(value) {
        this.inputValue = value;
      },
    },
    inputValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      inputValue: this.value,
    };
  },
};
</script>

<style lang="scss" scoped>
.radio-check-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  input,
  label {
    cursor: pointer;
  }

  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid rgb(180, 180, 180);
    border-radius: 2px;
    transform: rotate(-90deg);
    transition: all 0.2s ease;

    &:checked {
      border: 2px solid rgba(var(--vs-primary), 1) !important;
      background: rgba(var(--vs-primary), 1);
      transform: rotate(0deg);

      & + .check-icon svg {
        transform: translate3d(0, 0, 0);
      }
    }
  }

  .check-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    overflow: hidden;
    svg {
      transition: all 0.3s ease;
      transform: translate3d(24px, 0, 0);
    }
  }
}
</style>
