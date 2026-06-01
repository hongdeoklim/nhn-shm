<template>
  <vs-row class="w-full flex gap-2" vs-align="center" :class="[size === 'small' ? 'xl:w-200px' : 'xl:w-220px']">
    <vs-col v-if="label" class="title" :class="size">{{ label }}</vs-col>
    <vs-col class="flex-1" :class="label ? '' : 'ml-5'">
      <vs-select class="w-full" autocomplete v-model="select" @change="change" :disabled="readonly">
        <vs-select-item v-for="(item, index) in list" :key="index" :text="item.text || item.value" :value="item.value" />
      </vs-select>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "SearchNavItemSelect",
  props: {
    label: String,
    value: [Number, String],
    list: Array,
    size: {
      type: String,
      default: "normal",
    },
    readonly: Boolean,
    name: {
      type: String,
      default: "searchType",
    }
  },
  watch: {
    value(value) {
      this.select = value;
    },
    list: {
      deep: true,
      immediate: true,
      handler() {
        if (!this.value) {
          this.select = this.list[0].value;
          this.change(this.select);
        }
      },
    },
  },
  computed: {
    getSearchType () {
      const query = this.$route.query;
      if (query[this.name]) {
        try {
          return query[this.name]
        } catch (e) {}
      }
      return this.select
    },
  },
  data() {
    return {
      select: this.value,
    };
  },
  created() {
    this.select = this.getSearchType
    this.change(this.select);
  },
  methods: {
    change(data) {
      this.$emit("input", data);
      this.$emit("change", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 114px !important;

  font-weight: 500;
  line-height: 38px;
  text-align: left;
  white-space: nowrap;

  &.small {
    width: auto !important;
  }
}
</style>
