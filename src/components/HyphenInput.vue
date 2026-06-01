<template>
  <div class="flex gap-4">
    <div v-for="(_set, _set_i) in setting" :key="_set_i" class="relative" :class="[_set_i < setting.length - 1 && 'after-hyphen']">
      <input ref="hyphenInput" type="text" :readonly="readonly" :maxlength="_set.max" v-model="inputValue[_set_i]" @input="nextFocus(_set_i, inputValue[_set_i].length, _set.max)" />
    </div>
  </div>
</template>
<script>
export default {
  name: "HyphenInput",
  props: {
    value: { type: String | Number, default: "" },
    readonly: Boolean,
    autocomplete: { type: Boolean, default: true },
    setting: { type: Array, default: () => [{ max: 3 }, { max: 4 }, { max: 4 }] },
  },
  data() {
    return {
      inputValue: this.splitValue(this.value),
    };
  },
  watch: {
    value: {
      handler(value) {
        this.inputValue = this.splitValue(value); // 010-1234-5678
      },
    },
    inputValue: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value.join("-"));
      },
    },
  },
  methods: {
    /**
     * -을 기준으로 문자열을 자른다
     * @param {String} str 0000-0000-0000
     */
    splitValue(str) {
      return str.split("-");
    },
    /**
     * autocomplete 가 true일때, maxlength가 되면 다음 input으로 넘긴다
     * @param {Number} index 현재 input index
     * @param {Number} length 현재 입력받은 text의 길이
     * @param {Number} max 현재 input의 maxlength
     */
    nextFocus(index, length, max) {
      if (this.autocomplete && length === max && !!this.$refs.hyphenInput[index + 1]) {
        this.$refs.hyphenInput[index + 1].focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  position: relative;
  flex: 1;
  width: 100%;
  font-size: 1rem !important;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 0 0 rgb(0 0 0 / 15%);

  outline: none;
  text-transform: none;
  text-decoration: none;
  padding: 0.7rem !important;

  transition: all 0.3s ease;

  &:focus {
    border: 1px solid rgba(var(--vs-primary), 1) !important;
    box-shadow: 0 3px 10px 0 rgb(0 0 0 / 15%);
  }
}
.after-hyphen {
  display: flex;
  align-items: center;

  &::after {
    content: "-";
    position: absolute;
    right: -9px;
  }
}
</style>
