<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <vs-select class="w-full xl:w-32" autocomplete v-model="quarter" @change="change" :disabled="readonly">
          <vs-select-item v-for="(quarter, index) in quarterList" :key="index" :text="quarter.text" :value="quarter.value" />
        </vs-select>
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchYearQuarter",
  components: {
    SearchLabelBody,
  },
  props: {
    label: {
      default: "분기",
      type: String,
    },
    value: [String, Number],
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'quarter': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      this.quarter = value;
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
      const quarter = query[_query_keys[0]];
      if (quarter) {
        try {
          return {
            quarter: quarter || defaultValue,
          };
        } catch (e) {}
      }
      return {
        quarter: defaultValue,
      };
    },
    quarterList() {
      return [
        { text: '1분기', value: 1 },
        { text: '2분기', value: 2 },
        { text: '3분기', value: 3 },
        { text: '4분기', value: 4 },
      ];
    },
  },
  data() {
    return {
      quarter: "",
    };
  },
  created() {
    this.quarter = this.initData.quarter;
    this.$emit("input", this.quarter);
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
  },
};
</script>
