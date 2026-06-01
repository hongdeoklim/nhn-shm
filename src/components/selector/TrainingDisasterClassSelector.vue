<template>
  <vs-select v-model="data" autocomplete :disabled="disabled || readonly">
    <vs-select-item
      v-for="disaster in disasterList"
      :key="disaster"
      :value="disaster"
      :text="disaster"
    />
  </vs-select>
</template>

<script>
import { disasters } from "@/util/DisasterDataUtil.js";
export default {
  name: "TrainingDisasterClassSelector",
  props: {
    value: String,
    disabled: Boolean,
    readonly: Boolean,
  },
  data() {
    return {
      disasterList: disasters,
      data: this.value,
    };
  },
  watch: {
    value() {
      this.data = this.value;
    },
    data(value) {
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

<style scoped></style>
