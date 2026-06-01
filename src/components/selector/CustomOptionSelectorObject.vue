<template>
  <ml-input v-if="readonly" v-model="selectData" :style="{ color: color }" readonly class="w-full flex-1" />
  <vs-select v-else v-model="selectIndex" autocomplete :disabled="disabled" :placeholder="placeholder">
    <vs-select-item v-for="(option, option_i) in options" v-show="!option.hide" :value="option_i" :text="option.text || option.value" :key="`select-item-${option_i}-${option.value}`" @click.native="$emit('change')" />
  </vs-select>
</template>

<script>
export default {
  name: "CustomOptionSelectorObject",
  props: {
    value: Object || null,
    options: Array,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: {
      type: String,
      default: "선택",
    },
    color: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectIndex: this.value && this.value.index,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.selectIndex = value && value.index;
      },
    },
    selectIndex: {
      immediate: true,
      deep: true,
      handler(value) {
        const find = this.options.find((_op, _op_i) => value === _op_i);
        this.$emit("input", !!find ? { ...find, index: value } : null);
      },
    },
  },
  methods: {},
};
</script>

<style scoped></style>
