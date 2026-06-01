<template>
  <div class="flex" style="align-items: center;">
    <time-selector :readonly="readonly" v-model="inputValue.work_stime"></time-selector>
    <span class="mx-4">~</span>
    <time-selector :readonly="readonly" v-model="inputValue.work_etime"></time-selector>
  </div>
</template>
<script>
import TimeSelector from './selector/TimeSelector'
export default {
  components: {TimeSelector},
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          work_stime: '',
          work_etime: ''
        }
      }
    },
    placeholder: String,
    readonly: Boolean,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
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

<style lang="scss" scoped></style>
