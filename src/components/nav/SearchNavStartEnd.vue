<template>
  <div class="search-nav-start-end flex gap-2 w-full xl:w-auto">
    <span v-if="label" class="title">{{ label }}</span>
    <div class="flex-1 flex flex-wrap items-center gap-2">
      <date-selector v-model="sDate" :readonly="readonly" placeholder="선택" @change="onChangeData" class="w-full xl:w-128px" />
      <span>~</span>
      <date-selector v-model="eDate" :readonly="readonly" placeholder="선택" @change="onChangeData" class="flex-1 xl:w-128px" />
    </div>
  </div>
</template>

<script>
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect.vue";
import DateSelector from "@/components/selector/DateSelector.vue";
import moment from "moment";

export default {
  name: "SearchNavStartEnd",
  components: {
    DateSelector,
    SearchNavItemSelect,
  },
  props: {
    label: {
      default: "대상기간",
      type: String,
    },
    value: Object | String,
    readonly: Boolean,
  },
  watch: {
    value(value) {
      const { sDate, eDate } = value;
      this.sDate = sDate;
      this.eDate = eDate;
    },
  },
  data() {
    return {
      sDate: "",
      eDate: "",
    };
  },
  computed: {
    getCreatedAt() {
      const query = this.$route.query;
      if (query.sd || query.ed) {
        try {
          return {
            sDate: query.sd ? query.sd : "",
            eDate: query.ed ? query.ed : "",
          };
        } catch (e) {}
      }
      return {
        sDate: "",
        eDate: "",
      };
    },
  },
  created() {
    this.sDate = this.getCreatedAt.sDate;
    this.eDate = this.getCreatedAt.eDate;
  },
  mounted() {
    if (!this.value || !this.value.sDate) {
      this.$emit("input", { sDate: this.sDate, eDate: this.eDate });
    }
  },
  methods: {
    onChangeData() {
      if (!!this.sDate.trim() && !!this.eDate.trim()) {
        const sd = moment(this.sDate);
        const ed = moment(this.eDate);
        const diff = sd.diff(ed, "days");

        if (0 < diff) {
          this.$nextTick(() => {
            this.$set(this, "sDate", ed.format("YYYY-MM-DD"));
            this.$set(this, "eDate", sd.format("YYYY-MM-DD"));
          });
        }
      }

      this.$emit("input", { sDate: this.sDate, eDate: this.eDate });
      this.$emit("change", { sDate: this.sDate, eDate: this.eDate });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 114px;

  font-weight: 500;
  line-height: 38px;
  text-align: left;
  white-space: nowrap;
}
</style>
