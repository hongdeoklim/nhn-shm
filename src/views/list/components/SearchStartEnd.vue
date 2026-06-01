<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div class="flex-1 flex flex-wrap items-center gap-2">
        <date-selector v-model="startDate" :readonly="readonly" placeholder="선택" @change="onChangeData" class="w-full xl:w-128px" />
        <span>~</span>
        <date-selector v-model="endDate" :readonly="readonly" placeholder="선택" @change="onChangeData" class="flex-1 xl:w-128px" />
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import DateSelector from "@/components/selector/DateSelector";
import moment from "moment";
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchNavStartEnd",
  components: {
    SearchLabelBody,
    DateSelector,
    SearchNavItemSelect,
  },
  props: {
    label: {
      default: "대상기간",
      type: String
    },
    value: [String, Object],
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'sd': '',
          'ed': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      const { startDate, endDate } = value;
      this.startDate = startDate;
      this.endDate = endDate;
    },
  },
  data() {
    return {
      startDate: "",
      endDate: "",
    };
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : {sd: "", ed: ""};
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const sd = query[_query_keys[0]];
      const ed = query[_query_keys[1]];
      const data = {
        startDate: sd || defaultValue.sd,
        endDate: ed || defaultValue.ed,
      };
      return data;
    },
  },
  created() {
    this.startDate = this.initData.startDate;
    this.endDate = this.initData.endDate;
    this.$emit("input", { startDate: this.startDate, endDate: this.endDate });
  },
  methods: {
    onChangeData() {
      if (!!this.startDate.trim() && !!this.endDate.trim()) {
        const sd = moment(this.startDate);
        const ed = moment(this.endDate);
        const diff = sd.diff(ed, "days");

        if (0 < diff) {
          this.$nextTick(() => {
            this.$set(this, "startDate", ed.format("YYYY-MM-DD"));
            this.$set(this, "endDate", sd.format("YYYY-MM-DD"));
          });
        }
      }

      this.$emit("input", { startDate: this.startDate, endDate: this.endDate });
      this.$emit("change", { startDate: this.startDate, endDate: this.endDate });
    },
  },
};
</script>
