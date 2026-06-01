<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="labelHidden" :columns="options['gridTemplateColumns']">
      <div class="flex items-center gap-2">
        <vs-select class="w-full xl:w-24" autocomplete v-model="month" @change="change" :disabled="readonly">
          <vs-select-item v-for="(month, index) in months" :key="index" :text="month.text" :value="month.value" />
        </vs-select>

        <span v-if="labelHidden">{{ label }}</span>
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchMonth",
  components: {
    SearchLabelBody,
  },
  props: {
    label: String,
    value: [String, Number],
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'y_m': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      this.month = value;
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
      const month = query[_query_keys[0]];
      if (month) {
        try {
          return {
            month: month || defaultValue,
          };
        } catch (e) {}
      }
      return {
        month: defaultValue,
      };
    },
    months() {
      const months = [];
      if (this.options.useAll) {
        months.push({ text: "전체", value: "" });
      }
      for (let i = 1; i <= 12; i++) {
        if (this.labelHidden) {
          months.push({ text: i, value: i });
        } else {
          months.push({ text: `${i}월`, value: i });
        }
      }
      return months;
    },
    labelHidden () {
      if (this.isMobile || !this.lastLabel) {
        return false;
      }

      return true;
    },
    lastLabel () {
      if (this.options && this.options.lastLabel) {
        return this.options.lastLabel;
      }
      return false;
    },
  },
  data() {
    return {
      month: "",
    };
  },
  created() {
    this.month = this.initData.month;
    this.$emit("input", this.month);
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
  },
};
</script>
