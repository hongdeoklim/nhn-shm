<template>
  <vs-input
    ref="mlInput"
    class="ml-input"
    v-model="inputValue"
    :type="type"
    :readonly="readonly"
    :disabled="disabled"
    :icon-pack="iconPack"
    :icon="icon"
    :placeholder="placeholder"
    :max="maxValue"
    :min="minValue"
    :autofocus="autofocus"
    @keyup="(e) => $emit('keyup', e)"
    @click="(e) => $emit('click', e)"
    @focusout="(e) => $emit('focusout', e)"
    @blur="(e) => $emit('blur', e)"
  />
</template>

<script>
export default {
  name: "MaxLengthInput",
  props: {
    type: { type: String, default: "text" },
    value: { type: String | Number, default: "" },
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    max: { type: Number, default: 200 },
    iconPack: String,
    icon: String,
    noneCount: String,
    minValue: Number,
    maxValue: Number,
    autofocus: Boolean,
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
        // value에서 noneCount 문자를 모두 제거
        if (!!this.noneCount) value = value.replaceAll(this.noneCount, "");

        if (value && value.length > this.max) {
          this.inputValue = this.value;
          alert(`${this.max}자까지 작성할 수 있습니다.`);
          // this.$refs.mlInput.focus();
        } else {
          this.$emit("input", value);
          this.$emit("change", value);
        }
      },
    },
  },
  data() {
    return {
      inputValue: this.value,
    };
  },
  methods: {
    focus() {
      let inputEl = this.$refs.mlInput.$el.querySelector("input");
      inputEl.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.ml-input::v-deep {
  .input-span-placeholder {
    line-height: 1.2rem;
  }
}
</style>
