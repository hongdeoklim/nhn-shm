<template>
  <ml-input v-if="readonly" v-model="data" :style="{ color: color }" readonly class="w-full flex-1" />
  <vs-select v-else v-model="data" autocomplete :disabled="disabled" :placeholder="placeholder">
    <vs-select-item
      v-for="option in options"
      v-show="typeof option === 'string' ? true : !option.hide"
      :value="typeof option === 'string' ? option : option.value"
      :text="typeof option === 'string' ? option : option.value"
      :key="typeof option === 'string' ? option : option.value"
    />
  </vs-select>
</template>

<script>
export default {
  name: "CustomOptionSelector",
  props: {
    value: String,
    options: Array,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data: this.value,
    };
  },
  watch: {
    value() {
      this.data = this.value;
    },
    data(/*value*/) {
      this.$emit("input", this.data);
    },
  },
  mounted() {
    if (!this.value) {
      this.data = "";
      this.$emit("input", this.data);
    }
  },
};
</script>

<style lang="scss">
.vs-select--options {
  span {
    white-space: pre-wrap;
  }
}
</style>
