<template>
  <p v-if="isPrint" class="print-input">{{ dateRang.sDate }} ~ {{ dateRang.eDate }}</p>
  <div v-else class="time">
    <date-selector v-model="dateRang.sDate" :readonly="readonly" :max-date="maxDate" />
    <p>~</p>
    <date-selector v-model="dateRang.eDate" :readonly="readonly" :min-date="minDate" />
  </div>
</template>

<script>
import DateSelector from "@/components/selector/DateSelector";

export default {
  components: {
    DateSelector,
  },
  props: {
    isPrint: Boolean,
    readonly: Boolean,
    value: { type: Object | String, default: () => ({ sDate: "", eDate: "" }) },
  },
  created() {
    if (typeof this.value === "string") {
      this.dateRang = { sDate: "", eDate: "" };
    }
  },
  data() {
    return {
      dateRang: this.value,
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        this.dateRang = value;
      },
    },
    dateRang: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  computed: {
    maxDate() {
      if (typeof this.dateRang.eDate === "string") {
        return this.dateRang.eDate.trim();
      }
      return "";
    },
    minDate() {
      if (typeof this.dateRang.sDate === "string") {
        return this.dateRang.sDate.trim();
      }
      return "";
    },
  }
};
</script>
<style lang="scss" scoped>
.time {
  display: flex;
  align-items: center;
  gap: 12px;

  & > span {
    flex: 1;
  }
}
</style>
