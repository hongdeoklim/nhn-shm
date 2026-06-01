<template>
  <div class="search-base search-container">
    <search-multi-labels-body
      :labels="labels"
      :label-hidden="labels.length === 0"
      :columns="options['gridTemplateColumns']"
      v-model="selectLabel"
      @change="onChangeData"
    >
      <div class="flex-1 flex flex-wrap items-center gap-2">
        <date-selector v-model="startDate" :readonly="readonly" placeholder="선택" @change="onChangeData" class="w-full xl:w-128px" />
        <span>~</span>
        <date-selector v-model="endDate" :readonly="readonly" placeholder="선택" @change="onChangeData" class="flex-1 xl:w-128px" />
      </div>
    </search-multi-labels-body>
  </div>
</template>

<script>
import DateSelector from "@/components/selector/DateSelector";
import moment from "moment";
import SearchMultiLabelsBody from "@/views/list/components/base/SearchMultiLabelsBody.vue";

export default {
  name: "SearchMultiLabelStartEnd",
  components: {
    SearchMultiLabelsBody,
    DateSelector,
  },
  props: {
    label: {
      default: "",
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
      const { label, startDate, endDate } = value;
      this.selectLabel = label;
      this.startDate = startDate;
      this.endDate = endDate;
    },
  },
  data() {
    return {
      selectLabel: "",
      startDate: "",
      endDate: "",
    };
  },
  computed: {
    labels () {
      return (this.options && Array.isArray(this.options['labels'])) ? this.options['labels'] : [];
    },
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : {lb: "", sd: "", ed: ""};
      if (this.label) defaultValue.lb = this.label;
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const lb = query[_query_keys[0]];
      const sd = query[_query_keys[1]];
      const ed = query[_query_keys[2]];
      const data = {
        label: lb || defaultValue.lb,
        startDate: sd || defaultValue.sd,
        endDate: ed || defaultValue.ed,
      };
      return data;
    },
  },
  created() {
    this.startDate = this.initData.startDate;
    this.endDate = this.initData.endDate;
    this.selectLabel = this.initData.label;
    this.$emit("input", { label: this.selectLabel, startDate: this.startDate, endDate: this.endDate });
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

      this.$emit("input", { label: this.selectLabel, startDate: this.startDate, endDate: this.endDate });
      this.$emit("change", { label: this.selectLabel, startDate: this.startDate, endDate: this.endDate });
    },
  },
};
</script>
