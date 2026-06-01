<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <ml-input
          class="w-full xl:w-48"
          icon-pack="feather"
          icon="icon-search"
          placeholder="검색어를 입력하세요."
          v-model="keyword"
          @change="onChangeData"
          @keyup.enter="onKeyup"
        />
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchKeyword",
  components: {
    SearchLabelBody,
  },
  props: {
    label: {
      default: "연도",
      type: String,
    },
    value: [String, Number],
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'keyword': '',
        }
      },
    },
    options: Object,
    onClickSearch: Function,
  },
  watch: {
    value(value) {
      this.keyword = value;
    },
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : "";
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const keyword = query[_query_keys[0]];
      if (keyword) {
        try {
          return {
            keyword: keyword || defaultValue,
          };
        } catch (e) {}
      }
      return {
        keyword: defaultValue,
      };
    },
  },
  data() {
    return {
      keyword: "",
    };
  },
  created() {
    this.keyword = this.initData.keyword;
    this.$emit("input", this.keyword);
  },
  methods: {
    onChangeData() {
      this.$emit("input", this.keyword);
    },
    onKeyup() {
      this.onChangeData();
      if (this.onClickSearch) {
        this.onClickSearch();
      }
    }
  },
};
</script>
