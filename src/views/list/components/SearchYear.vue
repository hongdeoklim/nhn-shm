<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <vs-select class="w-full xl:w-32" autocomplete v-model="year" @change="change" :disabled="readonly">
          <vs-select-item v-for="(year, index) in years" :key="index" :text="year.text" :value="year.value" />
        </vs-select>
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchYear",
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
          'year': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      this.year = value;
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
      const year = query[_query_keys[0]];
      if (year) {
        try {
          return {
            year: year || defaultValue,
          };
        } catch (e) {}
      }
      return {
        year: defaultValue,
      };
    },
    years() {
      const years = [];
      const currentYear = new Date().getFullYear();
      if (this.options.useAll) {
        years.push({ text: "전체", value: "" });
      }
      for (let i = currentYear; i >= 2010; i--) {
        years.push({ text: `${i}년`, value: i });
      }
      return years;
    },
  },
  data() {
    return {
      year: "",
    };
  },
  created() {
    this.year = this.initData.year;
    this.$emit("input", this.year);
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
  },
};
</script>
