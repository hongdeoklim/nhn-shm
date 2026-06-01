<template>
  <vs-row class="w-full flex gap-2" vs-align="center" :class="[size === 'small' ? 'xl:w-240px' : 'xl:w-auto']">
    <vs-col class="title" :class="[!viewLabel && 'xl:hidden', size]">{{ label }}</vs-col>
    <vs-col class="flex-1">
      <ml-input icon-pack="feather" icon="icon-search" :placeholder="placeholder" v-model="keyword" @change="changeText" @keyup.enter="keyupEvent" class="w-full" />
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "SearchNavItemKeyword",
  props: {
    label: String,
    value: String,
    type: String,
    viewLabel: Boolean,
    size: {
      type: String,
      default: "normal",
    },
    placeholder: {
      type: String,
      default: "Search",
    },
  },
  watch: {
    value(value) {
      this.keyword = value;
    },
  },
  computed: {
    getKeyword () {
      const query = this.$route.query;
      if (query.keyword) {
        try {
          return query.keyword
        } catch (e) {}
      }
      return ''
    },
  },
  data() {
    return {
      keyword: "",
    };
  },
  created() {
    this.keyword = this.getKeyword
  },
  methods: {
    changeText() {
      if (this.type === "commaNumber") this.keyword = this.comma(this.keyword);
      this.$emit("input", this.keyword);
    },
    keyupEvent(event) {
      this.$emit("keyup-event", event.target.value);

      // 이벤트버스 이벤트 발송
      this.$eventbus.$emit('keyword-search', event.target.value);
    },
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
