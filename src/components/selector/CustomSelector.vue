<template>
  <span v-if="isPrint" class="print-input">{{ data }}</span>
  <ml-input v-else-if="readonly" v-model="data" style="color: red" readonly />
  <ml-input v-else-if="data === '직접입력'" ref="selectCustomInput" v-model="customInput" :readonly="disabled || readonly" @blur="inputBlur" autofocus />
  <vs-select v-else v-model="data" autocomplete :disabled="disabled || readonly" :placeholder="placeholder">
    <vs-select-item v-for="option in options" :value="option" :text="option" :key="option" />
    <vs-select-item v-show="false" :value="customInput" :text="customInput" />
  </vs-select>
</template>

<script>
export default {
  name: "CustomSelector",
  props: {
    value: String | Number,
    options: Array,
    disabled: Boolean,
    readonly: Boolean,
    isPrint: Boolean,
    placeholder: {
      type: String,
      default: "선택",
    },
  },
  data() {
    return {
      data: this.value,
      customInput: "",
    };
  },
  watch: {
    value() {
      this.data = this.value;
    },
    data() {
      if (this.data === "직접입력") {
        this.customInput = "";
        this.$nextTick(() => {
          this.$refs.selectCustomInput.focus();
        });
      } else this.$emit("input", this.data);
    },
  },
  methods: {
    inputBlur() {
      this.data = this.customInput;
    },
  },
};
</script>

<style scoped></style>
