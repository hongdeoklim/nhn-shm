<template>
  <MlInput
    :placeholder="placeholder"
    :value="comma(inputValue)"
    @input="
      (value) => {
        inputValue = removeComma(value);
      }
    "
    @keyup="(value) => $emit('keyup', value)"
    :readonly="readonly"
    :max="15"
    noneCount=","
  />
</template>
<script>
export default {
  props: {
    value: String | Number,
    placeholder: String,
    readonly: Boolean,
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
        if (value === "") this.inputValue = 0;
        if (isNaN(Number(value))) this.inputValue = 0;

        this.$emit("input", Number(value));
      },
    },
  },
  data() {
    return {
      inputValue: this.value,
    };
  },
  methods: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    removeComma(str) {
      if (str) {
        const noneComma = `${str}`.replaceAll(",", "");
        return `${Number(noneComma)}`;
      }
      return "0";
    },
  },
};
</script>

<style lang="scss" scoped></style>
