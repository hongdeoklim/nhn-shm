<template>
  <vs-input
    :placeholder="placeholder"
    :value="corporate(inputValue)"
    @input="
      (value) => {
        inputValue = removeCorporate(value);
      }
    "
    @keyup="(value) => $emit('keyup', value, corporate(inputValue))"
    @focusout="focusout"
    :readonly="readonly"
    :disabled="disabled"
    noneCount=","
  />
</template>
<script>
export default {
  props: {
    value: String | Number,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
  },
  emits: ['keyup', 'focusout'],
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
  methods: {
    corporate(str) {
      const strNum = `${str}`.replace(/\D/g, "")
      if (strNum.length <=3 ) {
        return strNum
      } else if (strNum.length <=5 ) {
        return strNum.replace(/(\d{3})(\d)/, '$1-$2');
      } else if (strNum.length <=10 ) {
        return strNum.replace(/(\d{3})(\d{2})(\d)/, '$1-$2-$3');
      } else {
        return strNum.substring(0,10).replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
      }
    },
    removeCorporate(str) {
      if (str) {
        const noneComma = `${str}`.replace(/\D/g, "").substring(0, 10);
        return `${Number(noneComma)}`;
      }
      return "";
    },
    focusout (value) {
      this.$emit('focusout', value)
    }
  },
};
</script>

<style lang="scss" scoped></style>
