<template>
  <div>
    <ml-input v-if="readonly" v-model="data" readonly class="w-full flex-1" />
    <multiselect v-else-if="multiple" :options="disasterList" v-model="data" :multiple="true" placeholder=""
                 selectLabel="" deselectLabel="" :openDirection="openDirection" :showNoResults="false" class="multiselect">
      <template slot="option" slot-scope="props">
        <div>{{ props.option }}</div>
      </template>
    </multiselect>
    <vs-select class="w-full" v-else v-model="data" autocomplete :disabled="disabled || readonly">
      <vs-select-item v-for="disaster in disasterList" :key="disaster" :value="disaster" :text="disaster" />
    </vs-select>
  </div>
</template>

<script>
import { disasters } from "@/util/DisasterDataUtil.js";
import Multiselect from "vue-multiselect";
export default {
  name: "DisasterClassSelector",
  components: {
    Multiselect,
  },
  props: {
    value: String | Array,
    disabled: Boolean,
    readonly: Boolean,
    multiple: { type: Boolean, default: false },
    openDirection: {
      type: String,
      default: "above",
    }
  },
  data() {
    return {
      disasterList: disasters,
      data: this.value,
      selected: "",
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
    if (!this.value && !this.multiple) {
      this.data = "넘어짐";
      this.$emit("input", this.data);
    }
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
.multiselect {
  .multiselect__tags {
    overflow: hidden;
    .multiselect__tag {
      background-color: rgba(var(--vs-secondary), 1) !important;
    }
    .multiselect__tag-icon::after {
      color: rgb(30, 13, 97);
    }
  }
}
</style>
